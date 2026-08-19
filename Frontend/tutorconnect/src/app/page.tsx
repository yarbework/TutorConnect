import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import AnnouncementBanner from '@/src/components/home/AnnouncementBanner';
import HeroSection from '@/src/components/home/HeroSection';
import RoleSelection from '@/src/components/home/RoleSelection';
import PopularSubjects from '@/src/components/home/PopularSubjects';
import FeaturedTutors from '@/src/components/home/FeaturedTutors';
import ProcessRoadmap from '@/src/components/home/ProcessRoadmap';
import CtaBanner from '@/src/components/home/CtaBanner';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <RoleSelection />
        <PopularSubjects />
        <FeaturedTutors />
        <ProcessRoadmap />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}