import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef } from 'react'
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'

export default function App() {
  const { height, width } = useWindowDimensions()
  const cardAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [cardAnim])

  const maxCardWidth = Math.min(width - space[6] * 2, 420)

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: palette.neutral50 }}
      contentContainerStyle={{
        padding: space[6],
        gap: space[6],
        minHeight: height,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <View
        style={{
          width: maxCardWidth,
          backgroundColor: palette.brand500,
          borderRadius: 24,
          borderCurve: 'continuous',
          padding: space[6],
          overflow: 'hidden',
          boxShadow: shadows.elev3,
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: 90,
            borderCurve: 'continuous',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            top: -60,
            right: -30,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: 70,
            borderCurve: 'continuous',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            bottom: -50,
            left: -20,
          }}
        />
        <Text selectable style={type.labelCaps}>
          Welcome back
        </Text>
        <Text selectable style={type.display}>
          Sign in to your care plan
        </Text>
        <Text selectable style={type.heroBody}>
          A calmer, more personal experience for your ongoing treatment and progress.
        </Text>
        <View style={{ flexDirection: 'row', gap: space[2], marginTop: space[4] }}>
          <View style={chipStyles.active}>
            <Text selectable style={type.chipTextActive}>
              HIPAA ready
            </Text>
          </View>
          <View style={chipStyles.subtle}>
            <Text selectable style={type.chipTextSubtle}>
              Personalized
            </Text>
          </View>
        </View>
      </View>

      <Animated.View
        style={{
          width: maxCardWidth,
          backgroundColor: palette.surface,
          borderRadius: 20,
          borderCurve: 'continuous',
          padding: space[5],
          gap: space[4],
          borderWidth: 1,
          borderColor: palette.neutral200,
          boxShadow: shadows.elev2,
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        }}
      >
        <View style={{ gap: space[3] }}>
          <Text selectable style={type.sectionTitle}>
            Sign in
          </Text>
          <Text selectable style={type.body}>
            Use your email to continue your plan and track progress.
          </Text>
        </View>

        <View style={{ gap: space[3] }}>
          <View style={{ gap: space[2] }}>
            <Text selectable style={type.label}>
              Email address
            </Text>
            <TextInput
              placeholder="name@email.com"
              placeholderTextColor={palette.neutral400}
              autoCapitalize="none"
              keyboardType="email-address"
              style={inputStyles.base}
            />
          </View>
          <View style={{ gap: space[2] }}>
            <Text selectable style={type.label}>
              Password
            </Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={palette.neutral400}
              secureTextEntry
              style={inputStyles.base}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            buttonStyles.primary,
            pressed && { backgroundColor: palette.brand600 },
          ]}
        >
          <Text selectable style={type.buttonPrimary}>
            Continue
          </Text>
        </Pressable>

        <View style={{ alignItems: 'center', gap: space[2] }}>
          <Pressable style={({ pressed }) => [buttonStyles.ghost, pressed && buttonStyles.ghostPressed]}>
            <Text selectable style={type.buttonGhost}>
              Forgot password?
            </Text>
          </Pressable>
          <Pressable style={({ pressed }) => [buttonStyles.outline, pressed && buttonStyles.outlinePressed]}>
            <Text selectable style={type.buttonOutline}>
              Create an account
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      <View style={{ width: maxCardWidth, gap: space[2] }}>
        <Text selectable style={type.caption}>
          By continuing, you agree to the MedAlpha Terms and Privacy Policy.
        </Text>
        <Text selectable style={type.caption}>
          Need help? Contact support@medalpha.health.
        </Text>
      </View>

      <StatusBar style="dark" />
    </ScrollView>
  )
}

const palette = {
  brand500: '#F28C5C',
  brand600: '#E57748',
  neutral50: '#FFFBF7',
  neutral100: '#F6F0E9',
  neutral200: '#E7DED6',
  neutral400: '#B8ADA3',
  neutral600: '#6C6158',
  neutral900: '#1F1A16',
  surface: '#FFFFFF',
}

const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
} as const

const shadows = {
  elev2: '0 6px 16px rgba(31, 26, 22, 0.08)',
  elev3: '0 14px 28px rgba(31, 26, 22, 0.12)',
}

const type = {
  display: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: space[2],
  },
  heroBody: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: space[2],
  },
  labelCaps: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    color: palette.neutral900,
  },
  body: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
    color: palette.neutral600,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
    color: palette.neutral600,
  },
  buttonPrimary: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  buttonGhost: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
    color: palette.neutral600,
  },
  buttonOutline: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600' as const,
    color: palette.neutral900,
  },
  chipTextActive: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    color: palette.brand500,
  },
  chipTextSubtle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    color: palette.neutral400,
  },
}

const inputStyles = {
  base: {
    height: 48,
    borderRadius: 12,
    borderCurve: 'continuous' as const,
    borderWidth: 1,
    borderColor: palette.neutral200,
    paddingHorizontal: space[4],
    backgroundColor: palette.neutral100,
    fontSize: 18,
    color: palette.neutral900,
  },
}

const buttonStyles = {
  primary: {
    height: 50,
    borderRadius: 16,
    borderCurve: 'continuous' as const,
    backgroundColor: palette.brand500,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  ghost: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  ghostPressed: {
    backgroundColor: palette.neutral100,
  },
  outline: {
    height: 48,
    borderRadius: 14,
    borderCurve: 'continuous' as const,
    borderWidth: 1,
    borderColor: palette.neutral200,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: '100%',
  },
  outlinePressed: {
    backgroundColor: palette.neutral100,
  },
}

const chipStyles = {
  active: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: palette.neutral50,
  },
  subtle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}
