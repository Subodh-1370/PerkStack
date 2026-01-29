# PerkStack - Startup Benefits & SaaS Deals Platform

A full-stack platform that connects startups with exclusive SaaS deals, featuring user authentication, deal management, and a claim system.

## 🎯 Project Overview

PerkStack solves a real problem for early-stage startups: accessing premium software tools at discounted rates. The platform acts as a marketplace where SaaS companies offer exclusive deals to verified startups.

## 🏗️ Architecture & Design Decisions

### Backend Architecture
- **Node.js + Express.js**: Chosen for rapid development and extensive ecosystem
- **MongoDB + Mongoose**: NoSQL database for flexible deal structures and user profiles
- **JWT Authentication**: Stateless authentication for scalability
- **RESTful APIs**: Standard HTTP methods for predictable client-server communication

### Frontend Architecture  
- **Next.js (App Router)**: Server-side rendering for SEO and performance
- **TypeScript**: Type safety for better development experience
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **Framer Motion**: Smooth animations for professional UX

### Key Engineering Decisions

#### 1. Separate Claim Model
**Why**: Claims are distinct from deals because:
- A deal can have multiple claims (many-to-one relationship)
- Claims need their own lifecycle (pending → approved/rejected)
- Tracking claim history requires independent timestamps
- Different users can claim the same deal

```javascript
// Claim schema tracks who claimed what, when, and status
const claimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
  status: { enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  claimedAt: { type: Date, default: Date.now }
});
```

#### 2. Backend Deal Access Control
**Why**: Security must be enforced server-side because:
- Frontend validation can be bypassed
- API calls can be made directly (Postman, curl)
- Prevents unauthorized users from accessing locked deals
- Ensures data integrity regardless of client implementation

```javascript
// Middleware checks user verification before allowing locked deal claims
if (deal.accessLevel === 'locked' && !req.user.isVerified) {
  return res.status(403).json({ error: 'You must be verified to claim this deal' });
}
```

#### 3. JWT Implementation
**Why**: JWT over sessions because:
- Stateless authentication scales better
- Mobile apps can use same API
- No server-side session storage needed
- Easy integration with frontend localStorage

#### 4. Claim Status Workflow
**Flow**: User claims deal → Admin reviews → Status update → User notified
- **Pending**: Default state, requires admin approval
- **Approved**: User gets deal access, email notification
- **Rejected**: User can try other deals, clear feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB installed locally
- npm or yarn

### Installation

1. **Clone and setup backend**
```bash
cd PerkStack
npm install
```

2. **Configure environment**
```bash
# Backend .env
MONGODB_URI=mongodb://localhost:27017/perkstack
JWT_SECRET=your-secret-key
PORT=5001
```

3. **Frontend setup**
```bash
cd client
npm install
```

4. **Start development servers**
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run client
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required)
  email: String (unique, required)
  passwordHash: String (required, bcrypt)
  startupName: String (required)
  isVerified: Boolean (default: false)
}
```

### Deal Model
```javascript
{
  title: String (required)
  description: String (required)
  category: String (enum: Marketing, Development, etc.)
  partnerName: String (required)
  accessLevel: String (enum: 'public', 'locked')
  eligibilityNote: String (required for locked deals)
  benefitDetails: String (required)
}
```

### Claim Model
```javascript
{
  user: ObjectId (ref: User)
  deal: ObjectId (ref: Deal)
  status: String (enum: pending, approved, rejected)
  claimedAt: Date (default: now)
}
```

## 🔐 Security Implementation

### Authentication Flow
1. User registers → Password hashed with bcrypt (12 rounds)
2. Login successful → JWT token generated (7-day expiry)
3. Token stored in localStorage → Added to API headers
4. Protected routes verify token → Extract user info

### Authorization Rules
- **Public deals**: Any authenticated user can claim
- **Locked deals**: Only verified users can claim
- **Duplicate prevention**: Same user cannot claim same deal twice
- **Admin endpoints**: Protected for deal/claim management

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Deals
- `GET /api/deals` - List all deals with filtering
- `GET /api/deals/:id` - Get specific deal details
- `POST /api/deals/seed` - Seed sample deals (dev only)

### Claims
- `POST /api/claims` - Create new claim (protected)
- `GET /api/claims/my` - Get user's claims (protected)
- `PATCH /api/claims/:id/status` - Update claim status (admin)

## 🎨 Frontend Components

### Key Components
- **AuthForm**: Reusable login/register form with validation
- **Layout**: Navigation with auth state management
- **DealCard**: Display deal information with claim actions
- **ClaimStatus**: Visual indicators for claim states

### State Management
- **localStorage**: User session persistence
- **React hooks**: Local component state
- **API integration**: Centralized in service layer

## 🧪 Testing & Validation

### Manual Testing Checklist
- [ ] User registration with valid data
- [ ] Duplicate email registration prevention
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Public deal claiming (any user)
- [ ] Locked deal claiming (verified users only)
- [ ] Duplicate claim prevention
- [ ] Claim status tracking in dashboard

### API Testing
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","startupName":"Test Startup"}'
```

## 📈 Scalability Considerations

### Current Limitations
- No file upload system for deal images
- Basic admin interface
- No email notification system
- No analytics/tracking

### Production Improvements
1. **Database Optimization**: Add indexes for frequent queries
2. **Caching**: Redis for deal listings and user sessions
3. **File Storage**: AWS S3 for deal images
4. **Email Service**: SendGrid for notifications
5. **Monitoring**: Logging and error tracking
6. **CDN**: CloudFront for static assets

## 🤝 Contributing

This project demonstrates full-stack development skills including:
- RESTful API design
- Database modeling
- Authentication & authorization
- Modern frontend development
- Business logic implementation
- Security best practices

## 📝 Learning Outcomes

Building PerkStack taught me:
- How to design secure authentication systems
- The importance of server-side validation
- Database relationship modeling
- Modern React patterns with Next.js
- API integration and error handling
- Professional UI/UX implementation

## ▶️ Running the Application

Both backend and frontend must run simultaneously.

Start Backend Server
npm run server
Backend runs on:
http://localhost:5000

Start Frontend Client
npm run client
Frontend runs on:
http://localhost:3000

