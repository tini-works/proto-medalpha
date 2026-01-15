import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { theme, getColor, getSpacing } from './src/theme'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MA Mobile</Text>
      <Text style={styles.subtitle}>Design System Demo</Text>

      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={getColor('neutral.400')} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={getColor('neutral.400')} secureTextEntry />

        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor('neutral.50'),
    alignItems: 'center',
    justifyContent: 'center',
    padding: getSpacing('4'),
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold as '700',
    color: getColor('neutral.900'),
    marginBottom: getSpacing('2'),
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: getColor('neutral.600'),
    marginBottom: getSpacing('8'),
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: getSpacing('6'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: getColor('neutral.300'),
    borderRadius: 8,
    paddingHorizontal: getSpacing('3'),
    marginBottom: getSpacing('4'),
    fontSize: theme.typography.fontSize.base,
  },
  buttonPrimary: {
    width: '100%',
    height: 48,
    backgroundColor: getColor('primary.600'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpacing('3'),
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium as '500',
  },
  buttonSecondary: {
    width: '100%',
    height: 48,
    backgroundColor: getColor('neutral.200'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: getColor('neutral.900'),
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium as '500',
  },
})
