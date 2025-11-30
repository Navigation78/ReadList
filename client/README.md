# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running the client

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project and copy the project URL and anon key into a `.env` file at the project root (client)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_GOOGLE_BOOKS_API_KEY=your-google-books-key
```

3. Run the dev server:

```bash
npm run dev
```

## New pages added

- `/` — Landing
- `/about` — About page
- `/features` — Features overview
- `/pricing` — Pricing placeholder
- `/signup` — Sign up (Supabase)
- `/login` — Log in (Supabase)
- `/dashboard` — Protected-ish dashboard
- `/books` — Book list (existing view)

Notes:
- Install the new dependencies after editing `package.json` by running `npm install`.
- The dashboard and auth flow use `@supabase/supabase-js`.
