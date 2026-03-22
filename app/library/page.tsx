'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LoadingSpinner from '@/components/LoadingSpinner'

interface WatchedEpisode {
  id: string
  episodeNum: number
  watchedAt: string
}

interface WatchlistItem {
  id: string
  animeId: number
  title: string
  imageUrl: string | null
  status: string
  score: number | null
  notes: string | null
  watchedEpisodes: WatchedEpisode[]
  updatedAt: string
}

const STATUS_OPTIONS = [
  { value: 'watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'plan_to_watch', label: 'Plan to Watch' }
]

export default function LibraryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editScore, setEditScore] = useState('')
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchWatchlist()
    }
  }, [session])

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/library')
      if (res.ok) {
        const data = await res.json()
        setWatchlist(data)
      }
    } catch (error) {
      console.error('Error fetching library:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch('/api/library', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: editStatus,
          score: editScore || null,
          notes: editNotes || null
        })
      })

      if (res.ok) {
        setEditingId(null)
        fetchWatchlist()
      }
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this anime from your library?')) return

    try {
      const res = await fetch(`/api/library?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchWatchlist()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleEpisodeToggle = async (watchlistId: string, episodeNum: number, isWatched: boolean) => {
    try {
      if (isWatched) {
        await fetch(`/api/library/episodes?watchlistId=${watchlistId}&episodeNum=${episodeNum}`, {
          method: 'DELETE'
        })
      } else {
        await fetch('/api/library/episodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ watchlistId, episodeNum })
        })
      }
      fetchWatchlist()
    } catch (error) {
      console.error('Error toggling episode:', error)
    }
  }

  const startEdit = (item: WatchlistItem) => {
    setEditingId(item.id)
    setEditStatus(item.status)
    setEditScore(item.score?.toString() || '')
    setEditNotes(item.notes || '')
  }

  if (status === 'loading' || loading) {
    return <LoadingSpinner size="lg" />
  }

  if (!session) {
    return null
  }

  const filteredWatchlist = filter === 'all' 
    ? watchlist 
    : watchlist.filter(item => item.status === filter)

  const stats = {
    total: watchlist.length,
    watching: watchlist.filter(i => i.status === 'watching').length,
    completed: watchlist.filter(i => i.status === 'completed').length,
    planToWatch: watchlist.filter(i => i.status === 'plan_to_watch').length
  }

  return (
    <div>
      <div className="header-box" style={{ background: '#336699' }}>
        My Anime Library
      </div>

      {/* Stats */}
      <table style={{ width: '100%', marginBottom: '15px', background: '#f9f9f9' }}>
        <tbody>
          <tr>
            <td style={{ textAlign: 'center', padding: '8px' }}>
              <strong>Total:</strong> {stats.total}
            </td>
            <td style={{ textAlign: 'center', padding: '8px' }}>
              <strong>Watching:</strong> {stats.watching}
            </td>
            <td style={{ textAlign: 'center', padding: '8px' }}>
              <strong>Completed:</strong> {stats.completed}
            </td>
            <td style={{ textAlign: 'center', padding: '8px' }}>
              <strong>Plan to Watch:</strong> {stats.planToWatch}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Filter */}
      <div style={{ marginBottom: '15px', fontSize: '11px' }}>
        <strong>Filter:</strong>{' '}
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ fontSize: '11px' }}
        >
          <option value="all">All ({watchlist.length})</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({watchlist.filter(i => i.status === opt.value).length})
            </option>
          ))}
        </select>
      </div>

      {filteredWatchlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
          {watchlist.length === 0 
            ? 'Your library is empty. Browse anime and add some!'
            : 'No anime in this category.'
          }
          <div style={{ marginTop: '10px' }}>
            <Link href="/">Browse Anime</Link>
          </div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Image</th>
              <th>Title</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '60px' }}>Score</th>
              <th style={{ width: '120px' }}>Episodes</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWatchlist.map((item) => (
              <tr key={item.id}>
                <td style={{ textAlign: 'center' }}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={50}
                      height={70}
                      style={{ border: '1px solid #999' }}
                    />
                  ) : (
                    <div style={{ width: '50px', height: '70px', background: '#eee', border: '1px solid #999' }}></div>
                  )}
                </td>
                <td>
                  <Link href={`/anime/${item.animeId}`} style={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Link>
                  {item.notes && (
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>
                      {item.notes}
                    </div>
                  )}
                </td>
                <td style={{ fontSize: '10px' }}>
                  {editingId === item.id ? (
                    <select 
                      value={editStatus} 
                      onChange={(e) => setEditStatus(e.target.value)}
                      style={{ fontSize: '10px', width: '100%' }}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    STATUS_OPTIONS.find(o => o.value === item.status)?.label || item.status
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === item.id ? (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      style={{ width: '50px', fontSize: '10px' }}
                    />
                  ) : (
                    item.score ? `${item.score}/10` : '-'
                  )}
                </td>
                <td style={{ fontSize: '10px' }}>
                  <div style={{ marginBottom: '3px' }}>
                    {item.watchedEpisodes.length} watched
                  </div>
                  <EpisodeTracker 
                    watchlistId={item.id}
                    watchedEpisodes={item.watchedEpisodes}
                    onToggle={handleEpisodeToggle}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === item.id ? (
                    <div>
                      <button onClick={() => handleUpdate(item.id)} style={{ fontSize: '10px', marginRight: '3px' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ fontSize: '10px' }}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => startEdit(item)} style={{ fontSize: '10px', marginRight: '3px' }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ fontSize: '10px', color: '#cc0000' }}>Del</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function EpisodeTracker({ 
  watchlistId, 
  watchedEpisodes, 
  onToggle 
}: { 
  watchlistId: string
  watchedEpisodes: WatchedEpisode[]
  onToggle: (watchlistId: string, episodeNum: number, isWatched: boolean) => void
}) {
  const [showEpisodes, setShowEpisodes] = useState(false)
  const [episodeCount, setEpisodeCount] = useState(12)

  if (!showEpisodes) {
    return (
      <button 
        onClick={() => setShowEpisodes(true)} 
        style={{ fontSize: '9px', padding: '2px 5px' }}
      >
        Track Episodes
      </button>
    )
  }

  return (
    <div style={{ background: '#f5f5f5', padding: '5px', border: '1px solid #ddd' }}>
      <div style={{ marginBottom: '5px' }}>
        <label style={{ fontSize: '9px' }}>Total eps: </label>
        <input
          type="number"
          min="1"
          max="500"
          value={episodeCount}
          onChange={(e) => setEpisodeCount(parseInt(e.target.value) || 12)}
          style={{ width: '40px', fontSize: '9px' }}
        />
      </div>
      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
        {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => {
          const isWatched = watchedEpisodes.some(we => we.episodeNum === ep)
          return (
            <button
              key={ep}
              onClick={() => onToggle(watchlistId, ep, isWatched)}
              style={{
                width: '24px',
                height: '20px',
                fontSize: '8px',
                padding: '1px',
                margin: '1px',
                background: isWatched ? '#669966' : '#eee',
                color: isWatched ? 'white' : '#333',
                border: '1px solid #999'
              }}
            >
              {ep}
            </button>
          )
        })}
      </div>
      <button 
        onClick={() => setShowEpisodes(false)} 
        style={{ fontSize: '9px', marginTop: '3px' }}
      >
        Close
      </button>
    </div>
  )
}
