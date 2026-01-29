export interface Deal {
  _id: string;
  title: string;
  description: string;
  category: string;
  partnerName: string;
  accessLevel: 'public' | 'locked';
  eligibilityNote?: string;
  benefitDetails: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  _id: string;
  user: string;
  deal: Deal;
  status: 'pending' | 'approved' | 'rejected';
  claimedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  startupName: string;
  isVerified: boolean;
}
