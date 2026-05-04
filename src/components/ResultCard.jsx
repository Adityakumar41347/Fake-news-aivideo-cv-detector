import React, { useEffect, useRef } from 'react'
import { ExternalLink, Bookmark, BookmarkCheck, Download, Share2, CheckCircle, XCircle, AlertTriangle, Bot, User } from 'lucide-react'
import { toggleBookmark } from '../services/api.js'
import toast from 'react-hot-toast'
import './ResultCard.css'

function getBadgeInfo(verdict = '', type) {
  const v = verdict.toUpperCase()
  if (type === 'news' || type === 'url') {
    if (v.includes('FAKE') || v.includes('FALSE') || v.includes('MISLEADING'))
      return { cls: 'badge-fake', icon: <XCircle size={12} />, bar: 'bar-red' }
    if (v.includes('REAL') || v.includes('CREDIBLE') || v.includes('TRUE'))
      return { cls: 'badge-real', icon: <CheckCircle size={12} />, bar: 'bar-green' }
    return { cls: 'badge-uncertain', icon: <AlertTriangle size={12} />, bar: 'bar-amber' }
  } else {
    if (v.includes('AI') || v.includes('SYNTHETIC') || v.includes('DEEPFAKE') || v.includes('GENERATED'))
      return { cls: 'badge-ai', icon: <Bot size={12} />, bar: 'bar-red' }
    if (v.includes('HUMAN') || v.includes('AUTHENTIC') || v.includes('REAL'))
      return { cls: 'badge-human', icon: <User size={12} />, bar: 'bar-green' }
    return { cls: 'badge-uncertain', icon: <AlertTriangle size={12} />, bar: 'bar-amber' }
  }
}

export default function ResultCard({ data, type, onBookmarkToggle }) {
  const barRef = useRef(null)
  const conf = Math.min(100, Math.max(0, parseInt(data.confidence) || 70))
  const { cls, icon, bar } = getBadgeInfo(data.verdict, type)

  useEffect(() => {
    const t = setTimeout(() => { if (barRef.current) barRef.current.style.width = conf + '%' }, 150)
    return () => clearTimeout(t)
  }, [conf])

  const handleBookmark = async () => {
    if (!data._id) return
    try {
      const r = await toggleBookmark(data._id)
      toast.success(r.isBookmarked ? 'Bookmarked!' : 'Bookmark removed')
      onBookmarkToggle?.(r.isBookmarked)
    } catch { toast.error('Failed to bookmark') }
  }

  const handleShare = () => {
    if (data.shareId) {
      const url = `${window.location.origin}/share/${data.shareId}`
      navigator.clipboard.writeText(url)
      toast.success('Share link copied!')
    }
  }

  const handleExport = () => {
    if (data._id) window.open(`/api/export/${data._id}`, '_blank')
  }

  return (
    <div className="result-card">
      {/* Header */}
      <div className="result-header">
        <div className="result-verdict-wrap">
          <span className={`badge ${cls}`}>{icon} {data.verdict}</span>
          <p className="result-summary">{data.summary}</p>
        </div>
        <div className="result-actions">
          <button className="icon-btn" onClick={handleBookmark} title="Bookmark">
            {data.isBookmarked ? <BookmarkCheck size={16} color="var(--accent)" /> : <Bookmark size={16} />}
          </button>
          <button className="icon-btn" onClick={handleShare} title="Copy share link">
            <Share2 size={16} />
          </button>
          <button className="icon-btn" onClick={handleExport} title="Export PDF">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Confidence */}
      <div className="confidence-wrap">
        <div className="confidence-labels">
          <span className="section-label">Confidence Score</span>
          <span className="confidence-pct">{conf}%</span>
        </div>
        <div className="confidence-track">
          <div className={`confidence-fill ${bar}`} ref={barRef} style={{ width: '0%' }} />
        </div>
      </div>

      {/* Signals */}
      {(data.red_flags?.length || data.warnings?.length || data.green_flags?.length) > 0 && (
        <div className="signals-section">
          <p className="section-label">Signals Detected</p>
          <div className="chips-wrap">
            {(data.red_flags || []).map((s, i) => <span key={i} className="chip chip-red"><XCircle size={11} />{s}</span>)}
            {(data.warnings || []).map((s, i) => <span key={i} className="chip chip-amber"><AlertTriangle size={11} />{s}</span>)}
            {(data.green_flags || []).map((s, i) => <span key={i} className="chip chip-green"><CheckCircle size={11} />{s}</span>)}
          </div>
        </div>
      )}

      {/* Analysis */}
      {data.analysis && (
        <div className="analysis-section">
          <p className="section-label">Detailed Analysis</p>
          <p className="analysis-text">{data.analysis}</p>
        </div>
      )}

      {/* CV quality */}
      {type === 'cv' && (data.quality_score || data.quality_feedback?.length > 0) && (
        <div className="cv-quality-section">
          <div className="confidence-labels">
            <span className="section-label">CV Quality</span>
            {data.quality_score && <span className="confidence-pct">{data.quality_score}%</span>}
          </div>
          {data.quality_score && (
            <div className="confidence-track">
              <div className="confidence-fill bar-green" style={{ width: `${Math.min(100, Math.max(0, parseInt(data.quality_score) || 0))}%` }} />
            </div>
          )}
          {data.quality_feedback?.length > 0 && (
            <div className="quality-feedback">
              {data.quality_feedback.map((item, i) => <p key={i}>{item}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Multi-model comparison */}
      {(data.model1 || data.model2) && (
        <div className="multimodel-section">
          <p className="section-label">Multi-Model Comparison</p>
          <div className="multimodel-grid">
            {data.model1 && (
              <div className="model-card">
                <div className="model-name">Llama 3.3 70B</div>
                <span className={`badge ${getBadgeInfo(data.model1.verdict, type).cls}`} style={{ fontSize: 10 }}>{data.model1.verdict}</span>
                <div className="model-conf">{data.model1.confidence}% confidence</div>
              </div>
            )}
            {data.model2 && (
              <div className="model-card">
                <div className="model-name">Mixtral 8x7B</div>
                <span className={`badge ${getBadgeInfo(data.model2.verdict, type).cls}`} style={{ fontSize: 10 }}>{data.model2.verdict}</span>
                <div className="model-conf">{data.model2.confidence}% confidence</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fact check links */}
      {data.factCheckLinks?.length > 0 && (
        <div className="factcheck-section">
          <p className="section-label">Fact Check Resources</p>
          <div className="factcheck-links">
            {data.factCheckLinks.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="factcheck-link">
                <ExternalLink size={12} /> {l.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      {data.recommendation && (
        <>
          <div className="divider" />
          <div className="recommendation">
            <p className="section-label">Recommendation</p>
            <p className="recommendation-text">{data.recommendation}</p>
          </div>
        </>
      )}
    </div>
  )
}
