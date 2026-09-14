'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { jobsApi } from '../../lib/api/jobs';
import { paymentsApi } from '../../lib/api/payments';
import { Wallet, WalletTransactionItem } from '../../types/application';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

const CONNECTS_PACKS = [
  { id: 'pack-10', connects: 10, priceETB: 150, popular: false },
  { id: 'pack-25', connects: 25, priceETB: 320, popular: true },
  { id: 'pack-50', connects: 50, priceETB: 600, popular: false },
];

function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isHydrated, isAuthenticated } = useAuthStore();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingPackId, setPurchasingPackId] = useState<string | null>(null);

  const loadWalletData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [walletRes, ledgerRes] = await Promise.all([
        jobsApi.getMyWallet().catch(() => null),
        jobsApi.getWalletTransactions().catch(() => [] as WalletTransactionItem[]),
      ]);
      setWallet(walletRes);
      setTransactions(ledgerRes);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      loadWalletData();
    }
  }, [isHydrated, isAuthenticated, loadWalletData]);

  // Handle return redirect from payment gateway (?payment=success / ?payment=failed)
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (!paymentStatus) return;

    if (paymentStatus === 'success') {
      toast.success('Payment verified! Your Connects balance has been credited.');
      loadWalletData();
    } else if (paymentStatus === 'failed') {
      toast.error('Transaction was declined or cancelled.');
    }

    // Clean query parameters from URL without page reload
    window.history.replaceState({}, '', '/wallet');
  }, [searchParams, loadWalletData]);

  // Dispatch real checkout creation
  const handleBuyPack = async (pack: typeof CONNECTS_PACKS[0]) => {
    setPurchasingPackId(pack.id);
    try {
      toast.info(`Initializing secure checkout for ${pack.connects} Connects...`);
      const session = await paymentsApi.createCheckout(pack.id);

      window.location.href = session.checkoutUrl;
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize payment session.');
      setPurchasingPackId(null);
    }
  };

  const isTutor = user?.role === 'TUTOR';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Connects Wallet & Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your token balance, view detailed transaction audits, and purchase credit packs.
          </p>
        </div>

        {/* Top Wallet Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-400/20 text-amber-300 rounded-2xl">
                  <Coins className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-blue-200">
                    Available Balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      {isLoading ? '...' : wallet?.balance ?? 0}
                    </span>
                    <span className="text-sm font-semibold text-blue-200">Connects</span>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Wallet
              </span>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                {isTutor
                  ? 'Cost: 2 Connects per job application proposal'
                  : 'Cost: 5 Connects per published job post'}
              </span>
              <span className="text-slate-400">
                10 Free Starter Connects granted upon signup
              </span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-700" /> How Connects Work
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects maintain marketplace quality by preventing spam. They are deducted atomically when submitting proposals or publishing listings.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">100% Refund Policy</p>
              <p className="text-[11px] text-slate-500 leading-normal">
                If a job post is cancelled by a guardian or removed by moderation, your spent Connects are automatically refunded.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Purchase Packs */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Purchase Connects Packs</h2>
            <p className="text-xs text-slate-500">Secure instant top-ups via Telebirr or CBE Birr</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CONNECTS_PACKS.map((pack) => {
              const isThisPurchasing = purchasingPackId === pack.id;
              const isAnyPurchasing = purchasingPackId !== null;

              return (
                <div
                  key={pack.id}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between space-y-4 transition ${
                    pack.popular
                      ? 'border-blue-700 ring-2 ring-blue-700/20 shadow-md'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    {pack.popular && (
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-2xl font-black text-slate-900">{pack.connects} Connects</h3>
                    <p className="text-sm font-extrabold text-blue-800">{pack.priceETB} ETB</p>
                  </div>

                  <button
                    type="button"
                    disabled={isAnyPurchasing}
                    onClick={() => handleBuyPack(pack)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      pack.popular
                        ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isThisPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Buy Now</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Audit Ledger */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Transaction Audit History</h2>
            <p className="text-xs text-slate-500">Immutable ledger records for all credit debits and additions</p>
          </div>

          {isLoading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isDebit = tx.type === 'DEBIT';
                return (
                  <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isDebit ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isDebit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{tx.description || tx.reason}</p>
                        <p className="text-[11px] text-slate-400">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <span className={`text-sm font-black ${isDebit ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isDebit ? `${tx.amount}` : `+${tx.amount}`} Connects
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        </div>
      }
    >
      <WalletContent />
    </Suspense>
  );
}