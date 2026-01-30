'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import { simpleAuth } from '@/lib/simpleAuth';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (formData: any) => {
    setLoading(true);
    setError('');

    try {
      await simpleAuth.register(formData);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
        <AuthForm
          type="register"
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />
      </div>
    </Layout>
  );
}
