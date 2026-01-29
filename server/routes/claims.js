const express = require('express');
const auth = require('../middleware/auth');
const Claim = require('../models/Claim');
const Deal = require('../models/Deal');
const router = express.Router();

// Create a claim (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({ error: 'Deal ID is required' });
    }

    // Check if deal exists
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Check if user is verified for locked deals
    if (deal.accessLevel === 'locked' && !req.user.isVerified) {
      return res.status(403).json({ error: 'You must be verified to claim this deal' });
    }

    // Check if user already claimed this deal
    const existingClaim = await Claim.findOne({ user: req.user._id, deal: dealId });
    if (existingClaim) {
      return res.status(400).json({ error: 'You have already claimed this deal' });
    }

    // Create claim
    const claim = new Claim({
      user: req.user._id,
      deal: dealId,
      status: 'pending'
    });

    await claim.save();

    // Populate deal info for response
    await claim.populate('deal', 'title partnerName benefitDetails');

    res.status(201).json({
      message: 'Deal claimed successfully',
      claim
    });
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ error: 'Failed to claim deal' });
  }
});

// Get user's claims (protected)
router.get('/my', auth, async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user._id })
      .populate('deal', 'title partnerName category benefitDetails accessLevel')
      .sort({ claimedAt: -1 });

    res.json(claims);
  } catch (error) {
    console.error('Get user claims error:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// Update claim status (admin only - for demo purposes)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('deal', 'title partnerName');

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json({
      message: `Claim status updated to ${status}`,
      claim
    });
  } catch (error) {
    console.error('Update claim status error:', error);
    res.status(500).json({ error: 'Failed to update claim status' });
  }
});

module.exports = router;
