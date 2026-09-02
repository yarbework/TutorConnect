import DashboardStatsCard from '../shared/DashboardStatsCard';
import { Briefcase, Users, CheckCircle2 } from 'lucide-react';

interface Props {
  activeJobsCount: number;
  totalApplicantsCount: number;
  hiredTutorsCount: number;
}

export default function GuardianMetrics({
  activeJobsCount,
  totalApplicantsCount,
  hiredTutorsCount,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardStatsCard
        title="Active Job Posts"
        value={activeJobsCount}
        subtitle="Currently open for tutors"
        icon={Briefcase}
        iconColor="text-emerald-700"
        bgColor="bg-emerald-50"
      />
      <DashboardStatsCard
        title="Total Applicants"
        value={totalApplicantsCount}
        subtitle="Tutor video pitches received"
        icon={Users}
        iconColor="text-blue-700"
        bgColor="bg-blue-50"
      />
      <DashboardStatsCard
        title="Hired Tutors"
        value={hiredTutorsCount}
        subtitle="Active learning engagements"
        icon={CheckCircle2}
        iconColor="text-purple-700"
        bgColor="bg-purple-50"
      />
    </div>
  );
}