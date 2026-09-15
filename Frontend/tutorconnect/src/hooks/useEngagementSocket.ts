'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { EngagementMessage } from '../types/engagement';

export function useEngagementSocket(engagementId: string | null) {
  const { token } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCounterpartyTyping, setIsCounterpartyTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!engagementId || !token) return;

    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    const socket = io(`${backendUrl}/engagements`, {
      auth: { token: token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinEngagement', { engagementId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('userTyping', (data: { userId: string; isTyping: boolean }) => {
      setIsCounterpartyTyping(data.isTyping);

      if (data.isTyping) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsCounterpartyTyping(false);
        }, 2500);
      }
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit('leaveEngagement', { engagementId });
      socket.disconnect();
    };
  }, [engagementId, token]);


  const onNewMessage = useCallback((callback: (message: EngagementMessage) => void) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('newMessage', callback);
    return () => {
      socket.off('newMessage', callback);
    };
  }, []);


  const emitSendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !engagementId) return;
      socketRef.current.emit('sendMessage', { engagementId, content });
    },
    [engagementId],
  );


  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!socketRef.current || !engagementId) return;
      socketRef.current.emit('typing', { engagementId, isTyping });
    },
    [engagementId],
  );

  return {
    isConnected,
    isCounterpartyTyping,
    onNewMessage,
    emitSendMessage,
    emitTyping,
  };
}