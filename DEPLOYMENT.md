# 🚀 FitLife Pro Deployment Guide

This guide covers deploying your FitLife Pro fitness tracking application to production.

## 📋 Pre-Deployment Checklist

- [ ] Google OAuth credentials configured in Google Cloud Console
- [ ] Production domain authorized in Google Cloud Console redirect URIs
- [ ] Environment variables ready
- [ ] Production build tested locally (`npm run build && npm run serve`)

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Free Tier Available)

**Why Vercel?**
- Zero-config deployment for Vite apps
- Free SSL certificates
- Global CDN
- Automatic deployments from Git
- Easy environment variable management

**Steps:**

1. **Install Vercel CLI** (optional, can use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow prompts to link your project.

3. **Or Deploy via GitHub**:
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Vercel auto-detects Vite configuration

4. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_GOOGLE_CLIENT_ID` = `your-client-id`
     - `VITE_GOOGLE_CLIENT_SECRET` = `your-client-secret`
   - Save and redeploy

5. **Configure Custom Domain** (fitlifepro.eu):
   - Go to Project Settings → Domains
   - Add `fitlifepro.eu` and `www.fitlifepro.eu`
   - Update DNS records as instructed by Vercel
   - SSL certificates are auto-generated

6. **Update Google OAuth Redirect URIs**:
   - Add `https://fitlifepro.eu` to authorized redirect URIs
   - Add `https://www.fitlifepro.eu` if using www subdomain
   - Add Vercel preview URLs if needed: `https://your-project.vercel.app`

---

### Option 2: Netlify (Free Tier Available)

**Steps:**

1. **Deploy via Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

2. **Or Deploy via GitHub**:
   - Push code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings are auto-detected from `netlify.toml`

3. **Configure Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add:
     - `VITE_GOOGLE_CLIENT_ID` = `your-client-id`
     - `VITE_GOOGLE_CLIENT_SECRET` = `your-client-secret`

4. **Configure Custom Domain**:
   - Go to Domain Settings → Add custom domain
   - Add `fitlifepro.eu`
   - Update DNS as instructed

5. **Update Google OAuth Redirect URIs**:
   - Add `https://fitlifepro.eu` to authorized redirect URIs
   - Add Netlify preview URL: `https://your-site-name.netlify.app`

---

### Option 3: GitHub Pages (Free, Static Only)

**Steps:**

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/fitlifepro"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure Custom Domain**:
   - Go to GitHub repository Settings → Pages
   - Add custom domain: `fitlifepro.eu`
   - Update DNS CNAME record to point to `yourusername.github.io`

**⚠️ Note:** Environment variables need to be hardcoded at build time for GitHub Pages (not recommended for sensitive data like OAuth secrets).

---

### Option 4: Traditional VPS (DigitalOcean, AWS, etc.)

**Steps:**

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your server via FTP/SSH

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name fitlifepro.eu www.fitlifepro.eu;

       root /var/www/fitlifepro/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Install SSL with Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d fitlifepro.eu -d www.fitlifepro.eu
   ```

---

## 🔐 Google OAuth Production Setup

**CRITICAL:** Before deployment works, configure Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add **Authorized JavaScript origins**:
   - `https://fitlifepro.eu`
   - `https://www.fitlifepro.eu`
   - Your deployment platform URL (e.g., `https://yourapp.vercel.app`)

4. Add **Authorized redirect URIs**:
   - `https://fitlifepro.eu`
   - `https://www.fitlifepro.eu`
   - Your deployment platform URL

5. Save changes

---

## 🧪 Test Production Build Locally

Before deploying, test the production build:

```bash
# Build the app
npm run build

# Preview the production build
npm run serve
```

Open `http://localhost:4173` and verify:
- ✅ Google login works
- ✅ All features function correctly
- ✅ No console errors
- ✅ Responsive design works

---

## 📊 Post-Deployment Monitoring

**Optional Enhancements:**

1. **Add Analytics** (Google Analytics, Plausible, etc.)
2. **Error Monitoring** (Sentry, LogRocket)
3. **Performance Monitoring** (Web Vitals already included)
4. **Uptime Monitoring** (UptimeRobot, Pingdom)

---

## 🔧 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ Yes |
| `VITE_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ Yes |

**Security Note:** The client secret is exposed in the frontend. For production, consider:
- Moving OAuth token exchange to a backend API
- Using a serverless function (Vercel/Netlify Functions)
- Implementing server-side authentication flow

---

## 🚨 Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run check:safe`
- Clear cache: `rm -rf node_modules dist && npm install`

### Google Login Not Working
- Verify authorized redirect URIs match exactly (including https://)
- Check browser console for CORS errors
- Ensure environment variables are set correctly
- Confirm OAuth client ID/secret are correct

### 404 Errors on Refresh
- Ensure redirect rules are configured (handled by `vercel.json`, `netlify.toml`, `_redirects`)
- For Nginx, check `try_files` directive

### Environment Variables Not Working
- Vercel/Netlify: Redeploy after adding env vars
- Variables must be prefixed with `VITE_` to be exposed to frontend
- Clear cache and rebuild

---

## 📞 Support

For deployment issues:
- Check platform-specific docs: [Vercel Docs](https://vercel.com/docs) | [Netlify Docs](https://docs.netlify.com)
- Review build logs in your hosting dashboard
- Verify Google OAuth configuration

---

## ✅ Deployment Complete!

Once deployed:
1. Test all features on production URL
2. Verify Google login works
3. Check responsive design on mobile devices
4. Monitor for any errors in production

Your FitLife Pro app is now live! 🎉
