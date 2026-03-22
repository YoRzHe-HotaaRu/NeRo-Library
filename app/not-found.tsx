import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '10px' }}>404</div>
      <div className="header-box" style={{ background: '#cc3333' }}>
        Page Not Found
      </div>
      
      <div style={{ padding: '20px', background: '#f9f9f9', border: '1px solid #ddd', marginTop: '15px' }}>
        <p style={{ marginBottom: '15px', color: '#666' }}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        
        <p style={{ fontSize: '11px', color: '#999', marginBottom: '15px' }}>
          The URL might be misspelled or the page may have been removed.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/">
            <button>Go to Home</button>
          </Link>
          <Link href="/search">
            <button>Search Anime</button>
          </Link>
          <Link href="/genre">
            <button>Browse Genres</button>
          </Link>
          <Link href="/seasons">
            <button>Browse Seasons</button>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#ffffee', border: '1px solid #ddd', fontSize: '10px' }}>
        <strong>Tip:</strong> Check the URL for typos, or use the navigation menu above to find what you're looking for.
      </div>
    </div>
  )
}
