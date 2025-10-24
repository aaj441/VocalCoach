# VocalCoach Deployment Guide

## ✅ Deployment Status: **READY TO DEPLOY**

VocalCoach is **fully deployable** to Railway or any Node.js hosting platform.

## 📋 Pre-Deployment Checklist

### ✅ Build System
- [x] Frontend builds successfully (`npm run build:frontend`)
- [x] Backend builds successfully (`npm run build:server`)
- [x] Combined build works (`npm run build`)
- [x] TypeScript compilation passes with no errors
- [x] All dependencies installed

### ✅ Server Configuration
- [x] Express server configured to serve static frontend files
- [x] SPA routing fallback (serves index.html for non-API routes)
- [x] API routes properly namespaced under `/api`
- [x] Health check endpoints at `/health`
- [x] CORS configured
- [x] Security headers (Helmet)
- [x] Compression enabled
- [x] Request logging
- [x] Error handling
- [x] Graceful shutdown

### ✅ Database
- [x] PostgreSQL schema defined with Drizzle ORM
- [x] Migration system configured
- [x] Database connection with retry logic
- [x] Health checks for database connectivity

### ✅ Deployment Files
- [x] `railway.json` - Railway deployment config
- [x] `nixpacks.toml` - Nixpacks build configuration
- [x] `package.json` - Proper start and build scripts
- [x] `.env.example` - All environment variables documented

### ✅ Features
- [x] Full authentication system (JWT)
- [x] Stripe subscription system
- [x] OpenAI integration for AI coaching
- [x] Job scheduler for automated tasks
- [x] 10-level progression system
- [x] Badge and XP system
- [x] Health monitoring
- [x] Real-time vocal analysis

## 🚀 Deployment Steps

### Option 1: Deploy to Railway (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin claude/gamify-vocal-coaching-011CUNiaSqEsegw1jjd5AaUM
   ```

2. **Create Railway Project**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your VocalCoach repository
   - Railway will auto-detect the configuration

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Set Environment Variables**

   Go to your project settings and add these variables:

   **Required:**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=(auto-set by Railway PostgreSQL)
   JWT_SECRET=(generate with: openssl rand -base64 32)
   OPENAI_API_KEY=sk-...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

   **Optional (with defaults):**
   ```
   FRONTEND_URL=https://your-app.railway.app
   CORS_ORIGIN=https://your-app.railway.app
   LOG_LEVEL=info
   JWT_EXPIRES_IN=7d
   ```

   **Stripe Price IDs:**
   ```
   STRIPE_PRICE_ID_BASIC=price_...
   STRIPE_PRICE_ID_PRO=price_...
   STRIPE_PRICE_ID_PREMIUM=price_...
   ```

5. **Configure Stripe Webhook**
   - After deployment, copy your Railway URL
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-app.railway.app/api/subscription/webhook`
   - Select events: `customer.subscription.*` and `invoice.*`
   - Copy webhook secret to Railway env vars

6. **Deploy**
   - Railway automatically deploys on push
   - Monitor logs in Railway dashboard
   - First deployment takes 3-5 minutes

7. **Run Database Migrations**
   ```bash
   # SSH into Railway or use Railway CLI
   npm run db:push
   ```

### Option 2: Deploy to Other Platforms

#### Render, Heroku, DigitalOcean, AWS

1. **Build Command:**
   ```
   npm install && npm run build
   ```

2. **Start Command:**
   ```
   npm start
   ```

3. **Environment:**
   - Node.js 20.x
   - PostgreSQL 14+

4. **Port:**
   - Server listens on `process.env.PORT` or 3001

## 📝 Environment Variables Reference

### Core Application
```bash
NODE_ENV=production          # Environment (production/development/test)
PORT=3001                    # Server port (Railway sets automatically)
FRONTEND_URL=https://...     # Your app's public URL
CORS_ORIGIN=https://...      # Allowed CORS origin (usually same as FRONTEND_URL)
```

### Database
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Authentication
```bash
JWT_SECRET=your-secret-key   # Generate: openssl rand -base64 32
JWT_EXPIRES_IN=7d            # Token expiration (7 days default)
```

### Stripe (Payment Processing)
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_PREMIUM=price_...
```

### OpenAI (AI Coaching)
```bash
OPENAI_API_KEY=sk-...        # From OpenAI dashboard
```

### Logging
```bash
LOG_LEVEL=info               # error, warn, info, debug
```

## 🔍 Post-Deployment Verification

### 1. Health Checks
```bash
# Basic health
curl https://your-app.railway.app/health

# Detailed health
curl https://your-app.railway.app/health/detailed

# Database health
curl https://your-app.railway.app/health/db
```

### 2. Frontend
```bash
# Visit in browser
https://your-app.railway.app

# Should load React app with Perplexity teal colors
```

### 3. API Endpoints
```bash
# Root API endpoint
curl https://your-app.railway.app/

# Should serve frontend index.html
```

### 4. Authentication
```bash
# Register test user
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
```

### 5. Database
```bash
# Run migrations
npm run db:push

# Or use Drizzle Studio (locally)
npm run db:studio
```

## 🐛 Troubleshooting

### Build Fails
- **Error:** TypeScript compilation errors
- **Fix:** Run `npm run build` locally first
- **Check:** All imports use `.js` extensions for ES modules

### Database Connection Fails
- **Error:** "Database connection failed"
- **Fix:** Verify `DATABASE_URL` is set correctly
- **Check:** PostgreSQL service is running
- **Note:** Railway PostgreSQL has auto-retry logic

### Environment Variables Not Loading
- **Error:** "Invalid environment variables"
- **Fix:** Check all required vars are set in Railway
- **Check:** No typos in variable names
- **Restart:** Redeploy after adding variables

### Stripe Webhook Fails
- **Error:** "Invalid signature"
- **Fix:** Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- **Check:** Webhook endpoint URL is correct
- **Test:** Use Stripe CLI for local testing

### Job Scheduler Not Running
- **Note:** Jobs only run in production mode
- **Check:** `NODE_ENV=production` is set
- **Verify:** Server logs show "Job scheduler started"

### Frontend 404 Errors
- **Error:** Routes return 404
- **Fix:** Server is configured to serve `index.html` for SPA routes
- **Check:** Static files are in correct location (`dist/`)

## 📊 Monitoring

### Railway Dashboard
- View real-time logs
- Monitor CPU/memory usage
- Check deployment status
- View environment variables

### Application Logs
- Winston logger outputs structured JSON
- View in Railway logs or export to log aggregator
- Levels: error, warn, info, debug

### Health Endpoints
- `/health` - Basic health check
- `/health/detailed` - Full system metrics
- `/health/db` - Database connectivity
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

## 🔐 Security Checklist

- [x] HTTPS enforced (Railway auto-provides)
- [x] CORS configured
- [x] Helmet security headers
- [x] JWT tokens with expiration
- [x] Passwords hashed with bcrypt
- [x] Stripe webhook signature verification
- [x] Environment variables not in code
- [x] SQL injection prevention (Drizzle ORM)
- [x] Rate limiting ready (express-rate-limit installed)

## 📈 Performance

- [x] Compression enabled
- [x] Static file serving
- [x] Database connection pooling
- [x] Efficient queries with indexes
- [x] Frontend code splitting
- [x] Gzipped assets (24KB CSS, 66KB JS)

## 🎯 Next Steps After Deployment

1. **Set up domain** (optional)
   - Configure custom domain in Railway
   - Update `FRONTEND_URL` and `CORS_ORIGIN`

2. **Configure monitoring** (optional)
   - Set up error tracking (Sentry, Bugsnag)
   - Add analytics (Plausible, Google Analytics)
   - Configure uptime monitoring

3. **Set up backups**
   - Railway PostgreSQL has automatic backups
   - Job scheduler runs daily backup at 3 AM (production)

4. **Test subscription flow**
   - Complete test purchase with Stripe
   - Verify webhook events are received
   - Check user subscription status updates

5. **Load testing** (optional)
   - Test with concurrent users
   - Monitor response times
   - Adjust resources if needed

## 📚 Documentation

- **Full implementation docs:** `README_IMPLEMENTATION.md`
- **API documentation:** See inline comments in route files
- **Environment setup:** `.env.example`
- **Database schema:** `server/db/schema.ts`

## 🎉 Deployment Complete!

Your VocalCoach application is now live and ready to help users develop their vocal skills with AI-powered, ADHD-friendly gamified training!

**Key Features Active:**
- ✅ 10-level progression system
- ✅ AI-powered exercise generation
- ✅ Real-time vocal analysis
- ✅ Stripe subscriptions
- ✅ Badge and XP system
- ✅ Automated daily challenges
- ✅ Health monitoring
- ✅ ADHD-friendly micro-sessions

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Stripe Docs: https://stripe.com/docs
- OpenAI Docs: https://platform.openai.com/docs
