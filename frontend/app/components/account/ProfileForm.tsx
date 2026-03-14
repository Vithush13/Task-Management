'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProfileFormProps {
  profile: {
    username: string;
    email: string;
    fullName: string;
    role: string;
    createdAt: string;
  };
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

const ProfileForm = ({ profile, onSubmit }: ProfileFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email
    }
  });
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Username (read-only) */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={profile.username}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          {...register('fullName', { 
            required: 'Full name is required',
            minLength: { value: 2, message: 'Full name must be at least 2 characters' }
          })}
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message as string}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
        )}
      </div>

      {/* Role (read-only) */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <input
          type="text"
          id="role"
          value={profile.role}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
        />
      </div>

      {/* Member Since */}
      <div>
        <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
          Member Since
        </label>
        <input
          type="text"
          id="createdAt"
          value={new Date(profile.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;