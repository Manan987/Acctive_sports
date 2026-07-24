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

## ☁️ Deploying to production (Railway or Render)

The project is production-hardened and **auto-switches from SQLite to PostgreSQL**
the moment `DATABASE_URL` points at a Postgres database — no code changes needed.
Deploys cleanly on **Railway**, **Render**, any Node VPS, or Docker.

### Step 1 — Create a free Postgres database (Neon or Supabase)
- Sign up at **neon.tech** (or **supabase.com**) → create a project.
- Copy the **pooled** connection string → this is your `DATABASE_URL`.

### Step 2 — Create a free Cloudinary account (for product images)
- Sign up at **cloudinary.com** → the Dashboard shows an "API Environment variable"
  like `cloudinary://key:secret@cloud-name` → this is your `CLOUDINARY_URL`.
- Railway/Render disks are ephemeral, so uploads need this to persist.

### Step 3 — Deploy the repo

**Railway** (railway.app)
1. **New Project → Deploy from GitHub repo** → pick `Manan987/Acctive_sports`.
2. It auto-detects Next.js: build `npm run build`, start `npm start`.
3. Add the environment variables below (Variables tab).

**Render** (render.com)
1. **New → Blueprint** → connect this repo. It reads [`render.yaml`](render.yaml)
   automatically (build/start/health-check all preconfigured; `AUTH_SECRET` is
   auto-generated).
2. Fill in the variables marked "you provide" below.

### Step 4 — Environment variables
Full list in [`.env.production.example`](.env.production.example):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon/Supabase URL (step 1) |
| `AUTH_SECRET` | long random string (`openssl rand -base64 32`) — Render auto-generates |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | your admin login (**use a strong password**) |
| `NEXT_PUBLIC_SITE_URL` | your live URL / custom domain |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919997100375` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | your email |
| `CLOUDINARY_URL` | from step 2 |
| `NEXT_PUBLIC_GA_ID` | *(optional)* GA4 id |

### Step 5 — Load the catalogue into the database (once)
After the first successful deploy, from your computer run (with the production
`DATABASE_URL` set in your shell — e.g. `export DATABASE_URL="postgres://…"`):
```bash
npm run db:deploy    # syncs schema + seeds 145 products + the admin user
```
> On Render the schema is also synced automatically each deploy via
> `preDeployCommand` — but the **seed runs once, manually** (it resets the catalogue,
> so it must not run on every deploy).

### Step 6 — Verify
- Open `https://<your-app-url>/api/health` → expect `{"status":"ok","db":"up"}`.
- Log in at `/admin`, add a real product, and upload an image.

---

## 🌐 Connecting your custom domain

1. Buy a domain (GoDaddy, Namecheap, Hostinger, etc.).
2. In your host: **Railway → Settings → Networking → Custom Domain**, or
   **Render → Settings → Custom Domains → Add**.
3. The host shows a **CNAME** target — add it in your registrar's DNS:
   - `www → <target the host gives you>` (CNAME), and set the root `@` to redirect
     to `www` (or use your registrar's ALIAS/ANAME to the same target).
4. Wait for DNS to propagate; SSL is issued automatically and free.
5. Set `NEXT_PUBLIC_SITE_URL` to your domain and redeploy so SEO/OG links are correct.

Every `git push` to `main` then auto-deploys to your domain.

> **Also supported:** a Node VPS (`npm run build` → `npm start` behind Nginx, with
> `output: "standalone"` already enabled) or Docker. Ask if you want a Dockerfile.

---

## 🔒 Production checklist (already built in)

- ✅ Auto Postgres switch (SQLite dev → Postgres prod, zero schema edits)
- ✅ Persistent image uploads via Cloudinary / Vercel Blob (local-disk fallback in dev)
- ✅ Security headers (HSTS, X-Frame-Options, nosniff, Permissions-Policy)
- ✅ `AUTH_SECRET` enforced in production (build/run fails if missing)
- ✅ Admin + API marked `noindex`; `robots.txt` disallows them
- ✅ Spam protection on public forms (honeypot + per-IP rate limit)
- ✅ Error, loading & global-error boundaries
- ✅ SEO: metadata, canonical, Open Graph **image**, product & Organization JSON-LD,
  dynamic `sitemap.xml`, `robots.txt`
- ✅ PWA `manifest`, SVG favicon, theme-color
- ✅ Health check at `/api/health`

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
