import Link from 'next/link';
import { Coins, Plus, Zap } from 'lucide-react';

interface Props {
  balance: number;
  role: 'TUTOR' | 'GUARDIAN';
}

export default function ConnectsBalanceCard({ balance, role }: Props) {
  const isTutor = role === 'TUTOR';

  return (
    <div className="bg-linear-to-br from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Connects Wallet</span>
            <p className="text-2xl font-black text-white">{balance} <span className="text-sm font-normal text-blue-200">Credits</span></p>
          </div>
        </div>

        <Link
          href="/connects/buy"
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm min-h-10"
        >
          <Plus className="w-4 h-4" /> Top Up
        </Link>
      </div>

      <div className="pt-2 border-t border-blue-800/60 flex items-center justify-between text-xs text-blue-200">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          {isTutor ? 'Cost: ~2 Connects per job application' : 'Cost: ~5 Connects per job posting'}
        </span>
      </div>
    </div>
  );
}