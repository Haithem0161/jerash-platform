# Feature Landscape

**Domain:** Bilingual Corporate Website for Oil & Gas Services Company (Iraq)
**Researched:** 2026-01-21
**Confidence:** HIGH (verified with multiple industry sources)

## Executive Summary

The oil & gas company website landscape is characterized by **functional but uninspiring** designs. Most competitors focus on content delivery over experience, creating an opportunity for differentiation through modern design and animation. The client's observation that competitor sites are "boring" is industry-accurate.

**Key insight:** The bar for "impressive" in this industry is lower than general web design. Features that would be standard in consumer websites (smooth animations, interactive elements, modern typography) feel exceptional in the industrial B2B context.

---

## Table Stakes

Features users expect. Missing = product feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Homepage with company overview** | First impression; establishes credibility | Medium | Must include hero, mission/vision, value proposition |
| **About Us / Company Profile** | Industry norm; establishes legitimacy | Low | History, leadership, certifications |
| **Services listing with descriptions** | Core value proposition | Medium | 20+ services need clear organization |
| **Contact page with all office locations** | Essential for B2B inquiry | Low | 3 locations (Basrah, Erbil, Baghdad) + form |
| **Mobile responsive design** | 60% of traffic is mobile | Medium | Critical for field workers accessing on-site |
| **SSL/HTTPS** | Industry standard security signal | Low | Non-negotiable for B2B credibility |
| **Clear navigation** | Usability baseline | Low | Bilingual navigation adds complexity |
| **Company logo and branding** | Brand identity | Low | Already have assets |
| **Footer with contact info** | Industry standard | Low | PO Box, email, phone |
| **Page load speed < 3 seconds** | 46% leave after 4 seconds | Medium | Especially important with image gallery |
| **Bilingual toggle (AR/EN)** | Operating in Iraq market | High | RTL support, complete content translation |
| **HSE/Safety section** | Industry-specific requirement | Medium | For Jerash: dedicated page, not just a mention |
| **Partners/Clients showcase** | Trust signal; industry credibility | Low | SLB partnership is significant |

**Critical for Jerash specifically:**
- HSE section is elevated from "nice to have" to "table stakes" per client emphasis
- Bilingual is mandatory for Iraqi market, not optional

---

## Differentiators

Features that set product apart from "boring" competitors. Not expected, but highly valued.

### Visual Experience Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Cinematic hero animations** | Immediate "wow" factor; signals modernity | High | Scroll-triggered, parallax effects |
| **Smooth page transitions** | Polished feel; competitors lack this | Medium | Framer Motion page-level animations |
| **Animated statistics/counters** | Engages visitors; memorable | Low | Years experience, projects completed |
| **Interactive service cards** | Exploration feel vs static lists | Medium | Hover states, expand on click |
| **Image gallery with lightbox** | Showcases 26 field images professionally | Medium | Masonry grid with smooth transitions |
| **Scroll-triggered reveals** | Progressive storytelling | Medium | Elements animate as they enter viewport |
| **Custom cursor effects** | Unique touch | Low | Optional; adds polish |
| **Loading animation** | Brand-first impression | Low | Custom loader with logo |

### Content Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **HSE as "crown jewel" section** | Elevates safety commitment above competitors | High | Dedicated page with rich content, metrics |
| **Interactive service explorer** | Better UX than competitor bullet lists | Medium | Filter/search 20+ services by category |
| **Team/leadership showcase** | Humanizes company; builds trust | Low | Photos, roles, credentials |
| **Project case studies** | Proof of capability | Medium | Optional; content may not exist |
| **Video integration** | Competitors rarely use video | Medium | Hero background or dedicated section |
| **Downloadable resources** | Lead capture opportunity | Low | Company profile PDF, certifications |
| **Interactive office map** | Better than text addresses | Medium | Click locations to see details |

### Technical Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Seamless RTL/LTR switching** | Rare; most bilingual sites are clunky | High | Layout, animations, images all adapt |
| **Fast image optimization** | Better UX than competitors | Medium | Lazy loading, WebP, responsive images |
| **SEO for both languages** | Discoverability in Arabic searches | Medium | hreflang tags, translated meta |
| **Dark mode option** | Modern expectation | Low | Optional but impressive |

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Stock photography** | Industry visitors notice immediately; destroys credibility | Use client's 26 real field images exclusively |
| **Auto-playing audio** | Universally hated; unprofessional | Silent video backgrounds only if any |
| **Intrusive pop-ups on entry** | 96% of B2B researchers bounce | Subtle CTA buttons, no modals on load |
| **Chat bots** | Client didn't request; overkill for company profile | Contact form is sufficient |
| **Blog/news section** | Client explicitly excluded; requires ongoing content | Focus on evergreen company info |
| **E-commerce/booking** | Not applicable to oilfield services | Contact form for inquiries |
| **User accounts/login** | No B2C component | Remove any complexity |
| **Social media feeds** | Client didn't request; often looks neglected | Static social links in footer only |
| **Over-animated everything** | Can feel cheap; performance hit | Strategic animation on key moments only |
| **Complex mega-menus** | Overkill for 6-8 pages | Simple dropdown or single-level nav |
| **Parallax overload** | 2015 trend; can cause motion sickness | Use sparingly, respect reduced-motion preferences |
| **Carousels for services** | Low engagement; users don't click through | Grid layout with filtering |
| **"Click to enter" splash pages** | Outdated; adds friction | Direct to content |
| **Excessive legal disclaimers on homepage** | Clutters experience | Footer or dedicated legal page |
| **PDF-only content** | Poor SEO, bad mobile experience | Web-native content with PDF download option |
| **Autoplay background video** | Performance killer; data usage in Iraq | Use optimized images or on-click video |

---

## Feature Dependencies

```
Navigation System
    |
    v
Language Toggle (AR/EN) -----> All Page Content
    |                              |
    v                              v
RTL/LTR Layout System -------> Page Components
                                   |
                                   v
                              Animation System (Framer Motion)
                                   |
                                   v
                              Image Gallery / Services Grid

Contact Form
    |
    v
Email Notification -----> Backend (Phase 2)
    |
    v
CV Submission -----> File Upload + Database (Phase 2)
```

**Build Order Implications:**
1. **Foundation first:** i18n system, RTL support, navigation
2. **Then layouts:** Page templates that adapt to language direction
3. **Then animations:** Build on stable layouts
4. **Then content pages:** Services, HSE, Gallery
5. **Then forms:** Contact, CV submission (can be frontend-first with backend later)

---

## MVP Recommendation

For MVP (Phase 1), prioritize to create "impressive" first impression:

### Must Build (Table Stakes + Core Differentiators)

1. **Homepage with cinematic hero** - First impression, hero slideshow with animations
2. **Bilingual toggle with full RTL** - Market requirement
3. **Services page with categories** - Core value proposition (20+ services organized)
4. **HSE dedicated page** - Client's crown jewel
5. **Image gallery** - Client emphasized importance (26 images)
6. **Contact page with 3 locations** - Essential B2B functionality
7. **Basic contact form** - Inquiry capture (email notification can be Phase 2)
8. **Responsive design** - Non-negotiable baseline
9. **Smooth page transitions** - Differentiator from "boring" competitors
10. **Partners section** - SLB partnership is credibility signal

### Should Build (High-Impact Differentiators)

11. **Scroll-triggered animations** - Cost-effective wow factor
12. **Animated statistics** - Engaging content presentation
13. **Interactive service cards** - Better than competitor bullet lists
14. **Joint Ventures section** - Client requested (Kweti)
15. **About page with leadership** - Trust building

### Defer to Post-MVP

- **CV submission with file upload** - Requires backend; use mailto: link initially
- **Project case studies** - Content may not exist; complex to build
- **Video integration** - Performance concerns; needs optimization
- **Dark mode** - Nice-to-have polish
- **Interactive office map** - Text addresses work for MVP
- **Downloadable company profile** - Already have PDF; link to it
- **Backend API integration** - Frontend-first approach confirmed

---

## Complexity Estimates

| Feature Category | Complexity | Estimate | Dependencies |
|-----------------|------------|----------|--------------|
| **Bilingual i18n + RTL** | High | 2-3 days | Foundation for all content |
| **Homepage with animations** | High | 2-3 days | i18n, Framer Motion |
| **Services page (20+ items)** | Medium | 1-2 days | i18n, component library |
| **HSE dedicated page** | Medium | 1 day | i18n, layout system |
| **Image gallery (26 images)** | Medium | 1-2 days | Image optimization |
| **Contact page + form** | Low | 0.5-1 day | i18n |
| **Navigation + footer** | Medium | 1 day | i18n, RTL |
| **Careers page** | Low | 0.5 day | i18n |
| **Partners/JV sections** | Low | 0.5 day | i18n |
| **Page transitions** | Medium | 1 day | Framer Motion |
| **Responsive polish** | Medium | 1-2 days | All pages complete |

**Total MVP estimate:** 12-18 days of focused development

---

## Competitive Analysis Summary

Based on research of oil & gas company websites:

### What Competitors Do (Industry Norm)
- Static hero images with basic text
- Bullet-point service lists
- Stock photography mixed with real images
- Basic Bootstrap/template designs
- Functional but uninspiring animations
- HSE buried in footer links or About page
- Simple contact forms
- English-only or poor Arabic implementations

### What Industry Leaders Do (SLB, Halliburton, Baker Hughes)
- Technology showcases with interactive elements
- Video integration (used sparingly)
- Strong sustainability/ESG messaging
- Professional photography
- Custom design systems
- Comprehensive service documentation
- Multiple contact channels

### Jerash Opportunity
- Modern animations will stand out immediately
- HSE prominence shows safety-first culture
- Professional bilingual RTL will impress local clients
- Real field images (26) vs stock photos
- Clean, bold design vs cluttered industry norm

---

## Sources

**Industry Best Practices:**
- [Inclind - Best Oil & Gas Website Designs](https://www.inclind.com/news/best-oil-gas-company-website-designs)
- [Top 5 Considerations for Oil and Gas Website Design 2025](https://www.harlemworldmagazine.com/top-5-considerations-for-oil-and-gas-website-design-and-development-in-2025/)
- [GroupM7 - Oil & Gas Website Design](https://groupm7.com/industries/oil-gas/)

**B2B Industrial Website Standards:**
- [Shopify - Industrial Website Design 2025](https://www.shopify.com/enterprise/blog/industrial-website-design)
- [Windmill Strategy - High-Performing B2B Industrial Websites](https://www.windmillstrategy.com/anatomy-high-performing-b2b-industrial-website/)
- [Trajectory Web Design - B2B Best Practices 2025](https://www.trajectorywebdesign.com/blog/b2b-website-design-best-practices)

**Animation & Modern Design:**
- [DesignRush - Best Animated Websites 2026](https://www.designrush.com/best-designs/websites/trends/best-animated-websites)
- [Squarespace - Web Design Trends 2026](https://pros.squarespace.com/blog/design-trends)
- [TheeDigital - Web Design Trends 2026](https://www.theedigital.com/web-design-trends)

**RTL/Bilingual Design:**
- [Reffine - RTL Website Design Best Practices](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices)
- [Weglot - RTL Web Design Tips](https://www.weglot.com/blog/rtl-web)
- [BrandingBlitz - Arabic-English Bilingual Design](https://brandingblitz.com/blog/arabic-english-bilingual-design)

**HSE & Industry Context:**
- [FAT FINGER - HSE in Oil Industry](https://fatfinger.io/hse-oil-industry/)
- [Global Group - HSE Best Practices Upstream](https://getglobalgroup.com/best-practices-for-healthy-safety-and-environment-hse-in-the-upstream-oil-and-gas-industry/)

**Careers & Contact Pages:**
- [Indeed - Company Careers Pages](https://www.indeed.com/hire/c/info/career-pages)
- [Workable - Careers Page Best Practices](https://resources.workable.com/tutorial/careers-page-best-practices)
- [HubSpot - Best Contact Us Pages](https://blog.hubspot.com/service/best-contact-us-pages)

---

*Research complete. This document provides the feature landscape for roadmap creation.*
