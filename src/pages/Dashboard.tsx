
import DashboardLayout from '@/components/DashboardLayout';
import ResumeScreener from '../components/ResumeScreener';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight">HireSmart Dashboard</h1>
        <p className="text-lg text-blue-900/80 mb-2">AI-powered resume screening & hiring workflow</p>
        <div className="flex justify-center gap-2 mb-2">
          <span className="inline-block px-4 py-1 rounded-full bg-cyan-200 text-cyan-900 font-semibold text-sm">Fast</span>
          <span className="inline-block px-4 py-1 rounded-full bg-indigo-200 text-indigo-900 font-semibold text-sm">Accurate</span>
          <span className="inline-block px-4 py-1 rounded-full bg-blue-200 text-blue-900 font-semibold text-sm">Secure</span>
        </div>
      </div>
      <div className="w-full">
        <ResumeScreener jobId={localStorage.getItem('jobId')} />
      </div>
    </DashboardLayout>
  );
}

