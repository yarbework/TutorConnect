import DashboardStatsCard from '../shared/DashboardStatsCard';
import { Briefcase, Send, Eye, CheckCircle2 } from 'lucide-react';

interface Props {
  activeApplicationsCount: number;
  acceptedMatchesCount: number;
  hourlyRate: number;
}

export default function TutorMetrics({
  activeApplicationsCount,
  acceptedMatchesCount,
  hourlyRate,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardStatsCard
        title="Active Proposals"
        value={activeApplicationsCount}
        subtitle="Pending guardian review"
        icon={Send}
        iconColor="text-blue-700"
        bgColor="bg-blue-50"
      />
      <DashboardStatsCard
        title="Accepted Matches"
        value={acceptedMatchesCount}
        subtitle="Active tutoring engagements"
        icon={CheckCircle2}
        iconColor="text-emerald-700"
        bgColor="bg-emerald-50"
      />
      <DashboardStatsCard
        title="Hourly Rate"
        value={`${hourlyRate} ETB`}
        subtitle="Current teaching rate / hr"
        icon={Briefcase}
        iconColor="text-purple-700"
        bgColor="bg-purple-50"
      />
    </div>
  );
}