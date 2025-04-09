'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';

type FormData = {
  mobile: string;
};

export default function AuthPage() {
  const { formState: { errors } } = useForm<FormData>();
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [sent, setSent] = useState(false)

  const handleSendOTP = async () => {
    await fetch('/api/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: phone }),
      headers: { 'Content-Type': 'application/json' },
    })
    setSent(true)
  }

  const handleVerifyAndLogin = async (e: any) => {
    e.preventDefault()
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
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="hero-gradient">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold">Probably</span>
              </div>
            </div>

            {/* Auth Card */}
            <div className="gradient-border card-shine rounded-xl bg-black/40 p-8">
              <div className="mb-6 text-center">
                <h1 className="mb-2 text-2xl font-bold">Welcome Back</h1>
                <p className="text-[hsl(var(--muted))]">
                  Sign in with your mobile number
                </p>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted))]">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full rounded-lg border border-purple-500/20 bg-black/20 p-3 text-white outline-none transition-all focus:border-purple-500/50"
                  />
                  {errors.mobile && (
                    <p className="mt-2 text-sm text-red-400">{errors.mobile.message}</p>
                  )}
                </div>

                {sent ? (
                  <>
                    <input
                      placeholder="Code"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      className="w-full rounded-lg border border-purple-500/20 bg-black/20 p-3 text-white outline-none transition-all focus:border-purple-500/50"
                    />
                    <button onClick={handleVerifyAndLogin}
                    className="glow group w-full rounded-xl bg-[hsl(var(--primary))] py-4 text-lg font-semibold transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-[1.02]">Verify & Login</button>
                  </>
                ): (
                  <button
                  type="button"
                  className="glow group w-full rounded-xl bg-[hsl(var(--primary))] py-4 text-lg font-semibold transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-[1.02]"
                  onClick={handleSendOTP}
                >
                  Send OTP
                  <ArrowRight className="ml-2 inline h-5 w-5 transition-all group-hover:translate-x-1" />
                </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}