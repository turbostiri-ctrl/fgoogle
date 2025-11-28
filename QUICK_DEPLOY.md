# ⚡ Quick Deploy Guide - FitLife Pro

## 🚀 Fastest Deployment (Vercel - 5 minutes)

### Method 1: Web Interface (No CLI needed)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel auto-detects everything!
   - Click "Deploy"

3. **Add Environment Variables** (while it's deploying):
   - Click "Environment Variables"
   - Add `VITE_GOOGLE_CLIENT_ID` = `1050318334379-2aelgit05hjt3uluitc14vg6js4kdgoo.apps.googleusercontent.com`
   - Add `VITE_GOOGLE_CLIENT_SECRET` = `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`
   - Click "Redeploy" (top right)

4. **Configure Your Domain**:
   - Project Settings → Domains
   - Add `fitlifepro.eu`
   - Update DNS A record to Vercel's IP (they'll show you)
   - SSL auto-configured ✅

5. **Update Google OAuth** ([console.cloud.google.com](https://console.cloud.google.com/apis/credentials)):
   - Add to Authorized JavaScript origins:
     - `https://fitlifepro.eu`
     - `https://your-project.vercel.app` (your Vercel URL)
   - Add to Authorized redirect URIs:
     - `https://fitlifepro.eu`
     - `https://your-project.vercel.app`

**Done! 🎉** Your app is live at `https://fitlifepro.eu`

---

### Method 2: Using CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy directly to production
vercel --prod
```

---

## 🔥 Alternative: Netlify (Also 5 minutes)

### Using Netlify Drop (Easiest - No Git needed)

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Drag & Drop**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder onto the page
   - Done! ✅

3. **Configure** (on the deployed site):
   - Site Settings → Environment Variables
   - Add `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_SECRET`
   - Domain Settings → Add `fitlifepro.eu`

---

## 🧪 Test Locally First

```bash
# Build production version
npm run build

# Preview it
npm run serve
```

Visit `http://localhost:4173` and verify everything works!

---

## ⚠️ Don't Forget!

After deploying to ANY platform:

1. ✅ Update Google OAuth redirect URIs with your production URL
2. ✅ Test Google login on production
3. ✅ Check mobile responsiveness
4. ✅ Verify all features work

---

## 🆘 Quick Troubleshooting

**"Google login not working"**
→ Check OAuth redirect URIs match exactly (https, no trailing slash)

**"404 on page refresh"**
→ Vercel/Netlify handle this automatically. For other hosts, check DEPLOYMENT.md

**"Environment variables not working"**
→ Redeploy after adding them. Must start with `VITE_`

---

## 📞 Need Help?

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

**Current Build Status:** ✅ Production bundle ready in `dist/` folder

**Production Bundle Size:**
- Total: ~1 MB
- Gzipped: ~260 KB
- Initial load: Fast ⚡
