// src/app/dashboard/admin/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminLayout from './_components/AdminLayout';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value;
  
  // Check if user is authenticated
  if (!userRole) {
    redirect('/auth');
  }
  
  // Only admin can access this page
  if (userRole !== 'admin') {
    redirect(`/dashboard/${userRole}`);
  }

  return <AdminLayout>{children}</AdminLayout>;
}