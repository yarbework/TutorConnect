import Link from 'next/link';
import { Coins, Check, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const PACKS = [
  {
    id: 'pack-10',
    title: 'Starter Pack',
    connects: 10,
    priceETB: 150,
    desc: 'Ideal for tutors applying to targeted high-match job requirements.',
    proposalsCount: '~5 Proposals',
    popular: false,
  },
  {
    id: 'pack-25',
    title: 'Educator Pro',
    connects: 25,
    priceETB: 320,
    desc: 'Our most popular bundle for active educators bidding on multiple students weekly.',
    proposalsCount: '~12 Proposals',
    popular: true,
  },
  {
    id: 'pack-50',
    title: 'Scholar Enterprise',
    connects: 50,
    priceETB: 600,
    desc: 'Maximum flexibility with the lowest unit rate per submitted proposal.',
    proposalsCount: '~25 Proposals',
    popular: false,
  },
];

export default function ConnectsPricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Access-Based Economy
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Transparent Connects Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            TutorConnect eliminates commission cuts on teaching hours. Tutors and guardians spend minimal tokens to interact, ensuring high-quality, intentional matches.
          </p>
        </div>

        {/* Free Starter Callout Banner */}
        <div className="max-w-xl mx-auto bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">10 Free Starter Connects</p>
              <p className="text-[11px] text-slate-500">Granted to all new tutor accounts automatically upon registration.</p>
            </div>
          </div>
          <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
            Free Bonus
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition relative ${
                pack.popular
                  ? 'border-2 border-blue-700 shadow-xl'
                  : 'border border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider text-white bg-blue-700 px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular Choice
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{pack.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{pack.desc}</p>
                </div>

                <div className="border-y border-slate-100 py-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">{pack.priceETB}</span>
                  <span className="text-xs font-bold text-slate-500">ETB</span>
                  <span className="text-xs font-black text-blue-700 ml-auto bg-blue-50 px-2.5 py-1 rounded-lg">
                    {pack.connects} Connects
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cost: 2 Connects per job proposal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{pack.proposalsCount}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant top-up via Telebirr or CBE Birr</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% token refund if job is cancelled</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register?role=TUTOR"
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs min-h-[44px] ${
                  pack.popular
                    ? 'bg-blue-700 hover:bg-blue-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Get Started with Pack <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero platform commission on settled hourly lesson tuition.
          </p>
        </div>

      </div>
    </section>
  );
}