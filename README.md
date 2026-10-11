# ԻՄ ԹԻՎՄԵԿ (1dproc)

Reconstructed source of https://1dproc.vercel.app/ — an Armenian school
project showcase (classes, sections, awards, built-in document editor)
backed by Supabase, rebuilt as a clean Vite + React project with a full
design system.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure

- `index.html` — entry (lang="hy", Armenian-capable Google Fonts)
- `src/main.jsx` — mounts `<App />` in StrictMode
- `src/App.jsx` — the entire application: section/class/project views,
  PIN gates, award dialogs, the Word-style document editor, and the
  Supabase data layer (client init + CRUD)
- `src/styles.css` — the new design system: header, section menu,
  notebook-style class cards (washi tape + spiral rings + ruled paper),
  project/hero cards, modals, forms, chips, lightbox, responsive layout
- `src/word.css` — stylesheet for the built-in Word-style editor
  (recovered from the original deployment)
- `eslint.config.js` — minimal `no-undef` guard used to verify no
  minified identifiers leaked into the reconstructed source

## Backend

Cloud-only: reads and writes go directly to the Supabase project
`nrvvexysitfnamxfxnsf` (tables `classes`, `projects`, `section_items`
plus the `project-media` storage bucket) using its public anon key.
There is no localStorage fallback and no local→cloud migration — the
temp-data layer from the original build (`imtivmek:classes:v3`,
`imtivmek:sections:v1`, `local-*` ids, and the migration that could
push local junk into the database) has been removed entirely. If the
cloud is unreachable, mutations fail with an error instead of silently
storing data locally.

## Fixes vs the original bundle

- The original build referenced an undeclared `showPromoteTarget`
  variable in the class view, which crashed the PIN dialog for
  add/rename/delete/promote. It is now the `E` promote-mode state it was
  clearly meant to be.
- The original build kept classes/sections in localStorage and auto-
  migrated them into the cloud database; the app is now Supabase-only.
  (The two "student of the year" / "project of the year" award slots
  still persist in localStorage exactly as in the original — they have
  no backing table in the database.)

## What was missing before

The original deployment only shipped CSS for the Word editor (~48
classes); every main-UI class (130+ used in the code) was unstyled, so
the app rendered as bare HTML. `src/styles.css` now covers all of them.
