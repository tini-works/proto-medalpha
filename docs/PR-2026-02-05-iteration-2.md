## Summary
Updated v4 documentation (dot map, IA map, user flows, impact analysis) to align with actual booking flow implementation. Key correction: Acute/Urgent and Prevention/Wellness flows use availability preferences + backend matching instead of direct slot selection.

## Changes
- **docliQ-DOT-MAP.md:** Updated booking flows table to show correct user selection behavior; clarified AVAILABILITY PREFS usage
- **USER-FLOWS-v4.md:** Rewrote J3b (Acute/Urgent) and J3c (Prevention/Wellness) flow steps and Mermaid diagrams
- **INFO-MAP-v4.md:** Updated Key Features, High-Level Structure, Navigation Paths, and route notes
- **IMPACT-ANALYSIS.md:** Updated MODIFIED Elements, Navigation Changes, and Data Model sections
- **Key behavior documented:**
  | Flow | User Selects Doctor? | User Selects Slot? | Uses Matching? |
  |------|---------------------|-------------------|----------------|
  | Follow-up (recent) | Auto | Auto | No |
  | Follow-up (none) | No | No | Yes |
  | Acute/Urgent | No | No | Yes |
  | Prevention/Wellness | Yes | No (Avail Prefs) | Yes |

## Review Focus
- [ ] Verify booking flow descriptions match actual screen navigation in app
- [ ] Check Mermaid diagrams render correctly and show matching flow
- [ ] Confirm AVAILABILITY PREFS object is correctly documented as used in both Acute/Urgent and Prevention/Wellness

## Artifacts
**Code:**
- [docliQ-DOT-MAP.md](https://github.com/tini-works/proto-medalpha/blob/ngan/document/docs/docliQ-DOT-MAP.md)
- [USER-FLOWS-v4.md](https://github.com/tini-works/proto-medalpha/blob/ngan/document/docs/USER-FLOWS-v4.md)
- [INFO-MAP-v4.md](https://github.com/tini-works/proto-medalpha/blob/ngan/document/docs/INFO-MAP-v4.md)
- [IMPACT-ANALYSIS.md](https://github.com/tini-works/proto-medalpha/blob/ngan/document/docs/IMPACT-ANALYSIS.md)

## Testing
- ✅ Cross-referenced booking flows with `BookingTypeScreen.tsx` mapping (lines 41-45)
- ✅ Verified flow terminology matches user-provided implementation comparison screenshot
- ✅ Confirmed all four documents are internally consistent with each other
- ⚠️ Not tested: Actual app navigation (documentation-only change)
