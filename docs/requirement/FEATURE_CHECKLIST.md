# MedAlpha Connect - Feature Checklist

## Home Screen
- [ ] Show app capabilities and key features
- [ ] Home content is CMS-managed (dynamic content slots)

## User Management
- [ ] Registration via email/password
- [ ] Social login option
- [ ] Profile management with completion validation
- [ ] Settings and preferences
- [ ] Future SSO handoff placeholder noted (no flow implemented yet)

## Appointment Booking (Primary)
- [ ] Doctor appointments with Curaay booking UI
- [ ] Booking is binding/confirmed in flow
- [ ] Appointment data synced into app history
- [ ] Telemedicine entry opens Teleclinic in WebView
- [ ] Telemedicine supports e-prescription capability (via Teleclinic UI)

## Prescription Redemption (Secondary)
- [ ] User must explicitly choose "online" or "offline" before redeeming (legal requirement)
- [ ] Online flow supports e-prescription redemption (GKV/PKV)
- [ ] NFC eGK scan flow via Cardlink SDK
- [ ] Online pharmacy order flow integrates with Apo Group (status updates shown)
- [ ] Offline flow includes location-based pharmacy search (Maps)

## History
- [ ] Past prescription redemptions list
- [ ] Appointment bookings list (synced from Curaay)
- [ ] Telemedicine consultations list
- [ ] All history data shown as persisted backend records

## Static Pages
- [ ] FAQ (CMS-managed)
- [ ] Support (CMS-managed)
- [ ] Privacy Policy (Datenschutz)
- [ ] Legal Disclosure (Impressum)

## Push Notifications
- [ ] Promotions/offers
- [ ] Post-appointment follow-up 60 minutes after scheduled end
- [ ] Follow-up includes satisfaction check
- [ ] Follow-up includes prescription redemption prompt
- [ ] Follow-up includes pharmacy recommendation offer

## CMS / Admin Web
- [ ] Admin login (email/password) for CMS
- [ ] Manage Home screen content
- [ ] Manage FAQ content
- [ ] Manage Support content

## Access Control / Gating
- [ ] Appointments gated by completed profile
- [ ] Prescriptions gated by completed profile

## White-Label Support
- [ ] Multiple branded deployments supported
- [ ] Theme tokens loaded at startup (no hardcoded colors/fonts)
- [ ] Identical release cycle for all variants

## Open Questions / Assumptions to Confirm
- [ ] SSO protocol/standard (OIDC, SAML?)
- [ ] Curaay API documentation and webhook format
- [ ] Apo Group API for order status tracking
- [ ] User data storage and GDPR compliance details
- [ ] Multi-language support requirements (DE, EN?)
- [ ] Cardlink SDK licensing (GEDISA vs Akquinet)
- [ ] White-label configuration storage (per-deployment or per-tenant?)
- [ ] Offline mode requirements (beyond pharmacy search)
