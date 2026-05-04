import React, { useEffect, useState } from 'react'
import { getHistory, deleteAnalysis, toggleBookmark } from '../services/api.js'
import { Trash2, Bookmark, BookmarkCheck, Share2, XCircle, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import './History.css'

function getBadgeInfo(verdict = '', type) {
  const v = verdict.toUpperCase()
  if (type === 'news' || type === 'url') {
    if (v.includes('FAKE') || v.includes('MISLEAD')) return { cls: 'badge-fake', icon: <XCircle size={11} /> }
    if (v.includes('REAL') || v.includes('CREDIBLE')) return { cls: 'badge-real', icon: <CheckCircle size={11} /> }
    return { cls: 'badge-uncertain', icon: <AlertTriangle size={11} /> }
  } else {
    if (v.includes('AI') || v.includes('DEEPFAKE') || v.includes('SYNTHETIC')) return { cls: 'badge-ai', icon: <XCircle size={11} /> }
    if (v.includes('AUTHENTIC') || v.includes('HUMAN') || v.includes('REAL')) return { cls: 'badge-human', icon: <CheckCircle size={11} /> }
    return { cls: 'badge-uncertain', icon: <AlertTriangle size={11} /> }
  }
}

export default function History() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getHistory({ type: filter || undefined, page, limit: 10 })
      setItems(data.items)
      setTotalPages(data.pages)
      setTotal(data.total)
    } catch (e) { toast.error(e.message) }
    setLoading(false)
  }

  useEffect(() => { setPage(1) }, [filter])
  useEffect(() => { load() }, [filter, page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return
    try {
      await deleteAnalysis(id)
      setItems(prev => prev.filter(i => i._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  const handleBookmark = async (id) => {
    try {
      const r = await toggleBookmark(id)
      setItems(prev => prev.map(i => i._id === id ? { ...i, isBookmarked: r.isBookmarked } : i))
      toast.success(r.isBookmarked ? 'Bookmarked!' : 'Bookmark removed')
    } catch { toast.error('Failed') }
  }

  const handleShare = (shareId) => {
    const url = `${window.location.origin}/share/${shareId}`
    navigator.clipboard.writeText(url)
    toast.success('Share link copied!')
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>History</h1>
          <p>{total} total analyses</p>
        </div>
      </div>

      <div className="filter-bar">
        {['', 'news', 'video', 'url', 'cv'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === '' ? 'All' : f === 'news' ? 'News' : f === 'video' ? 'Video' : f === 'url' ? 'URL' : 'CV'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="history-loading"><div className="spinner" /> Loading...</div>
      ) : items.length === 0 ? (
        <div className="history-empty">
          <Shield size={40} style={{ color: 'var(--text3)', marginBottom: 12 }} />
          <p>No analyses yet.</p>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>Go to Detect to start analyzing content!</p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {items.map(item => {
              const { cls, icon } = getBadgeInfo(item.verdict, item.type)
              return (
                <div className="history-item" key={item._id}>
                  <div className="history-item-left">
                    <div className="history-item-top">
                      <span className="type-pill">{item.type.toUpperCase()}</span>
                      <span className={`badge ${cls}`}>{icon} {item.verdict}</span>
                      <span className="conf-text">{item.confidence}%</span>
                    </div>
                    <p className="history-input">{item.input?.slice(0, 130)}{item.input?.length > 130 ? '...' : ''}</p>
                    {item.summary && <p className="history-summary">{item.summary}</p>}
                    <p className="history-date">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="history-item-actions">
                    <button className="icon-btn" onClick={() => handleBookmark(item._id)} title="Bookmark">
                      {item.isBookmarked ? <BookmarkCheck size={15} color="var(--accent)" /> : <Bookmark size={15} />}
                    </button>
                    {item.shareId && (
                      <button className="icon-btn" onClick={() => handleShare(item.shareId)} title="Share">
                        <Share2 size={15} />
                      </button>
                    )}
                    <button className="icon-btn danger" onClick={() => handleDelete(item._id)} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn-ghost" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button className="btn-ghost" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
