'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState(null)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: teacherData } = await supabase
        .from('teachers').select('*').eq('id', user.id).single()
      setTeacher(teacherData)

      const { data: sectionsData } = await supabase
        .from('sections').select('*').eq('teacher_id', user.id).order('created_at', { ascending: false })
      setSections(sectionsData || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar teacher={teacher} active="dashboard" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{
          height: '56px', background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            School Year 2025–2026 · 2nd Quarter
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--accent)', color: '#0f1117',
              fontSize: '12px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {teacher?.initials || '?'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Welcome back, {teacher?.full_name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Here's an overview of your classes
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total sections', value: sections.length },
              { label: 'Total students', value: sections.reduce((a, s) => a + (s.student_count || 0), 0) },
              { label: 'School year', value: '2025–2026' },
              { label: 'Quarter', value: '2nd' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '20px'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
              My sections
            </h2>
            <button
              onClick={() => router.push('/sections/new')}
              style={{
                background: 'var(--accent)', color: '#0f1117',
                border: 'none', borderRadius: '8px',
                padding: '8px 16px', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer'
              }}>
              + Add section
            </button>
          </div>

          {sections.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '48px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>📚</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                No sections yet
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Create your first section to get started
              </p>
              <button
                onClick={() => router.push('/sections/new')}
                style={{
                  background: 'var(--accent)', color: '#0f1117',
                  border: 'none', borderRadius: '8px',
                  padding: '10px 24px', fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer'
                }}>
                Create first section
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {sections.map(section => (
                <div
                  key={section.id}
                  onClick={() => router.push(`/sections/${section.id}`)}
                  style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '20px', cursor: 'pointer',
                    transition: 'border-color 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {section.subject}
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {section.grade_level} – {section.name}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {section.schedule} · {section.room}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}