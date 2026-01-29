const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Marketing', 'Development', 'Design', 'Analytics', 'Productivity', 'Sales', 'Other']
  },
  partnerName: {
    type: String,
    required: true,
    trim: true
  },
  accessLevel: {
    type: String,
    required: true,
    enum: ['public', 'locked'],
    default: 'public'
  },
  eligibilityNote: {
    type: String,
    required: function() {
      return this.accessLevel === 'locked';
    }
  },
  benefitDetails: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Deal', dealSchema);
