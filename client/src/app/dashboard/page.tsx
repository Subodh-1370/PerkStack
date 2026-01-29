'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { claimsAPI } from '@/lib/api';
import { Claim } from '@/types';
import { authService } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await claimsAPI.getMyClaims();
      setClaims(response.data);
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-blue-100 mb-4">
            Manage your startup: {user?.startupName}
          </p>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user?.isVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user?.isVerified ? '✅ Verified Startup' : '⏳ Pending Verification'}
            </span>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              label: 'Total Claims',
              value: claims.length,
              icon: '📋',
              color: 'bg-blue-50 border-blue-200'
            },
            {
              label: 'Approved',
              value: claims.filter(c => c.status === 'approved').length,
              icon: '✅',
              color: 'bg-green-50 border-green-200'
            },
            {
              label: 'Pending',
              value: claims.filter(c => c.status === 'pending').length,
              icon: '⏳',
              color: 'bg-yellow-50 border-yellow-200'
            },
            {
              label: 'Rejected',
              value: claims.filter(c => c.status === 'rejected').length,
              icon: '❌',
              color: 'bg-red-50 border-red-200'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-xl border ${stat.color}`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Claims Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Deal Claims</h2>
            {claims.length === 0 && (
              <a
                href="/deals"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse Deals →
              </a>
            )}
          </div>

          {claims.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No deals claimed yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring exclusive SaaS deals tailored for startups.
              </p>
              <a
                href="/deals"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Explore Deals
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim, index) => (
                <motion.div
                  key={claim._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {claim.deal.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                          {getStatusIcon(claim.status)} {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{claim.deal.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Partner:</span>
                          <span className="ml-2 font-medium text-gray-900">{claim.deal.partnerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 font-medium text-gray-900">{claim.deal.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Claimed:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(claim.claimedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Access:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {claim.deal.accessLevel === 'public' ? 'Public' : 'Verified Only'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {claim.status === 'approved' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">
                        🎉 Congratulations! Your claim has been approved. Check your email for next steps.
                      </p>
                    </div>
                  )}

                  {claim.status === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">
                        This claim was rejected. Feel free to explore other deals.
                      </p>
                    </div>
                  )}

                  {claim.status === 'pending' && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800">
                        Your claim is being reviewed. You'll receive an email once a decision is made.
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
