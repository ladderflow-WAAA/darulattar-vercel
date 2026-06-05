# Environment Variables & API Keys Required

Create a `.env.local` file in `darulattar-vercel/` (copy from `.env.example`).

## Required

| Variable | Purpose | Where to Get |
|----------|---------|-------------|
| `OPENROUTER_API_KEY` | Powers the Attar AI chatbot | https://openrouter.ai/keys |
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard > Settings > API |

## Cloudinary Setup (No env key needed)

Already configured with Cloudinary account `dy3jvbisa`.

1. Go to https://cloudinary.com/console
2. Create an **Upload Preset** named `darulattar_preset`
3. Set **Signing Mode** to `unsigned`
4. Set **Type** to `upload`

## Supabase Setup

Run this SQL in Supabase SQL Editor to create the products table:

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  image_url text not null default '',
  scent_profile jsonb not null default '{"top":"","heart":"","base":""}',
  variants jsonb not null default '[]',
  categories text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table products enable row level security;

-- Public can read all products
create policy "Public read access"
  on products for select using (true);

-- Logged-in users (admin) can insert
create policy "Admin insert access"
  on products for insert
  with check (auth.uid() IS NOT NULL);

-- Logged-in users (admin) can update
create policy "Admin update access"
  on products for update
  using (auth.uid() IS NOT NULL);

-- Logged-in users (admin) can delete
create policy "Admin delete access"
  on products for delete
  using (auth.uid() IS NOT NULL);
```

**If your table already exists and products aren't showing**, run the standalone fix:
`darulattar-vercel/SUPABASE-RLS-FIX.sql` in the Supabase SQL Editor.

Create an admin user in Supabase Auth > Users > Add User (email/password).

## Getting Started

```bash
cd darulattar-vercel
cp .env.example .env.local
# Fill in your keys in .env.local
npm install
npm run dev
```
