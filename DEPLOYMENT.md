# VocalCoach Deployment Guide

This guide covers deploying VocalCoach to various platforms.

## Railway Deployment

### Quick Deploy

1. **Connect your GitHub repository to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your VocalCoach repository

2. **Railway will automatically:**
   - Detect it's a Node.js project
   - Run `npm install`
   - Run `npm run build`
   - Run `npm start`
   - Assign a public URL

3. **Access your app:**
   - Railway will provide a URL like `vocalcoach.up.railway.app`
   - The app will be live and accessible

### Configuration Files

The following files configure Railway deployment:

- **`nixpacks.toml`**: Tells Railway how to build and start the app
- **`railway.json`**: Additional Railway configuration
- **`Procfile`**: Fallback process configuration
- **`.node-version`**: Specifies Node.js 20
- **`serve.json`**: Configuration for the static file server

### Environment Variables

No environment variables are required for basic deployment. All data is stored in the browser's localStorage.

### Troubleshooting

#### Build fails
- Check Railway logs for TypeScript errors
- Ensure all dependencies are listed in package.json
- Verify Node.js version is 20+

#### App doesn't start
- Verify `npm start` works locally: `npm run build && npm start`
- Check that the `serve` package is in dependencies, not devDependencies
- Ensure PORT environment variable is being used correctly

#### 404 errors on refresh
- The `serve.json` file configures SPA routing
- Ensure the file is in the root directory
- Verify the rewrite rules are correct

## Alternative Platforms

### Vercel

```bash
npm install -g vercel
vercel --prod
```

Configuration is automatic with Vite detection.

### Netlify

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploy:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/serve.json ./
RUN npm ci --production
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t vocalcoach .
docker run -p 3000:3000 vocalcoach
```

### Static Hosting (GitHub Pages, AWS S3, etc.)

1. Build the app:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your static hosting provider

3. Configure for SPA routing (route all requests to index.html)

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Microphone permission prompt works
- [ ] Audio analysis functions correctly
- [ ] LocalStorage persistence works
- [ ] All routes work (no 404s on refresh)
- [ ] Assets load correctly (CSS, JS, images)
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled (required for microphone access)

## Performance Optimization

### Enable Compression
Railway automatically uses gzip compression via the `serve` package.

### CDN (Optional)
For better global performance, add a CDN:
- Cloudflare
- Fastly
- AWS CloudFront

### Monitoring
Add monitoring tools:
- Railway built-in metrics
- Sentry for error tracking
- Google Analytics for usage

## Security Considerations

1. **HTTPS Required**: Microphone access requires HTTPS
2. **No Backend**: This is a client-side only app
3. **LocalStorage**: All data is stored client-side
4. **CORS**: Not applicable (no API calls)

## Costs

**Railway Free Tier:**
- 500 hours/month
- $5 credit/month
- Sufficient for this static app

**Paid Tier:**
- $5/month for 500 hours
- Additional usage: $0.000231/hour

For a static app with minimal resource usage, the free tier should be sufficient.
