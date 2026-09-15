import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EngagementsService } from './engagements.service';

interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    email: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/engagements',
})
export class EngagementsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EngagementsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly engagementsService: EngagementsService,
  ) {}


  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Disconnecting unauthenticated socket: ${client.id}`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'tutorconnect_super_secret_jwt_key_2026',
      });

      client.data = {
        userId: payload.userId || payload.sub || payload.id,
        email: payload.email,
      };

      this.logger.log(`Socket connected: ${client.id} (User: ${client.data.email})`);
    } catch (err) {
      this.logger.error(`Handshake auth failed for socket ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Socket disconnected: ${client.id}`);
  }


  @SubscribeMessage('joinEngagement')
  async handleJoinEngagement(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { engagementId: string },
  ) {
    const { engagementId } = data;
    const userId = client.data.userId;

    await this.engagementsService.getEngagementById(engagementId, userId);

    const roomName = `engagement_${engagementId}`;
    await client.join(roomName);
    this.logger.log(`User ${userId} joined room ${roomName}`);

    return { status: 'JOINED', room: roomName };
  }


  @SubscribeMessage('leaveEngagement')
  async handleLeaveEngagement(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { engagementId: string },
  ) {
    const roomName = `engagement_${data.engagementId}`;
    await client.leave(roomName);
    this.logger.log(`User ${client.data.userId} left room ${roomName}`);
    return { status: 'LEFT' };
  }


  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { engagementId: string; content: string },
  ) {
    const { engagementId, content } = data;
    const senderId = client.data.userId;

    const savedMessage = await this.engagementsService.sendMessage(
      engagementId,
      senderId,
      { content },
    );

    const roomName = `engagement_${engagementId}`;
    this.server.to(roomName).emit('newMessage', savedMessage);

    return savedMessage;
  }


  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { engagementId: string; isTyping: boolean },
  ) {
    const roomName = `engagement_${data.engagementId}`;
    client.to(roomName).emit('userTyping', {
      userId: client.data.userId,
      isTyping: data.isTyping,
    });
  }
}