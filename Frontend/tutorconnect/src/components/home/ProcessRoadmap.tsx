export default function ProcessRoadmap() {
  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Step-by-Step
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How TutorConnect Works
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            A simple, transparent process from first search to completed lesson
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-left space-y-3">
            <div className="w-10 h-10 bg-blue-700 text-white rounded-xl font-black flex items-center justify-center text-lg shadow-xs">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Post or Search Needs</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Guardians publish grade and budget requirements. Tutors browse listings tailored to their subjects and location.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-left space-y-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center text-lg shadow-xs">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Direct Proposal & Chat</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tutors apply using Connects credits. Guardians hire top candidates to unlock instant inline messaging for lesson coordination.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-left space-y-3">
            <div className="w-10 h-10 bg-indigo-700 text-white rounded-xl font-black flex items-center justify-center text-lg shadow-xs">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Learn & Review</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Settle tuition directly via Telebirr or CBE. Once sessions finish, close the engagement to exchange verified reviews.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}