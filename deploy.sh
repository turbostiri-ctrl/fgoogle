#!/bin/bash

# FitLife Pro Deployment Script
# This script helps deploy your app to various platforms

set -e

echo "🏋️ FitLife Pro Deployment Helper"
echo "================================"
echo ""

# Check if dist folder exists, if not build
if [ ! -d "dist" ]; then
  echo "📦 Building production bundle..."
  npm run build
  echo "✅ Build complete!"
  echo ""
fi

echo "Select deployment platform:"
echo "1) Vercel (recommended)"
echo "2) Netlify"
echo "3) Preview build locally"
echo "4) Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
  1)
    echo ""
    echo "🚀 Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
      echo "⚠️  Vercel CLI not found. Installing..."
      npm i -g vercel
    fi
    vercel --prod
    echo ""
    echo "✅ Deployed to Vercel!"
    echo "⚠️  Don't forget to:"
    echo "   1. Set environment variables in Vercel dashboard"
    echo "   2. Configure custom domain (fitlifepro.eu)"
    echo "   3. Update Google OAuth redirect URIs"
    ;;
  2)
    echo ""
    echo "🚀 Deploying to Netlify..."
    if ! command -v netlify &> /dev/null; then
      echo "⚠️  Netlify CLI not found. Installing..."
      npm i -g netlify-cli
    fi
    netlify deploy --prod
    echo ""
    echo "✅ Deployed to Netlify!"
    echo "⚠️  Don't forget to:"
    echo "   1. Set environment variables in Netlify dashboard"
    echo "   2. Configure custom domain (fitlifepro.eu)"
    echo "   3. Update Google OAuth redirect URIs"
    ;;
  3)
    echo ""
    echo "🔍 Starting local preview server..."
    echo "   Open http://localhost:4173 in your browser"
    echo "   Press Ctrl+C to stop"
    echo ""
    npm run serve
    ;;
  4)
    echo "👋 Exiting..."
    exit 0
    ;;
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "📖 For detailed deployment instructions, see DEPLOYMENT.md"
