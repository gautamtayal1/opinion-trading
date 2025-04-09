'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function Page() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)

  const handleSendOTP = async () => {
    await fetch('/api/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: phone }),
      headers: { 'Content-Type': 'application/json' },
    })
    setSent(true)
  }

  const handleVerifyAndLogin = async () => {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: phone, code }),
      headers: { 'Content-Type': 'application/json' },
    })

    const json = await res.json()
    if (json.success) {
      await signIn('credentials', { phoneNumber: phone, callbackUrl: '/' })
    } else {
      alert('OTP verification failed')
    }
  }

  return (
    <div>
      <input
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <button onClick={handleSendOTP}>Send OTP</button>

      {sent && (
        <>
          <input
            placeholder="Code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button onClick={handleVerifyAndLogin}>Verify & Login</button>
        </>
      )}
    </div>
  )
}
