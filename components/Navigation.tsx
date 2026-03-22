'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="content-box" style={{ background: '#e8e8e8', padding: '5px 10px', borderBottom: '2px solid #999' }}>
      {/* Mobile Menu Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            display: 'none', 
            fontSize: '16px', 
            padding: '5px 10px',
            background: '#ddd',
            border: '2px outset #ccc'
          }}
          className="mobile-menu-btn"
        >
          {menuOpen ? '✕' : '☰'} Menu
        </button>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ width: '100%' }}>
          <table style={{ width: '100%', border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ border: 'none', padding: '2px 0' }}>
                  <Link href="/" style={{ marginRight: '15px', fontWeight: 'bold', textDecoration: 'none' }}>[ Home ]</Link>
                  <Link href="/search" style={{ marginRight: '15px', fontWeight: 'bold', textDecoration: 'none' }}>[ Search ]</Link>
                  <Link href="/genre" style={{ marginRight: '15px', fontWeight: 'bold', textDecoration: 'none' }}>[ Genres ]</Link>
                  <Link href="/seasons" style={{ marginRight: '15px', fontWeight: 'bold', textDecoration: 'none' }}>[ Seasons ]</Link>
                  {session && (
                    <Link href="/library" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#cc6600' }}>[ My Library ]</Link>
                  )}
                </td>
                <td style={{ border: 'none', padding: '2px 0', textAlign: 'right', fontSize: '11px' }}>
                  {status === 'loading' ? (
                    <span style={{ color: '#999' }}>Loading...</span>
                  ) : session ? (
                    <span>
                      Welcome, <strong>{session.user?.name || session.user?.email}</strong> |{' '}
                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline', fontSize: '11px', padding: 0 }}
                      >
                        Logout
                      </button>
                    </span>
                  ) : (
                    <span>
                      <Link href="/login" style={{ marginRight: '10px' }}>[ Login ]</Link>
                      <Link href="/register">[ Register ]</Link>
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-nav" style={{ 
          display: 'none', 
          flexDirection: 'column', 
          gap: '5px', 
          padding: '10px 0',
          borderTop: '1px solid #ccc',
          marginTop: '5px'
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold', textDecoration: 'none', padding: '5px 0' }}>[ Home ]</Link>
          <Link href="/search" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold', textDecoration: 'none', padding: '5px 0' }}>[ Search ]</Link>
          <Link href="/genre" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold', textDecoration: 'none', padding: '5px 0' }}>[ Genres ]</Link>
          <Link href="/seasons" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold', textDecoration: 'none', padding: '5px 0' }}>[ Seasons ]</Link>
          {session && (
            <Link href="/library" onClick={() => setMenuOpen(false)} style={{ fontWeight: 'bold', textDecoration: 'none', padding: '5px 0', color: '#cc6600' }}>[ My Library ]</Link>
          )}
          <div style={{ borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '5px' }}>
            {status === 'loading' ? (
              <span style={{ color: '#999' }}>Loading...</span>
            ) : session ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Welcome, <strong>{session.user?.name}</strong></span>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ background: '#ddd', border: '2px outset #ccc', fontSize: '12px', padding: '4px 10px' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/login" onClick={() => setMenuOpen(false)}>[ Login ]</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>[ Register ]</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
