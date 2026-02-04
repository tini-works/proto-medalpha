import { StatusBar } from 'expo-status-bar'
import { useFonts, OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold } from '@expo-google-fonts/open-sans'
import React, { useMemo, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

type Route = 'buchung' | 'telemedizin' | 'erezept' | 'apotheke'

const palette = {
  primary: '#0C3D91',
  primaryLight: '#1E5BB8',
  accent: '#FFC603',
  success: '#2E7D32',
  background: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E2E8F0',
  muted: '#4B5563',
  text: '#111827',
  danger: '#D14343',
}

const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
}

const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
}

function NavPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.navPill,
        {
          backgroundColor: active ? palette.primary : '#E5EDFF',
          borderColor: active ? palette.primary : 'transparent',
        },
      ]}
    >
      <Text style={[styles.navPillText, { color: active ? '#fff' : palette.primary }]}>{label}</Text>
    </TouchableOpacity>
  )
}

function Card({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  )
}

function Tag({ text, tone = 'muted' }: { text: string; tone?: 'muted' | 'accent' | 'success' | 'danger' }) {
  const background = {
    muted: '#F3F4F6',
    accent: '#FFF4CC',
    success: '#E8F5E9',
    danger: '#FEE2E2',
  }[tone]
  const color = {
    muted: palette.muted,
    accent: '#8D6E00',
    success: palette.success,
    danger: '#B91C1C',
  }[tone]
  return (
    <View style={[styles.tag, { backgroundColor: background }]}>
      <Text style={[styles.tagText, { color }]}>{text}</Text>
    </View>
  )
}

function TimeSlot({ time, active = false }: { time: string; active?: boolean }) {
  return (
    <View
      style={[
        styles.timeSlot,
        {
          backgroundColor: active ? palette.accent : '#FFF8E1',
          borderColor: active ? palette.primary : '#F2D777',
        },
      ]}
    >
      <Text style={[styles.timeSlotText, { color: palette.text }]}>{time}</Text>
    </View>
  )
}

function SectionHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {meta ? <Text style={styles.sectionMeta}>{meta}</Text> : null}
    </View>
  )
}

function Partner({ name }: { name: string }) {
  return (
    <Text style={styles.partner}>Powered by {name}</Text>
  )
}

function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        style={styles.input}
      />
    </View>
  )
}

function PrimaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  )
}

function GhostButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.ghostButton}>
      <Text style={styles.ghostButtonText}>{label}</Text>
    </TouchableOpacity>
  )
}

function BookingFlow() {
  return (
    <View style={styles.flowWrapper}>
      <SectionHeader title="Arzttermin buchen" meta="6 Screens · Kernfluss" />
      <Card title="Suche" subtitle="Neueste Suchbegriffe & Autocomplete">
        <InputField label="Fachrichtung" placeholder="z. B. Dermatologie" />
        <InputField label="Ort oder PLZ" placeholder="z. B. Berlin" />
        <View style={styles.rowSpace}>
          <Tag text="Dermatologie · Berlin" tone="muted" />
          <Tag text="Hausarzt · München" tone="muted" />
        </View>
        <PrimaryButton label="Ärzte finden" />
      </Card>

      <Card title="Arztliste" subtitle="Hybrid-Karten mit 3 Slots + Mehr">
        <View style={styles.doctorCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.doctorName}>Dr. med. Sarah Klein</Text>
            <Text style={styles.doctorMeta}>Dermatologie · 0.8 km</Text>
            <View style={styles.rowSpace}>
              <Tag text="Kasse" />
              <Tag text="Video möglich" />
            </View>
            <Text style={styles.doctorMeta}>Bewertung 4,8 · 120 Rezensionen</Text>
          </View>
          <View style={styles.timeRow}>
            <TimeSlot time="14:10" />
            <TimeSlot time="14:30" active />
            <TimeSlot time="15:00" />
          </View>
          <TouchableOpacity>
            <Text style={styles.moreLink}>Mehr →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.doctorCard, { opacity: 0.6 }]}>
          <Text style={styles.doctorName}>Dr. med. Jonas Meier</Text>
          <Text style={styles.doctorMeta}>Dermatologie · 2.1 km</Text>
          <Text style={styles.doctorMeta}>Keine Slots heute · Filter anpassen</Text>
        </View>
      </Card>

      <Card title="Profil & Kalender" subtitle="Vollständige Wochenansicht">
        <Text style={styles.sectionMeta}>Freitag, 16. Jan 2026</Text>
        <View style={styles.timeGrid}>
          {['09:00', '09:30', '10:00', '11:30', '14:00', '14:30', '15:00'].map((t) => (
            <TimeSlot key={t} time={t} active={t === '14:30'} />
          ))}
        </View>
        <PrimaryButton label="14:30 Uhr auswählen" />
      </Card>

      <Card title="Bestätigung (Bottom Sheet)">
        <Text style={styles.sectionMeta}>Dr. Sarah Klein · 16. Jan 2026 · 14:30 Uhr</Text>
        <InputField label="Grund des Besuchs" placeholder="Kurz beschreiben" />
        <PrimaryButton label="Termin bestätigen" />
        <GhostButton label="Abbrechen" />
      </Card>

      <Card title="Erfolg" subtitle="Kalender & Route">
        <Text style={styles.successText}>Termin bestätigt!</Text>
        <View style={styles.rowSpace}>
          <PrimaryButton label="Zum Kalender hinzufügen" />
          <GhostButton label="Route öffnen" />
        </View>
        <Partner name="Curaay" />
      </Card>
    </View>
  )
}

function TelemedizinFlow() {
  return (
    <View style={styles.flowWrapper}>
      <SectionHeader title="Telemedizin" meta="Jetzt vs Termin · Warteraum · Video" />
      <Card title="Einstieg">
        <View style={styles.splitCards}>
          <View style={styles.choiceCard}>
            <Text style={styles.choiceTitle}>Jetzt sprechen</Text>
            <Text style={styles.choiceBody}>Arzt verbindet sich in wenigen Minuten.</Text>
            <PrimaryButton label="Video jetzt starten" />
          </View>
          <View style={styles.choiceCard}>
            <Text style={styles.choiceTitle}>Termin planen</Text>
            <Text style={styles.choiceBody}>Für später einen Slot sichern.</Text>
            <GhostButton label="Slot wählen" />
          </View>
        </View>
      </Card>

      <Card title="Symptom-Check">
        <Text style={styles.sectionMeta}>Fortschritt 2 / 5</Text>
        <View style={styles.chipRow}>
          {['Husten', 'Fieber', 'Ausschlag', 'Kopfschmerz'].map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
        <InputField label="Kurzbeschreibung" placeholder="Beschreiben Sie Ihre Symptome" />
        <PrimaryButton label="Weiter" />
      </Card>

      <Card title="Warteraum">
        <Text style={styles.waitingNumber}>Position 3 in der Warteschlange</Text>
        <Text style={styles.sectionMeta}>Geschätzte Wartezeit: 6 Minuten</Text>
        <View style={styles.tipList}>
          <Text style={styles.tipItem}>• Halten Sie Ihren Ausweis bereit.</Text>
          <Text style={styles.tipItem}>• Prüfen Sie Mikrofon & Kamera.</Text>
        </View>
      </Card>

      <Card title="Videogespräch" subtitle="Dunkles UI mit Controls">
        <View style={styles.videoFrame}>
          <Text style={{ color: '#fff' }}>Video-Placeholder</Text>
        </View>
        <View style={styles.controlRow}>
          <View style={styles.controlDot} />
          <View style={styles.controlDot} />
          <View style={[styles.controlDot, { backgroundColor: palette.danger }]} />
        </View>
      </Card>

      <Card title="Zusammenfassung">
        <Text style={styles.sectionMeta}>Dr. Julia Wagner · 16. Jan 2026</Text>
        <Text style={styles.summaryText}>
          Diagnose: Allergische Reaktion. Rezept wurde erstellt und kann als E-Rezept eingelöst werden.
        </Text>
        <PrimaryButton label="E-Rezept öffnen" />
        <Partner name="Teleclinic" />
      </Card>
    </View>
  )
}

function EPrescriptionFlow() {
  return (
    <View style={styles.flowWrapper}>
      <SectionHeader title="E-Rezept" meta="NFC Scan · Einlösen · Tracking" />
      <Card title="NFC Scan">
        <Text style={styles.sectionMeta}>Schritt 1/3</Text>
        <View style={styles.nfcBox}>
          <Text style={styles.nfcText}>Halten Sie die Gesundheitskarte ans Smartphone.</Text>
          <Text style={styles.nfcPin}>PIN eingeben → ••••</Text>
        </View>
        <PrimaryButton label="Scan starten" />
      </Card>

      <Card title="Rezeptdetails">
        <Text style={styles.sectionMeta}>2 Medikamente erkannt</Text>
        <View style={styles.rxItem}>
          <Text style={styles.rxTitle}>Cetirizin 10mg · 20 Stk</Text>
          <Tag text="Zuzahlung 5 €" tone="accent" />
        </View>
        <View style={styles.rxItem}>
          <Text style={styles.rxTitle}>Hydrocortison Creme</Text>
          <Tag text="Privat" tone="muted" />
        </View>
      </Card>

      <Card title="Einlösen">
        <View style={styles.splitCards}>
          <View style={styles.choiceCard}>
            <Text style={styles.choiceTitle}>Online Apotheke</Text>
            <Text style={styles.choiceBody}>Lieferung morgen · Tracking inklusive.</Text>
            <PrimaryButton label="Online einlösen" />
          </View>
          <View style={styles.choiceCard}>
            <Text style={styles.choiceTitle}>Lokale Apotheke</Text>
            <Text style={styles.choiceBody}>Reservieren & vor Ort abholen.</Text>
            <GhostButton label="Apotheke wählen" />
          </View>
        </View>
        <Partner name="Apo Group" />
      </Card>

      <Card title="Checkout">
        <InputField label="Adresse" placeholder="Straße, PLZ, Stadt" />
        <InputField label="Zuzahlung" placeholder="z. B. 5 €" />
        <PrimaryButton label="Bestellung abschließen" />
      </Card>

      <Card title="Tracking">
        <View style={styles.timeline}>
          <Text style={styles.timelineItem}>• Bestellung eingegangen</Text>
          <Text style={styles.timelineItem}>• Rezept verifiziert</Text>
          <Text style={styles.timelineItem}>• In Zustellung (DPD)</Text>
        </View>
      </Card>
    </View>
  )
}

function PharmacyFlow() {
  return (
    <View style={styles.flowWrapper}>
      <SectionHeader title="Apotheken" meta="Karte + Details" />
      <Card title="Kartenansicht">
        <View style={styles.mapBox}>
          <Text style={styles.mapText}>Map Placeholder</Text>
        </View>
        <View style={styles.bottomSheet}>
          <Text style={styles.doctorName}>dm Apotheke Mitte</Text>
          <Text style={styles.doctorMeta}>0.6 km · Geöffnet bis 20:00</Text>
          <View style={styles.rowSpace}>
            <Tag text="E-Rezept" tone="success" />
            <Tag text="Impfungen" tone="muted" />
          </View>
          <View style={styles.rowSpace}>
            <PrimaryButton label="Route" />
            <GhostButton label="Anrufen" />
          </View>
        </View>
        <Partner name="Google Maps" />
      </Card>

      <Card title="Details">
        <Text style={styles.sectionMeta}>Mo-Fr 08:00–20:00 · Sa 10:00–18:00</Text>
        <Text style={styles.sectionMeta}>Leistungen: E-Rezept, Impfungen, Beratung</Text>
        <PrimaryButton label="Termin für Beratung" />
      </Card>
    </View>
  )
}

export default function App() {
  const [route, setRoute] = useState<Route>('buchung')
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  })

  const title = useMemo(
    () =>
      ({
        buchung: 'Terminbuchung',
        telemedizin: 'Telemedizin',
        erezept: 'E-Rezept',
        apotheke: 'Apotheken',
      }[route]),
    [route],
  )

  if (!fontsLoaded) return null

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>MedAlpha Connect</Text>
          <Text style={styles.appSubtitle}>{title}</Text>
        </View>
        <View style={styles.navRow}>
          <NavPill label="Buchung" active={route === 'buchung'} onPress={() => setRoute('buchung')} />
          <NavPill label="Telemedizin" active={route === 'telemedizin'} onPress={() => setRoute('telemedizin')} />
          <NavPill label="E-Rezept" active={route === 'erezept'} onPress={() => setRoute('erezept')} />
          <NavPill label="Apotheken" active={route === 'apotheke'} onPress={() => setRoute('apotheke')} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {route === 'buchung' && <BookingFlow />}
        {route === 'telemedizin' && <TelemedizinFlow />}
        {route === 'erezept' && <EPrescriptionFlow />}
        {route === 'apotheke' && <PharmacyFlow />}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: palette.background,
  },
  appTitle: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 22,
    color: palette.primary,
  },
  appSubtitle: {
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 16,
    color: palette.muted,
    marginTop: 4,
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  navPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  navPillText: {
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  flowWrapper: {
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 20,
    color: palette.text,
  },
  sectionMeta: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    color: palette.muted,
    marginTop: 2,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    gap: spacing.md,
  },
  cardTitle: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 18,
    color: palette.text,
  },
  cardSubtitle: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    color: palette.muted,
  },
  inputLabel: {
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 14,
    color: palette.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonText: {
    fontFamily: 'OpenSans_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  ghostButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  ghostButtonText: {
    fontFamily: 'OpenSans_600SemiBold',
    color: palette.text,
    fontSize: 16,
  },
  tag: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 13,
  },
  timeSlot: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 72,
    alignItems: 'center',
  },
  timeSlotText: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 15,
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  doctorCard: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  doctorName: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 16,
    color: palette.text,
  },
  doctorMeta: {
    fontFamily: 'OpenSans_400Regular',
    color: palette.muted,
    fontSize: 14,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  moreLink: {
    fontFamily: 'OpenSans_600SemiBold',
    color: palette.primary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  successText: {
    fontFamily: 'OpenSans_700Bold',
    color: palette.success,
    fontSize: 16,
  },
  splitCards: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  choiceCard: {
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: '#F9FAFB',
  },
  choiceTitle: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 15,
    color: palette.text,
  },
  choiceBody: {
    fontFamily: 'OpenSans_400Regular',
    color: palette.muted,
    fontSize: 14,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#E0ECFF',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipText: {
    fontFamily: 'OpenSans_600SemiBold',
    color: palette.primary,
  },
  waitingNumber: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 16,
    color: palette.text,
  },
  tipList: {
    gap: 4,
  },
  tipItem: {
    fontFamily: 'OpenSans_400Regular',
    color: palette.muted,
  },
  videoFrame: {
    backgroundColor: '#0F172A',
    height: 220,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  controlDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1F2937',
  },
  summaryText: {
    fontFamily: 'OpenSans_400Regular',
    color: palette.text,
    lineHeight: 20,
  },
  nfcBox: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: '#F9FAFB',
    gap: spacing.sm,
  },
  nfcText: {
    fontFamily: 'OpenSans_600SemiBold',
    color: palette.text,
    fontSize: 15,
  },
  nfcPin: {
    fontFamily: 'OpenSans_400Regular',
    color: palette.muted,
  },
  rxItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    gap: spacing.xs,
  },
  rxTitle: {
    fontFamily: 'OpenSans_700Bold',
    color: palette.text,
  },
  timeline: {
    gap: spacing.xs,
  },
  timelineItem: {
    fontFamily: 'OpenSans_400Regular',
    color: palette.text,
  },
  mapBox: {
    backgroundColor: '#E0ECFF',
    height: 200,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontFamily: 'OpenSans_600SemiBold',
    color: palette.primary,
  },
  bottomSheet: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: radius.xl,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  partner: {
    fontFamily: 'OpenSans_400Regular',
    color: palette.muted,
    fontSize: 13,
    marginTop: spacing.sm,
  },
})
