'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const SEASON_NAMES: Record<string, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall'
}

export default function Breadcrumb() {
  const pathname = usePathname()
  
  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean)
    
    // Home page
    if (segments.length === 0) {
      return <span>Home</span>
    }

    const crumbs: { label: string; href?: string }[] = [
      { label: 'Home', href: '/' }
    ]

    const pageName = segments[0]
    
    switch (pageName) {
      case 'search':
        crumbs.push({ label: 'Search' })
        break
        
      case 'genre':
        crumbs.push({ label: 'Genres', href: '/genre' })
        if (segments[1]) {
          crumbs.push({ label: 'Genre Details' })
        }
        break
        
      case 'seasons':
        crumbs.push({ label: 'Seasons', href: '/seasons' })
        if (segments[1] && segments[2]) {
          const seasonLabel = (SEASON_NAMES[segments[2]] || segments[2]) + ' ' + segments[1]
          crumbs.push({ label: seasonLabel })
        }
        break
        
      case 'anime':
        crumbs.push({ label: 'Anime Details' })
        break
        
      case 'library':
        crumbs.push({ label: 'My Library' })
        break
        
      case 'login':
        crumbs.push({ label: 'Login' })
        break
        
      case 'register':
        crumbs.push({ label: 'Register' })
        break
        
      default:
        crumbs.push({ label: pageName.charAt(0).toUpperCase() + pageName.slice(1) })
    }

    return (
      <>
        {crumbs.map((crumb, index) => (
          <span key={index}>
            {index > 0 && ' > '}
            {crumb.href ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span style={{ fontWeight: 'bold' }}>{crumb.label}</span>
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <div style={{ padding: '5px 10px', fontSize: '10px', color: '#666', background: '#ffffee', border: '1px solid #ddd', marginTop: '10px' }}>
      You are here: {getBreadcrumb()}
    </div>
  )
}
