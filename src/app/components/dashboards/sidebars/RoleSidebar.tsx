"use client";

import AdminSidebar from './AdminSidebar';
import CreatorSidebar from './CreatorSidebar';
import AnalystSidebar from './AnalystSidebar';
import { useRouter } from 'next/navigation';

interface RoleSidebarProps {
  role: 'admin' | 'creator' | 'analyst' | 'manager' | 'client';
  className?: string;
}

export default function RoleSidebar({ role, className }: RoleSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/signout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  switch (role) {
    case 'admin':
      return <AdminSidebar className={className} onLogout={handleLogout} />;
    case 'creator':
      return <CreatorSidebar className={className} onLogout={handleLogout} />;
    case 'analyst':
      return <AnalystSidebar className={className} onLogout={handleLogout} />;
    default:
      return <CreatorSidebar className={className} onLogout={handleLogout} />;
  }
}