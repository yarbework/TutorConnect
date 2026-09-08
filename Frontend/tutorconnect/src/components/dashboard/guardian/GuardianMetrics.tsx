import DashboardStatsCard from '../shared/DashboardStatsCard';
import { Briefcase, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  activeJobsCount: number;
  inReviewJobsCount: number;
  hiredJobsCount: number;
}

export default function GuardianMetrics({
  activeJobsCount,
  inReviewJobsCount,
  hiredJobsCount,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardStatsCard
        title="Active Jobs"
        value={activeJobsCount}
        subtitle="Currently open to tutors"
        icon={Briefcase}
        iconColor="text-emerald-700"
        bgColor="bg-emerald-50"
      />
      <DashboardStatsCard
        title="In Review"
        value={inReviewJobsCount}
        subtitle="Applications under evaluation"
        icon={Clock}
        iconColor="text-amber-700"
        bgColor="bg-amber-50"
      />
      <DashboardStatsCard
        title="Hired Engagements"
        value={hiredJobsCount}
        subtitle="Active awarded tutoring"
        icon={CheckCircle2}
        iconColor="text-purple-700"
        bgColor="bg-purple-50"
      />
    </div>
  );
}