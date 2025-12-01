import DashboardLayout from '@/app/components/DashboardLayout';
import CreatorDashboard from '@/app/components/dashboards/CreatorDashboard';
import AnalystDashboard from '@/app/components/dashboards/AnalystDashboard';
import AdminDashboard from '@/app/components/dashboards/AdminDashboard';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface DashboardPageProps {
  params: {
    role: string;
  };
}

// Role configuration for only analyst and creator
const roleConfig = {
  admin: { 
    title: "Creator Dashboard", 
    description: "Content creation and social media management",
    component: AdminDashboard
  },
  creator: { 
    title: "Creator Dashboard", 
    description: "Content creation and social media management",
    component: CreatorDashboard
  },
  analyst: { 
    title: "Analyst Dashboard", 
    description: "Data analysis and performance insights",
    component: AnalystDashboard
  },
};

// Generate metadata dynamically
export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { role } = params;
  
  if (!(role in roleConfig)) {
    return {
      title: "Dashboard Not Found",
    };
  }

  const config = roleConfig[role as keyof typeof roleConfig];
  
  return {
    title: config.title,
    description: config.description,
  };
}

// Generate static params for better performance
export async function generateStaticParams() {
  return [
    { role: 'analyst' },
    { role: 'creator' }
  ];
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { role } = params;
  
  if (!(role in roleConfig)) {
    notFound();
  }

  const config = roleConfig[role as keyof typeof roleConfig];
  const DashboardComponent = config.component;

  return (
    <DashboardLayout userRole={role}>
      <div className="px-4 py-6 sm:px-0">
        <DashboardComponent />
      </div>
    </DashboardLayout>
  );
}