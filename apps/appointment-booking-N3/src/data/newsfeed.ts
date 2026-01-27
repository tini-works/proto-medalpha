import { ShortGuide, FeaturedStory, NewsArticle } from '../types'

// Mock Short Guides - video/guide cards for horizontal scroll
export const mockShortGuides: ShortGuide[] = [
  {
    id: 'guide-1',
    title: '5 Heart Health Tips',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-2',
    title: 'Quick Stress Relief',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-3',
    title: 'Healthy Meal Prep',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-4',
    title: 'Fitness Fundamentals',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=400&fit=crop',
    hasVideo: true,
  },
  {
    id: 'guide-5',
    title: 'Sleep Better Tonight',
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop',
    hasVideo: true,
  },
]

// Mock Featured Story - prominently displayed article
export const mockFeaturedStory: FeaturedStory = {
  id: 'article-featured-1',
  title: 'Introducing AI Symptom Checker',
  description: 'Experience faster, more accurate preliminary assessments with our latest platform update...',
  imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
  isNew: true,
}

// Mock News Articles - full articles with content for detail view
export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'article-featured-1',
    category: 'GENERAL',
    title: 'Introducing AI Symptom Checker',
    readTimeMinutes: 6,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    publishedAt: new Date('2024-01-27'),
    author: {
      name: 'Dr. Michael Zhang, MD',
      title: 'Chief Medical Officer',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    content: `# Introducing AI Symptom Checker

We're excited to announce the launch of our new AI-powered Symptom Checker, a revolutionary tool designed to provide faster, more accurate preliminary health assessments right from your mobile device.

## What is the AI Symptom Checker?

Our AI Symptom Checker uses advanced machine learning algorithms trained on millions of medical cases to help you understand your symptoms and determine the appropriate level of care you might need.

This isn't meant to replace your doctor—it's designed to empower you with information and guide you toward the right healthcare resources.

## How It Works

### 1. Describe Your Symptoms
Simply tell us what you're experiencing in plain language. No need for medical jargon—just describe how you feel.

### 2. Answer Follow-Up Questions
Our AI will ask relevant follow-up questions to better understand your situation, including symptom duration, severity, and related factors.

### 3. Get Personalized Insights
Within seconds, receive:
- Possible conditions to discuss with your doctor
- Recommended urgency level (emergency, urgent care, schedule appointment, self-care)
- Relevant specialists you might want to see
- Self-care tips when appropriate

## The Technology Behind It

Our AI Symptom Checker leverages:
- **Natural Language Processing (NLP)** to understand your symptom descriptions
- **Clinical Decision Support Systems** based on evidence-based medicine
- **Continuous Learning** from anonymized data to improve accuracy
- **Multi-language Support** for better accessibility

## Accuracy and Reliability

In clinical validation studies, our AI Symptom Checker demonstrated:
- 92% accuracy in identifying the correct condition category
- 87% agreement with emergency medicine physicians on triage decisions
- Consistent performance across different age groups and symptom complexities

## Privacy and Security

Your health information is precious. That's why we:
- Encrypt all symptom checker data end-to-end
- Never share your information with third parties
- Allow anonymous usage—no account required
- Comply with HIPAA and GDPR regulations

## When to Use It

The AI Symptom Checker is ideal for:
- New or concerning symptoms you're experiencing
- Determining if you need immediate medical attention
- Deciding whether to schedule a doctor's appointment
- Understanding potential causes before your visit
- Getting guidance on minor health concerns

## What It Can't Do

While powerful, our AI Symptom Checker:
- Cannot diagnose conditions definitively
- Should not be used for medical emergencies (call emergency services)
- Cannot prescribe medications or treatments
- Doesn't replace professional medical advice

## Getting Started

The AI Symptom Checker is now available in the Health section of your app. Simply tap "Check Symptoms" and start describing how you're feeling.

We recommend using it as a first step in your healthcare journey—to inform yourself and make more confident decisions about when and where to seek care.

## Looking Forward

This is just the beginning. We're continuously improving our AI with:
- More specialized symptom trees for chronic conditions
- Integration with your health records for personalized insights
- Symptom tracking over time to identify patterns
- Direct booking with appropriate specialists based on results

We believe that informed patients make better health decisions. Our AI Symptom Checker is designed to give you that information quickly and accurately, whenever you need it.`,
    keyTakeaway:
      'Our AI Symptom Checker achieved 92% accuracy in identifying correct condition categories and 87% agreement with emergency physicians on triage decisions in clinical validation studies.',
    relatedTopics: ['AI Health', 'Digital Health', 'Telemedicine'],
  },
  {
    id: 'article-1',
    category: 'CARDIOLOGY',
    title: 'New Breakthroughs in Hypertension Management',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-24'),
    author: {
      name: 'Dr. Sarah Chen, MD, PhD',
      title: 'Chief of Cardiology, Johns Hopkins',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: `# New Breakthroughs in Hypertension Management

Hypertension remains a leading cause of cardiovascular morbidity worldwide. Recent clinical trials have unveiled promising new therapeutic targets that could revolutionize how we approach treatment resistance.

## Understanding the Problem

High blood pressure, or hypertension, is a common condition that affects the body's arteries. It's also called high blood pressure. If you have high blood pressure, the force of blood pushing against the artery walls is consistently too high. The heart has to work harder to pump blood.

Hypertension affects millions of people globally and is a major risk factor for heart disease and stroke. Managing blood pressure effectively requires a multi-faceted approach combining lifestyle modifications with pharmacological interventions.

## The Study Findings

Researchers have identified a novel pathway involving renal denervation that shows significantly improved outcomes for patients who have previously been unresponsive to traditional beta-blockers and ACE inhibitors.

### Key Results:
- 34% reduction in systolic blood pressure on average
- Sustained improvement over 12-month follow-up period
- Reduced need for additional medications
- Improved patient quality of life and compliance

## The Science Behind It

The renin-angiotensin-aldosterone system (RAAS) plays a crucial role in blood pressure regulation. By targeting specific neural pathways in the renal arteries, researchers have developed a technique that provides sustained blood pressure reduction.

This new approach reduced systolic blood pressure by an average of 15 mmHg in patient groups that showed zero response to triple-drug therapy.

## Clinical Implications

The implications for long-term stroke prevention are substantial. By addressing the sympathetic nervous system's role in blood pressure regulation, we can offer hope to millions who struggle with uncontrolled hypertension.

These treatments are still in late-stage clinical trials, but the FDA has granted expedited review status. We expect to see these therapies available in major teaching hospitals by early 2024.

## What's Next for Patients

Patients are advised to consult with their primary care physicians about eligibility for ongoing trials. As these treatments move closer to widespread availability, updated treatment guidelines will be released.

In the meantime, maintaining a healthy lifestyle with regular exercise, reduced sodium intake, and stress management remains crucial for blood pressure control.`,
    keyTakeaway:
      'This new approach reduced systolic blood pressure by an average of 15 mmHg in patient groups that showed zero response to triple-drug therapy.',
    relatedTopics: ['Heart Health', 'Clinical Trials', 'Medication'],
  },
  {
    id: 'article-2',
    category: 'NUTRITION',
    title: '5 Superfoods for Better Immunity This Winter',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-22'),
    author: {
      name: 'Dr. Maria Rodriguez',
      title: 'Nutritionist Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: `# 5 Superfoods for Better Immunity This Winter

As winter approaches, supporting your immune system becomes increasingly important. This article explores five nutrient-dense foods that can help keep you healthy throughout the cold season.

## 1. Citrus Fruits

Rich in vitamin C, citrus fruits like oranges, lemons, and grapefruits are immune-boosting powerhouses. Vitamin C helps your body produce and use white blood cells to fight infection.

## 2. Garlic

Fresh garlic contains allicin, a compound with powerful antimicrobial properties. Adding garlic to your meals can provide significant immune benefits.

## 3. Ginger

This warming spice has been used in traditional medicine for centuries. Ginger contains gingerols and shogaols, compounds that may help reduce inflammation and support immune function.

## 4. Mushrooms

Particularly shiitake and oyster mushrooms, these fungi contain beta-glucans that activate immune cells. Add them to soups, stir-fries, or roast them as a side dish.

## 5. Leafy Greens

Spinach, kale, and other dark leafy greens are packed with vitamins A, C, and K, all essential for immune health. They also contain folate and iron.

## Simple Winter Immunity Bowl Recipe

Try combining these superfoods into a nourishing bowl: sautéed leafy greens, roasted mushrooms, garlic, fresh citrus segments, and ginger-infused broth.`,
    keyTakeaway: 'Incorporating these five superfoods into your winter diet can significantly boost your immune system naturally.',
    relatedTopics: ['Nutrition', 'Wellness', 'Immunity'],
  },
  {
    id: 'article-3',
    category: 'MENTAL_HEALTH',
    title: 'The Science of Daily Mindfulness Practice',
    readTimeMinutes: 6,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-20'),
    author: {
      name: 'Dr. James Wilson',
      title: 'Psychologist & Wellness Expert',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    content: `# The Science of Daily Mindfulness Practice

Mindfulness has become increasingly popular in recent years, but what does the science actually say about its benefits? This comprehensive review explores the evidence-based benefits of daily mindfulness practice.

## What is Mindfulness?

Mindfulness is the practice of maintaining moment-to-moment awareness of our thoughts, feelings, bodily sensations, and surrounding environment with a non-judgmental, open-minded attitude.

## Research-Backed Benefits

### Stress Reduction
Studies show that regular mindfulness practice activates the parasympathetic nervous system, reducing cortisol levels and promoting relaxation.

### Improved Focus
Mindfulness meditation strengthens attention networks, leading to improved concentration and cognitive performance.

### Emotional Regulation
Practitioners develop better control over their emotional responses, leading to increased emotional resilience.

### Sleep Quality
Evening mindfulness practices have been shown to improve sleep onset and quality.

## Getting Started

Begin with just 5-10 minutes daily. Find a quiet space, sit comfortably, and focus on your breath. When your mind wanders, gently bring it back to the present moment.

## Consistency is Key

The benefits of mindfulness accumulate over time. Most people report noticeable improvements after 8 weeks of consistent practice.`,
    keyTakeaway: 'Regular mindfulness practice has been scientifically proven to reduce stress, improve focus, and enhance emotional well-being.',
    relatedTopics: ['Mental Health', 'Meditation', 'Wellness'],
  },
  {
    id: 'article-4',
    category: 'FITNESS',
    title: 'Why Walking is the Best Medicine',
    readTimeMinutes: 7,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-18'),
    author: {
      name: 'Dr. Robert Patterson',
      title: 'Sports Medicine Physician',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: `# Why Walking is the Best Medicine

Walking is often overlooked as a form of exercise, but research consistently shows its profound benefits for physical and mental health. This article explores why walking deserves to be your preferred form of daily movement.

## The Benefits of Regular Walking

### Cardiovascular Health
Walking for 30 minutes daily reduces the risk of heart disease by up to 35%. It strengthens your heart and improves circulation.

### Weight Management
Regular walking burns calories and helps maintain a healthy weight without the joint stress of high-impact exercise.

### Brain Health
Walking increases blood flow to the brain, improving cognitive function and reducing the risk of dementia.

### Longevity
Studies show that regular walkers live longer, healthier lives compared to sedentary individuals.

## Making Walking More Enjoyable

- Walk with a friend for social connection
- Listen to podcasts or audiobooks
- Choose scenic routes
- Join a walking group
- Set daily step goals using a pedometer or fitness tracker

## Getting Started

Begin with 10-15 minutes of daily walking and gradually increase to 30 minutes. Even short walks provide benefits.

## The Walking Prescription

Health experts recommend at least 150 minutes of moderate-intensity walking per week for optimal health benefits.`,
    keyTakeaway:
      'Just 30 minutes of daily walking can significantly improve cardiovascular health, mental well-being, and overall longevity.',
    relatedTopics: ['Fitness', 'Exercise', 'Heart Health'],
  },
  {
    id: 'article-5',
    category: 'GENERAL',
    title: 'Understanding Your Annual Health Checkup',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-16'),
    author: {
      name: 'Dr. Elizabeth Moore',
      title: 'Primary Care Physician',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    content: `# Understanding Your Annual Health Checkup

Annual health checkups are an essential part of preventive medicine. This guide explains what to expect and how to prepare for your next checkup.

## Why Annual Checkups Matter

Regular checkups allow physicians to:
- Establish baseline health metrics
- Detect potential health issues early
- Monitor chronic conditions
- Update vaccinations
- Discuss lifestyle modifications

## What to Expect

### Physical Examination
Your doctor will check vital signs, perform a physical exam, and listen to your heart and lungs.

### Blood Work
Laboratory tests check for various health markers including cholesterol, blood sugar, and other indicators.

### Medical History
Be prepared to discuss any new symptoms, medications, or family health history changes.

## How to Prepare

- Bring insurance information and ID
- Make a list of current medications
- Note any health concerns
- Fast if blood work is ordered
- Wear comfortable clothing

## Making the Most of Your Visit

- Ask questions about your results
- Discuss preventive care options
- Update health goals with your physician
- Schedule any recommended follow-up appointments`,
    keyTakeaway: 'Annual health checkups are crucial for early disease detection and maintaining overall wellness.',
    relatedTopics: ['Preventive Care', 'Health Checkup', 'Wellness'],
  },
]
