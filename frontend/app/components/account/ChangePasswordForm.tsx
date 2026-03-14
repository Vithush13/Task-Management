'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ChangePasswordFormProps {
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  
  const newPassword = watch('newPassword');

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    const result = await onSubmit(data);
    if (result.success) {
      reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Current Password */}
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
          Current Password *
        </label>
        <input
          {...register('currentPassword', { 
            required: 'Current password is required'
          })}
          type="password"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message as string}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          New Password *
        </label>
        <input
          {...register('newPassword', { 
            required: 'New password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
          type="password"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message as string}</p>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm New Password *
        </label>
        <input
          {...register('confirmPassword', { 
            required: 'Please confirm your new password',
            validate: value => value === newPassword || 'Passwords do not match'
          })}
          type="password"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="bg-blue-50 p-3 rounded-md">
        <h4 className="text-xs font-medium text-blue-800 uppercase">Password Requirements</h4>
        <ul className="mt-1 text-xs text-blue-700 list-disc list-inside">
          <li>At least 6 characters long</li>
          <li>Include at least one uppercase letter</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;