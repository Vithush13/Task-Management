'use client';

import React, { useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delete Account
          </h3>

          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action is permanent and cannot be undone.
                All your tasks and data will be permanently deleted.
              </p>
            </div>

            <p className="text-sm text-gray-600">
              To confirm, type <span className="font-bold text-red-600">DELETE</span> in the box below:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="DELETE"
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading || confirmText !== 'DELETE'}
                className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;