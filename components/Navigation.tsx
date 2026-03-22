'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session, status } = useSession()

  return (
    <div className="content-box" style={{ background: '#e8e8e8', padding: '5px 10px', borderBottom: '2px solid #999' }}>
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
  )
}
