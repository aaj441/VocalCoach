# VocalCoach Implementation Documentation

## Overview

VocalCoach is a fully autonomous, AI-powered gamified vocal coaching platform with ADHD-friendly features. The system uses agentic automation to provide personalized training, adaptive challenges, and real-time feedback.

## Architecture

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS with custom Perplexity color scheme
- Zustand for state management
- Web Audio API for real-time audio analysis

**Backend:**
- Node.js + Express
- PostgreSQL with Drizzle ORM
- OpenAI GPT-4 for AI-powered features
- Stripe for subscription management
- JWT authentication with bcrypt
- Winston for structured logging
- Node-cron for job scheduling

**Infrastructure:**
- Railway for deployment
- Automated database migrations
- Health monitoring and observability
- Graceful shutdown handling

## Core Features

### 1. Autonomous Vocal Training Agent

**Location:** `server/agents/vocalAgent.ts`

The VocalAgent is the core AI system that autonomously:

- **Generates Personalized Exercises**
  - Analyzes user's vocal stats and recent performance
  - Identifies weakest skill area
  - Uses OpenAI GPT-4 to create custom exercises
  - Adapts difficulty based on user level

- **Analyzes Practice Sessions**
  - Calculates performance scores
  - Generates AI-powered feedback
  - Identifies improvements
  - Awards XP based on performance
  - Updates user progress automatically

- **Monitors User Health**
  - Detects 3-day inactivity
  - Protects streaks with proactive interventions
  - Sends ADHD-friendly motivational messages

- **Generates Daily Challenges**
  - Creates fresh challenges every day
  - Adapts to user level
  - Provides XP and item rewards

### 2. Gamification System

**Core Mechanics:**
- **XP & Leveling:** Earn XP from practice, level up every 1000 XP
- **Streaks:** Daily practice streaks with protective interventions
- **Challenges:** Daily, weekly, and achievement-based challenges
- **Badges:** Earn badges for milestones and achievements
- **Avatar Customization:** Unlock new items with progression

**Database Schema:**
- `users` - User accounts and subscription info
- `userProfiles` - Gamification data (level, XP, stats, avatar)
- `practiceSessions` - Practice history with detailed stats
- `aiExercises` - AI-generated personalized exercises
- `badges` - User achievements
- `challenges` - Daily/weekly challenges with rewards

### 3. Authentication System

**Location:** `server/services/auth.service.ts`

**Features:**
- User registration with automatic profile creation
- Secure password hashing (bcrypt with 10 rounds)
- JWT token generation and verification
- Session management
- Protected routes via middleware

**Endpoints:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh token

### 4. Subscription System

**Location:** `server/services/stripe.service.ts`

**Features:**
- Stripe Checkout integration
- Customer Portal for self-service management
- Webhook handling for subscription events
- Automatic user status updates
- Support for multiple tiers (basic, pro, premium)

**Tiers:**
- **Free:** Basic features, limited exercises
- **Basic:** $9.99/month - Unlimited exercises, basic AI feedback
- **Pro:** $19.99/month - Advanced AI analysis, custom challenges
- **Premium:** $29.99/month - Priority support, exclusive content

**Endpoints:**
- `POST /api/subscription/checkout` - Create checkout session
- `POST /api/subscription/portal` - Open customer portal
- `GET /api/subscription/status` - Check subscription status
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/subscription/webhook` - Stripe webhook handler

### 5. Job Scheduler

**Location:** `server/jobs/scheduler.ts`

**Automated Jobs:**

1. **Daily Challenges Generation**
   - Schedule: 12:00 AM daily
   - Generates fresh challenges for all users

2. **User Health Monitoring**
   - Schedule: Every 6 hours
   - Checks for inactive users
   - Sends intervention messages

3. **Database Backup**
   - Schedule: 3:00 AM daily
   - Creates PostgreSQL dump
   - (Production only)

4. **System Health Check**
   - Schedule: Every 15 minutes
   - Monitors memory, CPU, database
   - Logs metrics to database

5. **Weekly Analytics**
   - Schedule: 1:00 AM every Monday
   - Aggregates user statistics
   - Generates insights

### 6. Health Monitoring

**Location:** `server/routes/health.ts`

**Endpoints:**
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system metrics
- `GET /health/db` - Database connectivity check
- `GET /health/ready` - Readiness probe (Railway/K8s)
- `GET /health/live` - Liveness probe (Railway/K8s)

## API Reference

### Vocal Training Endpoints

**All require authentication**

#### Get User Profile
```
GET /api/vocal/profile
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "userId": "uuid",
    "level": 5,
    "xp": 2340,
    "totalPoints": 12500,
    "streak": 7,
    "avatar": {...},
    "vocalStats": {...}
  }
}
```

#### Generate Personalized Exercise
```
POST /api/vocal/exercise/generate
```

**Response:**
```json
{
  "exercise": {
    "id": "uuid",
    "type": "pitch",
    "difficulty": "intermediate",
    "title": "Chromatic Scale Mastery",
    "description": "...",
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "targetMetrics": {"pitchAccuracy": 85},
    "duration": 300
  }
}
```

#### Submit Practice Session
```
POST /api/vocal/session

{
  "type": "exercise",
  "duration": 300,
  "stats": {
    "pitchAccuracy": 82,
    "resonance": 75,
    "clarity": 78,
    "volumeControl": 80
  }
}
```

**Response:**
```json
{
  "feedback": [
    "Excellent pitch control!",
    "Great vocal resonance!"
  ],
  "improvements": [
    "Pitch accuracy improved by 8%"
  ],
  "xpGained": 245
}
```

#### Get Daily Challenges
```
GET /api/vocal/challenges/daily
```

**Response:**
```json
{
  "challenges": [
    {
      "id": "uuid",
      "title": "15-Minute Practice",
      "description": "Practice for 15 minutes today",
      "type": "daily",
      "difficulty": "easy",
      "goal": 900,
      "progress": 0,
      "reward": {
        "type": "xp",
        "value": 100,
        "name": "100 XP"
      },
      "expiresAt": "2025-10-25T00:00:00Z"
    }
  ]
}
```

## Environment Configuration

**Required Environment Variables:**

```bash
# Server
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vocalcoach

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# OpenAI
OPENAI_API_KEY=sk-...

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd VocalCoach
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your values
```

4. **Set up database**
```bash
# Create database
createdb vocalcoach

# Run migrations
npm run db:push

# Or generate and apply migrations
npm run db:migrate
```

5. **Run development servers**
```bash
# Run both frontend and backend
npm run dev:all

# Or run separately:
npm run dev          # Frontend only (port 5173)
npm run dev:server   # Backend only (port 3001)
```

### Database Management

**Push schema changes directly (development):**
```bash
npm run db:push
```

**Generate migrations (production):**
```bash
npm run db:migrate
```

**Open Drizzle Studio (GUI):**
```bash
npm run db:studio
```

## Production Deployment

### Building for Production

```bash
# Build frontend
npm run build

# Build backend
npm run build:server
```

### Running in Production

```bash
NODE_ENV=production npm run start:prod
```

### Railway Deployment

The app is configured for Railway deployment with:

- `railway.json` - Railway configuration
- `nixpacks.toml` - Build configuration
- `Procfile` - Process definition

**Deploy to Railway:**
1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push to main branch

**Environment Variables to Set:**
- `DATABASE_URL` (provided by Railway Postgres)
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `FRONTEND_URL`

## Code Organization

```
VocalCoach/
├── server/
│   ├── agents/
│   │   └── vocalAgent.ts          # AI training agent
│   ├── config/
│   │   ├── env.ts                 # Environment configuration
│   │   └── logger.ts              # Winston logger setup
│   ├── db/
│   │   ├── index.ts               # Database connection
│   │   ├── schema.ts              # Drizzle ORM schema
│   │   └── migrate.ts             # Migration runner
│   ├── jobs/
│   │   └── scheduler.ts           # Cron job scheduler
│   ├── middleware/
│   │   └── auth.middleware.ts     # JWT authentication
│   ├── routes/
│   │   ├── auth.routes.ts         # Auth endpoints
│   │   ├── vocal.routes.ts        # Vocal training endpoints
│   │   ├── subscription.routes.ts # Stripe endpoints
│   │   └── health.ts              # Health monitoring
│   ├── services/
│   │   ├── auth.service.ts        # Auth business logic
│   │   └── stripe.service.ts      # Stripe integration
│   └── index.ts                   # Main server file
├── src/
│   ├── components/                # React components
│   ├── utils/                     # Utility functions
│   └── App.tsx                    # Main React app
├── drizzle.config.ts              # Drizzle configuration
├── tsconfig.server.json           # Backend TypeScript config
└── package.json                   # Dependencies and scripts
```

## Key Design Decisions

### 1. Autonomous Agent Pattern

The VocalAgent operates independently, making decisions based on:
- User performance data
- Historical patterns
- AI-generated insights
- Health monitoring signals

**Benefits:**
- Reduces manual intervention
- Scales automatically
- Provides consistent experience
- Adapts to user needs

### 2. ADHD-Friendly Design

**Implementation:**
- Short, engaging exercise titles
- Clear step-by-step instructions
- Immediate feedback and rewards
- Streak protection interventions
- Quick 5-minute practice options
- Visual progress indicators

### 3. Real-time Audio Analysis

**Web Audio API Features:**
- Pitch detection via autocorrelation
- Spectral analysis for clarity
- Volume analysis with smoothing
- Low-latency processing (<50ms)

### 4. Gamification Psychology

**Engagement Mechanics:**
- Variable reward schedules (challenges)
- Progress visualization (XP bars, levels)
- Social proof (badges, achievements)
- Loss aversion (streak protection)
- Autonomy (avatar customization)

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Token refresh
- [ ] Protected route access

**Vocal Training:**
- [ ] Generate personalized exercise
- [ ] Submit practice session
- [ ] View practice history
- [ ] Get daily challenges
- [ ] Complete challenge

**Subscription:**
- [ ] Create checkout session
- [ ] Handle successful payment webhook
- [ ] Access customer portal
- [ ] Cancel subscription

**Health Monitoring:**
- [ ] Basic health check
- [ ] Detailed metrics
- [ ] Database connectivity

## Monitoring and Observability

### Logs

All logs use Winston with structured JSON format:

```typescript
logInfo('User registered', { userId, email });
logError('Registration failed', error, { email });
```

**Log Levels:**
- `error` - Errors requiring attention
- `warn` - Warning conditions
- `info` - Informational messages
- `debug` - Debug information (dev only)

### Health Metrics

System health is logged to `health_logs` table every 15 minutes:
- Status (healthy/degraded/unhealthy)
- Uptime
- Memory usage (RSS, heap)
- CPU usage
- Database status

### Job Execution

All job runs are logged with:
- Job name
- Status (success/failure)
- Duration
- Error details (if failed)

## Security Considerations

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration (7 days)
- Secure token storage
- Protected routes via middleware

### API Security
- Helmet for security headers
- CORS configuration
- Rate limiting (express-rate-limit)
- Request size limits (10MB max)
- Input validation with Zod

### Data Protection
- Environment variables for secrets
- No sensitive data in logs
- Sanitized user objects (passwords removed)
- Stripe signature verification

## Performance Optimizations

### Backend
- Compression middleware
- Database connection pooling
- Efficient queries with indexes
- Caching strategies (future)

### Frontend
- Code splitting
- Lazy loading components
- Audio processing on separate thread
- Debounced audio analysis

## Future Enhancements

### Phase 2 Features
1. **Social Features**
   - Friend system
   - Leaderboards
   - Challenge friends

2. **Advanced AI**
   - Voice emotion detection
   - Accent coaching
   - Song recommendation engine

3. **Content Expansion**
   - More mini-games
   - Song library integration
   - Video tutorials

4. **Analytics Dashboard**
   - Admin panel
   - User insights
   - Performance metrics

5. **Mobile Apps**
   - React Native apps
   - Push notifications
   - Offline mode

## Troubleshooting

### Common Issues

**Database connection failed:**
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection manually
psql $DATABASE_URL
```

**Port already in use:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill process
kill -9 <PID>
```

**OpenAI API errors:**
- Check API key is valid
- Verify billing is active
- Check rate limits

**Stripe webhook failures:**
- Verify webhook secret matches
- Check endpoint URL is accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:3001/api/subscription/webhook`

## Support

For issues, questions, or contributions:
- GitHub Issues: [repository-url]/issues
- Email: support@vocalcoach.app
- Documentation: [docs-url]

## License

[Your License Here]

---

**Built with ❤️ for aspiring vocalists with ADHD-friendly design principles**
