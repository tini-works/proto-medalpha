import { ShortGuide, FeaturedStory, NewsArticle } from '../types'

// Mock Short Guides - video/guide cards for horizontal scroll
// German content for prototype demonstration
export const mockShortGuides: ShortGuide[] = [
  {
    id: 'guide-1',
    title: '5 Tipps für ein gesundes Herz',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-2',
    title: 'Schnelle Stressbewältigung',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-3',
    title: 'Gesunde Mahlzeiten vorbereiten',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-4',
    title: 'Fitness-Grundlagen',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-5',
    title: 'Besser schlafen heute Nacht',
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop',
    hasVideo: true,
  },
]

// Mock Featured Story - prominently displayed article
// German content for prototype demonstration
export const mockFeaturedStory: FeaturedStory = {
  id: 'article-featured-1',
  title: 'Wir stellen vor: KI-Symptom-Checker',
  description: 'Erleben Sie schnellere und genauere Erstbewertungen mit unserem neuesten Plattform-Update...',
  imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
  isNew: true,
}

// Mock News Articles - full articles with content for detail view
// German content for prototype demonstration
export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'article-featured-1',
    category: 'GENERAL',
    title: 'Wir stellen vor: KI-Symptom-Checker',
    readTimeMinutes: 6,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    publishedAt: new Date('2024-01-27'),
    author: {
      name: 'Dr. Michael Zhang',
      title: 'Ärztlicher Direktor',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    content: `# Wir stellen vor: KI-Symptom-Checker

Wir freuen uns, den Start unseres neuen KI-gestützten Symptom-Checkers bekannt zu geben – ein revolutionäres Tool, das schnellere und genauere vorläufige Gesundheitsbewertungen direkt von Ihrem Mobilgerät aus ermöglicht.

## Was ist der KI-Symptom-Checker?

Unser KI-Symptom-Checker verwendet fortschrittliche maschinelle Lernalgorithmen, die auf Millionen von medizinischen Fällen trainiert wurden, um Ihnen zu helfen, Ihre Symptome zu verstehen und das angemessene Versorgungsniveau zu bestimmen.

Er soll Ihren Arzt nicht ersetzen – er wurde entwickelt, um Sie mit Informationen zu versorgen und Sie zu den richtigen Gesundheitsressourcen zu führen.

## So funktioniert es

### 1. Beschreiben Sie Ihre Symptome
Erzählen Sie uns einfach in einfacher Sprache, was Sie erleben. Keine medizinischen Fachbegriffe nötig – beschreiben Sie einfach, wie Sie sich fühlen.

### 2. Beantworten Sie Folgefragen
Unsere KI wird relevante Folgefragen stellen, um Ihre Situation besser zu verstehen, einschließlich Symptomdauer, Schweregrad und verwandter Faktoren.

### 3. Erhalten Sie personalisierte Einblicke
Innerhalb von Sekunden erhalten Sie:
- Mögliche Erkrankungen, die Sie mit Ihrem Arzt besprechen können
- Empfohlene Dringlichkeitsstufe (Notfall, dringende Versorgung, Termin vereinbaren, Selbstpflege)
- Relevante Fachärzte, die Sie aufsuchen könnten
- Tipps zur Selbstpflege, wenn angemessen

## Die Technologie dahinter

Unser KI-Symptom-Checker nutzt:
- **Natürliche Sprachverarbeitung (NLP)** um Ihre Symptombeschreibungen zu verstehen
- **Klinische Entscheidungsunterstützungssysteme** basierend auf evidenzbasierter Medizin
- **Kontinuierliches Lernen** aus anonymisierten Daten zur Verbesserung der Genauigkeit
- **Mehrsprachige Unterstützung** für bessere Zugänglichkeit

## Genauigkeit und Zuverlässigkeit

In klinischen Validierungsstudien zeigte unser KI-Symptom-Checker:
- 92% Genauigkeit bei der Identifizierung der korrekten Erkrankungskategorie
- 87% Übereinstimmung mit Notfallmedizinern bei Triage-Entscheidungen
- Konsistente Leistung über verschiedene Altersgruppen und Symptomkomplexitäten

## Datenschutz und Sicherheit

Ihre Gesundheitsinformationen sind wertvoll. Deshalb:
- Verschlüsseln wir alle Symptom-Checker-Daten Ende-zu-Ende
- Teilen wir Ihre Informationen niemals mit Dritten
- Ermöglichen wir anonyme Nutzung – kein Konto erforderlich
- Halten wir HIPAA- und DSGVO-Vorschriften ein

## Wann Sie ihn verwenden sollten

Der KI-Symptom-Checker ist ideal für:
- Neue oder besorgniserregende Symptome, die Sie erleben
- Die Bestimmung, ob Sie sofortige medizinische Versorgung benötigen
- Die Entscheidung, ob Sie einen Arzttermin vereinbaren sollten
- Das Verständnis möglicher Ursachen vor Ihrem Besuch
- Beratung bei kleineren Gesundheitsproblemen

## Was er nicht kann

Obwohl leistungsstark, kann unser KI-Symptom-Checker:
- Keine definitiven Diagnosen stellen
- Sollte nicht für medizinische Notfälle verwendet werden (rufen Sie den Rettungsdienst)
- Keine Medikamente oder Behandlungen verschreiben
- Ersetzt keine professionelle medizinische Beratung

## Erste Schritte

Der KI-Symptom-Checker ist jetzt im Gesundheitsbereich Ihrer App verfügbar. Tippen Sie einfach auf „Symptome prüfen" und beginnen Sie zu beschreiben, wie Sie sich fühlen.

Wir empfehlen, ihn als ersten Schritt in Ihrer Gesundheitsreise zu verwenden – um sich zu informieren und selbstbewusstere Entscheidungen darüber zu treffen, wann und wo Sie Versorgung suchen sollten.

## Ausblick

Dies ist erst der Anfang. Wir verbessern unsere KI kontinuierlich mit:
- Spezialisierteren Symptombäumen für chronische Erkrankungen
- Integration mit Ihren Gesundheitsakten für personalisierte Einblicke
- Symptomverfolgung im Zeitverlauf zur Erkennung von Mustern
- Direktbuchung bei geeigneten Fachärzten basierend auf den Ergebnissen

Wir glauben, dass informierte Patienten bessere Gesundheitsentscheidungen treffen. Unser KI-Symptom-Checker wurde entwickelt, um Ihnen diese Informationen schnell und genau zu liefern, wann immer Sie sie brauchen.`,
    keyTakeaway:
      'Unser KI-Symptom-Checker erreichte in klinischen Validierungsstudien 92% Genauigkeit bei der Identifizierung korrekter Erkrankungskategorien und 87% Übereinstimmung mit Notfallmedizinern bei Triage-Entscheidungen.',
    relatedTopics: ['KI-Gesundheit', 'Digitale Gesundheit', 'Telemedizin'],
  },
  {
    id: 'article-1',
    category: 'CARDIOLOGY',
    title: 'Neue Durchbrüche bei der Behandlung von Bluthochdruck',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-24'),
    author: {
      name: 'Dr. Sarah Chen',
      title: 'Chefärztin der Kardiologie, Universitätsklinikum',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: `# Neue Durchbrüche bei der Behandlung von Bluthochdruck

Hypertonie bleibt weltweit eine der Hauptursachen für kardiovaskuläre Erkrankungen. Aktuelle klinische Studien haben vielversprechende neue therapeutische Ansätze aufgezeigt, die die Behandlung von therapieresistenten Patienten revolutionieren könnten.

## Das Problem verstehen

Bluthochdruck, oder Hypertonie, ist eine häufige Erkrankung, die die Arterien des Körpers betrifft. Bei Bluthochdruck ist die Kraft, mit der das Blut gegen die Arterienwände drückt, konstant zu hoch. Das Herz muss härter arbeiten, um Blut zu pumpen.

Hypertonie betrifft weltweit Millionen von Menschen und ist ein wesentlicher Risikofaktor für Herzerkrankungen und Schlaganfall. Die effektive Behandlung des Blutdrucks erfordert einen vielschichtigen Ansatz, der Lebensstiländerungen mit medikamentösen Interventionen kombiniert.

## Die Studienergebnisse

Forscher haben einen neuartigen Behandlungsweg identifiziert, der die renale Denervation einbezieht und deutlich verbesserte Ergebnisse für Patienten zeigt, die zuvor auf traditionelle Betablocker und ACE-Hemmer nicht angesprochen haben.

### Wichtige Ergebnisse:
- Durchschnittlich 34% Reduktion des systolischen Blutdrucks
- Anhaltende Verbesserung über einen 12-monatigen Nachbeobachtungszeitraum
- Reduzierter Bedarf an zusätzlichen Medikamenten
- Verbesserte Lebensqualität und Therapietreue der Patienten

## Die Wissenschaft dahinter

Das Renin-Angiotensin-Aldosteron-System (RAAS) spielt eine entscheidende Rolle bei der Blutdruckregulation. Durch die gezielte Behandlung spezifischer Nervenbahnen in den Nierenarterien haben Forscher eine Technik entwickelt, die eine nachhaltige Blutdrucksenkung ermöglicht.

Dieser neue Ansatz senkte den systolischen Blutdruck im Durchschnitt um 15 mmHg bei Patientengruppen, die keine Reaktion auf eine Dreifach-Medikamententherapie zeigten.

## Klinische Bedeutung

Die Auswirkungen auf die langfristige Schlaganfallprävention sind erheblich. Indem wir die Rolle des sympathischen Nervensystems bei der Blutdruckregulation ansprechen, können wir Millionen von Menschen Hoffnung geben, die mit unkontrolliertem Bluthochdruck kämpfen.

Diese Behandlungen befinden sich noch in späten klinischen Studien, aber die Zulassungsbehörde hat ein beschleunigtes Prüfverfahren gewährt. Wir erwarten, dass diese Therapien Anfang 2024 in großen Universitätskliniken verfügbar sein werden.

## Was kommt als Nächstes für Patienten

Patienten wird geraten, sich bei ihren Hausärzten über die Eignung für laufende Studien zu informieren. Mit zunehmender Verfügbarkeit dieser Behandlungen werden aktualisierte Behandlungsrichtlinien veröffentlicht.

In der Zwischenzeit bleibt die Aufrechterhaltung eines gesunden Lebensstils mit regelmäßiger Bewegung, reduzierter Natriumaufnahme und Stressbewältigung entscheidend für die Blutdruckkontrolle.`,
    keyTakeaway:
      'Dieser neue Ansatz senkte den systolischen Blutdruck im Durchschnitt um 15 mmHg bei Patientengruppen, die keine Reaktion auf eine Dreifach-Medikamententherapie zeigten.',
    relatedTopics: ['Herzgesundheit', 'Klinische Studien', 'Medikamente'],
  },
  {
    id: 'article-2',
    category: 'NUTRITION',
    title: '5 Superfoods für ein stärkeres Immunsystem im Winter',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-22'),
    author: {
      name: 'Dr. Maria Rodriguez',
      title: 'Ernährungsspezialistin',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: `# 5 Superfoods für ein stärkeres Immunsystem im Winter

Mit dem Herannahen des Winters wird die Unterstützung Ihres Immunsystems immer wichtiger. Dieser Artikel stellt fünf nährstoffreiche Lebensmittel vor, die Ihnen helfen können, während der kalten Jahreszeit gesund zu bleiben.

## 1. Zitrusfrüchte

Reich an Vitamin C sind Zitrusfrüchte wie Orangen, Zitronen und Grapefruits wahre Kraftpakete für das Immunsystem. Vitamin C hilft Ihrem Körper, weiße Blutkörperchen zu produzieren und einzusetzen, um Infektionen zu bekämpfen.

## 2. Knoblauch

Frischer Knoblauch enthält Allicin, eine Verbindung mit starken antimikrobiellen Eigenschaften. Das Hinzufügen von Knoblauch zu Ihren Mahlzeiten kann erhebliche Vorteile für das Immunsystem bieten.

## 3. Ingwer

Dieses wärmende Gewürz wird seit Jahrhunderten in der traditionellen Medizin verwendet. Ingwer enthält Gingerole und Shogaole, Verbindungen, die helfen können, Entzündungen zu reduzieren und die Immunfunktion zu unterstützen.

## 4. Pilze

Besonders Shiitake- und Austernpilze enthalten Beta-Glucane, die Immunzellen aktivieren. Fügen Sie sie Suppen, Pfannengerichten hinzu oder rösten Sie sie als Beilage.

## 5. Blattgemüse

Spinat, Grünkohl und andere dunkle Blattgemüse sind reich an Vitaminen A, C und K, die alle für die Immungesundheit essentiell sind. Sie enthalten auch Folsäure und Eisen.

## Einfaches Winter-Immun-Bowl Rezept

Probieren Sie, diese Superfoods in einer nahrhaften Bowl zu kombinieren: angebratenes Blattgemüse, geröstete Pilze, Knoblauch, frische Zitrussegmente und Ingwer-Brühe.`,
    keyTakeaway: 'Die Integration dieser fünf Superfoods in Ihre Winterernährung kann Ihr Immunsystem auf natürliche Weise deutlich stärken.',
    relatedTopics: ['Ernährung', 'Wellness', 'Immunität'],
  },
  {
    id: 'article-3',
    category: 'MENTAL_HEALTH',
    title: 'Die Wissenschaft der täglichen Achtsamkeitspraxis',
    readTimeMinutes: 6,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-20'),
    author: {
      name: 'Dr. James Wilson',
      title: 'Psychologe & Wellness-Experte',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    content: `# Die Wissenschaft der täglichen Achtsamkeitspraxis

Achtsamkeit ist in den letzten Jahren immer beliebter geworden, aber was sagt die Wissenschaft tatsächlich über ihre Vorteile? Diese umfassende Übersicht untersucht die evidenzbasierten Vorteile der täglichen Achtsamkeitspraxis.

## Was ist Achtsamkeit?

Achtsamkeit ist die Praxis, eine Moment-zu-Moment-Bewusstheit unserer Gedanken, Gefühle, körperlichen Empfindungen und der umgebenden Umwelt mit einer nicht-wertenden, aufgeschlossenen Haltung aufrechtzuerhalten.

## Wissenschaftlich belegte Vorteile

### Stressreduktion
Studien zeigen, dass regelmäßige Achtsamkeitspraxis das parasympathische Nervensystem aktiviert, den Cortisolspiegel senkt und Entspannung fördert.

### Verbesserte Konzentration
Achtsamkeitsmeditation stärkt Aufmerksamkeitsnetzwerke, was zu verbesserter Konzentration und kognitiver Leistung führt.

### Emotionale Regulation
Praktizierende entwickeln eine bessere Kontrolle über ihre emotionalen Reaktionen, was zu erhöhter emotionaler Belastbarkeit führt.

### Schlafqualität
Abendliche Achtsamkeitspraktiken haben nachweislich das Einschlafen und die Schlafqualität verbessert.

## Erste Schritte

Beginnen Sie mit nur 5-10 Minuten täglich. Finden Sie einen ruhigen Ort, setzen Sie sich bequem hin und konzentrieren Sie sich auf Ihren Atem. Wenn Ihre Gedanken abschweifen, bringen Sie sie sanft in den gegenwärtigen Moment zurück.

## Regelmäßigkeit ist der Schlüssel

Die Vorteile der Achtsamkeit akkumulieren sich über die Zeit. Die meisten Menschen berichten nach 8 Wochen konsequenter Praxis von spürbaren Verbesserungen.`,
    keyTakeaway: 'Regelmäßige Achtsamkeitspraxis hat sich wissenschaftlich als stressreduzierend, konzentrationsfördernd und emotional stabilisierend erwiesen.',
    relatedTopics: ['Psychische Gesundheit', 'Meditation', 'Wellness'],
  },
  {
    id: 'article-4',
    category: 'FITNESS',
    title: 'Warum Spazierengehen die beste Medizin ist',
    readTimeMinutes: 7,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-18'),
    author: {
      name: 'Dr. Robert Patterson',
      title: 'Sportmediziner',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: `# Warum Spazierengehen die beste Medizin ist

Spazierengehen wird oft als Bewegungsform unterschätzt, aber die Forschung zeigt konsequent seine tiefgreifenden Vorteile für die körperliche und geistige Gesundheit. Dieser Artikel erklärt, warum Spazierengehen Ihre bevorzugte Form der täglichen Bewegung sein sollte.

## Die Vorteile regelmäßigen Spazierengehens

### Herz-Kreislauf-Gesundheit
30 Minuten tägliches Gehen reduziert das Risiko von Herzerkrankungen um bis zu 35%. Es stärkt Ihr Herz und verbessert die Durchblutung.

### Gewichtsmanagement
Regelmäßiges Gehen verbrennt Kalorien und hilft, ein gesundes Gewicht zu halten, ohne die Gelenkbelastung von intensivem Training.

### Gehirngesundheit
Spazierengehen erhöht die Durchblutung des Gehirns, verbessert die kognitive Funktion und reduziert das Demenzrisiko.

### Langlebigkeit
Studien zeigen, dass regelmäßige Spaziergänger im Vergleich zu sitzenden Personen länger und gesünder leben.

## Spazierengehen angenehmer gestalten

- Gehen Sie mit einem Freund für soziale Verbindung
- Hören Sie Podcasts oder Hörbücher
- Wählen Sie malerische Routen
- Treten Sie einer Wandergruppe bei
- Setzen Sie tägliche Schrittziele mit einem Schrittzähler oder Fitness-Tracker

## Erste Schritte

Beginnen Sie mit 10-15 Minuten täglichem Gehen und steigern Sie sich schrittweise auf 30 Minuten. Selbst kurze Spaziergänge bieten Vorteile.

## Die Walking-Empfehlung

Gesundheitsexperten empfehlen mindestens 150 Minuten moderates Gehen pro Woche für optimale gesundheitliche Vorteile.`,
    keyTakeaway:
      'Nur 30 Minuten tägliches Spazierengehen können die Herz-Kreislauf-Gesundheit, das psychische Wohlbefinden und die allgemeine Langlebigkeit erheblich verbessern.',
    relatedTopics: ['Fitness', 'Bewegung', 'Herzgesundheit'],
  },
  {
    id: 'article-5',
    category: 'GENERAL',
    title: 'Ihre jährliche Vorsorgeuntersuchung verstehen',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-16'),
    author: {
      name: 'Dr. Elisabeth Müller',
      title: 'Hausärztin',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    content: `# Ihre jährliche Vorsorgeuntersuchung verstehen

Jährliche Vorsorgeuntersuchungen sind ein wesentlicher Bestandteil der Präventivmedizin. Dieser Leitfaden erklärt, was Sie erwartet und wie Sie sich auf Ihre nächste Untersuchung vorbereiten können.

## Warum jährliche Untersuchungen wichtig sind

Regelmäßige Untersuchungen ermöglichen es Ärzten:
- Gesundheits-Basiswerte zu ermitteln
- Potenzielle Gesundheitsprobleme frühzeitig zu erkennen
- Chronische Erkrankungen zu überwachen
- Impfungen zu aktualisieren
- Lebensstiländerungen zu besprechen

## Was Sie erwartet

### Körperliche Untersuchung
Ihr Arzt wird die Vitalzeichen überprüfen, eine körperliche Untersuchung durchführen und Ihr Herz und Ihre Lungen abhören.

### Blutuntersuchung
Laboruntersuchungen prüfen verschiedene Gesundheitsmarker einschließlich Cholesterin, Blutzucker und andere Indikatoren.

### Krankengeschichte
Seien Sie bereit, neue Symptome, Medikamente oder Änderungen in der Familiengesundheitsgeschichte zu besprechen.

## Wie Sie sich vorbereiten

- Bringen Sie Versicherungsinformationen und Ausweis mit
- Erstellen Sie eine Liste aktueller Medikamente
- Notieren Sie alle Gesundheitsbedenken
- Fasten Sie, wenn eine Blutuntersuchung angeordnet ist
- Tragen Sie bequeme Kleidung

## Das Beste aus Ihrem Besuch machen

- Stellen Sie Fragen zu Ihren Ergebnissen
- Besprechen Sie Präventionsoptionen
- Aktualisieren Sie Gesundheitsziele mit Ihrem Arzt
- Vereinbaren Sie empfohlene Folgetermine`,
    keyTakeaway: 'Jährliche Vorsorgeuntersuchungen sind entscheidend für die Früherkennung von Krankheiten und die Erhaltung der allgemeinen Gesundheit.',
    relatedTopics: ['Vorsorge', 'Gesundheitscheck', 'Wellness'],
  },
]
