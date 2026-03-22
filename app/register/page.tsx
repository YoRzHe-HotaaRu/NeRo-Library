'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import HCaptcha from '@hcaptcha/react-hcaptcha'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const router = useRouter()
  const captchaRef = useRef<HCaptcha>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!captchaToken) {
      setError('Please complete the captcha')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, captchaToken })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        captchaRef.current?.resetCaptcha()
        setCaptchaToken('')
      } else {
        router.push('/login?registered=true')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="header-box" style={{ background: '#336699' }}>
        Create New Account
      </div>

      <div style={{ maxWidth: '400px', margin: '20px auto' }}>
        {error && (
          <div style={{ background: '#ffeeee', border: '1px solid #cc0000', padding: '8px', marginBottom: '10px', color: '#cc0000', fontSize: '11px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <table style={{ width: '100%', border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ border: 'none', padding: '5px', fontWeight: 'bold', width: '120px' }}>Username:</td>
                <td style={{ border: 'none', padding: '5px' }}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ border: 'none', padding: '5px', fontWeight: 'bold' }}>Password:</td>
                <td style={{ border: 'none', padding: '5px' }}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ border: 'none', padding: '5px', fontWeight: 'bold' }}>Confirm:</td>
                <td style={{ border: 'none', padding: '5px' }}>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ border: 'none', padding: '5px' }}></td>
                <td style={{ border: 'none', padding: '5px' }}>
                  <HCaptcha
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'}
                    onVerify={(token) => setCaptchaToken(token)}
                    ref={captchaRef}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ border: 'none', padding: '5px' }}></td>
                <td style={{ border: 'none', padding: '5px' }}>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <hr className="separator" />

        <div style={{ textAlign: 'center', fontSize: '10px', color: '#666', background: '#ffffee', padding: '8px', border: '1px solid #ddd' }}>
          <strong>Privacy Notice:</strong> We do not collect any personal data. Your username and password are stored securely and are only used for login purposes. No email, no tracking, no data sharing.
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', marginTop: '10px' }}>
          Already have an account? <Link href="/login">Login here</Link>
        </div>
      </div>
    </div>
  )
}
