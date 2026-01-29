# PerkStack System Flow Explanation

## 🔄 Complete User Registration Flow

### 1. Frontend Registration Request
```
User fills form → Submit → AuthForm component → handleRegister()
```

### 2. API Request Processing
```
Frontend → simpleAPI.register() → fetch() → Backend POST /api/auth/register
```

### 3. Backend Route Handler
```javascript
// POST /api/auth/register
router.post('/register', [validation middleware], async (req, res) => {
  1. Validate input (express-validator)
  2. Check if user exists (User.findOne)
  3. Hash password (bcrypt.genSalt + bcrypt.hash)
  4. Create user (new User())
  5. Generate JWT (jwt.sign)
  6. Return response with token + user data
});
```

### 4. Database Operations
```
MongoDB: Users collection → Insert new document
{
  name: "John Doe",
  email: "john@example.com", 
  passwordHash: "$2a$12$...",
  startupName: "Startup Inc",
  isVerified: false
}
```

### 5. Frontend Response Handling
```
Response received → Store token in localStorage → Store user data → Redirect to dashboard
```

## 🔐 Authentication Middleware Flow

### JWT Verification Process
```javascript
// Middleware runs on protected routes
auth middleware → Extract token from header → jwt.verify() → Find user in DB → Attach user to req
```

### Token Structure
```javascript
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1696896667,
  "exp": 1697501467
}
```

## 🎯 Deal Claiming Flow

### 1. User Claims Deal (Frontend)
```
Deal details page → Click "Claim Deal" → handleClaimDeal() → claimsAPI.createClaim()
```

### 2. Backend Claim Processing
```javascript
// POST /api/claims
1. Verify JWT token (auth middleware)
2. Extract user from req.user
3. Find deal by ID
4. Check access level (public vs locked)
5. Verify user eligibility
6. Check for duplicate claims
7. Create claim document
8. Return success response
```

### 3. Business Logic Enforcement
```javascript
// Critical security checks
if (deal.accessLevel === 'locked' && !user.isVerified) {
  return res.status(403).json({ error: 'Verification required' });
}

const existingClaim = await Claim.findOne({ user: userId, deal: dealId });
if (existingClaim) {
  return res.status(400).json({ error: 'Already claimed' });
}
```

### 4. Database Claim Creation
```javascript
// Claims collection - new document
{
  user: ObjectId("507f1f77bcf86cd799439011"),
  deal: ObjectId("507f1f77bcf86cd799439012"),
  status: "pending",
  claimedAt: ISODate("2024-01-29T12:00:00Z")
}
```

## 📊 Dashboard Data Flow

### 1. User Dashboard Request
```
Dashboard component → useEffect() → claimsAPI.getMyClaims()
```

### 2. Backend Data Retrieval
```javascript
// GET /api/claims/my
1. Verify JWT token
2. Find all claims for this user
3. Populate deal information for each claim
4. Sort by claimedAt (newest first)
5. Return array of claims with deal details
```

### 3. Data Aggregation
```javascript
// MongoDB aggregation pipeline
Claim.find({ user: userId })
  .populate('deal', 'title partnerName category benefitDetails accessLevel')
  .sort({ claimedAt: -1 })
```

### 4. Frontend Display
```
Claims array → Map through claims → Display claim cards with status indicators
```

## 🔒 Security Layers

### 1. Input Validation
```javascript
// Backend validation example
body('email').isEmail().normalizeEmail()
body('password').isLength({ min: 6 })
body('name').trim().isLength({ min: 2 })
```

### 2. Password Security
```javascript
// bcrypt hashing with 12 salt rounds
const salt = await bcrypt.genSalt(12);
const passwordHash = await bcrypt.hash(password, salt);
```

### 3. Authorization Checks
```javascript
// Route-level protection
app.use('/api/claims', auth); // All claim routes require auth

// Resource-level protection
if (deal.accessLevel === 'locked' && !req.user.isVerified) {
  return res.status(403).json({ error: 'Unauthorized' });
}
```

### 4. CORS Configuration
```javascript
// Prevent cross-origin attacks
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
```

## 🚨 Error Handling Flow

### 1. Frontend Error Handling
```javascript
try {
  await simpleAuth.register(userData);
  router.push('/dashboard');
} catch (error) {
  setError(error.message || 'Registration failed');
}
```

### 2. Backend Error Handling
```javascript
// Validation errors
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}

// Database errors
if (existingUser) {
  return res.status(400).json({ error: 'User already exists' });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

### 3. API Response Standards
```javascript
// Success response
{
  "message": "User registered successfully",
  "token": "eyJ...",
  "user": { "id": "...", "name": "...", "email": "..." }
}

// Error response
{
  "error": "User already exists with this email"
}
```

## 🔄 State Management Flow

### 1. Authentication State
```javascript
// localStorage persistence
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));

// Auth state retrieval
const user = simpleAuth.getCurrentUser();
const isAuthenticated = simpleAuth.isAuthenticated();
```

### 2. Component State Updates
```javascript
// React hooks for local state
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [claims, setClaims] = useState([]);
```

### 3. API State Synchronization
```javascript
// Fetch on mount
useEffect(() => {
  const currentUser = simpleAuth.getCurrentUser();
  if (!currentUser) {
    router.push('/login');
    return;
  }
  fetchClaims();
}, []);
```

## 📈 Performance Considerations

### 1. Database Optimization
```javascript
// Indexes for common queries
claimSchema.index({ user: 1, deal: 1 }, { unique: true }); // Prevent duplicates
userSchema.index({ email: 1 }, { unique: true }); // Fast user lookup
```

### 2. Frontend Optimization
```javascript
// Efficient re-renders
useMemo(() => filteredDeals, [deals, filters]);
useCallback(() => handleClaim, [dealId]);

// Lazy loading
const DealDetails = lazy(() => import('./DealDetails'));
```

### 3. API Optimization
```javascript
// Selective field population
.populate('deal', 'title partnerName category') // Only needed fields

// Pagination for large datasets
.getDeals({ page: 1, limit: 10 })
```

This system flow demonstrates a complete understanding of how each component interacts, from user input to database storage and back to the frontend display.
