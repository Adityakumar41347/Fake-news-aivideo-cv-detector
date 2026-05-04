import axios from 'axios'

const api = axios.create({ baseURL: 'https://fake-news-aivideo-cv-detector-server.onrender.com/api' })

export default api

export const analyzeNews = (data) => api.post('/analyze/news', data).then(r => r.data)
export const analyzeVideo = (data) => api.post('/analyze/video', data).then(r => r.data)
export const analyzeCv = (data) => api.post('/analyze/cv', data).then(r => r.data)
export const analyzeUrl = (data) => api.post('/analyze/url', data).then(r => r.data)
export const scrapeUrl = (url) => api.post('/scrape', { url }).then(r => r.data)
export const getHistory = (params) => api.get('/history', { params }).then(r => r.data)
export const getAnalysis = (id) => api.get(`/history/${id}`).then(r => r.data)
export const getShared = (shareId) => api.get(`/history/share/${shareId}`).then(r => r.data)
export const toggleBookmark = (id) => api.patch(`/history/${id}/bookmark`).then(r => r.data)
export const deleteAnalysis = (id) => api.delete(`/history/${id}`).then(r => r.data)
export const getStats = () => api.get('/stats').then(r => r.data)
