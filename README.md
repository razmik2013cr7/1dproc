# ԻՄ ԹԻՎՄԵԿ

React + Vite site for class projects: a list of classes (դասարաններ), each opening its projects. Projects support links, photos, and videos.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Supabase setup (one step)

The app connects to Supabase automatically. Until the tables exist, it runs in **local mode** (badge shows «⚠ Տեղական») and data stays in the browser.

To activate the cloud:

1. Open https://supabase.com/dashboard/project/nrvvexysitfnamxfxnsf/sql/new
2. Paste the entire contents of `supabase-schema.sql` and press **Run**
3. Reload the app — the badge will show «☁️ Ամպ»

If any classes were created locally before that, they will be automatically uploaded to Supabase on the first cloud load (one-time migration).

## Structure

- `src/supabase.js` — Supabase client (URL/key from `.env`, with fallback)
- `src/api.js` — cloud CRUD + photo upload to the `project-media` storage bucket
- `src/storage.js` — localStorage fallback + one-time migration helpers
- `src/pin.js` — admin PIN (client-side gate, not real security)
- `supabase-schema.sql` — tables, RLS policies, and the media bucket

## Notes

- The PIN gates the UI only; the database allows anonymous reads/writes (per the SQL policies). Tighten with Supabase Auth later if needed.
- Uploaded photos are stored in the public `project-media` bucket.
