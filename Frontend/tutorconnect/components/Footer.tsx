import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <span className="text-xl font-bold text-white tracking-tight">
            Tutor<span className="text-emerald-500">Connect</span>
          </span>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ethiopia's trusted platform bridging the gap between passionate tutors and dedicated guardians.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="#how-it-works" className="hover:text-white transition">How it Works</Link></li>
            <li><Link href="/register?role=GUARDIAN" className="hover:text-white transition">For Guardians</Link></li>
            <li><Link href="/register?role=TUTOR" className="hover:text-white transition">For Tutors</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Subjects</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer">Mathematics & Physics</span></li>
            <li><span className="hover:text-white cursor-pointer">Chemistry & Biology</span></li>
            <li><span className="hover:text-white cursor-pointer">EUEE National Exam Prep</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Legal & Support</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
            <li><span className="hover:text-white cursor-pointer">Verification FAQs</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TutorConnect. All rights reserved.
      </div>
    </footer>
  );
}