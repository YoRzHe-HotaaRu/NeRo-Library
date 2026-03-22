import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Navigation from '@/components/Navigation'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'NeRo Library - Browse and Search Anime',
  description: 'A web application for browsing and searching anime catalog using MyAnimeList data',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="container">
            {/* Header */}
            <div className="content-box" style={{ background: '#336699', color: 'white', textAlign: 'center', padding: '15px' }}>
              <div className="logo-text">
                <span className="logo-n">N</span><span className="logo-e">e</span><span className="logo-r">R</span><span className="logo-o">o</span>
                <span className="logo-space"> </span>
                Library<span className="logo-cursor">|</span>
              </div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#ccddff' }}>
                Browse and Search Anime Catalog
              </div>
            </div>

            {/* Navigation */}
            <Navigation />

            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Main Content */}
            <div className="content-box" style={{ marginTop: '10px', minHeight: '400px' }}>
              {children}
            </div>

            {/* Footer */}
            <div className="content-box" style={{ background: '#eeeeee', textAlign: 'center', fontSize: '10px', marginTop: '10px', borderTop: '2px solid #999' }}>
              <div style={{ marginBottom: '5px' }}>
                <a href="/" style={{ margin: '0 10px' }}>Home</a> |
                <a href="/search" style={{ margin: '0 10px' }}>Search</a> |
                <a href="/genre" style={{ margin: '0 10px' }}>Genres</a>
              </div>
              <div style={{ color: '#666' }}>
                &copy; 2026 NeRo Library. Data provided by Jikan API (MyAnimeList).
              </div>
              <div style={{ marginTop: '5px', color: '#999' }}>
                Best viewed with Netscape Navigator 4.0 or Internet Explorer 5.0 at 800x600 resolution
              </div>
            </div>
          </div>
        </AuthProvider>

        <style jsx global>{`
          .logo-text {
            font-size: 24px;
            font-family: Georgia, serif;
            font-weight: bold;
            letter-spacing: 2px;
          }

          .logo-n, .logo-e, .logo-r, .logo-o {
            display: inline-block;
            animation: letterBounce 2s ease-in-out infinite;
          }

          .logo-n { animation-delay: 0s; }
          .logo-e { animation-delay: 0.15s; }
          .logo-r { animation-delay: 0.3s; }
          .logo-o { animation-delay: 0.45s; }

          .logo-space {
            display: inline-block;
            width: 8px;
          }

          .logo-cursor {
            display: inline-block;
            animation: blink 0.8s step-end infinite;
            color: #ccddff;
            margin-left: 2px;
          }

          @keyframes letterBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          @keyframes blink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
          }
        `}</style>
      </body>
    </html>
  )
}
