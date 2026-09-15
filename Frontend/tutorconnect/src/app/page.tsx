import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import PopularSubjects from '../components/home/PopularSubjects';
import FeaturedTutors from '../components/home/FeaturedTutors';
import RecentJobsSection from '../components/home/RecentJobsSection';
import ProcessRoadmap from '../components/home/ProcessRoadmap';
import FeaturesSection from '../components/home/FeaturesSection';
import ConnectsPricingSection from '../components/home/ConnectsPricingSection';
import HomeReviewsSection from '../components/home/HomeReviewsSection';
import RoleSelection from '../components/home/RoleSelection';
import CtaBanner from '../components/home/CtaBanner';
import { publicApi } from '../lib/api/public';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredTutors, recentJobs, featuredReviews, stats] = await Promise.all([
    publicApi.getFeaturedTutors().catch(() => []),
    publicApi.getRecentJobs().catch(() => []),
    publicApi.getFeaturedReviews().catch(() => []),
    publicApi.getPlatformStats().catch(() => ({ verifiedTutorsCount: 0 })),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <HeroSection stats={stats} />
        <PopularSubjects />
        <FeaturedTutors tutors={featuredTutors} />
        <RecentJobsSection jobs={recentJobs} />
        <ProcessRoadmap />
        <FeaturesSection />
        <ConnectsPricingSection />
        <HomeReviewsSection reviews={featuredReviews} />
        <RoleSelection />
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}