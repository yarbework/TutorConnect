export default function ProcessRoadmap() {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-12">How TutorConnect Streamlines Tutoring</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-left space-y-3">
            <div className="w-10 h-10 bg-blue-700 text-white rounded-xl font-black flex items-center justify-center text-lg">1</div>
            <h3 className="font-bold text-lg text-slate-900">Post or Search Needs</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Guardians post detailed student needs; tutors search postings aligned with their academic background.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-left space-y-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center text-lg">2</div>
            <h3 className="font-bold text-lg text-slate-900">Connect via Proposals</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tutors use Connects credits to submit tailored proposals with pricing and schedules directly to guardians.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-left space-y-3">
            <div className="w-10 h-10 bg-indigo-700 text-white rounded-xl font-black flex items-center justify-center text-lg">3</div>
            <h3 className="font-bold text-lg text-slate-900">Learn & Succeed</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Finalize contracts, manage weekly lesson schedules, and track academic milestone improvements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}