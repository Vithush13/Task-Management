'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import SuccessAlert from '../../components/ui/SuccessAlert';
import ProfileForm from '../../components/account/ProfileForm';
import ChangePasswordForm from '../../components/account/ChangePasswordForm';
import DeleteAccountModal from '../../components/account/DeleteAccountModal';
import userService from '../../lib/userService';

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      setError('');
      const response = await userService.updateProfile(data);
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    }
  };

  const handlePasswordChange = async (data: any) => {
    try {
      setError('');
      await userService.changePassword(data);
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(''), 3000);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
      return { success: false, error: err.message };
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError('');
      await userService.deleteAccount();
      logout();
      router.push('/login?deleted=true');
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      setShowDeleteModal(false);
    }
  };

  if (loading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'profile' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            <ProfileForm 
              profile={profile} 
              onSubmit={handleProfileUpdate} 
            />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <ChangePasswordForm onSubmit={handlePasswordChange} />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
              <p className="text-sm text-gray-500 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}