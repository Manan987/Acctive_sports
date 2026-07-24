# 🏭 ACCTIVE Sports Industries — Full-Stack E‑commerce & Catalogue

A modern, production-ready website for **ACCTIVE Sports Industries** (Meerut) — a
custom sportswear manufacturer. Public catalogue with search/filters, product pages,
a **quote/enquiry cart** (payment-ready), and a full **admin panel** to manage
products and enquiries.

Built with **Next.js 14 (App Router)** · **TypeScript** · **Tailwind CSS** · **Prisma**.

```
Storefront ──▶ Quote cart ──▶ Enquiry saved to DB ──▶ Admin inbox ──▶ Reply on WhatsApp
```

---

## 📚 Table of contents

1. [Tech stack](#-tech-stack)
2. [Architecture](#-architecture)
3. [Data model](#-data-model)
4. [Project structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Quick start (local)](#-quick-start-local)
7. [Scripts reference](#-scripts-reference)
8. [Environment variables](#-environment-variables)
9. [Routes reference](#-routes-reference)
10. [Admin panel](#-admin-panel)
11. [Adding real product images](#-adding-real-product-images)
12. [Deploying to production](#-deploying-to-production-railway-or-render)
13. [Custom domain](#-connecting-your-custom-domain)
14. [Production hardening](#-production-hardening-built-in)
15. [Customizing](#-customizing)
16. [Troubleshooting](#-troubleshooting)
17. [Roadmap: online payments](#-roadmap-turning-on-online-payments)

---

## 🧰 Tech stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router, RSC) | SSR/SEO, API routes, one codebase |
| Language | **TypeScript** | Type safety end-to-end |
| Styling | **Tailwind CSS** + custom design system | Fast, consistent, dark-mode-first |
| Database ORM | **Prisma** | Type-safe queries, easy migrations |
| Database | **SQLite** (dev) → **PostgreSQL** (prod) | Zero-config locally, scalable in prod |
| Auth | **jose** (JWT) + **bcryptjs** | Stateless admin sessions, hashed passwords |
| Validation | **zod** | Runtime-safe API input validation |
| Images | **Cloudinary** / Vercel Blob / local disk | Persistent uploads on any host |
| Hosting | **Railway / Render** (or any Node host) | Portable, `output: "standalone"` |

---

## 🏗 Architecture

### High-level overview

```mermaid
flowchart TD
    subgraph Browser
      V[Visitor]
      A[Admin]
    end

    subgraph "Next.js app (single deploy)"
      direction TB
      SC["Server Components<br/>(pages render on server)"]
      CC["Client Components<br/>(cart, filters, carousels)"]
      API["Route Handlers<br/>/api/*"]
      MW["Auth guard<br/>(getSession in layouts)"]
    end

    DB[("PostgreSQL / SQLite<br/>via Prisma")]
    IMG[("Cloudinary<br/>image storage")]
    WA["WhatsApp<br/>(deep links)"]

    V -->|browse| SC
    V -->|cart state| CC
    CC -->|submit quote| API
    A -->|login / manage| MW --> API
    SC --> DB
    API --> DB
    API -->|upload| IMG
    V -.->|enquire| WA
```

### Request lifecycle (a page load)

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next.js (server)
    participant P as Prisma
    participant D as Database
    B->>N: GET /catalogue?category=shorts
    N->>P: getProducts({ category })
    P->>D: SELECT ... WHERE published AND category
    D-->>P: rows
    P-->>N: typed Product[]
    N-->>B: Streamed HTML (server-rendered)
    Note over B: Client components hydrate<br/>(filters, load-more, quote cart)
```

### Layers & responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Presentation** | `src/app/**`, `src/components/**` | Pages (server) + interactive UI (client) |
| **State (client)** | `src/context/QuoteContext.tsx` | Quote cart, persisted to `localStorage` |
| **API** | `src/app/api/**/route.ts` | JSON endpoints, validation, auth checks |
| **Domain / data access** | `src/lib/data.ts` | All product/category reads (server-only) |
| **Infrastructure** | `src/lib/{prisma,auth,env,rateLimit}.ts` | DB client, sessions, config, throttling |
| **Persistence** | `prisma/schema.prisma` | Schema, relations, migrations |

**Key rule:** database access happens only in **Server Components** and **Route
Handlers** via `src/lib/data.ts` / `src/lib/prisma.ts`. Client components never touch
the DB — they call `/api/*` or receive data as props.

### Admin authentication flow

```mermaid
flowchart LR
    L["POST /api/auth/login"] -->|bcrypt.compare| CHK{valid?}
    CHK -- no --> E["401"]
    CHK -- yes --> J["Sign JWT (jose)"] --> C["Set httpOnly cookie<br/>acctive_admin (7d)"]
    C --> G["/admin/(dash) layout<br/>calls getSession()"]
    G -->|no session| R["redirect /admin/login"]
    G -->|valid| D["render dashboard"]
```

- Passwords are **bcrypt-hashed** (never stored in plaintext).
- Sessions are **stateless JWTs** in an `httpOnly`, `sameSite=lax`, secure cookie.
- Every admin **page** (via the `(dash)` layout) and every mutating **API route**
  re-checks `getSession()`.

### Image upload — backend auto-selected

```mermaid
flowchart TD
    U["POST /api/upload (admin only)"] --> Q{Which backend?}
    Q -->|CLOUDINARY_URL set| C["Cloudinary → { url }"]
    Q -->|BLOB_READ_WRITE_TOKEN set| B["Vercel Blob → { url }"]
    Q -->|neither| L["Local /public/uploads → { url }"]
```

All three return the same `{ url }` shape, so the admin UI is storage-agnostic.

### Database provider auto-switch

`scripts/prisma-provider.mjs` runs before every `prisma generate` / `db push` / `dev`
/ `build`. It reads `DATABASE_URL` and rewrites the Prisma datasource provider:

| `DATABASE_URL` starts with | Provider used |
|---|---|
| `file:` (or unset) | `sqlite` (local dev) |
| `postgres://` / `postgresql://` | `postgresql` (production) |
| `mysql://` | `mysql` |

➡️ **You never edit `schema.prisma` to deploy.** Point `DATABASE_URL` at Postgres and
the build adapts automatically.

---

## 🗄 Data model

```mermaid
erDiagram
    Category ||--o{ Product : has
    Category {
        string id PK
        string name
        string slug UK
        int    order
    }
    Product {
        string  id PK
        string  slug UK
        string  name
        string  images   "JSON string[]"
        string  fabrics  "JSON string[]"
        string  sizes    "JSON string[]"
        string  sports   "JSON string[]"
        float   price    "nullable"
        int     moq
        bool    featured
        bool    published
        string  categoryId FK
    }
    Enquiry {
        string id PK
        string name
        string email
        string phone
        string items   "JSON line items"
        string status  "NEW|IN_PROGRESS|QUOTED|CLOSED"
        string source  "quote|contact"
    }
    AdminUser {
        string id PK
        string email UK
        string passwordHash
    }
```

> **Note on arrays:** SQLite has no array type, so `images/fabrics/sizes/sports` are
> stored as JSON strings and parsed by helpers in `src/lib/utils.ts` (`parseArray`).
> This keeps the schema identical across SQLite and Postgres.

---

## 🧩 Project structure

Folders are split by audience — **client** (public storefront) vs **admin** — so
anything is easy to find.

```
acctive/
├── prisma/
│   ├── schema.prisma            # data model (provider auto-set by script)
│   └── seed.ts                  # seeds 5 categories, 145 products, admin user
├── scripts/
│   └── prisma-provider.mjs      # picks sqlite/postgres from DATABASE_URL
├── public/
│   ├── placeholder-product.svg  # shown until real images are added
│   └── uploads/                 # local image uploads (dev)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # root layout (fonts, providers, JSON-LD, theme)
│   │   ├── globals.css          # design system (Tailwind layers)
│   │   ├── icon.svg manifest.ts opengraph-image.tsx robots.ts sitemap.ts
│   │   ├── global-error.tsx
│   │   │
│   │   ├── (client)/            # 🛍️  PUBLIC STOREFRONT
│   │   │   ├── layout.tsx       #   header + footer + WhatsApp + back-to-top
│   │   │   ├── page.tsx         #   home (hero, categories, FAQ, testimonials…)
│   │   │   ├── catalogue/       #   grid + search + filters + load-more
│   │   │   ├── products/[slug]/ #   product detail (gallery, tabs, size guide)
│   │   │   ├── quote/           #   quote/enquiry cart + submit
│   │   │   ├── about/ contact/  #   marketing pages
│   │   │   └── error.tsx loading.tsx not-found.tsx
│   │   │
│   │   ├── admin/               # 🔐  ADMIN
│   │   │   ├── login/           #   public login page
│   │   │   └── (dash)/          #   protected (auth guard in layout)
│   │   │       ├── page.tsx     #     dashboard
│   │   │       ├── products/    #     list / new / [id] edit
│   │   │       └── enquiries/   #     enquiry inbox
│   │   │
│   │   └── api/                 # 🔌  ROUTE HANDLERS (JSON)
│   │       ├── auth/            #   login, logout
│   │       ├── products/        #   create / update / delete
│   │       ├── categories/     #   list / create
│   │       ├── enquiries/      #   submit (public) / list / status / delete
│   │       ├── upload/         #   image upload (Cloudinary/Blob/local)
│   │       └── health/         #   uptime check
│   │
│   ├── components/
│   │   ├── client/             # 🛍️  storefront UI
│   │   │   ├── Header, Footer, ProductCard, ProductGrid, ProductTabs,
│   │   │   │   CatalogueFilters, ActiveFilters, AddToQuote, SizeGuide, …
│   │   │   └── marketing/      #   HeroCarousel, TrustBadges, FAQ, Testimonials…
│   │   └── admin/              # 🔐  AdminNav, ProductForm, EnquiryList, …
│   │
│   ├── context/
│   │   └── QuoteContext.tsx    # cart state (localStorage-persisted)
│   │
│   └── lib/
│       ├── prisma.ts           # singleton Prisma client
│       ├── data.ts             # server-side data access (products/categories)
│       ├── auth.ts             # JWT sessions + password hashing
│       ├── env.ts              # runtime env validation (fail-fast in prod)
│       ├── validation.ts       # zod schemas (enquiry)
│       ├── productSchema.ts    # zod schema (product) + slugify
│       ├── rateLimit.ts        # in-memory per-IP throttle
│       ├── site.ts             # brand/contact config + fabrics/sizes/sports
│       └── utils.ts            # cn(), parseArray(), formatINR()
│
├── .env / .env.example / .env.production.example
├── render.yaml                 # Render one-click blueprint
├── vercel.json .nvmrc          # optional host config / Node version
├── next.config.mjs             # headers, images, standalone output
├── tailwind.config.ts          # brand palette (flame/ink/electric)
└── package.json
```

---

## ✅ Prerequisites

- **Node.js 18.18+** (20 LTS recommended — see [`.nvmrc`](.nvmrc))
- **npm** (ships with Node)
- **git**
- *(Production only)* a **PostgreSQL** database + a **Cloudinary** account (both free tiers)

Check your versions:
```bash
node -v   # >= 18.18
npm -v
```

---

## 🚀 Quick start (local)

From a clean clone to a running site in 4 steps. Local dev uses **SQLite** — no
database to install.

```bash
# 1) Install dependencies (also runs prisma generate)
npm install

# 2) Create your env file (defaults work out of the box for local dev)
cp .env.example .env          # Windows PowerShell:  copy .env.example .env

# 3) Create the database + seed 145 products and the admin user
npm run db:push               # creates prisma/dev.db from the schema
npm run db:seed               # inserts categories, products, admin login

# 4) Start the dev server
npm run dev
```

Now open:

| URL | What |
|---|---|
| http://localhost:3000 | 🛍️ Storefront |
| http://localhost:3000/admin | 🔐 Admin panel |
| http://localhost:3000/api/health | ✅ Health check → `{"status":"ok"}` |

**Default admin login** (from `.env`): `admin@acctivesports.com` / `acctive@admin123`
— ⚠️ change these before going live.

> **One-liner reset** if you ever want a clean database: `npm run db:reset`.

---

## 📜 Scripts reference

| Command | What it does |
|---|---|
| `npm run dev` | Sync DB provider → start dev server (hot reload) |
| `npm run build` | Sync provider → `prisma generate` → production build |
| `npm run start` | Run the production build (after `build`) |
| `npm run lint` | ESLint (Next.js config) |
| `npm run db:push` | Create/update DB tables from `schema.prisma` (no data loss) |
| `npm run db:seed` | Seed categories, 145 products, admin user |
| `npm run db:deploy` | `db push` **+ seed** — first-time production setup |
| `npm run db:reset` | ⚠️ Wipe **and** re-seed the database |
| `npm run db:studio` | Open **Prisma Studio** — visual DB editor |
| `npm run db:provider` | (internal) set Prisma provider from `DATABASE_URL` |

---

## 🔐 Environment variables

Copy [`.env.example`](.env.example) → `.env` for local, or set these in your host's
dashboard for production (see [`.env.production.example`](.env.production.example)).

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | `file:./dev.db` locally; a Postgres URL in prod (auto-detected) |
| `AUTH_SECRET` | ✅ (prod) | Secret that signs admin JWTs. `openssl rand -base64 32` |
| `ADMIN_EMAIL` | ✅ | First admin login (created by the seed) |
| `ADMIN_PASSWORD` | ✅ | First admin password — **use a strong one in prod** |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public base URL (SEO, sitemap, OG links) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | WhatsApp number, digits only (e.g. `919997100375`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ✅ | Shown in footer/contact |
| `CLOUDINARY_URL` | prod images | `cloudinary://key:secret@cloud` — persistent uploads |
| `BLOB_READ_WRITE_TOKEN` | optional | Alternative image store (Vercel Blob) |
| `NEXT_PUBLIC_GA_ID` | optional | Google Analytics 4 id (`G-XXXX`) |

> Anything prefixed `NEXT_PUBLIC_` is exposed to the browser — never put secrets there.

---

## 🗺 Routes reference

**Storefront** (`src/app/(client)/`)

| Route | Page |
|---|---|
| `/` | Home |
| `/catalogue` | Catalogue (supports `?category=`, `?sport=`, `?fabric=`, `?q=`, `?sort=`) |
| `/products/[slug]` | Product detail |
| `/quote` | Quote/enquiry cart |
| `/about`, `/contact` | Marketing pages |

**Admin** (`src/app/admin/`)

| Route | Page |
|---|---|
| `/admin/login` | Login |
| `/admin` | Dashboard |
| `/admin/products`, `/products/new`, `/products/[id]` | Product CRUD |
| `/admin/enquiries` | Enquiry inbox |

**API** (`src/app/api/`)

| Endpoint | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/auth/login` · `/logout` | POST | – | Admin session |
| `/api/products` | POST | 🔐 | Create product |
| `/api/products/[id]` | PUT, DELETE | 🔐 | Update / delete |
| `/api/categories` | GET, POST | GET public | List / create categories |
| `/api/enquiries` | POST, GET | POST public, GET 🔐 | Submit quote / list |
| `/api/enquiries/[id]` | PATCH, DELETE | 🔐 | Update status / delete |
| `/api/upload` | POST | 🔐 | Image upload |
| `/api/health` | GET | – | Uptime/DB check |

**Generated:** `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`,
`/opengraph-image`, `/icon.svg`.

---

## 🖥 Admin panel

1. Go to `/admin/login` and sign in.
2. **Dashboard** — product/enquiry counts and recent enquiries.
3. **Products** — add/edit/delete, upload images, set category, fabrics, sizes,
   sports, optional price, MOQ, and featured/published toggles.
4. **Enquiries** — every quote request and contact message lands here. Change status
   (New → In progress → Quoted → Closed) and reply on WhatsApp in one click.

---

## 🖼 Adding real product images

Images currently show a branded placeholder. To add your own:

**Option A — Admin panel (recommended)**
1. Download images to your computer.
2. `/admin/products` → open a product (or **Add product**) → **Upload**.
   - Locally they save to `public/uploads/`.
   - In production they go to **Cloudinary** (if `CLOUDINARY_URL` is set).

**Option B — bulk, in code**
1. Drop images in `public/products/…`.
2. Point each product's `images` array in `prisma/seed.ts` at those paths.
3. `npm run db:reset`.

---

## ☁️ Deploying to production (Railway or Render)

Production-hardened and **auto-switches SQLite → PostgreSQL** when `DATABASE_URL` is a
Postgres URL — no code changes. Works on **Railway**, **Render**, any Node VPS, or Docker.

**1. Database (free)** — create a project on **neon.tech** or **supabase.com**, copy the
**pooled** connection string → `DATABASE_URL`.

**2. Images (free)** — sign up at **cloudinary.com**, copy the API env var
(`cloudinary://key:secret@cloud`) → `CLOUDINARY_URL`.

**3. Deploy the repo**
- **Railway:** New Project → Deploy from GitHub → pick the repo (auto-detects Next.js:
  build `npm run build`, start `npm start`).
- **Render:** New → **Blueprint** → connect the repo; it reads
  [`render.yaml`](render.yaml) (build/start/health-check preset, `AUTH_SECRET`
  auto-generated).

**4. Set environment variables** (from `.env.production.example`) — see the table above.

**5. Seed the database once** (from your machine, with the prod URL exported):
```bash
export DATABASE_URL="postgres://…"   # Windows: setx / $env:DATABASE_URL
npm run db:deploy                    # schema + 145 products + admin (run ONCE)
```
> On Render the schema also syncs each deploy via `preDeployCommand`. The **seed is
> manual/one-time** — it resets the catalogue, so it must not run on every deploy.

**6. Verify** — open `/api/health` → `{"status":"ok","db":"up"}`, then log in at `/admin`.

---

## 🌐 Connecting your custom domain

1. Buy a domain (GoDaddy, Namecheap, Hostinger…).
2. Host → **Railway: Settings → Networking → Custom Domain** / **Render: Settings →
   Custom Domains → Add**.
3. Add the **CNAME** the host shows in your registrar's DNS (`www → <target>`; point
   root `@` to `www` or use ALIAS/ANAME).
4. DNS propagates → SSL is issued free automatically.
5. Set `NEXT_PUBLIC_SITE_URL` to your domain and redeploy (fixes SEO/OG links).

Every `git push` to `main` then auto-deploys.

---

## 🔒 Production hardening (built in)

- ✅ Auto Postgres switch (SQLite dev → Postgres prod, zero schema edits)
- ✅ Persistent image uploads (Cloudinary / Vercel Blob / local fallback)
- ✅ Security headers — HSTS, X-Frame-Options, nosniff, Permissions-Policy
- ✅ `AUTH_SECRET` enforced at runtime in production
- ✅ Admin + API `noindex`; `robots.txt` disallows them
- ✅ Spam protection — honeypot + per-IP rate limit on public forms
- ✅ Error, loading & global-error boundaries; `/api/health`
- ✅ SEO — metadata, canonical, OG **image**, Product/Breadcrumb/Organization/FAQ
  JSON-LD, dynamic `sitemap.xml` + `robots.txt`
- ✅ PWA manifest, SVG favicon, theme-color

---

## 🔧 Customizing

| Want to change… | Edit |
|---|---|
| Brand name, phones, address, WhatsApp | `src/lib/site.ts` |
| Fabrics / sizes / sports lists | `src/lib/site.ts` |
| Colours & theme | `tailwind.config.ts` (`flame`, `ink`, `electric`) |
| Seed catalogue (products/categories) | `prisma/seed.ts` |
| FAQ questions | `src/components/client/marketing/FAQ.tsx` |
| Size chart | `src/components/client/SizeGuide.tsx` |

---

## 🩺 Troubleshooting

| Symptom | Fix |
|---|---|
| `AUTH_SECRET is required in production` at runtime | Set a real `AUTH_SECRET` env var |
| Build error about Prisma provider | Ensure `DATABASE_URL` is set; rerun `npm run build` |
| Images upload but vanish after redeploy (Railway/Render) | Set `CLOUDINARY_URL` (ephemeral disks) |
| Empty catalogue after deploy | Run `npm run db:deploy` once against the prod DB |
| Port 3000 in use | `npm run dev -- -p 3001` |
| Reset everything locally | `npm run db:reset` |

---

## 🛣 Roadmap: turning on online payments

The `Product` model already has `price` and `moq`, so checkout is **additive**:
1. Reuse `QuoteContext` as a cart with quantities/prices.
2. Add a `/api/checkout` route integrating **Razorpay** (best for India) or **Stripe**.
3. Add an `Order` model in Prisma + confirmation emails.

No schema rewrite needed — it's designed for this.

---

<div align="center">

**Made in Meerut, India 🇮🇳** · Built with Next.js, TypeScript, Tailwind & Prisma

</div>
