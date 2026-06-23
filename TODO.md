# TODO: Deploy to Vercel + Add Installable PWA Widget

## 0) Repo reality check
- [ ] Confirm no `package.json` / no `vercel.json` exists in repo (Vercel “plugins” installer won’t work for this setup).
- [ ] Determine how the frontend is served:
  - [ ] Spring Boot serves `frontend/` (as static resources)
  - [ ] Or separate static hosting (frontend build artifact)

## 1) Vercel deployment planning (Part 0 questions from playbook)
- [ ] Answer the playbook’s Part 0 questions:
  - Framework/version
  - Git remote exists (GitHub/GitLab) + target repo
  - Install/build commands + output dir
  - Pre-build steps (DB/codegen/migrations)
  - New vs existing Vercel project name
  - Production domain
  - Who sets env vars (you vs automation)
  - Public vs private repo
  - Runtime file writes? (uploads)
  - Storage provider (if uploads)
  - Database + credentials location
  - PWA app name/short name
  - Logo/icon asset availability
  - theme_color + background_color
  - display mode
  - offline behavior
  - Auth middleware behavior (redirects?)
  - Install entry point (OS-native only vs in-app button + help page)
  - In-app nav controls
  - Notifications/badges

## 2) Create Vercel configuration
- [ ] Add `vercel.json` appropriate for Spring Boot backend + frontend assets.
- [ ] Ensure routing is correct:
  - [ ] API routes go to backend
  - [ ] Frontend assets are served correctly
  - [ ] SPA fallback behavior if needed

## 3) Environment variables
- [ ] Add required env vars to Vercel **Production** (and Preview if used).
- [ ] Ensure missing env vars fail loudly (avoid silent production runtime failures).

## 4) PWA foundation (Part 2)
- [ ] Add `manifest.webmanifest` with:
  - [ ] name, short_name
  - [ ] start_url, scope
  - [ ] `display: "standalone"`
  - [ ] theme_color, background_color
  - [ ] icons: 192 + 512 + maskable 512
  - [ ] apple-touch-icon (180)
- [ ] Add/ensure icon files exist and are referenced correctly.

## 5) Service worker
- [ ] Add `public/sw.js` (or equivalent public path):
  - [ ] install/activate handlers
  - [ ] `fetch` pass-through (no caching)
- [ ] Register SW only in production.

## 6) Auth middleware whitelisting for PWA assets
- [ ] Whitelist unauthenticated access for:
  - [ ] `/manifest.webmanifest`
  - [ ] `/sw.js`
  - [ ] icon files (e.g., `/icon-*.png`, `/apple-icon*`)
  - [ ] install/help route (e.g., `/install` or `/faqs`)
- [ ] Verify each returns HTTP 200 unauthenticated (not a redirect).

## 7) Install UX
- [ ] Implement install/help page (`/install` or `/faqs`) and ensure it is:
  - [ ] reachable logged-out
  - [ ] linked from nav and mobile menu in both signed-in and signed-out
  - [ ] includes manual install instructions for iOS, Android, macOS Safari, Chrome/Edge
- [ ] Add in-app install prompt/button where supported (hidden on iOS/macOS Safari).

## 8) Standalone navigation controls
- [ ] Add in-app back/forward/reload controls gated to standalone/installed mode.

## 9) Verification
- [ ] Deploy first.
- [ ] Verify PWA assets:
  - [ ] curl check for manifest/icons/sw.js returns 200
  - [ ] DevTools Manifest shows no errors
  - [ ] Lighthouse PWA “installable” passes
- [ ] Test on a real device (install and open full-screen).

## 10) Storage for uploads (if applicable)
- [ ] If runtime writes/uploads exist:
  - [ ] Add object storage integration (Vercel Blob / S3 / Supabase Storage)
  - [ ] Update backend to store files remotely and save resulting URLs
  - [ ] Ensure production fails loudly if storage not configured

## 11) Finalization
- [ ] Connect repo to Vercel.
- [ ] Create production deployment.
- [ ] Confirm critical routes and PWA install behavior work end-to-end.

