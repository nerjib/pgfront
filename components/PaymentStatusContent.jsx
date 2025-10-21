"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setStatus(searchParams.get('status') || 'unknown');
    setMessage(searchParams.get('message') || 'No message provided.');
  }, [searchParams]);

  const handleGoHome = () => {
    router.push('/'); // Navigate to the home page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className={`text-3xl font-bold mb-4 ${status === 'failed' ? 'text-red-600' : 'text-green-600'}`}>
          Payment {status.charAt(0).toUpperCase() + status.slice(1)}
        </h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={handleGoHome}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
