'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { dealsAPI } from '@/lib/api';
import { Deal } from '@/types';
import { authService } from '@/lib/auth';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [accessFilter, setAccessFilter] = useState('');
  const [user, setUser] = useState<any>(null);

  const categories = ['Marketing', 'Development', 'Design', 'Analytics', 'Productivity', 'Sales', 'Other'];

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchDeals();
  }, []);

  useEffect(() => {
    filterDeals();
  }, [deals, searchTerm, categoryFilter, accessFilter]);

  const fetchDeals = async () => {
    try {
      const response = await dealsAPI.getDeals();
      setDeals(response.data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDeals = () => {
    let filtered = deals;

    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(deal => deal.category === categoryFilter);
    }

    if (accessFilter) {
      filtered = filtered.filter(deal => deal.accessLevel === accessFilter);
    }

    setFilteredDeals(filtered);
  };

  const canClaimDeal = (deal: Deal) => {
    if (!user) return false;
    if (deal.accessLevel === 'public') return true;
    return user.isVerified;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exclusive SaaS Deals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium software deals designed to accelerate your startup growth.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Access Levels</option>
                <option value="public">Public</option>
                <option value="locked">Locked (Verified Only)</option>
              </select>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 py-2">
                {filteredDeals.length} deals found
              </p>
            </div>
          </div>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal, index) => (
            <motion.div
              key={deal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                      {deal.category}
                    </span>
                    {deal.accessLevel === 'locked' && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full ml-2">
                        🔒 Verified Only
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {deal.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {deal.description}
                </p>

                <div className="text-sm text-gray-500 mb-4">
                  <p>Partner: <span className="font-medium text-gray-700">{deal.partnerName}</span></p>
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    href={`/deals/${deal._id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                  
                  {!canClaimDeal(deal) && deal.accessLevel === 'locked' && (
                    <span className="text-xs text-gray-500">
                      Requires verification
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No deals found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
