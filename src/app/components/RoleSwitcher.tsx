// app/components/dashboard/RoleSwitcher.tsx
"use client";
import { useState } from 'react';

interface RoleSwitcherProps {
  currentRole: string;
  availableRoles: string[];
}

const roleConfig = {
  admin: {
    name: "Admin",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "👑",
    description: "System administration"
  },
  creator: {
    name: "Content Creator",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "🎨",
    description: "Content creation and scheduling"
  },
  analyst: {
    name: "Analyst",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "📊",
    description: "Data analysis and reporting"
  },
  manager: {
    name: "Manager",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "👔",
    description: "Team management"
  },
  client: {
    name: "Client",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "💼",
    description: "Client portal"
  }
};

export default function RoleSwitcher({ currentRole, availableRoles }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSwitch = async (newRole: string) => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    setError(null);
    
    console.log(`🔄 Attempting to switch from ${currentRole} to ${newRole}`);
    console.log(`📡 Calling API: /api/user/switch-role`);

    try {
      const response = await fetch('/api/user/switch-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRole }),
      });

      console.log(`📥 API Response status: ${response.status}`);
      
      const data = await response.json();
      console.log(`📥 API Response data:`, data);

      if (response.ok && data.success) {
        console.log('✅ Role switch successful, redirecting...');
        
        // Show success message
        alert(`Role switched to ${newRole}! Redirecting...`);
        
        // Force a hard refresh to the new dashboard
        setTimeout(() => {
          window.location.href = `/dashboard/${newRole}`;
        }, 1000);
      } else {
        const errorMsg = data.error || `Failed with status ${response.status}`;
        console.error('❌ Switch role error:', errorMsg, data);
        
        // Show detailed error
        setError(errorMsg);
        alert(`❌ Error: ${errorMsg}\n\nCurrent role: ${currentRole}\nRequested: ${newRole}`);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Network error';
      setError(errorMsg);
      alert(`❌ Network error: ${errorMsg}\n\nPlease check console for details.`);
    } finally {
      setIsSwitching(false);
      setIsOpen(false);
    }
  };

  const currentRoleInfo = roleConfig[currentRole as keyof typeof roleConfig] || roleConfig.admin;

  // Debug info
  console.log('🔍 RoleSwitcher Debug:');
  console.log('  - Current role:', currentRole);
  console.log('  - Available roles:', availableRoles);
  console.log('  - Is admin?', currentRole === 'admin');
  console.log('  - Can switch?', currentRole === 'admin' && availableRoles.length > 1);

  return (
    <div className="relative">
      {/* Admin Role Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg border-2 ${currentRoleInfo.color} hover:opacity-80 transition-all disabled:opacity-50 min-w-[180px]`}
      >
        <span className="text-xl">{currentRoleInfo.icon}</span>
        <div className="text-left flex-1">
          <p className="text-sm font-semibold">{currentRoleInfo.name}</p>
          <p className="text-xs opacity-75">
            {isSwitching ? 'Switching...' : 'Switch role'}
            {currentRole === 'admin' && ' (Admin)'}
          </p>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && (
        <div className="absolute top-full mt-2 p-3 bg-red-100 text-red-800 text-sm rounded-lg border border-red-200 max-w-xs">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-purple-50">
              <h3 className="font-semibold text-gray-900">Admin Role Switcher</h3>
              <p className="text-sm text-gray-600 mt-1">
                Switch between different roles to test features
              </p>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>Current role: <span className="font-semibold text-purple-700">{currentRole}</span></p>
                <p>API endpoint: <code className="bg-gray-100 px-1 rounded">/api/user/switch-role</code></p>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {availableRoles.map((role) => {
                const roleInfo = roleConfig[role as keyof typeof roleConfig];
                const isCurrent = role === currentRole;
                
                if (!roleInfo) return null;

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    disabled={isSwitching || isCurrent}
                    className={`w-full flex items-start space-x-4 p-4 text-left hover:bg-gray-50 transition-colors ${
                      isCurrent ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className="text-2xl flex-shrink-0">{roleInfo.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{roleInfo.name}</p>
                        {isCurrent && (
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{roleInfo.description}</p>
                    </div>
                    {isSwitching && role === currentRole && (
                      <div className="flex-shrink-0">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600 space-y-1">
                <p className="text-center">You will be redirected to the selected role's dashboard</p>
                <p className="text-center text-gray-500">
                  Check browser console for debugging info
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}