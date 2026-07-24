# ACCTIVE Sports Industries — Full-Stack E-commerce & Catalogue

A modern, full-stack website for **ACCTIVE Sports Industries** (Meerut) — a custom
sportswear manufacturer. Built with **Next.js 14 (App Router)**, **TypeScript**,
**Tailwind CSS** and **Prisma**.

Features a public catalogue with search/filters, product pages, a **quote/enquiry
cart** (payment-gateway ready), and a full **admin panel** to manage products and
enquiries.

---

## ✨ Features

**Storefront**
- Attractive, responsive, dark-mode-first design (athletic brand palette)
- Home page: hero, stats, category grid, featured products, "why us", CTA
- Catalogue with live **search**, category chips, **sport & fabric filters**, sort
- Product detail pages with image gallery, size/fabric/qty selectors, related items
- **Quote cart** — add products, set quantities/sizes/notes, submit a bulk quote
- One-click **WhatsApp** enquiry throughout, floating WhatsApp button
- About page (story, capabilities, process) and Contact page (form + Google Map)
- SEO: metadata, Open Graph, JSON-LD product schema, `sitemap.xml`, `robots.txt`
- Optional Google Analytics 4

**Admin panel** (`/admin`)
- Secure login (JWT httpOnly cookie, bcrypt-hashed passwords)
- Dashboard with counts + recent enquiries
- Product CRUD: create/edit/delete, image upload, categories, fabrics, sizes,
  sports, pricing (optional), MOQ, featured/published toggles
- Enquiry inbox: view quote requests + contact messages, change status, reply on
  WhatsApp, delete

**Data & payments**
- Prisma ORM (SQLite locally, Postgres in production)
- Optional per-product pricing already modeled — enabling online payments later is
  additive, no rebuild required

---

## 🚀 Getting started (local)

Prerequisites: **Node.js 18.18+** (or 20+).

```bash
# 1. Install dependencies
npm install

# 2. Create your env file (defaults work for local dev)
cp .env.example .env      # on Windows PowerShell:  copy .env.example .env

# 3. Create the database schema + seed products and the admin user
npm run db:push
npm run db:seed

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000**.
Admin panel: **http://localhost:3000/admin** — log in with the credentials in `.env`
(default `admin@acctivesports.com` / `acctive@admin123`). **Change these before going live.**

### Handy scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run start` | Run the production build |
| `npm run db:push` | Apply the Prisma schema to the database |
| `npm run db:seed` | Seed categories, 145 products, admin user |
| `npm run db:reset` | Wipe + re-seed the database |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |

---

## 🖼️ Adding your real product images

I couldn't pull images from your Google Drive automatically (it needs authorization
in an interactive Claude session). Two easy ways to add them:

**Option A — via the Admin panel (recommended):**
1. Download the images from Drive to your computer.
2. Go to `/admin/products`, open a product (or "Add product") and use **Upload**.
   Files are stored in `public/uploads/`.

**Option B — bulk, in code:**
1. Drop images into `public/products/…`.
2. Edit `prisma/seed.ts` to point each product's `images` array at those paths,
   then run `npm run db:reset`.

> Placeholder art (`public/placeholder-product.svg`) is shown until real images are added.

---

## ☁️ Deploying to Vercel

The site already runs on Vercel-style hosting. Two production notes:

1. **Database** — SQLite can't be written on Vercel's serverless filesystem.
   Use a hosted Postgres (free tiers: **Neon**, **Supabase**, or **Vercel Postgres**):
   - In `prisma/schema.prisma`, set `provider = "postgresql"`.
   - Set `DATABASE_URL` in Vercel env vars to your Postgres URL.
   - Run `npx prisma db push` then `npm run db:seed` against it once.

2. **Image uploads** — the local-disk upload (`/api/upload`) works for local dev and
   self-hosting. On Vercel, switch it to **Vercel Blob** or **Cloudinary** (the route
   returns `{ url }`, so only the storage call changes). Until then, use image URLs.

**Env vars to set in Vercel:** `DATABASE_URL`, `AUTH_SECRET` (long random string),
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
`NEXT_PUBLIC_CONTACT_EMAIL`, and optionally `NEXT_PUBLIC_GA_ID`.

---

## 🧩 Project structure

Folders are split by audience — **client** (public storefront) vs **admin** — so
anything is easy to find:

```
src/
  app/
    (client)/        # 🛍️ PUBLIC storefront (shares Header/Footer/WhatsApp)
      page.tsx       #   home
      catalogue/     #   catalogue + filters
      products/[slug]#   product detail
      about/ contact/ quote/
    admin/           # 🔐 ADMIN
      login/         #   public login
      (dash)/        #   protected: dashboard, products, enquiries
    api/             # auth, products, enquiries, categories, upload
    sitemap.ts robots.ts  layout.tsx  globals.css
  components/
    client/          # 🛍️ all storefront components
      marketing/     #   hero carousel, trust badges, testimonials, etc.
    admin/           # 🔐 all admin-panel components
  context/           # QuoteContext (cart)
  lib/               # prisma, auth, data access, site config, validation
prisma/
  schema.prisma  seed.ts
public/
  uploads/  placeholder-product.svg
```

---

## 🔧 Customizing

- **Brand / contact info:** `src/lib/site.ts`
- **Colours & theme:** `tailwind.config.ts` (`flame`, `ink`, `electric`)
- **Fabrics / sizes / sports lists:** `src/lib/site.ts`
- **Seed catalogue:** `prisma/seed.ts`

## 🛣️ Turning on online payments later

The `Product` model already has `price` and `moq`. To add checkout:
1. Add a `cart`/`order` flow (reuse `QuoteContext`).
2. Integrate **Razorpay** (best for India) or **Stripe** in a new `/api/checkout` route.
3. Add order records to Prisma and confirmation emails.

No schema rewrite needed — it's designed for this.
