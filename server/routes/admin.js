const express = require('express');
const User = require('../models/User');
const Deal = require('../models/Deal');
const Claim = require('../models/Claim');
const router = express.Router();

// Clear all data (for development only)
router.post('/clear', async (req, res) => {
  try {
    await User.deleteMany({});
    await Claim.deleteMany({});
    
    // Re-seed deals
    const sampleDeals = [
      {
        title: 'HubSpot CRM Pro',
        description: 'Get 50% off HubSpot CRM Pro for the first year',
        category: 'Sales',
        partnerName: 'HubSpot',
        accessLevel: 'public',
        benefitDetails: '50% discount on HubSpot CRM Pro for 12 months. Includes all features: contact management, deal tracking, email templates, and analytics.',
        featuredImage: ''
      },
      {
        title: 'Stripe Processing Fees',
        description: 'Reduced processing fees for startups',
        category: 'Development',
        partnerName: 'Stripe',
        accessLevel: 'locked',
        eligibilityNote: 'Must be a registered startup with less than 50 employees',
        benefitDetails: 'Reduced processing fees of 2.2% + 30¢ per transaction (normally 2.9% + 30¢). No monthly fees for the first 6 months.',
        featuredImage: ''
      },
      {
        title: 'AWS Credits',
        description: '$10,000 in AWS credits for early-stage startups',
        category: 'Development',
        partnerName: 'Amazon Web Services',
        accessLevel: 'locked',
        eligibilityNote: 'Must be less than 2 years old and have raised less than $5M',
        benefitDetails: '$10,000 in AWS credits valid for 2 years. Includes access to AWS Activate program with technical support and training.',
        featuredImage: ''
      },
      {
        title: 'Figma Team Plan',
        description: 'Free Figma Team plan for startups',
        category: 'Design',
        partnerName: 'Figma',
        accessLevel: 'public',
        benefitDetails: 'Free Figma Team plan for 12 months. Includes unlimited files, version history, and team libraries.',
        featuredImage: ''
      },
      {
        title: 'Notion Plus Plan',
        description: '50% off Notion Plus for teams',
        category: 'Productivity',
        partnerName: 'Notion',
        accessLevel: 'public',
        benefitDetails: '50% discount on Notion Plus plan for up to 10 team members. Includes unlimited blocks, advanced permissions, and priority support.',
        featuredImage: ''
      },
      {
        title: 'Google Cloud Credits',
        description: '$5,000 in Google Cloud credits',
        category: 'Development',
        partnerName: 'Google Cloud',
        accessLevel: 'locked',
        eligibilityNote: 'Must be a technology startup with less than 100 employees',
        benefitDetails: '$5,000 in Google Cloud credits valid for 12 months. Includes access to Google for Startups program.',
        featuredImage: ''
      }
    ];

    await Deal.deleteMany({});
    await Deal.insertMany(sampleDeals);
    
    res.json({ message: 'Database cleared and re-seeded successfully' });
  } catch (error) {
    console.error('Clear database error:', error);
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

module.exports = router;
