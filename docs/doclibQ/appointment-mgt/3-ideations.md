---
name: prototype-gated:3-ideations
source_framing: docs/doclibQ/appointment-mgt/2-framing.md
source_scope: 'docs/doclibQ/appointment-mgt/scope-for-exoloration (N).md'
hypothesis: Framing A - Increase User Engagement & Retention
platform: Mobile App (React Native / Expo)
created: 2026-01-30
updated: 2026-01-30
---

# Step: IDEATIONS - Mobile-First

```
┌─────────────────────────────────────────────────────────────────┐
│ IDEATIONS (Mobile-First)         Status: ✅ COMPLETE            │
├─────────────────────────────────────────────────────────────────┤
│ 📱 PLATFORM CONSTRAINTS                                         │
│ • Screen: 320-414px width (mobile-first, not tablet)            │
│ • Navigation: Bottom tab bar (fixed, 5 items max)               │
│ • Input: Thumb-friendly tap targets (44px minimum)              │
│ • Scroll: Vertical primary, horizontal sparingly                │
│ • Performance: <3s load, 60fps animations                       │
│ • Context: One primary action per screen                        │
│ • Interruptions: Push notifications, deep links                 │
├─────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                      │
│ Hypothesis: IF we implement user engagement features (favorites │
│ storage with last 5 doctors, push notification reminders at     │
│ 24h/72h before appointments, and automatic post-appointment     │
│ feedback request 1h after visit), THEN user retention rate will │
│ increase and repeat bookings will increase, FOR primary users   │
│ (Sarah, Marc, families), BECAUSE the app becomes a persistent   │
│ relationship tool rather than a one-time transaction.           │
│                                                                 │
│ IA: Mobile-native booking with 3 paths. Home shows single       │
│ upcoming appointment + quick actions. Bottom nav: Home,         │
│ Booking, History, Notifications, Settings.                      │
│                                                                 │
│ User Flow: App Launch → Home → Booking (wizard steps) →         │
│ Confirmation → Push notification engagement. Deep links from    │
│ notifications to specific screens.                              │
├─────────────────────────────────────────────────────────────────┤
│ 💡 SOLUTION APPROACHES (5)                                      │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ A: ENGAGEMENT HUB (Dashboard-Centric) ⚠️ WEB-CENTRIC        │ │
│ │                                                             │ │
│ │ 📝 Core concept                                             │ │
│ │ Transform the home dashboard into a persistent engagement   │ │
│ │ hub where favorites, reminders, and feedback are central    │ │
│ │ features rather than buried in settings or booking flows.   │ │
│ │                                                                 │
│ │ ⚠️ MOBILE ADAPTATION REQUIRED:                                │ │
│ │ Netflix/Spotify model assumes large screen + passive        │ │
│ │ browsing. Mobile equivalent needs vertical scrolling,       │ │
│ │ card-based layout, and progressive disclosure.              │ │
│ │                                                             │ │
│ │ 🌍 Cross-domain inspiration                                 │ │
│ │ Domain: Streaming / Entertainment (Netflix, Spotify)        │ │
│ │ Example: Netflix "Continue Watching" and personalized       │ │
│ │ recommendations on home screen                              │ │
│ │ Pattern to steal: Surface personalized content and quick    │ │
│ │ actions immediately upon app open to drive return visits    │ │
│ │ ⚠️ Mobile adaptation: Instagram Stories-style vertical      │ │
│ │   cards, not horizontal carousel                            │ │
│ │                                                             │ │
│ │ ⚙️ How it works (Mobile-Adapted)                             │ │
│ │ • Home screen: Single upcoming appointment card (peek)      │ │
│ │ • Tap to expand: Show full appointment + quick actions      │ │
│ │ • "My Doctors" vertical list (3 doctors max), tap for more  │ │
│ │ • Floating action button (FAB) for quick booking            │ │
│ │ • Feedback as badge on History tab (not home overlay)       │ │
│ │ • Reminder toggle in appointment detail (not home widget)   │ │
│ │ • Bottom sheet for settings (swipe up from tab bar)         │ │
│ │                                                             │ │
│ │ ⚖️ Trade-offs                                                │ │
│ │ ┌─────────────────────┬─────────────────────┐               │ │
│ │ │ ✅ Pros             │ ⚠️ Cons              │               │ │
│ │ ├─────────────────────┼─────────────────────┤               │ │
│ │ │ • High visibility   │ • Cluttered home    │               │ │
│ │ │ • Drives retention  │ • Requires scroll   │               │ │
│ │ │ • Quick rebooking   │ • Performance risk  │               │ │
│ │ │ • Netflix proven    │ • May overwhelm on  │               │ │
│ │ │ • One-tap actions   │   small screens     │               │ │
│ │ └─────────────────────┴─────────────────────┘               │ │
│ │                                                             │ │
│ │ 👤 Best suited for: Tablet users (secondary focus)          │ │
│ │ ⚠️ Not recommended for mobile-first approach                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ B: PROGRESSIVE DISCLOSURE (Contextual) ⭐ MOBILE-NATIVE      │ │
│ │                                                             │ │
│ │ 📝 Core concept                                             │ │
│ │ Engagement features appear contextually at the exact moment │ │
│ │ they are needed, rather than all at once on home. Favorites │ │
│ │ offered after booking, reminders suggested at confirmation, │ │
│ │ feedback triggered post-appointment. Reduces cognitive load.│ │
│ │                                                                 │
│ │ ✅ MOBILE-OPTIMAL: Matches native iOS/Android patterns      │ │
│ │ • Toasts and snackbars = standard mobile feedback           │ │
│ │ • Inline toggles = native settings pattern                  │ │
│ │ • Push notifications = mobile-native engagement             │ │
│ │ • Progressive disclosure = respects limited attention       │ │
│ │                                                             │ │
│ │ ⚙️ How it works (Mobile-Native)                              │ │
│ │ • After booking success: Bottom sheet "Add to favorites?"   │ │
│ │ • At confirmation: Inline toggle "Remind me 24h/72h before" │ │
│ │ • 1h post-appointment: Rich push notification with actions  │ │
│ │   [Rate] [Remind me later] [Dismiss]                        │ │
│ │ • "My Doctors" in booking flow (before specialty search)    │ │
│ │ • Reminder toggle per-appointment (detail screen)           │ │
│ │ • Feedback badge on History tab (red dot + count)           │ │
│ │ • Deep links from push → specific screens (not just home)   │ │
│ │                                                             │ │
│ │ 📱 Mobile UX Details:                                       │ │
│ │ • Bottom sheets (not modals) for contextual actions         │ │
│ │ • Swipe gestures for dismiss/undo                           │ │
│ │ • Haptic feedback on favorite add/remove                    │ │
│ │ • Skeleton loaders during async operations                  │ │
│ │ • Pull-to-refresh on appointment lists                      │ │
│ │                                                             │ │
│ │ ⚖️ Trade-offs                                                │ │
│ │ ┌─────────────────────┬─────────────────────┐               │ │
│ │ │ ✅ Pros             │ ⚠️ Cons              │               │ │
│ │ ├─────────────────────┼─────────────────────┤               │ │
│ │ │ • Native mobile UX  │ • Lower discover-   │               │ │
│ │ │ • Low cognitive     │   ability (mitigate │               │ │
│ │ │   load              │   with onboarding)  │               │ │
│ │ │ • Elderly-friendly  │ • Requires push     │               │ │
│ │ │ • GDPR-aligned      │   notification setup│               │ │
│ │ │ • Right-time UX     │ • Harder to measure │               │ │
│ │ │ • Simple home       │   engagement        │               │ │
│ │ │ • Fast performance  │                     │               │ │
│ │ │ • One-action/screen │                     │               │ │
│ │ └─────────────────────┴─────────────────────┘               │ │
│ │                                                             │ │
│ │ 👤 Best suited for: All mobile users (universal pattern)    │ │
│ │ ⭐ RECOMMENDED for mobile-first approach                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ C: GAMIFICATION LAYER (Habit Formation) 🎮 MOBILE-ADAPTED   │ │
│ │                                                             │ │
│ │ 📝 Core concept                                             │ │
│ │ Add subtle gamification to drive repeat engagement: streaks │ │
│ │ for consecutive bookings, badges for feedback completion,   │ │
│ │ and visible "health journey" progress. Leverages behavioral │ │
│ │ psychology to create habit loops beyond appointments.       │ │
│ │                                                                 │
│ │ 📱 MOBILE ADAPTATION:                                       │ │
│ │ Duolingo/Strava work on mobile because:                     │ │
│ │ • Visual progress fits small screens (badges, counters)     │ │
│ │ • Push notifications replace dashboard widgets              │ │
│ │ • One-tap actions (check-in, log activity)                  │ │
│ │ • Social features optional (not primary screen)             │ │
│ │                                                             │ │
│ │ 🌍 Cross-domain inspiration                                 │ │
│ │ Domain: Fitness / Health (Duolingo, Strava)                 │ │
│ │ Example: Duolingo's daily streaks and push notification     │ │
│ │ Pattern to steal: Visible progress + daily streaks create   │ │
│ │   habit formation and fear of breaking the chain            │ │
│ │                                                             │ │
│ │ ⚙️ How it works (Mobile-Adapted)                             │ │
│ │ • Profile tab shows "Health Streak" badge (small, subtle)   │ │
│ │ • Badges as unlockable achievements (not upfront)           │ │
│ │ • Progress: Simple counter + circular progress (not bar)    │ │
│ │ • Streak recovery: One-tap "Restore" in push notification   │ │
│ │ • Weekly push: "3 days to keep your streak!" [Book Now]     │ │
│ │ • Social proof: Inline in booking flow (not separate screen)│ │
│ │                                                             │ │
│ │ 📱 Mobile UX Constraints:                                   │ │
│ │ • Gamification secondary (Profile tab, not home)            │ │
│ │ • One badge per screen max (avoid clutter)                  │ │
│ │ • Push notifications = primary engagement driver            │ │
│ │ • No leaderboards (privacy concerns + screen space)         │ │
│ │ • Simple animations (Lottie, not complex)                   │ │
│ │                                                             │ │
│ │ ⚖️ Trade-offs                                                │ │
│ │ ┌─────────────────────┬─────────────────────┐               │ │
│ │ │ ✅ Pros             │ ⚠️ Cons              │               │ │
│ │ ├─────────────────────┼─────────────────────┤               │ │
│ │ │ • High retention    │ • Risk of annoyance │               │ │
│ │ │ • Proven mobile     │ • GDPR complexity   │               │ │
│ │ │ • Push-friendly     │ • Elderly resistance│               │ │
│ │ │ • Differentiation   │ • Development cost  │               │ │
│ │ │ • Fits small screens│ • May feel gimmicky │               │ │
│ │ └─────────────────────┴─────────────────────┘               │ │
│ │                                                             │ │
│ │ 👤 Best suited for: Young professionals (Marc, Elena)       │ │
│ │ 🎮 Layer on top of Approach B (not standalone)              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ D: INTELLIGENT AUTOMATION (Zero-Input) 🤖 MOBILE-COMPATIBLE │ │
│ │                                                             │ │
│ │ 📝 Core concept                                             │ │
│ │ Minimize user input by making smart defaults: automatically │ │
│ │ add every booked doctor to favorites, enable all reminders  │ │
│ │ by default, and send feedback request without opt-in. Users │ │
│ │ opt-out rather than opt-in, reducing friction to zero.      │ │
│ │                                                                 │
│ │ 📱 MOBILE ADAPTATION:                                       │ │
│ │ Mobile is PERFECT for zero-input because:                   │ │
│ │ • Limited screen space = fewer settings to manage           │ │
│ │ • Push notifications = primary engagement (no UI needed)    │ │
│ │ • Settings buried in app = users accept defaults            │ │
│ │ • One-tap opt-out = standard mobile pattern                 │ │
│ │                                                             │ │
│ │ 🌍 Cross-domain inspiration                                 │ │
│ │ Domain: Productivity / SaaS (Superhuman, Notion)            │ │
│ │ Example: Superhuman's "auto-advance" and smart defaults     │ │
│ │ Pattern to steal: Aggressive defaults that respect power    │ │
│ │   users while helping beginners; clear opt-out paths        │ │
│ │                                                             │ │
│ │ ⚙️ How it works (Mobile-Optimized)                           │ │
│ │ • Auto-add every doctor to "My Doctors" (last 5 by date)    │ │
│ │ • Reminders: Auto-enable, user gets push (no pre-approval)  │ │
│ │ • Feedback: Rich push 1h post-visit [Rate] [Dismiss]        │ │
│ │ • Settings: "Notification Preferences" in Settings tab      │ │
│ │   (toggle all on/off, not granular per-appointment)         │ │
│ │ • Smart backoff: If user dismisses 3x, auto-disable         │ │
│ │ • Panic button: "Stop all notifications" in push itself     │ │
│ │                                                             │ │
│ │ 📱 Mobile UX Details:                                       │ │
│ │ • No onboarding friction (defaults applied immediately)     │ │
│ │ • First push includes "You're getting reminders because..." │ │
│ │ • Swipe left on push = quick disable                        │ │
│ │ • Settings requires 2 taps (Tab → Toggle) = friction        │ │
│ │ • Analytics: Track opt-out rate as health metric            │ │
│ │                                                             │ │
│ │ ⚖️ Trade-offs                                                │ │
│ │ ┌─────────────────────┬─────────────────────┐               │ │
│ │ │ ✅ Pros             │ ⚠️ Cons              │               │ │
│ │ ├─────────────────────┼─────────────────────┤               │ │
│ │ │ • Zero UI clutter   │ • GDPR risk (Art 7) │               │ │
│ │ │ • Fastest mobile UX │ • Privacy backlash  │               │ │
│ │ │ • Push-native       │ • Unsubscribe rates │               │ │
│ │ │ • Minimal dev time  │ • Legal compliance  │               │ │
│ │ │ • High opt-out if   │ • Harder to undo on │               │ │
│ │ │   misconfigured     │   mobile            │               │ │
│ │ └─────────────────────┴─────────────────────┘               │ │
│ │                                                             │ │
│ │ 👤 Best suited for: Power users (Marc, tech-savvy)          │ │
│ │ ⚠️ Requires legal review before implementation              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ E: FAMILY-CENTRIC (Household View) 👨‍👩‍👧 MOBILE-NICHE        │ │
│ │                                                             │ │
│ │ 📝 Core concept                                             │ │
│ │ Pivot to family-as-primary-unit: shared favorites across    │ │
│ │ household, consolidated reminders for all family members,   │ │
│ │ and batch feedback collection. Leverages existing dependent │ │
│ │ booking (75% coverage) as foundation for engagement.        │ │
│ │                                                                 │
│ │ 📱 MOBILE ADAPTATION:                                       │ │
│ │ Family features on mobile require careful UX:               │ │
│ │ • Switching profiles = extra navigation (tab bar complexity)│ │
│ │ • Consolidated reminders = longer push notification text    │ │
│ │ • Shared data = privacy concerns on personal device         │ │
│ │ • Dashboard = challenging on small screen                   │ │
│ │                                                             │ │
│ │ ⚙️ How it works (Mobile-Adapted)                             │ │
│ │ • "My Doctors" includes family doctors (tagged with name)   │ │
│ │ • Consolidated reminder push: "3 appointments this week"    │ │
│ │ • Tap push → list view (not individual detail)              │ │
│ │ • "Family" filter in appointment history (not separate tab) │ │
│ │ • Shared calendar export: One .ics with multiple events     │ │
│ │ • Family streak: Badge on profile (not prominent)           │ │
│ │                                                             │ │
│ │ 📱 Mobile UX Constraints:                                   │ │
│ │ • No separate "Family" tab (use filters instead)            │ │
│ │ • Push notification 160 chars max (consolidated tricky)     │ │
│ │ • Profile switch requires 2 taps minimum                    │ │
│ │ • Shared favorites show who added it (privacy)              │ │
│ │ • Individual engagement metrics harder to track             │ │
│ │                                                             │ │
│ │ ⚖️ Trade-offs                                                │ │
│ │ ┌─────────────────────┬─────────────────────┐               │ │
│ │ │ ✅ Pros             │ ⚠️ Cons              │               │ │
│ │ ├─────────────────────┼─────────────────────┤               │ │
│ │ │ • High value for    │ • Mobile UX         │               │ │
│ │ │   families          │   complexity        │               │ │
│ │ │ • Leverages 75%     │ • Excludes single   │               │ │
│ │ │   dependent feature │   users             │               │ │
│ │ │ • Natural for       │ • Privacy concerns  │               │ │
│ │ │   mobile (always    │   on shared device  │               │ │
│ │ │   with you)         │ • Push char limits  │               │ │
│ │ └─────────────────────┴─────────────────────┘               │ │
│ │                                                             │ │
│ │ 👤 Best suited for: Parents with children (Sarah persona)   │ │
│ │ 🎯 Niche approach for family segment only                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ BE: B+E HYBRID (Family-First Progressive Disclosure)        │ │
│ │     ⭐⭐⭐ RECOMMENDED FOR DOCliQ                             │ │
│ │                                                             │ │
│ │ 📝 Core concept                                             │ │
│ │ Combine the mobile-native patterns of Progressive Disclosure│ │
│ │ (B) with the family-centric engagement of Approach E.       │ │
│ │ Engagement features appear contextually for family bookings,│ │
│ │ with shared favorites and consolidated reminders for        │ │
│ │ households. Best of both worlds for DocliQ's family users.  │ │
│ │                                                                 │
│ │ ✅ WHY THIS HYBRID WORKS:                                   │ │
│ │ • Approach B = Proven mobile-native pattern (universal)     │ │
│ │ • Approach E = High value for families (75% dependent cov)  │ │
│ │ • Together = Family-first UX with mobile best practices     │ │
│ │ • Leverages existing dependent booking infrastructure       │ │
│ │                                                             │ │
│ │ ⚙️ How it works (Hybrid B+E)                                 │ │
│ │ • Booking flow starts with "Who is this for?" dropdown      │ │
│ │   └─ [Me] [Emma] [Max] (family member selection)            │ │
│ │                                                             │ │
│ │ • After booking for family member:                          │ │
│ │   Bottom sheet: "Add Dr. Schmidt to family favorites?"      │ │
│ │   └─ Shows "Added for Emma's checkup" tag                   │ │
│ │                                                             │ │
│ │ • At confirmation: Inline toggle per family member          │ │
│ │   "Remind Emma 24h before?" [Toggle ON]                     │ │
│ │   "Remind you about Emma's appointment?" [Toggle ON]        │ │
│ │                                                             │ │
│ │ • 72h before: Consolidated rich push (if multiple family    │ │
│ │   appointments): "This week: Emma Mon 10am, Max Wed 2pm"    │ │
│ │   └─ [View All] [Dismiss]                                   │ │
│ │                                                             │ │
│ │ • 24h before: Individual push per appointment               │ │
│ │   "Emma's cardiologist tomorrow 10am" [Confirm] [Cancel]    │ │
│ │                                                             │ │
│ │ • 1h post-appointment: Contextual feedback                  │ │
│ │   "How was Emma's visit with Dr. Schmidt?" [👍] [👎]        │ │
│ │                                                             │ │
│ │ • "My Doctors" in booking flow:                             │ │
│ │   ├─ Dr. Schmidt [Emma's doctor | Last visit: 2 weeks ago]  │ │
│ │   ├─ Dr. Weber [Your doctor | Next: Tomorrow 10am]          │ │
│ │   └─ Tap doctor → "Book for [dropdown: Me/Emma/Max]"       │ │
│ │                                                             │ │
│ │ • Appointment detail screen:                                │ │
│ │   ├─ Shows family member avatar + name                      │ │
│ │   ├─ Toggle: "Remind [family member]"                       │ │
│ │   ├─ Toggle: "Remind me (parent)"                          │ │
│ │   └─ Action: "Add doctor to [family member]'s favorites"    │ │
│ │                                                             │ │
│ │ • History tab: Filter by family member                      │ │
│ │   └─ "All" | "Me" | "Emma" | "Max" (horizontal chips)       │ │
│ │                                                             │ │
│ │ • Settings: Family notification preferences                 │ │
│ │   ├─ "Consolidated reminders" (group family appointments)   │ │
│ │   └─ "Individual reminders" (separate for each)            │ │
│ │                                                             │ │
│ │ 📱 Mobile UX Details (Hybrid):                              │ │
│ │ • Family member selection persists for session (not tap)    │ │
│ │ • Color-coded family members (Emma = pink, Max = blue)      │ │
│ │ • Avatar circles in doctor list show family association     │ │
│ │ • Swipe between family filters in history (not dropdown)    │ │
│ │ • Haptic: Different vibration per family member (subtle)    │ │
│ │ • Consolidated push uses family member colors in text       │ │
│ │                                                             │ │
│ │ ⚖️ Trade-offs                                                │ │
│ │ ┌─────────────────────┬─────────────────────┐               │ │
│ │ │ ✅ Pros             │ ⚠️ Cons              │               │ │
│ │ ├─────────────────────┼─────────────────────┤               │ │
│ │ │ • Mobile-native     │ • More complex than │               │ │
│ │ │   (from B)          │   pure B            │               │ │
│ │ │ • Family value      │ • Single users see  │               │ │
│ │ │   (from E)          │   extra UI          │               │ │
│ │ │ • Universal appeal  │ • Push char limits  │               │ │
│ │ │ • Leverages 75%     │   for consolidated  │               │ │
│ │ │   dependent cov     │ • Privacy: shared   │               │ │
│ │ │ • Differentiation   │   device concerns   │               │ │
│ │ │ • High retention    │ • Testing matrix    │               │ │
│ │ │   potential         │   larger            │               │ │
│ │ └─────────────────────┴─────────────────────┘               │ │
│ │                                                             │ │
│ │ 👤 Best suited for: Families (Sarah persona) + All mobile   │ │
│ │ ⭐⭐⭐ RECOMMENDED: Best fit for DocliQ's user base           │ │
│ │     (high family usage + mobile-first requirement)          │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 📊 COMPARISON MATRIX (Mobile-First Assessment)                  │
│ ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐ │
│ │        │ Mobile │ Effort │ Risk   │ Valid? │ Inspir │ Best   │ │
│ │        │ Fit    │        │        │        │        │ for    │ │
│ ├────────┼────────┼────────┼────────┼────────┼────────┼────────┤ │
│ │ A      │ ⭐⭐   │ 🟡 Med │ 🟡 Med │ ✅ Yes │ ✅ Yes │ Tablet │ │
│ │ B      │ ⭐⭐⭐⭐⭐ │ 🟢 Low │ 🟢 Low │ ✅ Yes │ ❌ No  │ All    │ │
│ │ C      │ ⭐⭐⭐⭐ │ 🔴 High│ 🟡 Med │ ✅ Yes │ ✅ Yes │ Young  │ │
│ │ D      │ ⭐⭐⭐⭐ │ 🟢 Low │ 🔴 High│ ⚠️ Part│ ✅ Yes │ Power  │ │
│ │ E      │ ⭐⭐⭐  │ 🟡 Med │ 🟡 Med │ ✅ Yes │ ❌ No  │ Family │ │
│ │ BE     │ ⭐⭐⭐⭐⭐ │ 🟡 Med │ 🟢 Low │ ✅ Yes │ ❌ No  │ Family │ │
│ │ (B+E)  │        │        │        │        │        │ Mobile │ │
│ └────────┴────────┴────────┴────────┴────────┴────────┴────────┘ │
│                                                                 │
│ Mobile Fit Scale: ⭐⭐⭐⭐⭐ = Excellent | ⭐⭐ = Poor (web-centric)  │
│ Cross-domain inspiration count: 3/3 max ✅                      │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: Recommend BE (B+E HYBRID) for DocliQ mobile:             │
│                                                                 │
│ 1. Best of both: Mobile-native patterns (B) + Family value (E)  │
│    • Progressive disclosure = proven mobile UX                  │
│    • Family-first features = high value for DocliQ users        │
│                                                                 │
│ 2. Leverages existing infrastructure:                           │
│    • 75% dependent booking already implemented                  │
│    • Contextual engagement proven in mobile apps                │
│    • Shared favorites build on existing "My Doctors"            │
│                                                                 │
│ 3. Differentiation: No competitor combines family-centric       │
│    engagement with mobile-native UX                             │
│                                                                 │
│ 4. Universal appeal: Works for families (Sarah) AND single      │
│    users (Marc, Elena) - single users just skip family features │
│                                                                 │
│ 5. Balanced risk: Medium effort (not high like AI/gamification) │
│    with low risk (proven patterns, not experimental)            │
│                                                                 │
│ ⚠️ Why NOT pure B or pure E:                                  │
│ • Pure B = Misses family opportunity (75% dependent coverage)   │
│ • Pure E = Niche for families only, misses universal patterns   │
│ • Hybrid BE = Family-first without sacrificing mobile UX        │
│                                                                 │
│ 🎯 Recommended Path:                                            │
│ • Primary: Approach BE (B+E Hybrid) for MVP                     │
│ • Single users: See streamlined B (family UI hidden)            │
│ • Families: See full BE (shared favorites, consolidated pushes) │
│ • Phase 2: Layer C (Gamification) for young professionals       │
│ • Phase 3: Add D (Automation) for power users post-GDPR review  │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION: [ ]A [ ]B [ ]C [ ]D [ ]E [ ]BE Hybrid              │
│ [x]A2+B+B2+E+E2 COMBINED (Iteration 1 + 2 merged)              │
│ Notes: COMBINED APPROACH selected - merges:                     │
│ • Iteration 1: B (Progressive Disclosure) + E (Family-Centric)  │
│ • Iteration 2: A2 (Conversational) + B2 (Micro-interactions)    │
│ • Iteration 2: E2 (Platform: Widget + App Clips)                │
│ Result: Family-first conversational UI with atomic interactions │
│ and platform ecosystem. 6-week phased implementation.           │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Implementation Notes by Approach (Mobile-First)

### Approach A: ENGAGEMENT HUB ⚠️ WEB-CENTRIC

**⚠️ NOT RECOMMENDED FOR MOBILE** - This layout assumes desktop/tablet screen real estate.

**Why It Doesn't Work on Mobile**:
- Horizontal "My Doctors" carousel requires sideways swipe (anti-pattern on mobile)
- Multiple widgets create scroll fatigue (3+ screen heights)
- Dense information overwhelms on small screens
- Netflix model assumes passive browsing; mobile users are task-oriented

**Web/Tablet Version (Future)**:
```
┌──────────────────────────────────────────────────────┐
│ Good morning, Sarah                    🔔      ⚙️   │ Desktop/Tablet
├──────────────────────────────────────────────────────┤
│ 📋 My Doctors              [👤][👤][👤][👤]  →       │ Horizontal OK
├──────────────────────────────────────────────────────┤
│ ⏰ Upcoming    │  ⭐ Feedback                       │ Side-by-side
│ 👤 Cardiology  │  Rate Dr. Müller?                  │ widgets
│ Tomorrow 10:30 │  [★★★★★]                            │
│ [🔔] [✏️]      │                                     │
├──────────────────────────────────────────────────────┤
│ [Book New Appointment]                               │
└──────────────────────────────────────────────────────┘
```

**Mobile Adaptation (If Forced)**:
```
┌─────────────────────────────────────────┐
│ Good morning, Sarah              🔔    │
├─────────────────────────────────────────┤
│ ⏰ Upcoming Appointment                 │
│ 👤 Cardiology - Tomorrow 10:30       │
│ [🔔 Reminders ON] [Book Again]        │
├─────────────────────────────────────────┤
│ 📋 My Doctors (3)            [See All] │
│ 👤 Dr. Schmidt                          │
│ 👤 Dr. Weber                            │
│ 👤 Dr. Müller                           │
├─────────────────────────────────────────┤
│ ⭐ Rate your last visit?               │
│ [★★★★★] [Not Now]                       │
├─────────────────────────────────────────┤
│ [+ Book Appointment]                    │
└─────────────────────────────────────────┘
```

**Key Implementation Files**:
- `src/screens/home/HomeScreen.tsx` - Major redesign (NOT recommended for mobile)
- `src/components/sections/MyDoctorsSection.tsx` - New
- `src/components/cards/UpcomingAppointmentCard.tsx` - Enhanced

---

### Approach B: PROGRESSIVE DISCLOSURE ⭐ MOBILE-NATIVE

**Home Screen Layout**:
```
┌─────────────────────────────────────────┐
│ Good morning, Sarah              🔔    │
├─────────────────────────────────────────┤
│ ⏰ Tomorrow, 10:30 AM                  │
│ 👤 Dr. Schmidt • Cardiology            │
│ 📍 Berlin Medical Center               │
│                                         │
│ [View Details] [Book Another]          │
├─────────────────────────────────────────┤
│ 📋 Quick Book                          │
│ [Search Doctors] [My Doctors]          │
├─────────────────────────────────────────┤
│ 📰 Health News               [3 new]   │
│ • Flu season updates...                │
└─────────────────────────────────────────┘
```

**Contextual Feature Placement (Mobile-Native)**:

| Feature | Location | Mobile Pattern |
|---------|----------|----------------|
| **Favorites** | Booking Success → Bottom sheet | Native iOS/Android share sheet pattern |
| **Reminders** | Confirmation → Inline toggle | Settings toggle inline (not separate screen) |
| **Feedback** | Push notification (1h post) | Rich push with action buttons |
| **My Doctors** | Booking Flow → Before search | Vertical list with peek cards |

**Implementation Flow (Mobile)**:

**1. Favorites (Contextual)**:
```
Booking Success Screen
├─ Shows appointment details
├─ [Done] button
└─ Bottom sheet slides up:
   "Add Dr. Schmidt to My Doctors?"
   [Add] [Not Now]
   Swipe down to dismiss
```

**2. Reminders (Inline)**:
```
Confirmation Screen
├─ Appointment summary card
├─ Inline toggle row:
│  "Remind me before appointment"
│  [Toggle ON] 24h before • 72h before
├─ Expands when toggled ON
└─ [Confirm Booking] button
```

**3. Feedback (Push-Driven)**:
```
Rich Push Notification (1h post-appointment):
┌─────────────────────────────────────────┐
│ 🏥 DocliQ                              │
│ How was your visit with Dr. Schmidt?   │
│                                         │
│ [Rate Now] [Remind Me Later] [Dismiss] │
└─────────────────────────────────────────┘

Tap [Rate Now] → Deep link to rating screen
```

**Key Implementation Files**:
- `src/screens/home/HomeScreen.tsx` - Minimal changes (clean home)
- `src/screens/booking/SuccessScreen.tsx` - Add bottom sheet for favorites
- `src/screens/booking/ConfirmScreen.tsx` - Add inline reminder toggle
- `src/components/notifications/RichPushHandler.tsx` - **NEW**
- `src/screens/booking/SearchScreen.tsx` - Add "My Doctors" section in flow
- `src/screens/appointments/AppointmentDetailScreen.tsx` - Per-appointment settings

---

### Approach BE: B+E HYBRID ⭐⭐⭐ RECOMMENDED

**Family-First Mobile UX**:
```
┌─────────────────────────────────────────┐
│ Good morning, Sarah              🔔    │
├─────────────────────────────────────────┤
│ 👨‍👩‍👧 Family Appointments This Week       │
│ Emma: Mon 10am • Max: Wed 2pm          │
│ You: Fri 4pm                           │
│ [View All 3]                           │
├─────────────────────────────────────────┤
│ 📋 My Family Doctors                    │
│ 👤 Dr. Schmidt [Emma's doctor]         │
│ 👤 Dr. Weber [Your doctor]             │
│ [Book for... ▼]                        │
├─────────────────────────────────────────┤
│ ⭐ Feedback Pending (2)                 │
│ Rate Emma's visit with Dr. Schmidt     │
│ [👍] [👎] [Later]                       │
└─────────────────────────────────────────┘
```

**Family Booking Flow**:
```
Step 1: Who is this for?
├─ [Me 👤] [Emma 👧] [Max 👦]
└─ Selection persists for session

Step 2: Booking confirmation
├─ "Booked for Emma"
├─ Bottom sheet: "Add Dr. Schmidt to Emma's favorites?"
└─ [Add] [Not Now]

Step 3: Reminder setup
├─ Toggle: "Remind Emma 24h before" [ON]
├─ Toggle: "Remind me (parent)" [ON]
└─ Consolidated: 1 push for parent about Emma's appointment

Step 4: Post-visit feedback
├─ Push: "How was Emma's visit?"
├─ [👍 Great] [👎 Could be better]
└─ Tap → Rating screen with family member context
```

**Consolidated Family Push**:
```
┌─────────────────────────────────────────┐
│ 🏥 DocliQ - 3 Family Appointments      │
│                                         │
│ This week:                              │
│ 👧 Emma: Mon 10am - Dr. Schmidt        │
│ 👦 Max: Wed 2pm - Dr. Weber            │
│ 👤 You: Fri 4pm - Dr. Müller           │
│                                         │
│ [View All] [Dismiss]                    │
└─────────────────────────────────────────┘
```

**Key Implementation Files (Hybrid)**:
- `src/components/family/FamilyMemberSelector.tsx` - **NEW** Dropdown/chips
- `src/components/family/TaggedDoctorCard.tsx` - **NEW** Shows [Emma's doctor]
- `src/components/notifications/ConsolidatedPush.tsx` - **NEW** Multi-appointment
- `src/screens/booking/SuccessScreen.tsx` - Modified: "Add to [Name]'s favorites"
- `src/screens/appointments/AppointmentDetailScreen.tsx` - Family context + toggles
- `src/screens/history/HistoryScreen.tsx` - Family filter chips
- `src/screens/settings/NotificationsScreen.tsx` - Consolidated vs individual toggle

**Single User Mode (Automatic)**:
- If no dependents: Hide family UI, show pure B
- If 1+ dependents: Show full BE hybrid
- Zero configuration required

---

### Approach C: GAMIFICATION LAYER 🎮 Mobile-Adapted

**⚠️ Layer on Approach B, Not Standalone**

Gamification works on mobile when it's subtle and secondary:

**Mobile Badge Display**:
```
Profile Tab (not Home)
├─ User avatar and name
├─ "Health Streak: 3 months" (small, below name)
├─ Badges: [🏥] [⭐] [🔥] (horizontal scroll, 3 visible)
└─ Tap badge → Detail modal with unlock criteria
```

**Mobile-Specific Constraints**:
- No leaderboard (privacy + screen space)
- One badge per push notification max
- Simple Lottie animations (not complex)
- Profile tab location (not prominent home placement)

**Badge System**:
| Badge | Criteria | Mobile Display |
|-------|----------|----------------|
| 🏥 First Steps | First booking | Small icon on profile |
| ⭐ Feedback Hero | 5 reviews | Push: "You earned Feedback Hero!" |
| 🔥 3-Month Streak | 3 consecutive months | Profile + weekly push |

**Key Implementation Files**:
- `src/components/gamification/BadgeDisplay.tsx` - Compact for mobile
- `src/screens/profile/ProfileScreen.tsx` - Badge section (not home)
- `src/utils/pushNotifications.tsx` - Badge unlock pushes

---

### Approach D: INTELLIGENT AUTOMATION 🤖 Mobile-Optimized

**Perfect for Mobile: Zero UI Clutter**

Mobile users accept defaults more readily because:
- Settings are buried (2-3 taps away)
- Push notifications are primary engagement
- Less expectation of granular control

**Mobile Default Behaviors**:
```typescript
// All auto-enabled (no user action required)
const mobileDefaults = {
  favorites: 'auto-add-last-5',    // Silent, no UI
  reminders72h: true,              // Push notification
  reminders24h: true,              // Push notification  
  feedbackAuto: true,              // Rich push 1h post
  smartBackoff: true,              // Auto-disable if dismissed 3x
}

// Opt-out via push action (not settings)
const pushActions = {
  reminder: '[Dismiss] [Disable All Reminders]',
  feedback: '[Rate] [Remind Later] [Stop Asking]'
}

// Settings for power users (2 taps deep)
const settingsScreen = {
  notificationPreferences: 'Toggle all on/off',  // Not granular
  dataManagement: 'Clear favorites, reset'
}
```

**Mobile UX Flow**:
```
User books appointment
├─ Doctor auto-added to favorites (silent)
├─ Reminders auto-enabled (silent)
├─ User receives first push:
│  "We'll remind you before your appointment"
│  [OK] [Don't Remind Me]
└─ If user taps [Don't Remind Me] → One-tap disable
```

**Key Implementation Files**:
- `src/state/AppContext.tsx` - Default state (silent)
- `src/components/notifications/PushActions.tsx` - Opt-out in push
- `src/screens/settings/NotificationsScreen.tsx` - Bulk settings only

---

### Approach E: FAMILY-CENTRIC 👨‍👩‍👧 Mobile-Niche

**Family Features on Mobile: Use Filters, Not Separate Views**

**Challenge**: Mobile screens can't accommodate household dashboards

**Mobile-Adapted Data Model**:
```typescript
// No separate "Household" tab - use filters instead
interface FamilyFeatures {
  // "My Doctors" shows family doctors (tagged)
  sharedFavorites: Doctor[]  // Shows "Added by Emma's mom"
  
  // Consolidated reminder as rich push (160 char limit)
  consolidatedPush: {
    title: "3 family appointments this week",
    body: "Emma: Mon 10am, Max: Wed 2pm, You: Fri 4pm",
    actions: ["View All", "Dismiss"]
  }
  
  // Family streak: Badge on profile (not prominent)
  familyStreak: number  // "Family Health Champion"
}
```

**Mobile Family UX**:
```
Booking Flow
├─ "Who is this appointment for?"
├─ Dropdown: [Me] [Emma (child)] [Max (child)]
└─ Selected profile persists for session

My Doctors List
├─ Dr. Schmidt [Added for Emma's checkup]
├─ Dr. Weber [Your cardiologist]
└─ Tap doctor → Shows all family appointments with them

Rich Push (Consolidated)
├─ "This week: 3 family appointments"
├─ Tap → Appointment list (filtered by family)
└─ Not individual detail views
```

**Key Implementation Files**:
- `src/components/booking/PatientSelector.tsx` - Family member dropdown
- `src/components/doctors/FamilyDoctorList.tsx` - Tagged favorites
- `src/components/notifications/ConsolidatedPush.tsx` - Multi-appointment push
```

---

## Mobile UX Patterns Used

### Core Mobile Patterns in Recommended Approach (B)

| Pattern | Implementation | Why It Works on Mobile |
|---------|----------------|------------------------|
| **Bottom Sheets** | Favorite add, quick actions | Native iOS/Android share sheet pattern |
| **Inline Toggles** | Reminder enable in confirmation | No navigation, immediate feedback |
| **Rich Push Notifications** | Feedback request, reminders | Primary mobile engagement channel |
| **Deep Linking** | Push → specific screen | Reduces navigation friction |
| **Progressive Disclosure** | Show on demand, not all at once | Respects limited attention |
| **Vertical Lists** | My Doctors in booking flow | Natural mobile scroll direction |
| **One Primary Action** | One CTA per screen | Thumb-friendly, clear intent |
| **Contextual Toasts** | Success, undo actions | Non-blocking feedback |
| **Haptic Feedback** | Favorite add, toggle on | Physical confirmation |
| **Skeleton Loaders** | Async operations | Perceived performance |

### Mobile Anti-Patterns Avoided

| Anti-Pattern | Why Avoided | Mobile Alternative |
|--------------|-------------|-------------------|
| Horizontal carousels | Swipe fatigue, poor discoverability | Vertical lists with peek |
| Dashboard widgets | Information overload, scroll fatigue | Single focus per screen |
| Dense home screen | Cognitive overload on small screens | Clean home, contextual features |
| Modals for everything | Blocks flow, hard to dismiss on mobile | Bottom sheets, inline actions |
| Multi-column layouts | Doesn't fit mobile viewport | Single column, full width |
| Hover interactions | No hover on touch devices | Tap, long-press, swipe |

---

## Cross-Domain Inspiration Details

### 1. Netflix (Streaming) → Approach A (Web/Tablet Only)
**What we stole**: "Continue Watching" row on home screen
**Why it works**: Reduces friction to resume activity
**Mobile problem**: Horizontal carousel = poor mobile UX
**How we adapted for mobile**: Use Approach B (contextual) instead

### 2. Duolingo (EdTech) → Approach C (Mobile-Native)
**What we stole**: Daily streaks with push notification
**Why it works**: Creates habit formation through loss aversion
**Mobile adaptation**: Badge on profile (not home), push-driven

### 3. Superhuman (Productivity) → Approach D (Mobile-Optimized)
**What we stole**: Aggressive defaults with elegant opt-out
**Why it works**: Power users get speed, beginners get help
**Mobile adaptation**: Opt-out via push actions (not buried settings)

---

## Risk Assessment Summary (Mobile Context)

| Risk | A | B | C | D | E |
|------|---|---|---|---|---|
| GDPR non-compliance | Low | Low | Med | **High** | Med |
| Elderly exclusion | **High** | Low | Med | Med | Low |
| Development delay | Med | Low | **High** | Low | Med |
| Low adoption | **High** | Low | Low | Med | Med |
| Technical complexity | Med | Low | **High** | Low | Med |
| Mobile performance | **Poor** | Excellent | Good | Excellent | Good |
| Screen clutter | **High** | Low | Med | Low | Med |

**Key**: Approach B (Progressive Disclosure) minimizes mobile-specific risks

---

## Recommended Path Forward (Mobile-First)

### Phase 1: MVP (Approach B - Progressive Disclosure)
**Target**: All users, immediate implementation
**Features**:
- Contextual favorites (bottom sheet after booking)
- Inline reminder toggle (confirmation screen)
- Rich push notifications (feedback request)
- "My Doctors" in booking flow (not home)

**Success Metrics**:
- 7-day retention >25%
- Favorites adoption >40%
- Push opt-out rate <15%

### Phase 2: Enhancement (Layer Approach C - Gamification)
**Target**: Young professionals (Marc, Elena)
**Features**:
- Health streak badge on profile
- Achievement notifications
- Weekly streak pushes

**Timing**: After Phase 1 validates core engagement

### Phase 3: Power Users (Approach D - Automation)
**Target**: Tech-savvy users who want zero friction
**Features**:
- Auto-enable all features by default
- Smart backoff (auto-disable if ignored)
- One-tap opt-out in push notifications

**Timing**: After GDPR compliance review

### Deferred: Approach A (Engagement Hub)
**Reason**: Web-centric design, poor mobile fit
**Future**: Tablet version or web dashboard only

---

## Implementation Priority (Mobile)

| Priority | Feature | Approach | Files | Time |
|----------|---------|----------|-------|------|
| **P0** | Contextual favorites | B | 3 | 2 days |
| **P0** | Inline reminder toggle | B | 2 | 1 day |
| **P0** | Rich push notifications | B | 2 | 2 days |
| **P1** | "My Doctors" in booking flow | B | 2 | 2 days |
| **P2** | Health streak badge | C | 3 | 3 days |
| **P3** | Auto-enable defaults | D | 2 | 2 days (post-GDPR review) |

**Total MVP Time**: ~10 days (Approach B)

---

*Document Version: 2.0 (Mobile-First Update) | 
Next Step: Gate FILTER (MANDATORY) for Approach B selection | 
Created: 2026-01-30 | Updated: 2026-01-30 | 
Command: prototype-gated:3-ideations*
