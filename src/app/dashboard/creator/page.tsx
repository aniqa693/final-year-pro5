import DashboardLayout from '@/app/components/DashboardLayout';
import CreatorDashboard from '@/app/components/dashboards/CreatorDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Creator Dashboard",
  description: "Content creation and social media management",
};

export default function CreatorDashboardPage() {
  return (
    <DashboardLayout userRole="creator">
      <div className="px-4 py-6 sm:px-0">
        <CreatorDashboard />
      </div>
    </DashboardLayout>
  );
}