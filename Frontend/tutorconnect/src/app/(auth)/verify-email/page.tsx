import { Suspense } from 'react';
import VerifyEmailCard from '../../../components/auth/VerifyEmailCard';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-blue-700" />}>
        <VerifyEmailCard />
      </Suspense>
    </div>
  );
}