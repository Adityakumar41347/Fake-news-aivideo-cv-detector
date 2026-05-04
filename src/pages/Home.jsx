import React, { useState } from 'react'
import { analyzeCv, analyzeNews, analyzeVideo, scrapeUrl } from '../services/api.js'
import ResultCard from '../components/ResultCard.jsx'
import { FileText, Newspaper, Video, Link, Sparkles, ChevronRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import './Home.css'

const TABS = [
  { id: 'news', label: 'News / Text', icon: <Newspaper size={16} /> },
  { id: 'video', label: 'AI Video', icon: <Video size={16} /> },
  { id: 'url', label: 'URL Scraper', icon: <Link size={16} /> },
  { id: 'cv', label: 'CV Analyser', icon: <FileText size={16} /> },
]

export default function Home() {
  const [tab, setTab] = useState('news')
  const [multiModel, setMultiModel] = useState(false)

  // News
  const [newsText, setNewsText] = useState('')
  const [newsSource, setNewsSource] = useState('')
  const [newsResult, setNewsResult] = useState(null)
  const [newsLoading, setNewsLoading] = useState(false)

  // Video
  const [videoText, setVideoText] = useState('')
  const [videoPlatform, setVideoPlatform] = useState('')
  const [videoContext, setVideoContext] = useState('')
  const [videoResult, setVideoResult] = useState(null)
  const [videoLoading, setVideoLoading] = useState(false)

  // URL
  const [url, setUrl] = useState('')
  const [urlResult, setUrlResult] = useState(null)
  const [urlLoading, setUrlLoading] = useState(false)
  const [scrapeStatus, setScrapeStatus] = useState('')

  // CV
  const [cvText, setCvText] = useState('')
  const [cvJobTitle, setCvJobTitle] = useState('')
  const [cvCompany, setCvCompany] = useState('')
  const [cvResult, setCvResult] = useState(null)
  const [cvLoading, setCvLoading] = useState(false)

  const handleNews = async (e) => {
    e.preventDefault()
    if (!newsText.trim()) return toast.error('Please enter some text')
    setNewsLoading(true); setNewsResult(null)
    try {
      const data = await analyzeNews({ text: newsText, source: newsSource, multiModel })
      setNewsResult(data)
      toast.success('Analysis complete!')
    } catch (err) { toast.error(err.response?.data?.error || err.message) }
    setNewsLoading(false)
  }

  const handleVideo = async (e) => {
    e.preventDefault()
    if (!videoText.trim()) return toast.error('Please describe the video')
    setVideoLoading(true); setVideoResult(null)
    try {
      const data = await analyzeVideo({ text: videoText, platform: videoPlatform, context: videoContext, multiModel })
      setVideoResult(data)
      toast.success('Analysis complete!')
    } catch (err) { toast.error(err.response?.data?.error || err.message) }
    setVideoLoading(false)
  }

  const handleUrl = async (e) => {
    e.preventDefault()
    if (!url.trim()) return toast.error('Please enter a URL')
    setUrlLoading(true); setUrlResult(null); setScrapeStatus('Fetching article...')
    try {
      const scraped = await scrapeUrl(url)
      setScrapeStatus('Analyzing content...')
      const data = await analyzeNews({ text: scraped.text, source: url, multiModel })
      setUrlResult({ ...data, scrapedTitle: scraped.title })
      toast.success('Analysis complete!')
    } catch (err) { toast.error(err.response?.data?.error || err.message) }
    setUrlLoading(false); setScrapeStatus('')
  }

  const handleCv = async (e) => {
    e.preventDefault()
    if (!cvText.trim()) return toast.error('Please paste the CV text')
    setCvLoading(true); setCvResult(null)
    try {
      const data = await analyzeCv({ text: cvText, jobTitle: cvJobTitle, company: cvCompany })
      setCvResult(data)
      toast.success('CV analysis complete!')
    } catch (err) { toast.error(err.response?.data?.error || err.message) }
    setCvLoading(false)
  }

  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge"><Sparkles size={13} /> AI-Powered Detection</div>
        <h1 className="hero-title">Detect <span className="gradient-text">Fake News</span> & <span className="gradient-text">AI Videos</span></h1>
        <p className="hero-sub">Analyze any content for misinformation, deepfakes, and AI-generated media using advanced language models.</p>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Multi-model toggle */}
      <div className="options-bar">
        <label className="toggle-wrap">
          <div className={`toggle ${multiModel ? 'on' : ''}`} onClick={() => setMultiModel(v => !v)}>
            <div className="toggle-thumb" />
          </div>
          <span>Multi-model comparison <span className="option-hint">(slower, more accurate)</span></span>
        </label>
      </div>

      {/* NEWS */}
      {tab === 'news' && (
        <form className="card analyze-form" onSubmit={handleNews}>
          <label className="label">Article text or headline</label>
          <textarea className="input textarea" value={newsText} onChange={e => setNewsText(e.target.value)} placeholder="Paste the full article, headline, or social media post you want to verify..." rows={6} />
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label className="label">Source (optional)</label>
              <input className="input" type="text" value={newsSource} onChange={e => setNewsSource(e.target.value)} placeholder="e.g. CNN, BBC, https://..." />
            </div>
            <button className="btn-primary submit-btn" type="submit" disabled={newsLoading}>
              {newsLoading ? <><Loader2 size={15} className="spin" /> Analyzing...</> : <>Analyze <ChevronRight size={15} /></>}
            </button>
          </div>
        </form>
      )}

      {/* VIDEO */}
      {tab === 'video' && (
        <form className="card analyze-form" onSubmit={handleVideo}>
          <label className="label">Describe what you observe in the video</label>
          <textarea className="input textarea" value={videoText} onChange={e => setVideoText(e.target.value)} placeholder="Describe visual artifacts: unnatural face movements, blurry edges, lip sync issues, lighting inconsistencies, unusual eye blinking, background glitches..." rows={6} />
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label className="label">Platform</label>
              <input className="input" type="text" value={videoPlatform} onChange={e => setVideoPlatform(e.target.value)} placeholder="YouTube, TikTok, Twitter..." />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Subject / Context</label>
              <input className="input" type="text" value={videoContext} onChange={e => setVideoContext(e.target.value)} placeholder="Political speech, celebrity..." />
            </div>
          </div>
          <button className="btn-primary submit-btn" type="submit" disabled={videoLoading} style={{ marginTop: 12 }}>
            {videoLoading ? <><Loader2 size={15} className="spin" /> Analyzing...</> : <>Analyze Video <ChevronRight size={15} /></>}
          </button>
        </form>
      )}

      {/* URL */}
      {tab === 'url' && (
        <form className="card analyze-form" onSubmit={handleUrl}>
          <label className="label">Paste a news article URL</label>
          <div className="url-input-wrap">
            <Link size={16} className="url-icon" />
            <input className="input url-input" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/news-article" />
          </div>
          <p className="form-hint">We'll automatically fetch and analyze the article content for you.</p>
          <button className="btn-primary submit-btn" type="submit" disabled={urlLoading} style={{ marginTop: 12 }}>
            {urlLoading ? <><Loader2 size={15} className="spin" /> {scrapeStatus || 'Processing...'}</> : <>Fetch & Analyze <ChevronRight size={15} /></>}
          </button>
        </form>
      )}
      {tab === 'cv' && (
        <form className="card analyze-form" onSubmit={handleCv}>
          <label className="label">CV or resume text</label>
          <textarea className="input textarea cv-textarea" value={cvText} onChange={e => setCvText(e.target.value)} placeholder="Paste the candidate's CV or resume text for AI-writing and quality analysis..." rows={8} />
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label className="label">Role (optional)</label>
              <input className="input" type="text" value={cvJobTitle} onChange={e => setCvJobTitle(e.target.value)} placeholder="e.g. Frontend Developer" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Company (optional)</label>
              <input className="input" type="text" value={cvCompany} onChange={e => setCvCompany(e.target.value)} placeholder="e.g. Acme Inc." />
            </div>
          </div>
          <button className="btn-primary submit-btn" type="submit" disabled={cvLoading} style={{ marginTop: 12 }}>
            {cvLoading ? <><Loader2 size={15} className="spin" /> Analyzing CV...</> : <>Analyze CV <ChevronRight size={15} /></>}
          </button>
        </form>
      )}

      {/* Results */}
      {newsResult && tab === 'news' && <ResultCard data={newsResult} type="news" />}
      {videoResult && tab === 'video' && <ResultCard data={videoResult} type="video" />}
      {urlResult && tab === 'url' && (
        <>
          {urlResult.scrapedTitle && <div className="scraped-title">📰 {urlResult.scrapedTitle}</div>}
          <ResultCard data={urlResult} type="url" />
        </>
      )}
      {cvResult && tab === 'cv' && <ResultCard data={cvResult} type="cv" />}
    </div>
  )
}
