# Phase 7: Contact & Careers - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can submit inquiries and CVs through functional forms. Contact page with form and office locations. Careers page with job listings and CV upload. Separate Partners and Joint Ventures pages. Backend email integration is future work - forms simulate submission for now.

</domain>

<decisions>
## Implementation Decisions

### Contact Form Design
- Card layout with sidebar: form on left, office quick-contact info on right
- Department dropdown options: General, Technical, Careers, Other
- Submission behavior: Simulate for now (no backend) - real SMTP + admin dashboard is future work
- Success state: Inline success message replacing form with animation, stay on page

### Office Locations Display
- Tabbed interface (consistent with footer pattern)
- No default tab - show all three equally (unlike footer which defaults to Basrah)
- Each office shows: phone, email, address, working hours
- Embedded map using MapCN (https://www.mapcn.dev/docs) - not Google Maps
- Phone numbers and emails are clickable (tel: and mailto: links)

### CV Upload & Careers Page
- Dashed border dropzone for drag-and-drop uploads
- Accepted file types: PDF, Word (.doc, .docx), and images (JPG, PNG) for scanned documents
- Maximum file size: 10MB
- Form fields: Name, email, phone only (minimal alongside CV)
- Static job listings displayed as cards grid
- Job card content: title, department, location, employment type, brief description
- Clicking job card opens modal with full details and "Apply" button

### Partners/JV Pages
- Two separate pages: /partners and /joint-ventures
- Partners page: Just SLB for now - logo + description card, ready to add more later
- Joint Ventures page: Kweti with company name, logo, description (basic profile card)

### Claude's Discretion
- Exact form field styling and spacing
- Map pin styling and zoom level
- Job listing placeholder content (titles, descriptions)
- Modal animation and close behavior
- Form validation error message wording
- Upload progress indicator design

</decisions>

<specifics>
## Specific Ideas

- Tabbed interface for offices like the footer - established pattern
- MapCN for maps instead of Google Maps (user specified: https://www.mapcn.dev/docs)
- Job modal should have "Apply" button that scrolls/links to CV form
- Partners/JV pages structured for easy expansion when more partners added

</specifics>

<deferred>
## Deferred Ideas

- SMTP email integration for form submissions - future admin dashboard work
- Admin dashboard for viewing submissions - separate phase
- Dynamic job listings from database - keep static for now

</deferred>

---

*Phase: 07-contact-careers*
*Context gathered: 2026-01-22*
