# Winger Bag Track (React + Vite)

Inventory management system for Winger, Kigali.

## Setup

1. Install dependencies

   npm install

2. Configure environment

   Create a `.env` with:

   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...

3. Run locally

   npm run dev

4. Build for production

   npm run build

5. Preview the production build

   npm run preview

## PWA (Installable Web App)

This project is a PWA (installable web app). Users can install it on:
- Android (Chrome/Edge)
- iOS (Safari: Add to Home Screen)
- Desktop (Chrome/Edge)

Install page:
- /install

Requirements:
- Must be served over HTTPS for install prompts (localhost is OK for development).
- The host must support SPA routing (all paths -> /index.html).

Hosting helpers included:
- `public/_redirects` (Netlify/Cloudflare Pages style)
- `netlify.toml`
- `vercel.json`

## Android APK (Native App)

This repo is set up with Capacitor to produce a real Android app.

Prereqs:
- Android Studio installed
- JDK 17+ installed

Build / sync web assets into Android:

  npm run android:sync

Open Android Studio:

  npm run android:open

APK output paths (Android Studio):
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`

CLI build (optional):
- From `android/` run: `gradlew.bat assembleDebug`

Signing a release APK/AAB is done in Android Studio (Build -> Generate Signed Bundle / APK).

## Project Structure

src/
- components/
  - ui/            shadcn/ui components
  - inventory/     app-specific components
- hooks/           custom React hooks (Supabase)
- integrations/
  - supabase/      Supabase client
- lib/             utilities
- pages/           route pages
- types/           shared helpers
