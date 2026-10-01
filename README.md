# Liam's Celebration (Next.js + Tailwind + Supabase)
1. `npm install`
2. Create a Supabase project; run `supabase/schema.sql` in the SQL Editor.
3. Auth > Users > Add user (email + password) for the admin. Then Auth > Providers > Email: disable "Allow new users to sign up" (any signed-in user is treated as admin).
4. `cp .env.example .env.local` and fill in your URL + anon key.
5. `npm run dev` -> site at `/`, admin at `/login` -> `/admin`.
