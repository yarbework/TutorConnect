import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import PublicTutorProfileView from '../../../components/tutor/PublicTutorProfileView';
import { tutorApi } from '../../../lib/api/tutor';

export default async function PublicTutorPage({ params }: { params: { id: string } }) {
  let profile = null;

  try {
    profile = await tutorApi.getPublicProfile(params.id);
  } catch (err) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <PublicTutorProfileView profile={profile} />
      </main>
      <Footer />
    </div>
  );
}