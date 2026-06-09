'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  { label: 'Dashboard', icon: '⊞', path: '/dashboard' },
  { label: 'Sections', icon: '👥', path: '/sections' },
  { label: 'Attendance Scan', icon: '⟳', path: '/attendance' },
  { label: 'Reports', icon: '📊', path: '/reports' },
]

export default function Sidebar({ teacher, active }) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{
      width: '250px', background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, minHeight: '100vh'
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px 16px', borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          width: '36px', height: '36px', background: 'var(--accent)',
          borderRadius: '8px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '18px', flexShrink: 0
        }}>🎓</div>
        <div>
          <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2' }}>
            ClassTrack
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Teacher Console
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(item => {
          const isActive = active === item.label.toLowerCase().replace(' ', '-')
          return (
            <div
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px',
                fontSize: '14px', cursor: 'pointer',
                background: isActive ? 'var(--accent-tint)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: isActive ? '500' : '400',
                transition: 'background 0.15s, color 0.15s'
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Signed in as <strong style={{ color: 'var(--text-secondary)' }}>{teacher?.full_name || 'Teacher'}</strong>
        </p>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '8px',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '6px', color: 'var(--text-secondary)',
            fontSize: '12px', cursor: 'pointer'
          }}>
          Sign out
        </button>
      </div>
    </div>
  )
}