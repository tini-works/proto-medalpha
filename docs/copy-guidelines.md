# Copy & Tone Guidelines

**Version:** 1.0.0  
**Last Updated:** 2026-01-16  
**Languages:** German (primary), English (secondary)

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `design-tokens.json` | Machine-readable token VALUES |
| `visual-guidelines.md` | Design philosophy and RATIONALE |
| `design-system-rules.md` | Implementation PATTERNS |

---

## 1. Positioning Context

**Product:** MedAlpha Connect, a healthcare app by dm-drogerie markt offering appointment booking, telemedicine, and prescription redemption.

**Brand promise:** "Your trusted healthcare companion. Simple, reliable, always there."

**Core values:**
- **Trustworthy:** Professional, credible, secure
- **Accessible:** Clear for all ages and digital skill levels
- **Efficient:** Respects users' time
- **Caring:** Supportive without being patronizing

---

## 2. Tone Rules

### 2a. Professional, Not Clinical

**The balance:** Sound like a knowledgeable healthcare professional, not a cold medical system.

| ❌ Too clinical | ❌ Too casual | ✅ Right tone |
|-----------------|---------------|---------------|
| "Appointment request submitted for processing" | "Awesome! You're all booked!" | "Termin bestätigt" / "Appointment confirmed" |
| "Authentication credentials required" | "Pop in your login deets" | "Bitte anmelden" / "Please sign in" |
| "Prescription retrieval initiated" | "Getting your meds now!" | "Rezept wird abgerufen" / "Retrieving prescription" |

### 2b. Clear Over Clever

**Priority:** Clarity > personality. Healthcare information must be unambiguous.

| ❌ Avoid | ✅ Use |
|----------|--------|
| "Your health journey starts here" | "Termin buchen" / "Book appointment" |
| "Let's get you feeling better!" | "Wählen Sie einen Arzt" / "Select a doctor" |
| "Oops! Something went wrong" | "Verbindungsfehler. Bitte erneut versuchen." / "Connection error. Please try again." |

### 2c. Respectful of All Users

**Remember the personas:** Helga (68) needs straightforward language. Elena (23) can handle modern phrasing but still needs clarity.

**Rules:**
- No slang or trendy expressions.
- No abbreviations without explanation (first use: "Gesundheitskarte (eGK)").
- No assumptions about technical knowledge.
- No ageist language (avoid implying something is "easy" or "simple").

### 2d. Reassuring Without Overpromising

**Healthcare context requires precision.**

| ❌ Overpromising | ✅ Accurate |
|------------------|-------------|
| "Your prescription will arrive tomorrow" | "Voraussichtliche Lieferung: 1-2 Werktage" / "Estimated delivery: 1-2 business days" |
| "The doctor will call you now" | "Der Arzt meldet sich in Kürze" / "The doctor will be with you shortly" |
| "100% secure" | "Ihre Daten sind verschlüsselt und geschützt" / "Your data is encrypted and protected" |

---

## 3. Voice Characteristics

| Characteristic | Expression |
|---------------|------------|
| **Confident** | State information directly. "Termin bestätigt" not "Ihr Termin wurde erfolgreich gebucht" |
| **Calm** | No urgency unless necessary. Avoid exclamation marks. |
| **Helpful** | Offer next steps. "Termin bestätigt. In Kalender speichern?" |
| **Human** | Use "Sie" (formal you) consistently. Address the user directly. |

---

## 4. German Language Rules

### 4a. Formal Address (Sie)

**Always use formal "Sie" address.** This is a healthcare app, not a social platform.

| ❌ Informal | ✅ Formal |
|-------------|-----------|
| "Dein Termin" | "Ihr Termin" |
| "Wähle einen Arzt" | "Wählen Sie einen Arzt" |
| "Hast du Fragen?" | "Haben Sie Fragen?" |

### 4b. Clarity Over Brevity

German sentences can be longer than English. Prioritize clarity.

| ❌ Too abbreviated | ✅ Clear |
|--------------------|----------|
| "Rx scannen" | "Rezept mit NFC scannen" |
| "Termin wählen" | "Datum und Uhrzeit wählen" |
| "Bestätigen?" | "Termin verbindlich buchen?" |

### 4c. Medical Terminology

**Use official German medical terms, then explain if needed.**

| Term | Usage |
|------|-------|
| Gesundheitskarte | Use "Gesundheitskarte" or "eGK" (elektronische Gesundheitskarte) |
| E-Rezept | "E-Rezept" (established term for electronic prescription) |
| Videosprechstunde | Preferred over "Telemedicine" or "Video-Konsultation" |
| GKV / PKV | "Gesetzliche/Private Krankenversicherung" on first use |

### 4d. Common Healthcare Phrases

| Context | German | English equivalent |
|---------|--------|-------------------|
| Book appointment | "Termin buchen" | Book appointment |
| Cancel | "Termin stornieren" | Cancel appointment |
| Reschedule | "Termin verschieben" | Reschedule |
| Doctor | "Arzt" / "Ärztin" | Doctor |
| Prescription | "Rezept" | Prescription |
| Pharmacy | "Apotheke" | Pharmacy |
| Health insurance | "Krankenversicherung" | Health insurance |

---

## 5. English Language Rules

### 5a. Consistent American English

Use American English spelling and conventions.

| ❌ British | ✅ American |
|------------|-------------|
| Colour | Color |
| Organisation | Organization |
| Centre | Center |

### 5b. Match German Formality

English should feel equally professional.

| ❌ Too casual | ✅ Professional |
|---------------|-----------------|
| "Hey there!" | "Welcome" |
| "You're all set!" | "Appointment confirmed" |
| "Oops!" | "Error" |

---

## 6. Copy Style

### 6a. Short, Direct, Active

- Use active voice.
- Keep sentences under 15 words where possible.
- One idea per sentence.
- Lead with the action verb.

| ❌ Passive/long | ✅ Active/short |
|-----------------|-----------------|
| "Your appointment has been successfully booked by our system" | "Termin bestätigt" |
| "The prescription you requested is now being processed" | "Rezept wird verarbeitet" |
| "You will need to select a date before continuing" | "Datum wählen" |

### 6b. Hierarchy in Multi-Step Flows

For Helga and other users needing guidance, structure information clearly.

```
Step 1 of 3: Datum wählen
[Primary action]

Nächster Schritt: Uhrzeit wählen
```

### 6c. Error Messages

**Format:** What happened + What to do

| ❌ Vague | ✅ Actionable |
|----------|---------------|
| "Error" | "Verbindung fehlgeschlagen. Bitte Internetverbindung prüfen." |
| "Something went wrong" | "Gesundheitskarte nicht erkannt. Karte erneut auflegen." |
| "Try again later" | "Dienst vorübergehend nicht verfügbar. In 5 Minuten erneut versuchen." |

---

## 7. UI Microcopy Examples

### 7a. Button Labels

Use verb + object. Avoid generic labels.

| Context | German | English |
|---------|--------|---------|
| Primary CTA | "Termin buchen" | "Book Appointment" |
| Confirm | "Bestätigen" | "Confirm" |
| Cancel | "Abbrechen" | "Cancel" |
| Delete | "Löschen" | "Delete" |
| Save | "Speichern" | "Save" |
| Continue | "Weiter" | "Continue" |
| Back | "Zurück" | "Back" |
| Retry | "Erneut versuchen" | "Try Again" |
| Done | "Fertig" | "Done" |
| Close | "Schließen" | "Close" |

### 7b. Empty States

**Format:** Brief statement + Action

| Screen | German | English |
|--------|--------|---------|
| No appointments | "Keine Termine. Termin buchen?" | "No appointments. Book one?" |
| No prescriptions | "Keine Rezepte vorhanden" | "No prescriptions available" |
| No history | "Noch keine Aktivität" | "No activity yet" |

### 7c. Success Messages

| Action | German | English |
|--------|--------|---------|
| Appointment booked | "Termin bestätigt" | "Appointment confirmed" |
| Prescription ordered | "Rezept bestellt" | "Prescription ordered" |
| Profile updated | "Profil aktualisiert" | "Profile updated" |
| Settings saved | "Einstellungen gespeichert" | "Settings saved" |

### 7d. Error Messages

| Error type | German | English |
|------------|--------|---------|
| Network | "Keine Internetverbindung" | "No internet connection" |
| Server | "Dienst nicht verfügbar. Bitte später erneut versuchen." | "Service unavailable. Please try again later." |
| Validation | "Bitte füllen Sie alle Pflichtfelder aus" | "Please complete all required fields" |
| NFC fail | "Karte nicht erkannt. Bitte erneut versuchen." | "Card not detected. Please try again." |
| Session expired | "Sitzung abgelaufen. Bitte erneut anmelden." | "Session expired. Please sign in again." |

---

## 8. Notification Copy

### 8a. Push Notification Format

**Format:** [Action/Update] + [Relevant detail]

| Type | German | English |
|------|--------|---------|
| Appointment reminder | "Termin morgen um 14:30 bei Dr. Müller" | "Appointment tomorrow at 2:30 PM with Dr. Müller" |
| Prescription ready | "Neues Rezept verfügbar" | "New prescription available" |
| Post-appointment | "Wie war Ihr Termin? Rezept einlösen?" | "How was your appointment? Redeem a prescription?" |
| Delivery update | "Ihre Bestellung ist unterwegs" | "Your order is on its way" |

### 8b. In-App Toast Messages

**Keep under 5 words. Include undo where applicable.**

| Action | German | English |
|--------|--------|---------|
| Item deleted | "Gelöscht" [Rückgängig] | "Deleted" [Undo] |
| Item saved | "Gespeichert" | "Saved" |
| Copied | "Kopiert" | "Copied" |
| Added to calendar | "Zum Kalender hinzugefügt" | "Added to calendar" |

---

## 9. Sensitive Topic Guidelines

### 9a. Privacy-Conscious Language

For users like Elena ordering sensitive medications:

| ❌ Explicit | ✅ Discreet |
|-------------|-------------|
| "Birth control pills ordered" | "Rezept bestellt" |
| "Acne medication" | "Medikament" |

**In history and notifications, use generic terms unless user is in private context.**

### 9b. Health Condition References

Never assume or label the user's condition.

| ❌ Assumptive | ✅ Neutral |
|---------------|-----------|
| "For your diabetes medication" | "Für Ihr Rezept" |
| "Your chronic condition" | "Ihre regelmäßigen Medikamente" |

### 9c. Insurance Information

Present insurance options neutrally. GKV and PKV users should feel equally supported.

| ❌ Biased | ✅ Neutral |
|-----------|-----------|
| "Standard insurance" | "Gesetzliche Versicherung (GKV)" |
| "Premium insurance" | "Private Versicherung (PKV)" |

---

## 10. i18n Patterns

### 10a. Interpolation Syntax

Use `{{variable}}` for dynamic values.

```json
// de.json
"appointment.confirmation": "Ihr Termin am {{date}} um {{time}} bei {{doctor}} wurde bestätigt."

// en.json
"appointment.confirmation": "Your appointment on {{date}} at {{time}} with {{doctor}} has been confirmed."
```

### 10b. Date and Time Formatting

| Format | German | English |
|--------|--------|---------|
| Date | 16.01.2026 | January 16, 2026 |
| Time | 14:30 Uhr | 2:30 PM |
| Duration | 30 Min. | 30 min |

### 10c. Plural Handling

German and English have different plural rules.

```json
// de.json
"appointments.count_one": "{{count}} Termin",
"appointments.count_other": "{{count}} Termine"

// en.json
"appointments.count_one": "{{count}} appointment",
"appointments.count_other": "{{count}} appointments"
```

### 10d. ARIA Labels

All ARIA labels must be translated.

```json
// de.json
"aria.closeDialog": "Dialog schließen",
"aria.openMenu": "Menü öffnen",
"aria.selectDate": "Datum auswählen",
"aria.bookAppointment": "Termin buchen"

// en.json
"aria.closeDialog": "Close dialog",
"aria.openMenu": "Open menu",
"aria.selectDate": "Select date",
"aria.bookAppointment": "Book appointment"
```

---

## 11. Persona-Specific Adjustments

### 11a. Helga (68) - Clarity First

- Always show step numbers in flows: "Schritt 1 von 3"
- Confirmation dialogs should be explicit: "Termin verbindlich buchen?"
- Error messages should include specific recovery steps.
- Avoid idioms or figures of speech.

### 11b. Thomas (51) - Transparency

- Show prices and costs clearly.
- Confirmation messages should be complete: "Termin bestätigt. Kostenlos mit Ihrer GKV."
- No marketing language in functional flows.

### 11c. Sarah (34) - Efficiency

- Minimize words in flows she'll repeat often.
- Support quick-scan: key info first.
- Family context where relevant: "Termin für [Kind's Name]"

### 11d. Marc (42) - Precision

- Use specific times and durations.
- Data-forward confirmations: "Termin: 15.01., 09:00, Dr. Müller, Allgemeinmedizin"
- No fluff, no marketing.

### 11e. Elena (23) - Modern but Clear

- Modern phrasing acceptable, but not slang.
- Privacy messaging: "Diskrete Lieferung" / "Discreet delivery"
- Can handle more compact layouts.

---

## 12. Anti-Patterns

### 12a. Never Use

| Pattern | Why |
|---------|-----|
| Exclamation marks (except true emergencies) | Feels unprofessional, creates false urgency |
| Marketing superlatives ("best", "amazing", "incredible") | Erodes trust in healthcare context |
| Emojis | Unprofessional for healthcare |
| Slang or colloquialisms | Excludes older users, reduces clarity |
| Passive aggressive ("As mentioned before...") | Unprofessional |
| Uncertainty ("maybe", "might", "possibly") in confirmations | Erodes trust |

### 12b. Avoid Unless Necessary

| Pattern | When acceptable |
|---------|-----------------|
| Abbreviations | Only established ones (GKV, PKV, eGK) with first-use explanation |
| Technical terms | Only when official (E-Rezept, NFC) with context |
| English words in German text | Only when German equivalent is awkward or unknown |

---

## 13. Writing Checklist

Before finalizing any copy, verify:

- [ ] Is this in formal German (Sie)?
- [ ] Is the message under 15 words?
- [ ] Is it action-oriented (starts with verb)?
- [ ] Would Helga understand it immediately?
- [ ] Is it free of marketing language?
- [ ] Does it include next steps (where applicable)?
- [ ] Is there an English translation?
- [ ] Are interpolation variables correct?

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-16 | Initial release for MedAlpha Connect |
