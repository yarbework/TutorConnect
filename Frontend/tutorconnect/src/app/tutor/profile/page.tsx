// src/app/tutor/profile/page.tsx
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TutorProfileForm from '../../../components/tutor/TutorProfileForm';

export default function TutorProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Tutor Profile & Portfolio</h1>
          <p className="text-slate-600 text-sm mt-1">
            Configure your teaching bio, hourly rate, YouTube introduction video, and weekly availability.
          </p>
        </div>
        <TutorProfileForm />
      </main>
      <Footer />
    </div>
  );
}