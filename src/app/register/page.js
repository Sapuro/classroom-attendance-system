
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    const { error: insertError } = await supabase.from('teachers').insert({
      id: data.user.id,
      email: form.email,
      full_name: form.full_name,
      initials: form.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    if (insertError) { setError(insertError.message); setLoading(false); return }
    router.push('/dashboard')
  }

  const fields = [
    { label: 'Full name', name: 'full_name', type: 'text', placeholder: 'e.g. Maria Cruz' },
    { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@school.edu' },
    { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
    { label: 'Confirm password', name: 'confirm', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-app)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px', background: 'var(--accent)',
            borderRadius: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px'
          }}>🎓</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Create account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Register as a ClassTrack teacher
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '32px'
        }}>
          <form onSubmit={handleRegister}>
            {fields.map(field => (
              <div key={field.name} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {field.label}
                </label>
                <input type={field.type} name={field.name}
                  placeholder={field.placeholder} value={form[field.name]}
                  onChange={handleChange} required />
              </div>
            ))}

            {error && (
              <div style={{
                background: '#2d1117', border: '1px solid #da3633', borderRadius: '8px',
                padding: '10px 14px', fontSize: '13px', color: '#da3633', marginBottom: '16px'
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px',
              background: loading ? 'var(--accent-tint)' : 'var(--accent)',
              color: loading ? 'var(--accent)' : '#0f1117',
              border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div style={{
            marginTop: '24px', paddingTop: '24px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)'
          }}>
            Already have an account?{' '}
            <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  )
}