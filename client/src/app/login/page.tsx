'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import { simpleAuth } from '@/lib/simpleAuth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (formData: any) => {
    setLoading(true);
    setError('');

    try {
      await simpleAuth.login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </Layout>
  );
}
