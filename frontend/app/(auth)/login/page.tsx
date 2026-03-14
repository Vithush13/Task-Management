'use client';

import { useSearchParams } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import SuccessAlert from '../../components/ui/SuccessAlert';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  return (
    <>
      {showSuccess && (
        <div className="max-w-md mx-auto mt-4">
          <SuccessAlert 
            message="Registration successful! Please login with your credentials." 
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}
      <LoginForm />
    </>
  );
}