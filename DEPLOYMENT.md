# Deploying ACCTIVE Sports — from local code to a live domain

A complete, ordered walkthrough: register a domain, provision a database, deploy
the app, point the domain at it, and verify the result.

Budget roughly **90 minutes** end to end, most of which is waiting for DNS.

**Recurring cost:** ₹700–₹1,500/yr for the domain, ₹0–₹600/month for hosting and
database depending on the tier you pick. Everything below has a free tier that
works for launch.

---

## Table of contents

1. [Before you start](#1-before-you-start)
2. [Register your domain](#2-register-your-domain)
3. [Create the database](#3-create-the-database-postgresql)
4. [Set up Cloudinary for images](#4-set-up-cloudinary-for-images)
5. [Deploy the app](#5-deploy-the-app)
6. [Environment variables reference](#6-environment-variables-reference)
7. [Seed the catalogue and admin login](#7-seed-the-catalogue-and-admin-login)
8. [Connect your domain](#8-connect-your-domain)
9. [Post-deployment checklist](#9-post-deployment-checklist)
10. [Search engine setup](#10-search-engine-setup)
11. [Ongoing maintenance](#11-ongoing-maintenance)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Before you start

Have these ready:

| What | Why | Notes |
|---|---|---|
| GitHub account | Hosting platforms deploy from your repo | Repo already at `Manan987/Acctive_sports` |
| Credit/debit card or UPI | Domain registration | Hosting itself can stay free |
| Business email | Domain + hosting accounts | Use one you will keep access to |
| Company address & phone | Domain registration (ICANN requires real contact details) | Already in `src/lib/site.ts` |
| GSTIN *(optional)* | Claim input credit on the domain/hosting invoices | |

> **A note on `.in` domains:** registering a `.in` requires a valid Indian
> postal address. Registration is instant; there is no waiting period.

---

## 2. Register your domain

### 2.1 Choose the name

Check availability at [instantdomainsearch.com](https://instantdomainsearch.com)
before you go to a registrar — it is faster than any registrar's own search.

Suggested candidates for this business:

- `acctivesports.com` — best if available; `.com` is what buyers type by default
- `acctivesports.in` — strong signal you're an Indian manufacturer, usually cheaper
- `acctivesportsindustries.com` — longer, use only if the short ones are taken

Rules of thumb: no hyphens, no numbers, and say it out loud — you will read it
over the phone to customers constantly.

### 2.2 Pick a registrar

| Registrar | `.com` first year | `.com` renewal | Notes |
|---|---|---|---|
| **[Cloudflare Registrar](https://domains.cloudflare.com)** | ~₹1,000 | ~₹1,000 | **Recommended.** Sells at wholesale cost, free WHOIS privacy, no upsells. Requires moving DNS to Cloudflare (which you want anyway). |
| [Namecheap](https://namecheap.com) | ~₹600 | ~₹1,300 | Free WHOIS privacy, good UI |
| [GoDaddy](https://godaddy.com) | ~₹150 | ~₹1,600 | Cheap first year, expensive renewal, aggressive upsells at checkout |
| [BigRock](https://bigrock.in) | ~₹500 | ~₹1,200 | Indian company, INR billing, GST invoice |

The first-year price is marketing. **Compare the renewal price** — that is what
you pay every year from year two.

### 2.3 Register it

1. Search your name, add to cart.
2. **Decline every upsell.** You do not need their hosting, their email, their
   "website builder", or their SSL certificate — your host provides SSL free.
3. **Enable WHOIS privacy** (free at Cloudflare and Namecheap). Without it your
   name, address, email and phone are published in a public database that
   spammers scrape continuously.
4. **Set auto-renew ON.** A lapsed domain can be bought by anyone, including
   competitors, and recovering it is expensive or impossible.
5. Complete the ICANN email verification within 15 days or the domain is
   suspended. Check spam if it does not arrive.

### 2.4 Put Cloudflare in front (recommended)

Even if you registered elsewhere, moving DNS to Cloudflare gives you free CDN,
DDoS protection, faster DNS resolution and a much better DNS editor.

1. Sign up at [cloudflare.com](https://cloudflare.com), add your domain, pick the **Free** plan.
2. Cloudflare shows you two nameservers, e.g. `kia.ns.cloudflare.com`.
3. In your registrar's control panel, replace the existing nameservers with those two.
4. Wait for Cloudflare to confirm — usually 5 minutes to 2 hours.

Skip this section entirely if you registered *at* Cloudflare; it is already done.

---

## 3. Create the database (PostgreSQL)

Local development uses SQLite. Production needs PostgreSQL — the app detects
which from the connection string and switches Prisma automatically
(`scripts/prisma-provider.mjs`), so **no schema edits are needed**.

### Option A — Neon (recommended)

1. Sign up at [neon.tech](https://neon.tech) — free tier, no card.
2. Create a project. **Region: Singapore (`ap-southeast-1`)** — closest to India.
3. From the dashboard, copy the **Pooled connection** string. It looks like:
   ```
   postgres://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   > Use the **pooled** URL, not the direct one. Serverless platforms open a new
   > connection per request and will exhaust a direct connection limit fast.
4. Save it — this is your `DATABASE_URL`.

### Option B — Supabase

Same idea: [supabase.com](https://supabase.com) → new project → region Singapore
→ Settings → Database → **Connection pooling** → copy the URI. Replace
`[YOUR-PASSWORD]` with the password you set at project creation.

---

## 4. Set up Cloudinary for images

**This is not optional.** Render, Railway and Vercel all have ephemeral disks —
anything written to `/public/uploads` disappears on the next deploy or restart.
Without Cloudinary, every product image an admin uploads vanishes.

1. Sign up at [cloudinary.com](https://cloudinary.com) — free tier is 25 GB.
2. On the dashboard, find the **API Environment variable**:
   ```
   cloudinary://123456789012345:abcdefGHIJKLmnop_qrstuvwxyz@your-cloud-name
   ```
3. Save it as `CLOUDINARY_URL`.

Once set, the upload route uses Cloudinary automatically — no code change.
Product images land in a `products/` folder; site assets in `website production/`.

### Uploading the existing 145 catalogue images

The repo ships the source photography in `CATALOUGE/`, but `public/uploads/` is
gitignored and empty, so a fresh deploy has no product imagery.

```bash
# Locally, with CLOUDINARY_URL and DATABASE_URL set in .env,
# pointing DATABASE_URL at your PRODUCTION database:
node scripts/bulk-upload.mjs
```

This uploads every image in `CATALOUGE/` to Cloudinary and rewrites each
product's `images` column to the resulting CDN URLs. Run it **once**, after
seeding (step 7).

---

## 5. Deploy the app

### Option A — Render (recommended for this project)

The repo already contains `render.yaml`, so Render configures itself.

1. Sign up at [render.com](https://render.com), connect GitHub.
2. **New → Blueprint**, select `Manan987/Acctive_sports`, click **Apply**.
3. Render reads `render.yaml` and creates the web service. Fill in the variables
   marked `sync: false` when prompted (see [section 6](#6-environment-variables-reference)).
4. First deploy takes 3–6 minutes.

`render.yaml` already sets `preDeployCommand: npx prisma db push --skip-generate`,
so the schema syncs on every deploy. It is idempotent and does not delete data.

> **Free tier caveat:** Render's free web services sleep after 15 minutes idle,
> and the next visitor waits ~50 seconds for a cold start. For a live storefront
> this is a real problem — upgrade to the **Starter** plan (~$7/month) before you
> advertise the site anywhere.

### Option B — Vercel

Best performance, but `output: "standalone"` in `next.config.mjs` is aimed at
self-hosting. Vercel ignores it harmlessly.

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
2. Framework preset: **Next.js** (auto-detected). Leave build settings alone —
   `vercel.json` pins the region to `bom1` (Mumbai).
3. Add the environment variables from [section 6](#6-environment-variables-reference).
4. Deploy.

Vercel has no pre-deploy hook, so push the schema once from your machine:

```bash
DATABASE_URL="your-production-url" npx prisma db push
```

### Option C — Railway

[railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**.
Add the variables, then in **Settings → Deploy** set the pre-deploy command to
`npx prisma db push --skip-generate`.

---

## 6. Environment variables reference

Set these in your host's dashboard (Render → Environment, Vercel → Settings →
Environment Variables). **Never commit real values to git.**

### Required

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `postgres://…?sslmode=require` | Pooled URL from step 3 |
| `AUTH_SECRET` | 44-char random string | Signs admin session JWTs. Generate: `openssl rand -base64 32`. Render's blueprint generates this for you. **The app refuses to start in production without it.** |
| `NEXT_PUBLIC_SITE_URL` | `https://acctivesports.com` | Your final domain, no trailing slash. Feeds canonical URLs, OG tags, the sitemap and robots.txt. **If this is wrong, the whole site tells Google it lives at localhost.** |
| `ADMIN_EMAIL` | `admin@acctivesports.com` | First admin login |
| `ADMIN_PASSWORD` | strong unique password | Used once by the seed. The seed **refuses to run in production without it** rather than create an account with the documented default. |
| `CLOUDINARY_URL` | `cloudinary://key:secret@cloud` | From step 4 |

### Recommended

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919997100375` | Digits only, with country code, no `+` or spaces |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `activesportswears@gmail.com` | Shown in the footer and contact page |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics 4. Leave blank to disable analytics entirely |

### Payment details (optional but recommended)

The checkout shows these on the order-confirmation screen. **Anything you leave
blank is simply not shown** — the page falls back to "our team will send you the
payment details", so the site never instructs a customer to pay into an account
that does not exist.

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_UPI_ID` | `acctivesports@okhdfcbank` |
| `NEXT_PUBLIC_BANK_ACCOUNT_NAME` | `ACCTIVE Sports Industries` |
| `NEXT_PUBLIC_BANK_ACCOUNT_NUMBER` | `50100XXXXXXXXX` |
| `NEXT_PUBLIC_BANK_IFSC` | `HDFC0001234` |
| `NEXT_PUBLIC_BANK_NAME` | `HDFC Bank` |

> Bank transfer details are only shown when **both** the account number and IFSC
> are set.

### Advanced

| Variable | When to set |
|---|---|
| `TRUST_PROXY` | Leave unset on Render/Vercel/Railway. Set to `"false"` **only** if the app is exposed directly to the internet with no proxy — otherwise a client can spoof `x-forwarded-for` and bypass rate limiting. |
| `BLOB_READ_WRITE_TOKEN` | Alternative image store (Vercel Blob) if you prefer it to Cloudinary |

---

## 7. Seed the catalogue and admin login

This creates the admin user, the 6 categories and the 157 products.

**Run it exactly once.** The seed begins with `deleteMany()` on products and
categories — running it again wipes everything you have added since.

### On Render

Dashboard → your service → **Shell** tab:

```bash
npm run db:seed
```

### On Vercel / Railway / from your machine

```bash
# Point at PRODUCTION and set the admin password for this one command
DATABASE_URL="your-production-url" \
ADMIN_EMAIL="admin@acctivesports.com" \
ADMIN_PASSWORD="your-strong-password" \
npx tsx prisma/seed.ts
```

### Then, immediately after seeding

```bash
# 1. Upload the catalogue photography to Cloudinary and rewrite image URLs
DATABASE_URL="your-production-url" node scripts/bulk-upload.mjs

# 2. Align minimum order quantity with the "order from 1 piece" promise
DATABASE_URL="your-production-url" node scripts/normalise-moq.mjs
```

### Set your prices

Seeded products have **no price**, so every product shows "Price on request" and
the discount tiers stay hidden. Log in at `/admin/login`, open each product and
set its MRP. The 25% single-piece and 50% bulk (5+ pieces) discounts are then
applied automatically — on the card, the product page, the cart, the checkout
and the recorded order total.

**Change the admin password after your first login.**

---

## 8. Connect your domain

### 8.1 Tell your host about the domain

**Render:** Service → Settings → **Custom Domains** → Add
`acctivesports.com`, then add `www.acctivesports.com` too. Render shows the DNS
records to create.

**Vercel:** Project → Settings → **Domains** → add both. Vercel shows the records.

### 8.2 Create the DNS records

In Cloudflare (or your registrar's DNS panel):

| Type | Name | Value | Proxy |
|---|---|---|---|
| `CNAME` | `www` | `acctive-sports.onrender.com` *(the value your host gave you)* | DNS only |
| `A` or `CNAME` | `@` | whatever your host specified for the root | DNS only |

Notes:

- **Set the proxy to "DNS only" (grey cloud) at first.** Cloudflare's orange-cloud
  proxy can interfere with your host's certificate issuance. Turn it on after SSL
  is confirmed working.
- Render supplies an `A` record IP for the root domain; Vercel gives you
  `76.76.21.21`. Use exactly what your dashboard displays — do not copy the
  example above blindly.
- Delete any leftover parking records the registrar created.

### 8.3 Wait, then verify

DNS typically propagates in 5–30 minutes and can take up to 48 hours. Check with:

```bash
nslookup acctivesports.com
nslookup www.acctivesports.com
```

Or use [dnschecker.org](https://dnschecker.org) to see propagation worldwide.

### 8.4 SSL

Both Render and Vercel issue a Let's Encrypt certificate automatically once DNS
resolves — usually within minutes of verification. You do **not** need to buy an
SSL certificate from anyone.

Confirm `https://` loads with a padlock and no warning before continuing.

### 8.5 Update the site URL

Once the domain is live, set `NEXT_PUBLIC_SITE_URL=https://acctivesports.com`
in your host's environment variables and **redeploy**. Until you do, canonical
tags, OG images and the sitemap all still point at the old `.onrender.com` URL.

---

## 9. Post-deployment checklist

Work through this on the live domain before you tell anyone the site exists.

**Core**
- [ ] `https://yourdomain.com` loads with a valid padlock
- [ ] `http://` and the bare/`www` variants all redirect to the canonical one
- [ ] `/api/health` returns `{"status":"ok","db":"up"}`
- [ ] Product images load (they should be `res.cloudinary.com` URLs, not `/uploads/`)

**Commerce**
- [ ] Catalogue filters, search, sort and pagination work
- [ ] Add to cart → cart drawer → cart page → checkout all show the **same** figure
- [ ] Adding a 5th piece drops the discount tier from 25% to 50% and the total falls
- [ ] Placing a test order succeeds and appears in `/admin/enquiries`
- [ ] The recorded order total matches what checkout displayed
- [ ] WhatsApp buttons open a chat with the right number and a prefilled message
- [ ] Newsletter signup succeeds and shows up in admin as source `newsletter`

**Admin**
- [ ] Login works and a wrong password is rejected
- [ ] You changed the seeded admin password
- [ ] Creating, editing and deleting a product works
- [ ] Image upload works and the image persists after a redeploy

**Quality**
- [ ] Test on a real phone, not just a narrow browser window
- [ ] Dark mode looks right on every page
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) — aim for 90+ on mobile
- [ ] Tab through the homepage with the keyboard; the focus ring is always visible
- [ ] `/admin` and `/api` return `noindex` headers (already configured)

---

## 10. Search engine setup

1. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console)
   - Add your domain as a **Domain property** (verify with a DNS TXT record)
   - Submit `https://yourdomain.com/sitemap.xml`
   - The sitemap is generated live from the database, so new products appear automatically
2. **Bing Webmaster Tools** — [bing.com/webmasters](https://bing.com/webmasters); it can import directly from Search Console
3. **Google Business Profile** — [business.google.com](https://business.google.com).
   For a Meerut manufacturer this drives more enquiries than anything else on
   this list. Use the exact address from `src/lib/site.ts` and add real photos of
   the factory and finished kits.
4. **Google Analytics 4** — create a property, copy the `G-XXXXXXXXXX`
   measurement ID into `NEXT_PUBLIC_GA_ID`, redeploy.

The site already emits `Organization`, `Product`, `BreadcrumbList` and `FAQPage`
structured data. Validate it at [search.google.com/test/rich-results](https://search.google.com/test/rich-results).

---

## 11. Ongoing maintenance

**Deploying changes.** Push to `main`; Render and Vercel rebuild automatically.

**Database backups.** Neon keeps 7 days of point-in-time history on the free
tier. For anything you cannot afford to lose, take your own dump monthly:

```bash
pg_dump "your-production-url" > backup-$(date +%Y-%m-%d).sql
```

**Domain renewal.** Keep auto-renew on and the card on file current. Set a
calendar reminder two weeks before expiry as a backstop.

**Dependencies.** Every few months:

```bash
npm outdated
npm update
npm run build   # verify before pushing
```

**Rate limiting.** Limits are held in an in-memory `Map`, so each instance keeps
its own counters. If you scale beyond one instance, move `src/lib/rateLimit.ts`
to Upstash Redis or the effective limit multiplies by the instance count.

**Enquiry email alerts.** Nothing currently emails you when an order arrives —
check `/admin/enquiries`. To add alerts, plug a provider such as
[Resend](https://resend.com) into `src/app/api/enquiries/route.ts` at the marked
`NOTE:` comment.

---

## 12. Troubleshooting

**Build fails: `Environment variable not found: DATABASE_URL`**
The variable is not set on the host, or was added after the build started. Add
it and trigger a manual redeploy.

**Site loads but every page is empty / 500s**
The schema was never pushed. Run `npx prisma db push` against the production
`DATABASE_URL`.

**All product images are broken**
The database still holds `/uploads/…` paths from the seed. Run
`node scripts/bulk-upload.mjs` with `CLOUDINARY_URL` set.

**Uploaded images vanish after a redeploy**
`CLOUDINARY_URL` is not set, so uploads fell through to the local disk, which is
ephemeral. Set it and re-upload.

**Google shows `localhost:3000` in results**
`NEXT_PUBLIC_SITE_URL` was unset or wrong at build time. Fix it and redeploy —
this is a build-time value, so a restart alone will not pick it up.

**Search finds nothing on Postgres but worked locally**
Already handled — `src/lib/data.ts` detects Postgres and adds
`mode: "insensitive"`. If you see this, your `DATABASE_URL` does not start with
`postgres://`.

**Admin login returns 429**
Rate limiting: 10 attempts per 15 minutes per IP and per account. Wait it out; a
successful login clears the counter.

**Domain shows the registrar's parking page**
Nameservers or DNS records have not propagated, or a leftover parking A record
is still present. Delete it and re-check `nslookup`.

**Cold starts on Render free tier**
Expected — free services sleep after 15 minutes. Upgrade to Starter.

---

## Quick reference

```bash
# Local development
npm install
cp .env.example .env
npm run db:reset      # push schema + seed  (DESTRUCTIVE)
npm run dev           # http://localhost:3000

# Production one-time setup
npx prisma db push                  # sync schema
npm run db:seed                     # categories, products, admin  (ONCE)
node scripts/bulk-upload.mjs        # photography -> Cloudinary
node scripts/normalise-moq.mjs      # set every product MOQ to 1

# Health check
curl https://yourdomain.com/api/health
```

| Thing | Where |
|---|---|
| Admin panel | `https://yourdomain.com/admin` |
| Health check | `https://yourdomain.com/api/health` |
| Sitemap | `https://yourdomain.com/sitemap.xml` |
| Brand, contact, discounts | `src/lib/site.ts` |
| Pricing rules | `src/lib/pricing.ts` |
