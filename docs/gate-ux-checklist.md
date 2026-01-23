# Product Designer Checklist

**Purpose:** Tasks and decision points relevant to a product designer for the MedAlpha Connect app.
**Source:** Perplexity research (2026-01)

---

## 1. UX, Usability & Accessibility (Trust + Clarity)

These items directly impact the look, feel, and flow of the interface you design.

| Area | Checklist Item | Relevant Standard |
|------|----------------|-------------------|
| **Accessibility** | Ensure UI elements meet BITV 2.0 (WCAG 2.1 AA) requirements (color contrast, text scaling, touch target sizes) | BITV 2.0, ISO/IEC 40500 |
| **Localization** | Validate UI layouts and text strings in all 14+ languages to prevent overflow or misaligned elements | User need |
| **Clarity** | Use plain language; avoid medical jargon where possible. If jargon is necessary, provide clear inline explanations or glossaries | User need |
| **Consistency** | Apply a consistent design system across the core app and co-branded partner experiences to maintain user trust | ISO 9241-210 |
| **Cognitive Load** | Ensure task flows (e.g., booking an appointment, redeeming a code) are linear and simple, especially for senior users | ISO 9241-210 |

---

## 2. Feature Workflows & Information Architecture (Efficiency)

These items concern the flow of data and how users interact with core functions.

| Area | Checklist Item | Relevant Standard |
|------|----------------|-------------------|
| **E-Prescription** | Design the flow for entering the 16-digit gematik code and selecting a partner pharmacy/delivery option | DiGA Fast-Track |
| **Interoperability** | Design the user flow for granting consent to share data using FHIR standards (e.g., syncing ePA data) | HL7 FHIR |
| **Error Prevention** | Implement clear input validation and confirmation steps for critical actions (e.g., confirming a telemedicine session) | IEC 62366-1 |

---

## 3. Compliance & Security Touchpoints

While engineering handles the implementation, designers must account for UI/UX elements required by law.

| Area | Checklist Item | Relevant Standard |
|------|----------------|-------------------|
| **Data Privacy** | Design transparent consent screens and clear privacy policy access points (GDPR requirements) | GDPR, DiGAV |
| **Certifications** | Ensure necessary legal labels (e.g., CE mark, BfArM/DiGA label) are included in the app's 'About' section or legal footer | MDR, DiGAV |

---

## Why Ethics & Well-being Were Integrated

**Key insight:** Ethics and well-being were not excluded; they are fundamental principles baked into the German regulatory framework. The checklist items represent the enforcement mechanisms for those concepts in a highly regulated market.

### Well-being = Clinical Effectiveness & Safety

In Germany, a digital health app (DiGA) must prove a "positive healthcare effect" (pVE) through a scientific study. This regulatory requirement is the functional definition of "well-being" in this context: the app must demonstrably help people in a safe manner, which is a core ethical principle of medicine. The MDR (Medical Device Regulation) certification process mandates rigorous safety checks.

### Ethics = Transparency & Data Sovereignty

The strict GDPR and BSI security standards enforce the ethical principles of user autonomy, transparency, and data protection. A product designer implements these ethics through:
- Clear consent screens
- Data minimization in the UI
- Providing users control over their data (e.g., the ability to export their ePA data)

---

## Summary

The checklist translates abstract ethical goals into concrete, actionable design requirements mandated by law.

---

## Quick Reference: Standards Mentioned

| Standard | Full Name | Scope |
|----------|-----------|-------|
| BITV 2.0 | Barrierefreie-Informationstechnik-Verordnung | German accessibility regulation |
| WCAG 2.1 AA | Web Content Accessibility Guidelines | International accessibility standard |
| ISO/IEC 40500 | Accessibility standard (same as WCAG 2.0) | International |
| ISO 9241-210 | Ergonomics of human-system interaction | Usability standard |
| DiGA Fast-Track | Digital Health Applications pathway | German health app approval |
| HL7 FHIR | Fast Healthcare Interoperability Resources | Health data exchange standard |
| IEC 62366-1 | Medical devices, usability engineering | Error prevention |
| GDPR | General Data Protection Regulation | EU data privacy |
| DiGAV | Digitale Gesundheitsanwendungen-Verordnung | German digital health app regulation |
| MDR | Medical Device Regulation | EU medical device safety |
| BSI | Bundesamt fur Sicherheit in der Informationstechnik | German IT security authority |
