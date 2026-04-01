#!/bin/bash
# AutoBlog AI — One-click setup script
# Run: chmod +x setup.sh && ./setup.sh

set -e

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║        AutoBlog AI Setup              ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --silent

# Copy env file
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "✓ Created .env.local from template"
  echo ""
  echo "⚠️  IMPORTANT: Edit .env.local and add your API keys before continuing!"
  echo ""
  echo "   Required keys:"
  echo "   • NEXT_PUBLIC_SUPABASE_URL    → from supabase.com project settings"
  echo "   • NEXT_PUBLIC_SUPABASE_ANON_KEY → from supabase.com project settings"
  echo "   • SUPABASE_SERVICE_KEY        → from supabase.com project settings"
  echo "   • ANTHROPIC_API_KEY           → from console.anthropic.com"
  echo "   • NEXT_PUBLIC_SITE_URL        → your domain (e.g. https://myblog.com)"
  echo "   • NEXT_PUBLIC_SITE_NAME       → your blog name"
  echo "   • CRON_SECRET                 → any random string"
  echo "   • ADMIN_PASSWORD              → dashboard login password"
  echo ""
  echo "Press ENTER after you've filled in .env.local..."
  read -r
else
  echo "✓ .env.local already exists"
fi

# Validate env
source .env.local 2>/dev/null || true

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "⚠️  Warning: NEXT_PUBLIC_SUPABASE_URL not set"
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "⚠️  Warning: ANTHROPIC_API_KEY not set"
fi

echo ""
echo "📝 Database setup instructions:"
echo "   1. Go to your Supabase project → SQL Editor"
echo "   2. Paste and run: supabase-schema.sql"
echo "   3. Then paste and run: supabase-schema-extras.sql"
echo ""
echo "Press ENTER when database is set up..."
read -r

# Build check
echo "🔨 Building project..."
npm run build

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║         Setup Complete! ✓             ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "🚀 Start development:"
echo "   npm run dev"
echo ""
echo "🌐 Your blog:      http://localhost:3000"
echo "📊 Dashboard:      http://localhost:3000/dashboard"
echo "⚡ Generate post:  http://localhost:3000/dashboard/generate"
echo ""
echo "📦 Deploy to Vercel:"
echo "   npx vercel"
echo "   (Add all .env.local values in Vercel → Project → Settings → Environment Variables)"
echo ""
