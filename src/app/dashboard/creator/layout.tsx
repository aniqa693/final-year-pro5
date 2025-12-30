// src/app/dashboard/creator/layout.tsx
import DashboardLayout from '@/app/components/DashboardLayout';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value;
  const originalRole = cookieStore.get('original-role')?.value;
  
  // Check if user is authenticated
  if (!userRole) {
    redirect('/auth');
  }
  
  // Only creator can access this page
  if (userRole !== 'creator') {
    redirect(`/dashboard/${userRole}`);
  }

  return (
    <DashboardLayout 
      userRole={userRole}
      originalRole={originalRole} // Pass the original role
    >
      {children}
    </DashboardLayout>
  );
}