"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RoleSwitcherProps {
  currentRole: string;
  availableRoles: string[];
}

const roleConfig = {
 
  creator: {
    name: "Content Creator",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🎨",
    description: "Content creation and scheduling"
  },
  analyst: {
    name: "Analyst",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "📊",
    description: "Data analysis and reporting"
  },

};

export default function RoleSwitcher({ currentRole, availableRoles }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const handleRoleSwitch = async (newRole: string) => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    
    try {
      const response = await fetch('/api/user/switch-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the new role's dashboard
        window.location.href = `/dashboard/${newRole}`;
      } else {
        alert(data.error || 'Failed to switch role');
      }
    } catch (error) {
      console.error('Role switch error:', error);
      alert('Failed to switch role');
    } finally {
      setIsSwitching(false);
      setIsOpen(false);
    }
  };

  const currentRoleInfo = roleConfig[currentRole as keyof typeof roleConfig] || roleConfig.creator;

  return (
    <div className="relative">
      {/* Current Role Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg border-2 ${currentRoleInfo.color} hover:opacity-80 transition-all disabled:opacity-50`}
      >
        <span className="text-xl">{currentRoleInfo.icon}</span>
        <div className="text-left">
          <p className="text-sm font-semibold">{currentRoleInfo.name}</p>
          <p className="text-xs opacity-75">Click to switch</p>
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Switch Role</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose a different role to access its features
            </p>
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
                    isCurrent ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{roleInfo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900">{roleInfo.name}</p>
                      {isCurrent && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{roleInfo.description}</p>
                  </div>
                  {isSwitching && role === currentRole && (
                    <div className="flex-shrink-0">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {availableRoles.length === 1 && (
            <div className="p-4 bg-yellow-50 border-t border-yellow-200">
              <p className="text-sm text-yellow-800 text-center">
                You only have access to one role. Contact an administrator for additional roles.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}