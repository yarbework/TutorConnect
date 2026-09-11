'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EngagementSidebar from '../../components/chat/EngagementSidebar';
import EngagementChatPane from '../../components/chat/EngagementChatPane';
import { engagementsApi } from '../../lib/api/engagements';
import { Engagement } from '../../types/engagement';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2, MessageSquare } from 'lucide-react';

export default function MessagesWorkspacePage() {
  const { user, isHydrated, isAuthenticated } = useAuthStore();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEngagements = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await engagementsApi.getMyEngagements();
      setEngagements(data);
      if (data.length > 0) {
        setSelectedEngagement(data[0]);
      }
    } catch (err) {
      console.error('Failed to load engagements:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      fetchEngagements();
    }
  }, [isHydrated, isAuthenticated, fetchEngagements]);

  const handleEngagementUpdated = (updated: Engagement) => {
    setEngagements((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setSelectedEngagement(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Direct Engagement Messaging</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate tutoring sessions, verify meeting landmarks, and establish direct payment terms.
          </p>
        </div>

        {isLoading ? (
          <div className="py-28 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          </div>
        ) : engagements.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No active conversations found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Direct messaging channels are automatically unlocked when a guardian accepts a proposal or awards a tutoring job.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Your Engagements ({engagements.length})
                </span>
              </div>
              <EngagementSidebar
                engagements={engagements}
                selectedId={selectedEngagement?.id || null}
                currentUserId={user?.id}
                onSelect={(eng) => setSelectedEngagement(eng)}
              />
            </div>

            <div className="lg:col-span-2">
              {selectedEngagement && (
                <EngagementChatPane
                  key={selectedEngagement.id}
                  engagement={selectedEngagement}
                  currentUserId={user?.id}
                  onEngagementUpdated={handleEngagementUpdated}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}