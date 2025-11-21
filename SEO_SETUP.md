# Rewards Peak SEO Setup & Maintenance Guide

This document outlines the SEO implementation for Rewards Peak, designed to maximize visibility in the US while maintaining global accessibility.

## 1. On-Page SEO

### Metadata
- **Global Metadata (`src/app/layout.tsx`):** Contains the base title template, description, and keywords targeting both US and global audiences. It also includes Open Graph and Twitter card tags.
- **Homepage Metadata (`src/app/page.tsx`):** Specific metadata for the landing page.
- **Dynamic Offer Metadata (`src/app/offer/[id]/page.tsx`):** Automatically generates unique titles and descriptions for each offer page based on the offer name and details.

### Structured Data (JSON-LD)
- **Organization Schema:** Injected in `src/app/layout.tsx`, providing search engines with business details (logo, social links, contact).
- **Offer Schema:** Injected in `src/app/offer/[id]/page.tsx`, describing each offer with schema.org/Offer properties (name, description, image, seller).

## 2. Technical SEO

### Robots.txt (`src/app/robots.ts`)
- Configured to allow crawling of all public pages.
- Disallows sensitive paths like `/admin/`, `/dashboard/settings`, and `/auth/`.
- Points crawlers to the XML sitemap.

### Dynamic Sitemap (`src/app/sitemap.ts`)
- Automatically generates `sitemap.xml` at `https://rewardspeak.com/sitemap.xml`.
- Includes core static routes (e.g., `/join`, `/help`).
- **Dynamic Offers:** Fetches all active offers from the API and adds them to the sitemap automatically. This ensures Google finds new offers as soon as they are available.

## 3. Internationalization
- **Canonical Tags:** Set to `https://rewardspeak.com` to prevent duplicate content issues.
- **Language Tags:** Configured for `en-US` and `x-default` to target US users while serving English speakers globally.

## 4. Maintenance & Automation

### How to Update
- **New Pages:** If you add a new static page (e.g., `/blog`), add its path to the `routes` array in `src/app/sitemap.ts`.
- **New Offers:** No action needed. The sitemap automatically fetches offers from the API.
- **Keywords:** Update the `keywords` array in `src/app/layout.tsx` to target new search terms.

### Monitoring
- **Google Search Console:**
  - Submit your sitemap: `https://rewardspeak.com/sitemap.xml`.
  - Set "International Targeting" to "United States" if you want to prioritize US traffic (optional, as the site is global).
  - Monitor "Coverage" to ensure all offer pages are indexed.

## 5. Off-Page SEO Recommendations

To further boost authority, especially in the US:
- **Backlinks:** Reach out to "make money online" blogs, personal finance forums, and student reward sites for guest posts or reviews.
- **Social Signals:** Share new high-paying offers on Twitter, Facebook, and Reddit (e.g., r/beermoney, r/sidehustle).
- **Local Citations:** If you have a physical US presence, list the business in local directories (Yelp, YellowPages).
