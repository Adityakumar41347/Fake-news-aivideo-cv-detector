import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { Sun, Moon, Shield, LayoutDashboard, History, LogOut, LogIn, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-logo"><Shield size={18} /></div>
          <span>AI Detector</span>
          <span className="navbar-version">v2.0</span>
        </NavLink>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Detect
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={15} /> Dashboard
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <History size={15} /> History
          </NavLink>
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          {user ? (
            <div className="navbar-user">
              <div className="user-avatar">{user.name[0].toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
              <button className="icon-btn" onClick={() => { logout(); navigate('/') }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/auth')} style={{ padding: '7px 14px', fontSize: 13 }}>
              <LogIn size={15} /> Sign In
            </button>
          )}
          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
