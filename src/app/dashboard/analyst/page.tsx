import DashboardLayout from '@/app/components/DashboardLayout';
import AnalystDashboard from '@/app/components/dashboards/AnalystDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Analyst Dashboard",
  description: "Data analysis and performance insights",
};

export default function AnalystDashboardPage() {
  return (
    <DashboardLayout userRole="analyst">
      <div className="px-4 py-6 sm:px-0">
        <AnalystDashboard />
      </div>
    </DashboardLayout>
  );
}