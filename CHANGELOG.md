# Changelog

All notable changes to Lumen BI.

## [Unreleased]
- Add formatters, clipboard hook, and media query hook.
- Add robots.txt, manifest, and sitemap for SEO.
- Add BFF health proxy and API status banner.
- Add schema panel, recent datasets, and chart empty states.
- Add backend timing middleware and expanded health payload.
- Add KPI copy helper and upload meta on dashboard.
- Add sample chip loading state and filename sanitization.
- Add numeric column KPI and five-card KPI grid support.
- Add backend test coverage for health, KPIs, and charts.
- Add Render deploy guide and contributing docs.
- Add SiteFooter with GitHub link on landing page.
- Add CopyButton, Divider, EmptyState, and Skeleton UI primitives.
- Add useLocalStorage hook for client persistence.
- Add recent dataset index in sessionStorage.
- Add checkApiHealth helper on the frontend API client.
- Add shared constants for upload limits and app name.
- Add parser whitespace edge-case test.
- Wire manifest link in Next.js layout metadata.
- Show upload timestamp in dashboard topbar.
- Allow copying dataset ID from dashboard header.
- Integrate KpiSummary row above KPI grid.
- Split data preview and schema into two-column layout.
- Expose API version on backend /health endpoint.
- Track recent uploads whenever saveDataset is called.
- Improve 404 page copy for clearer navigation.
- Wire recent-dataset tracking when saving analysis results.
- Show chart empty states when trend or bar data is unavailable.
- Link PWA manifest from Next.js root layout metadata.
- Add SiteFooter and live API status banner on landing page.
- Add schema panel, recent list, and KPI copy on dashboard.
- Disable sample chips while sample CSV is uploading.
- Add numeric-column KPI and allow five KPI cards in the grid.
- Sanitize uploaded filenames before persisting analysis.
- Add client-side checkApiHealth helper for BFF probe.
- Show upload date and copyable dataset ID in dashboard topbar.
- Improve 404 headline copy for clearer wayfinding.
- Document free Vercel + Render hosting stack in README.
- Clarify ALLOWED_ORIGINS env var for production CORS.
