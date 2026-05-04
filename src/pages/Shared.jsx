import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getShared } from '../services/api.js'
import ResultCard from '../components/ResultCard.jsx'
import { Shield } from 'lucide-react'

export default function Shared() {
  const { shareId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getShared(shareId).then(setData).catch(e => setError(e.response?.data?.error || 'Not found')).finally(() => setLoading(false))
  }, [shareId])

  if (loading) return <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text2)' }}><div className="spinner" /> Loading shared analysis...</div>
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>❌ {error}</div>

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <Shield size={20} style={{ color: 'var(--accent)' }} />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Shared Analysis</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Analyzed on {new Date(data.createdAt).toLocaleString()}</p>
        </div>
      </div>
      {data.input && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p className="section-label">Original Content</p>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{data.input.slice(0, 500)}{data.input.length > 500 ? '...' : ''}</p>
        </div>
      )}
      <ResultCard data={data} type={data.type} />
    </div>
  )
}
