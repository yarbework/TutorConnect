import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import JobPostForm from '../../../../components/jobs/JobPostForm';

export default function NewJobPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Post a Tutoring Requirement</h1>
          <p className="text-slate-600 text-sm mt-1">
            Create a targeted job post specifying your student&apos;s grade level, subject, learning goals, and schedule.
          </p>
        </div>
        <JobPostForm />
      </main>
      <Footer />
    </div>
  );
}