import React, { useEffect, useState } from 'react'
import { getStats } from '../services/api.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { TrendingUp, Shield, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react'
import './Dashboard.css'

const COLORS = ['#ef4444', '#22c55e', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats().then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="dash-loading">
      <div className="spinner" /> Loading dashboard...
    </div>
  )

  if (!stats) return <div className="dash-empty">Could not load stats.</div>

  const verdictData = Object.entries(stats.byVerdict || {}).map(([k, v]) => ({ name: k, value: v }))
  const typeData = Object.entries(stats.byType || {}).map(([k, v]) => ({ name: k, count: v }))
  const trendData = (stats.trend || []).map(t => ({ date: t._id.slice(5), count: t.count }))

  const fakeCount = Object.entries(stats.byVerdict || {}).filter(([k]) => k.includes('FAKE') || k.includes('MISLEAD') || k.includes('AI-GEN') || k.includes('DEEPFAKE')).reduce((a, [, v]) => a + v, 0)
  const realCount = Object.entries(stats.byVerdict || {}).filter(([k]) => k.includes('REAL') || k.includes('CREDIBLE') || k.includes('AUTHENTIC')).reduce((a, [, v]) => a + v, 0)

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <p>Analytics and insights from your analyses.</p>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}><Activity size={20} /></div>
          <div className="stat-val">{stats.total}</div>
          <div className="stat-label">Total Analyses</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><XCircle size={20} /></div>
          <div className="stat-val">{fakeCount}</div>
          <div className="stat-label">Fake / Misleading</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#22c55e' }}><CheckCircle size={20} /></div>
          <div className="stat-val">{realCount}</div>
          <div className="stat-label">Credible / Real</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><Shield size={20} /></div>
          <div className="stat-val">{stats.avgConfidence}%</div>
          <div className="stat-label">Avg Confidence</div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Trend */}
        <div className="chart-card wide">
          <div className="chart-title"><TrendingUp size={16} /> Analyses Last 7 Days</div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text2)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text2)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
                <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="chart-empty">Not enough data yet</div>}
        </div>

        {/* Verdict distribution */}
        <div className="chart-card">
          <div className="chart-title">Verdict Distribution</div>
          {verdictData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={verdictData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {verdictData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="chart-empty">No data yet</div>}
        </div>

        {/* By type */}
        <div className="chart-card">
          <div className="chart-title">By Content Type</div>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text2)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text2)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="chart-empty">No data yet</div>}
        </div>
      </div>

      {/* Top red flags */}
      {stats.topFlags?.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="chart-title" style={{ marginBottom: '1rem' }}><AlertTriangle size={16} /> Most Common Red Flags</div>
          <div className="flags-list">
            {stats.topFlags.map((f, i) => (
              <div key={i} className="flag-row">
                <span className="flag-rank">#{i + 1}</span>
                <span className="flag-name">{f._id}</span>
                <span className="flag-count">{f.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
