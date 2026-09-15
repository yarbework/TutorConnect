'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Engagement, EngagementMessage } from '../../types/engagement';
import { engagementsApi } from '../../lib/api/engagements';
import { reviewsApi } from '../../lib/api/reviews';
import { useEngagementSocket } from '../../hooks/useEngagementSocket';
import ChatMessageItem from './ChatMessageItem';
import ReviewModal from '../reviews/ReviewModal';
import { 
  Send, 
  CheckCircle2, 
  Loader2, 
  Info, 
  Sparkles, 
  Star,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
import EngagementReviewsCard from './EngagementReviewsCard';
import { Review } from '../../types/review';

interface Props {
  engagement: Engagement;
  currentUserId?: string;
  onEngagementUpdated: (updated: Engagement) => void;
}

export default function EngagementChatPane({
  engagement,
  currentUserId,
  onEngagementUpdated,
}: Props) {
  const [messages, setMessages] = useState<EngagementMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isGuardian = currentUserId === engagement.guardianId;
  const counterparty = isGuardian ? engagement.tutor?.email : engagement.guardian?.email;
  const isClosed = engagement.status !== 'ACTIVE';

  const [engagementReviews, setEngagementReviews] = useState<{
          myReview: Review | null;
          counterpartyReview: Review | null;
        }>({ myReview: null, counterpartyReview: null });

  const {
    isConnected,
    isCounterpartyTyping,
    onNewMessage,
    emitSendMessage,
    emitTyping,
  } = useEngagementSocket(engagement.id);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsLoading(true);
    engagementsApi
      .getMessages(engagement.id)
      .then((data) => {
        setMessages(data);
        setTimeout(scrollToBottom, 50);
      })
      .catch((err) => {
        toast.error('Failed to load messages');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [engagement.id]);

  useEffect(() => {
    const unsubscribe = onNewMessage((incomingMessage: EngagementMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === incomingMessage.id)) {
          return prev;
        }
        return [...prev, incomingMessage];
      });
      setTimeout(scrollToBottom, 20);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onNewMessage]);

const loadEngagementReviews = useCallback(() => {
  if (engagement.status === 'COMPLETED') {
    reviewsApi
      .getEngagementReviews(engagement.id)
      .then((res) => {
        setEngagementReviews(res);
        setHasReviewed(Boolean(res.myReview));
      })
      .catch((err) => console.error('Failed to load engagement reviews', err));
  }
}, [engagement.id, engagement.status]);

useEffect(() => {
  loadEngagementReviews();
}, [loadEngagementReviews]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending || isClosed) return;

    const content = inputText.trim();
    setInputText('');
    setIsSending(true);
    emitTyping(false);

    emitSendMessage(content);

    const optimisticMsg: EngagementMessage = {
      id: `temp-${Date.now()}`,
      engagementId: engagement.id,
      senderId: currentUserId || '',
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 20);

    try {
      const persisted = await engagementsApi.sendMessage(engagement.id, content);
      setMessages((prev) => prev.map((m) => (m.id === optimisticMsg.id ? persisted : m)));
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!isClosed) {
      emitTyping(e.target.value.length > 0);
    }
  };

  const handleCloseEngagement = async () => {
    if (!confirm('Are you sure you want to end this tutoring engagement? This will conclude the contract and open the review evaluation.')) {
      return;
    }

    setIsClosing(true);
    try {
      const updated = await engagementsApi.closeEngagement(engagement.id, 'COMPLETED');
      toast.success('Tutoring engagement concluded successfully.');
      onEngagementUpdated(updated);
      setIsReviewModalOpen(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to close engagement');
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      <div className="p-4 sm:px-6 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900">{engagement.job?.title}</h3>
                <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Wifi className="w-3 h-3 text-emerald-600" /> Live
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 text-slate-400" /> Offline
                      </>
                    )}
                  </span>
          </div>
          <p className="text-xs text-slate-500">
            Participant: <strong className="text-slate-800">{counterparty}</strong> • Agreed Rate: <strong className="text-blue-900 font-bold">{engagement.agreedHourlyRate} ETB/hr</strong>
          </p>
        </div>

        {!isClosed ? (
          <button
            type="button"
            disabled={isClosing}
            onClick={handleCloseEngagement}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[36px]"
          >
            {isClosing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            End Engagement
          </button>
        ) : (
          hasReviewed === false && (
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[36px]"
            >
              <Star className="w-3.5 h-3.5 fill-slate-950" /> Rate Experience
            </button>
          )
        )}
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-1 text-center">
            <Info className="w-6 h-6 text-slate-300" />
            <p className="text-xs font-semibold">Conversation is empty.</p>
            <p className="text-[11px] text-slate-400">Say hello and confirm lesson dates and meeting times.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              isSelf={msg.senderId === currentUserId}
            />
          ))
        )}

        {isCounterpartyTyping && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 italic py-1 px-2 animate-pulse">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            <span>{counterparty} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200/80 shrink-0">
      {!isClosed ? (
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200/80 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message (schedule, location, direct payment details)..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 min-h-[40px] cursor-pointer shadow-xs"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </form>
        </div>
      ) : (
        <EngagementReviewsCard
          myReview={engagementReviews.myReview}
          counterpartyReview={engagementReviews.counterpartyReview}
          counterpartyRoleLabel={isGuardian ? 'Tutor' : 'Guardian'}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />
      )}

      {engagement && (
        <ReviewModal
          engagementId={engagement.id}
          counterpartyLabel={isGuardian ? 'Tutor' : 'Guardian'}
          isGuardian={isGuardian}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            loadEngagementReviews(); 
          }}
        />
      )}
      </div>

      {engagement && (
        <ReviewModal
          engagementId={engagement.id}
          counterpartyLabel={isGuardian ? 'Tutor' : 'Guardian'}
          isGuardian={isGuardian}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            setHasReviewed(true);
          }}
        />
      )}
    </div>
  );
}