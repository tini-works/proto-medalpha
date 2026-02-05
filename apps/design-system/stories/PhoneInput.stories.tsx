import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PhoneInput } from '@meda/ui'

const meta = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    verificationStatus: {
      control: 'select',
      options: ['none', 'pending', 'verified'],
    },
  },
} satisfies Meta<typeof PhoneInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [countryCode, setCountryCode] = useState('+49')
    const [phoneNumber, setPhoneNumber] = useState('')
    return (
      <div className="w-80">
        <PhoneInput
          label="Phone Number"
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={setCountryCode}
          onPhoneNumberChange={setPhoneNumber}
        />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: function Render() {
    const [countryCode, setCountryCode] = useState('+49')
    const [phoneNumber, setPhoneNumber] = useState('1234567890')
    return (
      <div className="w-80">
        <PhoneInput
          label="Phone Number"
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={setCountryCode}
          onPhoneNumberChange={setPhoneNumber}
        />
      </div>
    )
  },
}

export const WithHint: Story = {
  render: function Render() {
    const [countryCode, setCountryCode] = useState('+49')
    const [phoneNumber, setPhoneNumber] = useState('')
    return (
      <div className="w-80">
        <PhoneInput
          label="Phone Number"
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={setCountryCode}
          onPhoneNumberChange={setPhoneNumber}
          hint="We'll send a verification code to this number"
        />
      </div>
    )
  },
}

export const WithError: Story = {
  render: function Render() {
    const [countryCode, setCountryCode] = useState('+49')
    const [phoneNumber, setPhoneNumber] = useState('123')
    return (
      <div className="w-80">
        <PhoneInput
          label="Phone Number"
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={setCountryCode}
          onPhoneNumberChange={setPhoneNumber}
          error="Please enter a valid phone number"
        />
      </div>
    )
  },
}

export const Required: Story = {
  render: function Render() {
    const [countryCode, setCountryCode] = useState('+49')
    const [phoneNumber, setPhoneNumber] = useState('')
    return (
      <div className="w-80">
        <PhoneInput
          label="Phone Number"
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={setCountryCode}
          onPhoneNumberChange={setPhoneNumber}
          required
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-80">
        <PhoneInput
          label="Phone Number"
          countryCode="+49"
          phoneNumber="1234567890"
          onCountryCodeChange={() => {}}
          onPhoneNumberChange={() => {}}
          disabled
        />
      </div>
    )
  },
}

export const WithVerification: Story = {
  render: function Render() {
    const [countryCode, setCountryCode] = useState('+49')
    const [phoneNumber, setPhoneNumber] = useState('1234567890')
    const [status, setStatus] = useState<'none' | 'pending' | 'verified'>('none')

    const handleVerify = async () => {
      setStatus('pending')
      await new Promise((r) => setTimeout(r, 2000))
      setStatus('verified')
    }

    return (
      <div className="w-80">
        <PhoneInput
          label="Phone Number"
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={setCountryCode}
          onPhoneNumberChange={(num) => {
            setPhoneNumber(num)
            if (status === 'verified') setStatus('none')
          }}
          verificationStatus={status}
          onVerifyClick={handleVerify}
          pendingHint="Sending verification code..."
        />
      </div>
    )
  },
}

export const VerificationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <PhoneInput
        label="Not verified"
        countryCode="+49"
        phoneNumber="1234567890"
        onCountryCodeChange={() => {}}
        onPhoneNumberChange={() => {}}
        verificationStatus="none"
        onVerifyClick={() => {}}
      />
      <PhoneInput
        label="Pending verification"
        countryCode="+49"
        phoneNumber="1234567890"
        onCountryCodeChange={() => {}}
        onPhoneNumberChange={() => {}}
        verificationStatus="pending"
        pendingHint="Verification code sent"
      />
      <PhoneInput
        label="Verified"
        countryCode="+49"
        phoneNumber="1234567890"
        onCountryCodeChange={() => {}}
        onPhoneNumberChange={() => {}}
        verificationStatus="verified"
      />
    </div>
  ),
}

export const DifferentCountries: Story = {
  render: function Render() {
    const [phones, setPhones] = useState([
      { code: '+49', number: '1234567890' },
      { code: '+1', number: '5551234567' },
      { code: '+44', number: '7911123456' },
    ])

    return (
      <div className="flex flex-col gap-6 w-80">
        {phones.map((phone, i) => (
          <PhoneInput
            key={i}
            label={`Phone ${i + 1}`}
            countryCode={phone.code}
            phoneNumber={phone.number}
            onCountryCodeChange={(code) => {
              const updated = [...phones]
              updated[i].code = code
              setPhones(updated)
            }}
            onPhoneNumberChange={(num) => {
              const updated = [...phones]
              updated[i].number = num
              setPhones(updated)
            }}
          />
        ))}
      </div>
    )
  },
}
