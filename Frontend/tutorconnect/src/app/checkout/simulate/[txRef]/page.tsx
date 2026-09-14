'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { paymentsApi, OrderDetails } from '../../../../lib/api/payments';
import { 
  ShieldCheck, 
  Smartphone, 
  Coins, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowLeft, 
  Zap,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ txRef: string }> | { txRef: string };
}

export default function SimulateCheckoutPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = 'then' in params ? use(params) : params;
  const txRef = resolvedParams.txRef;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'TELEBIRR' | 'CBE'>('TELEBIRR');
  const [phoneNumber, setPhoneNumber] = useState('0911223344');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  useEffect(() => {
    paymentsApi
      .getOrderByTxRef(txRef)
      .then((data) => setOrder(data))
      .catch((err) => {
        toast.error('Transaction reference not found');
        console.error(err);
      })
      .finally(() => setIsLoadingOrder(false));
  }, [txRef]);

  const handleSimulateAction = async (outcome: 'SUCCESS' | 'FAILED') => {
    setIsProcessing(true);
    try {
      await paymentsApi.simulatePayment(txRef, outcome);

      if (outcome === 'SUCCESS') {
        toast.success(`Payment verified! ${order?.connectsAmount} Connects credited to your wallet.`);
        router.replace('/wallet?payment=success');
      } else {
        toast.error('Transaction failed (Declined by provider).');
        router.replace('/wallet?payment=failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Loading payment gateway terminal...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <p className="text-sm font-bold text-rose-400">Invalid or expired transaction session.</p>
        <button
          onClick={() => router.push('/wallet')}
          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl"
        >
          Return to Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      
      
      <div className="w-full max-w-md mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2.5 rounded-2xl text-center text-xs">
        <span className="font-extrabold block">Sandbox Test Mode</span>
        Zero real money is charged. This screen simulates local mobile banking rails.
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> TutorConnect Checkout
            </span>
            <h1 className="text-xl font-black text-white mt-0.5">Payment Terminal</h1>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 256-Bit SSL
          </span>
        </div>

        <div className="p-6 bg-slate-900/80 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Package</span>
            <span className="text-xs font-black text-white flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {order.connectsAmount} Connects
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Price</span>
            <span className="text-2xl font-black text-amber-400">{order.amountETB} <span className="text-xs text-slate-400">ETB</span></span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
            <span>Reference</span>
            <span className="font-mono text-slate-400">{order.txRef}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Mobile Money Provider
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedMethod('TELEBIRR')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                selectedMethod === 'TELEBIRR'
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs font-black">Telebirr</p>
                <p className="text-[10px] text-slate-400">Instant Mobile PIN</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('CBE')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                selectedMethod === 'CBE'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs font-black">CBE Birr</p>
                <p className="text-[10px] text-slate-400">Commercial Bank</p>
              </div>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Account / Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-2 pt-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulateAction('SUCCESS')}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm PIN 
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulateAction('FAILED')}
              className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" /> Insufficient Balance (Fail)
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => router.push('/wallet')}
              className="w-full py-2.5 text-slate-500 hover:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Cancel and Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}