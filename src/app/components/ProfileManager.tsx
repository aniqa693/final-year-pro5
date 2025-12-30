// app/components/ProfileManager.tsx
"use client";
import { useState, useEffect } from 'react';
import { 
  X, 
  Edit2, 
  Save, 
  Trash2, 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Globe, 
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileManager({ isOpen, onClose }: ProfileManagerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setAvatarPreview(data.user.image || null);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveMessage('');

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      bio: formData.get('bio') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      website: formData.get('website') as string,
      image: avatarPreview || formData.get('image') as string,
    };

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setAvatarPreview(data.user.image || null);
        setIsEditing(false);
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setSaveMessage('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.')) {
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Account deleted successfully. Redirecting to home page...');
        window.location.href = '/';
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert('Failed to delete account');
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      // In a real app, you would upload the file to a storage service
      console.log('Selected file:', file.name);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    if (user) {
      setUser({ ...user, image: undefined });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Settings
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setIsEditing(false);
              setSaveMessage('');
              setAvatarPreview(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Success/Error Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            saveMessage.includes('success') 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {saveMessage.includes('success') ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{saveMessage}</span>
          </div>
        )}

        {!isEditing ? (
          // View Mode - Enhanced Card Design
          <div className="space-y-8">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative flex items-center gap-6">
                <div className="relative">
                  {avatarPreview || user?.image ? (
                    <img 
                      src={avatarPreview || user?.image} 
                      alt={user?.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30 shadow-2xl">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{user?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-white/90">{user?.email}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mt-3">
                    <User className="w-3.5 h-3.5" />
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Company</h4>
                      <p className="text-gray-600 text-sm">Professional affiliation</p>
                    </div>
                  </div>
                  <p className="text-gray-900 text-lg font-medium pl-11">
                    {user?.company || 'Not specified'}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-gray-600 text-sm">Your base location</p>
                    </div>
                  </div>
                  <p className="text-gray-900 text-lg font-medium pl-11">
                    {user?.location || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Website</h4>
                      <p className="text-gray-600 text-sm">Personal or professional site</p>
                    </div>
                  </div>
                  <p className="text-gray-900 text-lg font-medium pl-11 truncate">
                    {user?.website ? (
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {user.website}
                      </a>
                    ) : 'Not specified'}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Member Since</h4>
                      <p className="text-gray-600 text-sm">Account creation date</p>
                    </div>
                  </div>
                  <p className="text-gray-900 text-lg font-medium pl-11">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">About Me</h4>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {user?.bio || 'No bio provided. Tell others about yourself!'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3.5 px-6 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold border border-gray-300"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode - Enhanced Form Design
          <form onSubmit={handleProfileUpdate} className="space-y-8">
            {/* Avatar Upload Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {avatarPreview ? (
                    <>
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 shadow-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                      <User className="w-16 h-16 text-blue-500" />
                    </div>
                  )}
                </div>
                
                <label className="cursor-pointer">
                  <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-400 transition-colors">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700">Upload New Photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 text-sm mt-3">JPG, PNG or GIF (max 2MB)</p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name || ''}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Bio
              </label>
              <textarea
                name="bio"
                defaultValue={user?.bio || ''}
                rows={4}
                placeholder="Tell the world your story..."
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  defaultValue={user?.company || ''}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={user?.location || ''}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  defaultValue={user?.website || ''}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Avatar URL
              </label>
              <input
                type="url"
                name="image"
                value={avatarPreview || ''}
                onChange={(e) => setAvatarPreview(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter a direct image URL or upload a file
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSaveMessage('');
                  setAvatarPreview(user?.image || null);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold border border-gray-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}