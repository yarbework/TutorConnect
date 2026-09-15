import { ShieldCheck, Video, MessageSquare, Award, Clock, Coins } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Verified Degrees & Backgrounds',
    desc: 'Every tutor profile undergoes manual document inspection, degree verification, and identity audits before receiving the green badge.',
    badge: 'Trust & Safety',
  },
  {
    icon: Video,
    title: 'Video Introductions',
    desc: 'Watch 60-second pedagogical video introductions directly on tutor profiles to evaluate pronunciation, tone, and teaching style before hiring.',
    badge: 'Preview First',
  },
  {
    icon: MessageSquare,
    title: 'Instant Direct Messaging',
    desc: 'Hiring unlocks an inline private workspace to coordinate session hours, landmarks, and lesson expectations without giving away personal numbers prematurely.',
    badge: 'Real-Time Sync',
  },
  {
    icon: Coins,
    title: 'Zero Commission Settlement',
    desc: 'We do not shave percentages off tutor earnings. Families pay tutors directly via local Telebirr, CBE Birr, or cash without platform fees.',
    badge: '100% P2P',
  },
  {
    icon: Award,
    title: 'Mutual Post-Contract Reviews',
    desc: 'Verified ratings open exclusively after a contract is concluded, keeping tutor quality badges and guardian ratings authentic.',
    badge: 'Verified Feedback',
  },
  {
    icon: Clock,
    title: 'Flexible Hourly Schedules',
    desc: 'Inspect tutors weekly morning, afternoon, and evening availability matrices to book sessions that fit student exam timetables.',
    badge: 'Calendar Matrix',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Designed for Trust, Speed, and Quality
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Eliminating the traditional uncertainty of finding home educators in Ethiopia through transparent vetting and direct communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-200/70 flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-sm transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-blue-700 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}