# ACCTIVE Sports Industries — Shopify Store Development Prompt

## Brand Overview

- **Store Name:** ACCTIVE Sports Industries
- **Short Name:** ACCTIVE
- **Tagline:** Premium Custom Sportswear, Manufactured in Meerut
- **Founded:** 2003 by Shivinder Sharma, Meerut, Uttar Pradesh, India
- **Business Type:** B2B + B2C custom sportswear manufacturer (factory-direct, no middlemen)
- **Email:** activesportswears@gmail.com
- **Phones:** +91 99971 00375 / +91 80062 77622
- **WhatsApp:** +91 99971 00375
- **Instagram:** @acctivesports.76
- **Address:** 41/31A Mokhampur, Plot No. 36, Sports Complex Enclave, Delhi Road, Meerut, Uttar Pradesh 250002, India

---

## Color Palette & Typography

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Flame 500 (Primary) | `#ff5a0f` | CTAs, badges, accents, links |
| Flame 600 | `#f03d05` | Hover states |
| Flame 400 | `#ff7d36` | Gradient text, highlights |
| Ink 950 (Dark BG) | `#070b14` | Hero backgrounds, dark sections |
| Ink 900 | `#0e1626` | Cards on dark |
| Ink 50 | `#f4f6fb` | Light section backgrounds |
| Electric 400 | `#22d3ee` | Accent glow, gradient partner |
| White | `#ffffff` | Text on dark, card backgrounds |

### Typography
- **Font:** Inter (Google Fonts) — weights 400, 500, 600, 700, 800, 900
- **Display/Headings:** Inter ExtraBold (800–900)
- **Body:** Inter Regular/Medium (400–500)
- **Eyebrow labels:** 10–12px, uppercase, letter-spacing 0.2em, Flame 500 color

### Gradient Text (animated)
```css
background: linear-gradient(135deg, #ff5a0f, #ff7d36, #22d3ee, #ff5a0f);
background-size: 300% 300%;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
animation: gradient-shift 4s ease infinite;
```

---

## Product Catalog

### Categories
1. **Collar T-Shirts** (Polo/Collar jerseys)
   - Sub-types: Front & Back Sublimation, Full Sublimation, SAP Mattie plain
2. **Round Neck T-Shirts**
   - Sub-types: Front Sublimation, Front & Back Sublimation, Full Sublimation, Plain T-Shirts
3. **Shorts**
   - Sub-types: Elite/Dot Knit/PMC/Heavy Knit/Diagonal, Lycra/Knitted Lycra (Spandex), NS Lycra
4. **Lowers** (Track pants / bottoms)
   - Sub-types: Diagonal/Heavy Knit/Adidas Knit, Elite/Heavy PMC, Lycra/NS Lycra
5. **Tracksuits** (Full sets)
   - Sub-types: Lycra Tracksuit, NS Lycra Tracksuit, Superpoly Tracksuit, TPU Tracksuit
6. **Track Jackets**

### Product Fields (per product)
- Name, slug, description
- Images (multiple — front + back for hover flip)
- Category
- Fabrics (multi-select): Lycra, Superpoly, SAP Mattie, TPU, NS Lycra, Elite Knit
- Sizes: S, M, L, XL, XXL
- Sports tags: Cricket, Football, Basketball, Badminton, Hockey, Tennis, Boxing, Athletics
- Price (INR, optional — "Price on request" if blank)
- MOQ (Minimum Order Quantity, default 1)
- Featured flag (boolean)
- SKU

### Pricing / Discount Logic
- **Single piece discount:** 25% off MRP automatically
- **Bulk discount:** 50% off MRP when cart reaches 5+ pieces total (across all products/designs)
- Both discounts applied automatically at checkout — no coupon code needed
- Show MRP struck-through beside discounted price
- Show bulk tier callout on product page: "5+ pieces — save 50%"

### Fabrics Offered
Lycra · Superpoly · SAP Mattie · TPU · NS Lycra · Elite Knit

### Sports Covered
Cricket · Football · Basketball · Badminton · Hockey · Tennis · Boxing · Athletics

---

## Site Structure & Pages

### 1. Homepage (`/`)

**Sections in order:**

#### A. Announcement Bar (top of page)
- Scrolling text: "🏆 Free mockup on every order · 🚚 Pan-India delivery · 💰 Up to 50% off on bulk orders · ✨ 300+ designs available"
- Background: Flame 500, white text

#### B. Header / Navigation
- Logo: Orange square with "A" + "ACCTIVE." wordmark (dot in flame color)
- Nav links: Home, Shop (mega-menu), About, Contact
- Right side: Dark/Light toggle, Cart icon with item count badge, "Shop Now" CTA button
- **Mega-menu on "Shop":** Left column = Categories list with product counts; Right column = Shop by Sport chips + "View All Products" button
- Sticky on scroll with blur backdrop
- Mobile: Hamburger menu with full category list + "View Cart" button

#### C. Hero Carousel (3 slides, auto-advances every 6s)
- **Slide 1:** "Custom sportswear that performs & pops" — CTA: Browse Catalogue / Get Free Quote
- **Slide 2:** "Colours that never fade or crack" — CTA: See Jerseys / Our Process
- **Slide 3:** "Kit out your whole team or brand" — CTA: Shop Bulk Kits / Talk to Us
- Each slide: Dark gradient background + grid texture + glow orbs (flame orange + cyan)
- Animated gradient text on key phrase
- Right side floating card showing sport categories + "145+ designs" stat + "Shop Now" button
- Floating badges: "✓ Free Mockup" and "🚚 Pan-India"
- Mini stats bar below headline: 145+ Designs · 8 Sports · 10K+ Kits Delivered · 100% Customizable
- Dot indicators + prev/next arrow buttons

#### D. Trust Badges (4 columns)
- 🏭 Factory-Direct Pricing — "No middlemen — manufactured in-house"
- 🚚 Pan-India Delivery — "Shipped anywhere in India, on time"
- 🎨 Free Custom Mockup — "Digital proof before you pay a rupee"
- ✅ Quality Assured — "Every batch QC-checked before dispatch"
- Each badge: gradient background card with colored border, emoji icon

#### E. Product Showcase Strip (3 images)
- 3 real product images side by side (from Cloudinary CDN)
- Each links to /catalogue
- Hover: scale image, show label pill + arrow icon, flame underline animation

#### F. Shop by Category (grid)
- 2-col on mobile, 3-col on desktop
- Each card: tall image card (h-56) with dark gradient overlay
- Hover: image scales, flame bottom border slides in, design count badge
- Shows category name + "X designs" count

#### G. Bestsellers / Featured Products (grid)
- Eyebrow: "Bestsellers"
- Heading: "Most-ordered designs"
- 2-col mobile, 4-col desktop
- ProductCard component (see Product Card spec below)

#### H. Shop by Sport (8 tiles)
- Cricket 🏏 · Football ⚽ · Basketball 🏀 · Badminton 🏸 · Hockey 🏑 · Tennis 🎾 · Boxing 🥊 · Athletics 🏃
- Each sport has its own color scheme (green=cricket, blue=football, orange=basketball, etc.)
- Hover: lift + shadow, icon scales up

#### I. How It Works / Customize Banner (dark card)
- Dark background (ink-950) with grid texture + glow orbs
- Heading: "Your team. Your colours. Your name on every jersey."
- 4 numbered steps with emoji + gradient circle numbers:
  1. 🎨 Pick a design
  2. ✏️ Free mockup
  3. 🏭 Approve & produce
  4. 🚚 Delivered to you
- CTAs: "Start Shopping" (primary) + "Get Free Quote" (ghost)

#### J. New Arrivals (horizontal scroll)
- Eyebrow: "Just Added"
- Horizontal scrollable row of ProductCards (w-44 on mobile, w-56 on desktop)

#### K. Why Choose ACCTIVE (6-card grid)
- 2-col mobile, 3-col desktop
- Cards with flame icon + title + description:
  1. Vivid, long-lasting sublimation
  2. Sports-grade fabrics
  3. 100% custom designs
  4. Bulk-ready manufacturing
  5. Pan-India delivery
  6. Factory-direct pricing

#### L. Stats Counter Band (dark section)
- Dark background with grid texture + glow
- Animated count-up on scroll into view:
  - 300+ Product designs
  - 8 Sports covered
  - 6 Premium fabrics
  - 100% Customizable

#### M. Capabilities Section
- What we manufacture: list of product types with icons

#### N. Testimonials (rotating cards)
- Auto-rotates every 5s
- Card layout with gradient border
- ★★★★★ stars
- Quote + reviewer name + role + avatar (initials with gradient background)
- 4 reviews:
  1. Rahul Verma — Cricket Academy, Lucknow
  2. Anjali Mehta — Football Club Manager, Delhi
  3. S. Krishnan — Sports Coordinator, Meerut
  4. Farhan Sheikh — D2C Activewear Brand

#### O. Partners Marquee
- Label: "Supplying and manufacturing for"
- Scrolling marquee of customer segments: Cricket Academies · Football Clubs · Schools · Colleges · Corporate Teams · Retail Brands · Boxing Gyms · Athletics Clubs

#### P. FAQ Accordion (7 questions)
1. What discounts do you offer?
2. What is your minimum order quantity (MOQ)?
3. Can I get my team name, numbers and logo printed?
4. Do you provide a sample before the full order?
5. How long does delivery take and where do you ship?
6. What fabrics do you offer?
7. How do I place an order?

#### Q. Newsletter Banner
- Email signup with "Get exclusive offers and new design alerts"

#### R. Final CTA Section
- Dark gradient background (ink-950 → flame-950 → ink-900) with grid + dual glow orbs
- Trust badge: "🏆 Trusted by teams, academies and brands across India"
- Heading: "Your next kit is one order away."
- Sub-text with design count + free mockup mention
- CTAs: "Browse all designs →" (primary) + "Talk to our team" (ghost)
- Trust line: "Free mockup on every order · Order from 1 piece · 50% off at 5+ pieces · Pan-India delivery"

#### S. Footer
- Gradient top border (flame orange)
- 4 columns: Brand info + social icons | Explore links | Products links | Contact info
- Brand column: Logo + tagline + WhatsApp icon button (green) + Instagram icon button (pink)
- Explore: Catalogue, About Us, Contact, My Cart
- Products: Collar T-Shirts, Round Neck T-Shirts, Shorts, Lowers, Tracksuits
- Contact: Address, phones, email, WhatsApp + Instagram links
- Bottom bar: © 2026 ACCTIVE Sports Industries. All rights reserved. | Made in Meerut, India 🇮🇳

---

### 2. Catalogue Page (`/catalogue`)

- Header: "Catalogue" with product count + "every piece is fully customizable"
- **Filter bar** (sticky on desktop):
  - Search box (text search by name)
  - Category dropdown/chips
  - Sport filter chips
  - Fabric filter chips
  - Sort: Newest / Featured / Price Low-High / Price High-Low
- **Active filters** shown as removable pills below filter bar
- **Product grid:** 2-col mobile, 3-col tablet, 4-col desktop
- **Pagination** at bottom
- Empty state: "No products match your filters" with clear filters CTA

---

### 3. Product Detail Page (`/products/[slug]`)

**Layout:** 2-column on desktop (gallery left, info right)

**Left — Product Gallery:**
- Main large image
- Thumbnail strip below (click to switch)
- Front/back image flip on hover

**Right — Product Info:**
- Category eyebrow (flame color, uppercase)
- Product name (H1, large bold)
- **Price block:**
  - Discounted price (large, bold) + MRP struck through + "Save 25%" badge
  - Bulk tier callout (green card): "5+ pieces — save 50%" with bulk price shown
  - "per piece, excluding customization" sub-text
  - If no price: "Price on request" pill
- Description paragraph
- Sport tags (clickable, link to catalogue filtered by sport)
- Fabric info + Size Guide link
- **Add to Cart / Quote form:**
  - Size selector (S/M/L/XL/XXL chips)
  - Quantity input
  - "Add to Cart" primary button
  - "Request Quote via WhatsApp" secondary button
- **Trust badges row (3 icons):**
  - 🎨 Fully customizable
  - 🚚 Pan-India delivery
  - 🏭 Factory direct
- **Product Tabs below:**
  - Details (fabrics, sizes, sports, MOQ, SKU)
  - Customization info
  - Shipping & delivery info
- **Related Products** grid (4 products from same category)
- **Breadcrumb:** Home / Shop / Category / Product Name

---

### 4. About Page (`/about`)

**Sections:**
1. **Hero** — Video background (looping), dark overlay, grid texture, glow orbs
   - Badge: "About ACCTIVE Sports Industries"
   - H1: "Discover ACCTIVE Sports — your go-to destination for premium sportswear."
   - Sub: Founded by Shivinder Sharma in Meerut since 2003
   - CTAs: View Catalogue + Request a Quote
   - Stats grid: 2003 Founded · 300+ Designs · 10K+ Kits Delivered · 100% Customizable

2. **Our Story** — 2-column (text left, image collage right)
   - History from Pt. Sohan Lal and Sons Hockey makers → ACCTIVE 2003
   - "20+ Years of Excellence" highlight card
   - Image collage: 3 product photos in asymmetric grid
   - "300+ Designs" floating badge

3. **Founder Quote** — Dark section
   - Large quote marks
   - "Experience the difference that quality makes with ACCTIVE Sports Industries."
   - Founder attribution: Shivinder Sharma, Founder

4. **Core Values** — 3 cards
   - Quality First (flame gradient)
   - Customer Focus (blue gradient)
   - Innovation (purple gradient)

5. **Product Range** — Light section
   - Pill tags: Men's Polo T-Shirts, Round Neck T-Shirts, Printed Hooded Jackets, Polyester Lycra Cycling Dresses, Shorts & Lowers, Full Tracksuits, Track Jackets, Custom Team Kits
   - Premium Fabrics list
   - Sports We Cover list

6. **Capabilities** — 6-card grid
   - In-house Sublimation, Custom Design Studio, Bulk Manufacturing, Quality Control, Textile Engineers, Pan-India Delivery

7. **How It Works** — Dark section, 4 numbered steps
   - 01 Share your brief → 02 Get a quote & mockup → 03 Production → 04 Pan-India delivery

8. **CTA** — Flame gradient card
   - "Ready to elevate your team's performance?"
   - Browse Catalogue + Contact Us buttons

---

### 5. Contact Page (`/contact`)

**Sections:**
1. **Hero** — Video background, dark overlay
   - "Let's build your perfect kit"
   - Quick contact pills: WhatsApp Us (green) + Email (white)

2. **Product image accent strip** — 3 product images at 120px height

3. **Contact Content** — 3-column grid
   - **Left column (1/3):** Info cards (Address, Phone, Email, Social) + Google Maps embed + product teaser image
   - **Right column (2/3):** Contact/Enquiry Form

**Contact Form fields:**
- Full Name (required)
- Email (required)
- Phone / WhatsApp number (required)
- Company / Team name (optional)
- Product interest (dropdown or text)
- Message / Requirements
- Submit: "Send Enquiry" button

---

### 6. Cart Page (`/cart`)

- List of cart items with image, name, size, fabric, quantity controls, price
- Order summary sidebar:
  - Subtotal
  - Discount applied (25% single / 50% bulk — auto-calculated)
  - Total
  - "Proceed to Checkout" button
  - "Continue Shopping" link
- Empty cart state with "Browse Catalogue" CTA

---

### 7. Checkout Page (`/checkout`)

- Customer details: Name, Email, Phone, Address
- Order summary
- Payment options: UPI / Bank Transfer (details shown after order placed)
- "Place Order" button → sends enquiry to admin + WhatsApp confirmation

---

## Product Card Component Spec

Used in grids and carousels throughout the site.

**Visual:**
- Rounded card (border-radius: 16px) with subtle border
- Hover: lifts 8px, flame-colored shadow glow
- Gradient overlay appears on hover

**Image area:**
- Square aspect ratio
- Front image shown by default
- Back image fades in on hover (with slight scale)
- "Quick View →" pill slides up from bottom on hover
- Badges top-left: "⭐ Featured" (flame pill) if featured
- Badge top-right: "Customizable" (white pill)

**Info area (below image):**
- Category name (flame, uppercase, tiny)
- Product name (2-line clamp, hover turns flame)
- Price: discounted price + "/piece" + MRP struck through
- If no price: "💬 Price on request" pill
- MOQ shown if > 1
- Size chips (up to 5, then "+N more")
- "Add to Cart" / "Quick Add" button

---

## Cart Drawer (Slide-in)

- Slides in from right on cart icon click
- Lists items with image, name, size, qty +/- controls, remove button
- Subtotal + discount info
- "Checkout" CTA + "Continue Shopping" link

---

## WhatsApp Floating Button

- Fixed bottom-right corner
- Green WhatsApp icon
- Pre-filled message: "Hi ACCTIVE, I'd like to enquire about your sportswear."
- Opens wa.me/919997100375

---

## Shopify-Specific Implementation Notes

### Theme Recommendation
Use **Dawn** (Shopify's free base theme) or **Impulse** / **Prestige** as starting point, then customize heavily with custom sections.

### Custom Sections Needed (Shopify Liquid)
1. `hero-carousel` — 3-slide auto-advancing carousel with gradient backgrounds
2. `trust-badges` — 4-column icon + text badges
3. `product-showcase-strip` — 3-image linked strip
4. `shop-by-sport` — 8-tile sport grid with color-coded cards
5. `customize-banner` — dark card with 4 numbered steps
6. `stats-counter` — animated count-up on scroll
7. `testimonials-carousel` — rotating review cards
8. `partners-marquee` — infinite scroll marquee
9. `faq-accordion` — collapsible FAQ
10. `newsletter-banner` — email signup
11. `announcement-bar` — scrolling top bar

### Metafields Required
- `product.fabrics` — list of fabrics (multi-line text or JSON)
- `product.sports` — list of sports (multi-line text or JSON)
- `product.moq` — integer (minimum order quantity)
- `product.back_image` — second image URL for hover flip

### Shopify Apps to Install
- **Klaviyo** or **Omnisend** — email/SMS marketing + newsletter
- **WhatsApp Chat** (e.g., Tidio or SuperLemon) — floating WhatsApp button
- **Product Reviews** (Judge.me or Loox) — customer reviews
- **Bulk Discounts / Tiered Pricing** — for automatic 25%/50% discount logic
  - Use Shopify Scripts (Plus) or **Bold Discounts** / **Quantity Breaks** app
- **Google Analytics 4** — via Shopify native integration
- **SEO Manager** — meta tags, sitemap, structured data

### Discount Implementation (Shopify)
Since Shopify doesn't natively support "25% off everything + 50% off at 5+ pieces":
- Option A (Shopify Plus): Use **Shopify Scripts** to apply automatic discounts
- Option B (Standard): Use **Automatic Discounts** in Shopify admin:
  - Create "SINGLE25" automatic discount: 25% off all products
  - Create "BULK50" automatic discount: 50% off when cart quantity ≥ 5 (overrides SINGLE25)
- Option C: Use **Bold Quantity Breaks** or **Tiered Pricing** app

### Collections Setup
Create these Shopify Collections:
- `collar-t-shirts` — Collar T-Shirts
- `round-neck-t-shirts` — Round Neck T-Shirts
- `shorts` — Shorts
- `lowers` — Lowers / Track Pants
- `tracksuits` — Tracksuits
- `track-jackets` — Track Jackets
- `featured` — Featured / Bestsellers (manual or tagged)
- `new-arrivals` — auto-sorted by newest

### Navigation Menus
- **Main Menu:** Home, Shop (with sub-links per collection), About, Contact
- **Footer Menu:** Catalogue, About, Contact, Cart
- **Footer Products Menu:** All 6 category links

### Product Tags (for filtering)
Tag every product with:
- Sport: `sport:cricket`, `sport:football`, etc.
- Fabric: `fabric:lycra`, `fabric:superpoly`, etc.
- Type: `type:jersey`, `type:shorts`, etc.
- `featured` for bestsellers

### SEO
- Homepage canonical: `/`
- Catalogue canonical: `/collections/all`
- Product canonical: `/products/[handle]`
- FAQ section: Add FAQ schema (JSON-LD)
- Product pages: Add Product schema (JSON-LD) with price, availability
- Breadcrumb schema on product pages
- Meta description for all pages (see page specs above)
- Sitemap: auto-generated by Shopify
- robots.txt: allow all

### Image CDN
- All product images hosted on Shopify CDN (upload via admin)
- Hero/About/Contact background images: use Cloudinary URLs or upload to Shopify Files
  - Custom jerseys: `https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png`
  - Team kits: `https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png`
  - Bulk orders: `https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png`
- About page video: `https://res.cloudinary.com/rdhqircc/video/upload/v1786295693/gemini_generated_video_26B45789_flyulq.mp4`
- Contact page video: `https://res.cloudinary.com/rdhqircc/video/upload/v1786295693/gemini_generated_video_AD4F8806_bs8ynq.mp4`

---

## CSS Variables / Design Tokens

```css
:root {
  --color-primary: #ff5a0f;
  --color-primary-hover: #f03d05;
  --color-primary-light: rgba(255, 90, 15, 0.1);
  --color-accent: #22d3ee;
  --color-dark: #070b14;
  --color-dark-2: #0e1626;
  --color-light: #f4f6fb;
  --color-text: #0e1626;
  --color-text-muted: #425a95;
  --font-main: 'Inter', system-ui, sans-serif;
  --radius-card: 16px;
  --radius-btn: 9999px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-hover: 0 20px 40px rgba(255, 90, 15, 0.15);
}
```

---

## Key Animations

```css
/* Gradient text animation */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Float (hero card) */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* Pulse glow (CTA button) */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 90, 15, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(255, 90, 15, 0); }
}

/* Marquee */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

---

## Button Styles

```css
/* Primary CTA */
.btn-primary {
  background: #ff5a0f;
  color: white;
  border-radius: 9999px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(255, 90, 15, 0.25);
  transition: background 0.2s, transform 0.2s;
}
.btn-primary:hover { background: #f03d05; transform: translateY(-1px); }

/* Ghost on dark */
.btn-ghost-dark {
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.1);
  color: white;
  border-radius: 9999px;
  padding: 10px 20px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}
.btn-ghost-dark:hover { background: rgba(255,255,255,0.2); }

/* Secondary */
.btn-secondary {
  border: 1px solid #c8d2e6;
  background: white;
  color: #0e1626;
  border-radius: 9999px;
  padding: 10px 20px;
  font-weight: 600;
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout changes |
|------------|-------|----------------|
| Mobile | < 640px | 1-col grids, hamburger nav, stacked hero |
| Tablet | 640–1024px | 2-col grids, some 3-col |
| Desktop | > 1024px | 3–4 col grids, mega-menu, side-by-side layouts |

---

## Admin / Backend Requirements (Shopify Admin)

- Product management: add/edit/delete products with all metafields
- Order management: view and fulfill orders
- Enquiry tracking: use Shopify Orders + customer notes, or install a CRM app
- Inventory: track stock per variant (size)
- Analytics: Shopify Analytics + Google Analytics 4
- Email notifications: order confirmation, shipping updates

---

## Content to Migrate from Current Site

### Products (300+ designs across 6 categories)
All product images are in `/public/uploads/` — upload to Shopify via bulk import CSV.

### Product CSV columns needed:
`Handle, Title, Body (HTML), Vendor, Type, Tags, Published, Option1 Name, Option1 Value, Option2 Name, Option2 Value, Variant Price, Variant Compare At Price, Variant Requires Shipping, Variant Taxable, Image Src, Image Position, Metafield: fabrics, Metafield: sports, Metafield: moq`

### Static Content
- About page copy (founder story, values, capabilities) — as above
- FAQ content — 7 questions as listed above
- Contact info — as listed in Brand Overview

---

## Launch Checklist

- [ ] Install theme and configure colors/fonts
- [ ] Create all 6 collections
- [ ] Import all 300+ products via CSV with images
- [ ] Set up automatic discounts (25% single, 50% bulk 5+)
- [ ] Build all custom sections (hero, trust badges, sport tiles, etc.)
- [ ] Configure navigation menus
- [ ] Set up contact form → email notification
- [ ] Install WhatsApp chat widget
- [ ] Connect Google Analytics 4
- [ ] Set up Klaviyo/Omnisend for newsletter
- [ ] Configure SEO: meta titles, descriptions, JSON-LD
- [ ] Test mobile responsiveness
- [ ] Test cart + checkout flow
- [ ] Set up custom domain
- [ ] Enable SSL
- [ ] Submit sitemap to Google Search Console
