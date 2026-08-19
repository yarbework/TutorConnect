import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/home/AnnouncementBanner';
import HeroSection from '@/components/home/HeroSection';
import RoleSelection from '@/components/home/RoleSelection';
import PopularSubjects from '@/components/home/PopularSubjects';
import FeaturedTutors from '@/components/home/FeaturedTutors';
import ProcessRoadmap from '@/components/home/ProcessRoadmap';
import CtaBanner from '@/components/home/CtaBanner';

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