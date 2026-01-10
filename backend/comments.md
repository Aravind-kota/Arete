# Product Scraping & Data Architecture Design

**(World of Books – Frontend-Driven Scraping System)**

## 1. Goal & Context

The system is designed to scrape product data from **World of Books** on-demand and persist it in a structured database so that a frontend can:

* Display product grids
* Support filters (price, condition, format, rating)
* Support sections (categories, recommendations)
* Refresh stale data safely without over-scraping

The backend is built using **NestJS**, **Crawlee + Playwright**, **Supabase (Postgres)**, and **Upstash Redis**.

---

## 2. Current Scraping Flow (Baseline)

### Existing Flow

1. User triggers a scrape via API
2. Job is queued
3. PlaywrightCrawler navigates:

   * Home → Categories → Product pages
4. Product data is extracted and saved
5. A `last_scraped_at` threshold avoids frequent re-saves

### What Works Well

* DOM-based scraping (more reliable than raw HTTP)
* Queue-based architecture (non-blocking)
* Basic freshness check
* Reasonable URL filtering

### Key Problems Identified

* Product identification relies on URL (unstable)
* Price stored as text (not filterable)
* Category → product relationship is too rigid
* Scraping logic is heuristic-heavy and brittle
* Frontend filtering requirements are not reflected in schema

---

## 3. Frontend-Driven Scraping Philosophy (Core Principle)

> **Scrape only what you need, but structure it as if it will be queried heavily.**

This means:

* Extract **normalized, typed data**
* Avoid UI-only text blobs
* Prefer IDs and numbers over strings
* Treat scraping as **data ingestion**, not page mirroring

---

## 4. Product Scraping Strategy (Recommended)

### 4.1 Product Page Detection (Critical)

Avoid URL-only detection.

A page is considered a **product page** only if it contains:

* Product title (`h1`)
* Price element
* ISBN or unique product identifier
* “Add to basket” / availability indicator

**Why**
Category pages often contain prices → false positives.

---

### 4.2 Stable Product Identity

#### ❌ What not to use

* `document.URL`
* URLs with tracking params

#### ✅ What to use

1. **ISBN** (primary)
2. Internal SKU / data attribute (fallback)
3. Canonical URL hash (last resort)

```text
source_id = ISBN || internal_product_id
```

This ensures:

* Deduplication across categories
* Stable refresh logic
* Safe updates

---

### 4.3 Price Extraction (Frontend-Critical)

#### ❌ Bad

```text
"£3.99"
```

#### ✅ Good

```json
{
  "price_value": 3.99,
  "currency": "GBP"
}
```

Enables:

* Sorting
* Price range filters
* Currency handling

---

### 4.4 Mandatory Product Fields

Each product **must** include:

| Field           | Reason                |
| --------------- | --------------------- |
| title           | Display               |
| author          | Filtering / sections  |
| isbn            | Deduplication         |
| price_value     | Range filters         |
| currency        | Intl safety           |
| condition       | Used / New filters    |
| format          | Paperback / Hardcover |
| availability    | UX decisions          |
| image_url       | Grid rendering        |
| source_url      | Deep linking          |
| last_scraped_at | Cache logic           |

Optional but valuable:

* rating_avg
* reviews_count
* publisher
* publication_date

---

## 5. Category & Navigation Scraping

### 5.1 Navigation

Scrape only:

* Visible navigation items
* Primary category links

Avoid:

* Footer
* Account
* Help links

---

### 5.2 Categories

Category identity should include:

* `id`
* `slug`
* `title`
* `parent_id` (nullable)
* `navigation_id`
* `last_scraped_at`

Avoid using page titles for names — prefer `h1`.

---

## 6. Database Design (Supabase / Postgres)

### 6.1 Core Tables

#### navigation

```sql
id
title
slug
last_scraped_at
```

#### category

```sql
id
navigation_id
parent_id
title
slug
last_scraped_at
```

#### product

```sql
id
source_id (UNIQUE)
title
author
isbn
price_value
currency
condition
format
image_url
source_url
availability
rating_avg
reviews_count
last_scraped_at
```

---

### 6.2 Relationships (Very Important)

#### ❌ Wrong

```
product → category (one-to-one)
```

#### ✅ Correct

```
product ↔ category (many-to-many)
```

```sql
product_category
- product_id
- category_id
```

This enables:

* Multiple category listings
* Better recommendations
* Flexible frontend sections

---

### 6.3 Product Details (Optional Split)

```sql
product_detail
product_id (FK)
description
specs (jsonb)
```

Keep large text out of main product table.

---

## 7. Indexing Strategy (Performance)

Required indexes:

* `product(source_id)` UNIQUE
* `product(price_value)`
* `product(condition)`
* `product(format)`
* `product(rating_avg)`
* `product_category(category_id, product_id)`

Optional:

* GIN index on `product_detail.specs`

---

## 8. Caching & Freshness Constraints

### 8.1 Redis (Upstash)

Use Redis for:

* Scrape locks (`SETNX`)
* TTL cache of parsed product JSON
* Job status

Do **not** use Redis as permanent storage.

---

### 8.2 Freshness Rules

| Entity     | TTL      |
| ---------- | -------- |
| Product    | 24 hours |
| Category   | 12 hours |
| Navigation | 7 days   |

Rules:

* Skip scrape if fresh
* Allow forced refresh via API
* Never enqueue duplicate scrape jobs

---

## 9. Ethical & Operational Constraints

* Respect robots.txt
* Limit concurrency (2–3 pages max)
* Random delay between requests
* Abort heavy assets (images, fonts)
* Implement retries with exponential backoff
* Persist scrape failures for observability

---

## 10. Frontend Enablement (Why This Matters)

With this design, the frontend can:

* Filter by price, format, condition
* Sort reliably
* Build category sections
* Show recommendations
* Refresh data safely

Without schema normalization → frontend complexity explodes.

---

## 11. Final Take

Your current scraper is **functional but heuristic-driven**.
To make it **frontend-grade**, you must:

1. Normalize data (numbers, enums, IDs)
2. Strengthen product identity
3. Restructure relationships
4. Treat scraping as ingestion, not crawling

This moves the system from **“works”** to **“scales & survives review.”**

---

If you want next:

* I can **rewrite only the product scraping block** cleanly
* Or design **exact API responses for frontend filters**
* Or map this directly to **React Query + filter UX**

Just tell me where to go next.
