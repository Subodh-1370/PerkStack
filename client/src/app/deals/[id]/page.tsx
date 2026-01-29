'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { dealsAPI, claimsAPI } from '@/lib/api';
import { Deal } from '@/types';
import { authService } from '@/lib/auth';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchDeal();
  }, [params.id]);

  const fetchDeal = async () => {
    try {
      const response = await dealsAPI.getDeal(params.id as string);
      setDeal(response.data);
    } catch (error) {
      console.error('Failed to fetch deal:', error);
      router.push('/deals');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDeal = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (deal?.accessLevel === 'locked' && !user.isVerified) {
      setError('You must be verified to claim this deal.');
      return;
    }

    setClaiming(true);
    setError('');
    setSuccess('');

    try {
      await claimsAPI.createClaim(deal!._id);
      setSuccess('Deal claimed successfully! Check your dashboard for status updates.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to claim deal');
    } finally {
      setClaiming(false);
    }
  };

  const canClaimDeal = () => {
    if (!user) return false;
    if (!deal) return false;
    if (deal.accessLevel === 'public') return true;
    return user.isVerified;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading deal details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!deal) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Deal not found</h1>
            <Link href="/deals" className="text-blue-600 hover:text-blue-700">
              ← Back to deals
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/deals" className="text-blue-600 hover:text-blue-700">
            ← Back to deals
          </Link>
        </motion.nav>

        {/* Deal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
                {deal.category}
              </span>
              {deal.accessLevel === 'locked' && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full ml-2">
                  🔒 Verified Only
                </span>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {deal.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {deal.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Partner</h3>
              <p className="text-lg font-semibold text-gray-900">{deal.partnerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Access Level</h3>
              <p className="text-lg font-semibold text-gray-900">
                {deal.accessLevel === 'public' ? 'Available to Everyone' : 'Verified Startups Only'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Deal Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Details</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{deal.benefitDetails}</p>
          </div>
        </motion.div>

        {/* Eligibility */}
        {deal.accessLevel === 'locked' && deal.eligibilityNote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">🔒 Eligibility Requirements</h2>
            <p className="text-yellow-800">{deal.eligibilityNote}</p>
          </motion.div>
        )}

        {/* Claim Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="text-center">
            {user ? (
              canClaimDeal() ? (
                <motion.button
                  onClick={handleClaimDeal}
                  disabled={claiming}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-4 rounded-lg font-semibold text-white ${
                    claiming
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {claiming ? 'Claiming Deal...' : 'Claim This Deal'}
                </motion.button>
              ) : (
                <div className="text-gray-600">
                  <p className="text-lg font-medium mb-2">🔒 This deal requires verification</p>
                  <p>You need to be a verified startup to claim this deal.</p>
                </div>
              )
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Sign in to claim this exclusive deal</p>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-block"
                >
                  Sign In to Claim
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
