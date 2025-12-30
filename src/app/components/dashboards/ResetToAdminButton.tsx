// app/components/dashboards/ResetToAdminButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetToAdminButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleResetToAdmin = async () => {
    if (!confirm('Are you sure you want to reset back to Admin role?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/reset-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset role');
      }

      // Success - reload the page to reflect the new role
      window.location.href = '/dashboard/admin';
      
    } catch (error) {
      console.error('Error resetting to admin:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset role');
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleResetToAdmin}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resetting...
          </>
        ) : (
          'Reset to Admin'
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {/* <p className="mt-2 text-sm text-gray-600">
        Switch back to your administrator role
      </p> */}
    </div>
  );
}