## Doctor Details v2 — Germany-Compliant (Booking-Neutral)

> Scope: Doctor Details screen only.  
> Excludes booking CTAs, availability, urgency, or promotional medical claims in accordance with German HWG & Ärztekammer rules.

### Priority Legend
- **P0** — Mandatory for trust, legality, and eligibility
- **P1** — Strongly recommended to reduce rejection & confusion
- **P2** — Confidence & clarity boosters (non-promotional)

---

| Priority | Category | Information Item | Purpose | Status |
|---------|----------|------------------|---------|--------|
| **P0** | Identity | Doctor name & academic title | Legal professional identification | ✅ Present |
| **P0** | Identity | Medical specialty | Eligibility validation | ✅ Present |
| **P0** | Practice | Practice address (street, city, postcode) | Physical verification & legitimacy | ✅ Present |
| **P0** | Insurance | Accepted insurance types (GKV / PKV) | Eligibility filter | ✅ Present |
| **P0** | Language | Spoken languages | Communication fit | ✅ Present |
| **P0** | Trust | Rating (average score) | Neutral social proof | ✅ Present |
| **P0** | Trust | Rating count | Context for score reliability | ✅ Present |
| **P1** | Practice | Practice name | Institutional trust & recognition | ❌ Not present |
| **P1** | Professional | Neutral professional bio | Competence & background | ✅ Present |
| **P1** | Professional | Medical license / chamber reference | Regulatory trust signal | ❌ Not present |
| **P1** | Transparency | Accepting new patients (yes / no) | Expectation management | ❌ Not present |
| **P1** | Insurance | Insurance limitations (if any) | Prevents rejection post-request | ❌ Not present |
| **P1** | Contact | Practice phone number | Offline fallback & reassurance | ❌ Not present |
| **P2** | Reviews | User reviews (non-curated) | Experiential insight | ✅ Present |
| **P2** | Practice | Accessibility info (e.g. wheelchair access) | Inclusion & legal safety | ❌ Not present |
| **P2** | Experience | Years of experience (non-promotional) | Confidence building | ⚠️ Implicit only |
| **P2** | Location | City / region label | Scanability | ✅ Present |
| **P2** | Location | Static map preview | Orientation (non-transactional) | ❌ Not present |
| **P2** | Visual | Doctor or practice photo (neutral) | Familiarity & comfort | ❌ Not present |

---

### Explicitly Excluded (by design & regulation)
- Appointment CTAs (e.g. “Book now”)
- Next available appointment / time slots
- Urgency signals, comparative claims, performance promises
- Pricing information for GKV services

> **Design principle:** Doctor Details informs. Booking happens in a separate, system-driven request flow.
