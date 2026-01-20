# Product Strategy — MedAlpha Connect


## 1. Market Context & Problem
- Current healthcare fragmentation: Booking, telemedicine, and prescriptions are split across multiple apps/providers; no unified solution.
- User pain points: Multiple apps; complex e-prescription redemption; time pressure and scheduling friction.
- Retail partner limitations: Lack a branded healthcare touchpoint; need white-label deployment.
- Why now: E-prescription mandatory since Jan 2024; CardLink approved Mar 2024 for NFC; ePA auto-rollout since Jan 2025 with 80% utilization target by 2026; infrastructure readiness is high.

## 2. Vision & Product North Star
- Vision statement: Smartphone app for MedAlpha retail partner projects enabling booking and prescription redemption through integrated services; a trusted, accessible companion.
- What success looks like: Leading white-label healthcare app for retail partners in Germany; high engagement and transaction volume; rapid deployment with minimal customization; scalable multi-tenant platform on a single release cycle.
- Guiding ambition: The neutral healthcare gateway for retail partners.

## 3. Target Users
- Primary users: German residents with public or private insurance seeking convenient digital healthcare access; patients on mobile app.
- Secondary users: Customers of MedAlpha retail partners (white-label deployments); CMS admins managing content.
- Core needs & behaviors: Convenience, time savings, unified digital experience; tech-comfortable adults (25-55); trust, clarity, accessibility.

## 4. Jobs to Be Done
- Functional jobs: Book a doctor appointment quickly; redeem prescriptions (online/offline); access telemedicine.
- Emotional jobs: Feel in control of healthcare; reduce stress around medical tasks.
- Aspirational outcomes: Live a healthier life with easy access to care.

## 5. Solution Overview
- High-level product concept: Unified healthcare service aggregator (appointments, telemedicine, prescription redemption) built for white-label deployment.
- Core pillars: Appointment booking (Curaay); Telemedicine (Teleclinic); Prescription redemption online (Cardlink → Apo Group) and offline (pharmacy search); CMS-driven home; profile gating; history; notifications.
- Partner integrations (conceptual): Curaay, Teleclinic, Cardlink, Apo Group, Google Maps, FCM/APNs; SSO partner handoff planned.

## 6. Key User Journeys
- Appointment booking flow: Complete profile → select in-person appointment → book via Curaay with binding confirmation → stored in history → post-appointment follow-up after 60 minutes.
- Telemedicine → prescription flow: Complete profile → enter Teleclinic WebView → consult → receive push prompt to redeem prescription → choose online/offline before redemption.
- Online vs offline pharmacy choice: User presented with mandatory neutral choice → Online: NFC eGK scan via Cardlink → Apo Group fulfillment; Offline: location-based pharmacy search.

## 7. Differentiation & Competitive Landscape
- Competitor snapshot: Doctolib (appointments); Jameda (appointments); TeleClinic (telemedicine, owned by DocMorris); DocMorris/Shop Apotheke (online pharmacy); insurance apps (member-only).
- Where existing solutions fall short: Single-function focus; closed ecosystems; no white-label multi-tenant; member-locked insurance apps; lack neutral online/offline choice.
- Why this approach wins: Unified platform across booking/telemedicine/prescriptions; white-label B2B2C distribution; neutral pharmacy choice (legal-compliant); SSO-ready.

## 8. Business Value
- Value for users: One app to book appointments, consult via video, and redeem prescriptions online or at nearby pharmacies.
- Value for retail partners: Fully white-labeled healthcare app creating a branded touchpoint without development effort.
- Value for MedAlpha: Establish leading white-label healthcare app; drive engagement/transactions; revenue via partner commissions; scalable multi-tenant platform.

## 9. Scope & Design Principles
- MVP scope: CMS-driven home; registration/profile/settings; appointment booking (Curaay); telemedicine (Teleclinic WebView); prescription redemption online (Cardlink + Apo Group) and offline (pharmacy search); history; static pages (FAQ, Support, Privacy Policy, Legal Disclosure); push notifications and post-appointment follow-up.
- Out-of-scope items: Cannabis-related projects.
- Non-negotiable principles: White-label parity (identical release cycle); Compliance-first (GDPR/DSGVO, legal online/offline choice); Scalable architecture (multi-tenant, theming via tokens).

## 10. High-Level Roadmap
- Phase 1: MVP — Core booking, telemedicine, prescription redemption; CMS home/static content; history; notifications; profile gating.
- Phase 2: Expansion & optimization — Implement SSO partner handoff; refine white-label theming/CMS operations; integration optimization.
- Phase 3: Partner scale — Multi-partner rollout at scale on single codebase/release cycle.

## 11. Risks & Assumptions
- Technical dependencies: Teleclinic integration (DocMorris-owned); Cardlink NFC SDK licensing (GEDISA vs Akquinet); Curaay and Apo Group API/webhook formats.
- Regulatory considerations: GDPR/DSGVO for medical data; mandatory explicit online/offline pharmacy choice; e-prescription compliance.
- Partner alignment risks: Apo Group incentives vs DocMorris; retail partner distribution required; Teleclinic relationship changes.
- Key assumptions to validate: Retail partner distribution reduces CAC and drives adoption; users value unified journey over single-function apps; NFC/eGK readiness sufficient.

## 12. Next Steps & Decisions
- What decisions are needed: SSO protocol choice (OIDC vs SAML); Cardlink SDK provider/licensing; GDPR data storage approach (GKV vs PKV history); white-label configuration storage strategy; multi-language requirements; obtain API documentation (Curaay, Apo Group).
- What happens next: Obtain required partner API documentation; evaluate/select Cardlink SDK; define detailed user stories; begin wireframes/mockups; establish development environment.
- Proposed timeline for discovery/delivery:
