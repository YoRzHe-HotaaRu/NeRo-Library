'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/types/anime';
import { getAnimeById } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AnimeDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToLibrary, setAddingToLibrary] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchAnimeDetails() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAnimeById(parseInt(id));
        setAnime(response.data);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnimeDetails();
  }, [id]);

  useEffect(() => {
    if (session && anime) {
      checkLibraryStatus()
    }
  }, [session, anime])

  const checkLibraryStatus = async () => {
    try {
      const res = await fetch('/api/library')
      if (res.ok) {
        const data = await res.json()
        const item = data.find((w: any) => w.animeId === parseInt(id))
        if (item) {
          setLibraryStatus(item.status)
        }
      }
    } catch (error) {
      console.error('Error checking library status:', error)
    }
  }

  const addToLibrary = async (status: string) => {
    if (!anime || !session) return

    setAddingToLibrary(true)
    setMessage('')

    try {
      const title = anime.title_english || anime.title
      const imageUrl = anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url

      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animeId: parseInt(id),
          title,
          imageUrl,
          status
        })
      })

      if (res.ok) {
        setLibraryStatus(status)
        setMessage('Added to library!')
      } else {
        const data = await res.json()
        setMessage(data.error || 'Failed to add to library')
      }
    } catch (error) {
      setMessage('Error adding to library')
    } finally {
      setAddingToLibrary(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p className="error-text">{error}</p>
        <Link href="/"><button>Back to Home</button></Link>
      </div>
    );
  }

  if (!anime) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: '#666' }}>Anime not found</p>
        <Link href="/"><button>Back to Home</button></Link>
      </div>
    );
  }

  const title = anime.title_english || anime.title;
  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <div>
      {/* Back Link */}
      <div style={{ marginBottom: '10px', fontSize: '11px' }}>
        <Link href="/">&lt;&lt; Back to Home</Link>
      </div>

      {/* Title */}
      <div className="header-box" style={{ background: '#336699' }}>
        {title}
      </div>
      
      {anime.title_japanese && (
        <div style={{ textAlign: 'center', color: '#666', marginBottom: '10px', fontSize: '12px' }}>
          {anime.title_japanese}
        </div>
      )}

      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            {/* Image Column */}
            <td style={{ width: '200px', verticalAlign: 'top', padding: '10px' }}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  width={180}
                  height={250}
                  style={{ border: '2px solid #999', display: 'block' }}
                />
              ) : (
                <div style={{ 
                  width: '180px', 
                  height: '250px', 
                  background: '#eee', 
                  border: '2px solid #999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: '#999'
                }}>
                  No Image Available
                </div>
              )}

              {/* Add to Library */}
              <div style={{ marginTop: '10px', padding: '8px', background: '#f9f9f9', border: '1px solid #ddd' }}>
                {session ? (
                  <>
                    {libraryStatus ? (
                      <div style={{ textAlign: 'center', fontSize: '11px' }}>
                        <div style={{ color: '#669966', fontWeight: 'bold', marginBottom: '5px' }}>
                          In Library: {libraryStatus.replace('_', ' ')}
                        </div>
                        <Link href="/library">View Library</Link>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }}>
                          Add to Library:
                        </div>
                        {message && (
                          <div style={{ fontSize: '10px', color: message.includes('Added') ? '#669966' : '#cc0000', marginBottom: '5px', textAlign: 'center' }}>
                            {message}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <button 
                            onClick={() => addToLibrary('watching')} 
                            disabled={addingToLibrary}
                            style={{ fontSize: '10px', width: '100%' }}
                          >
                            Watching
                          </button>
                          <button 
                            onClick={() => addToLibrary('completed')} 
                            disabled={addingToLibrary}
                            style={{ fontSize: '10px', width: '100%' }}
                          >
                            Completed
                          </button>
                          <button 
                            onClick={() => addToLibrary('plan_to_watch')} 
                            disabled={addingToLibrary}
                            style={{ fontSize: '10px', width: '100%' }}
                          >
                            Plan to Watch
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '10px' }}>
                    <Link href="/login">Login</Link> to save to library
                  </div>
                )}
              </div>
            </td>
            
            {/* Info Column */}
            <td style={{ verticalAlign: 'top', padding: '10px' }}>
              {/* Score and Stats */}
              {anime.score && (
                <div className="info-row">
                  <div className="info-label">Score:</div>
                  <div className="info-value">
                    <span style={{ fontWeight: 'bold', color: '#cc6600', fontSize: '14px' }}>{anime.score.toFixed(1)}</span>
                    {anime.scored_by && <span style={{ fontSize: '10px', color: '#666' }}> ({anime.scored_by.toLocaleString()} votes)</span>}
                  </div>
                </div>
              )}
              
              {anime.rank && (
                <div className="info-row">
                  <div className="info-label">Rank:</div>
                  <div className="info-value">#{anime.rank}</div>
                </div>
              )}
              
              {anime.popularity && (
                <div className="info-row">
                  <div className="info-label">Popularity:</div>
                  <div className="info-value">#{anime.popularity}</div>
                </div>
              )}
              
              {anime.type && (
                <div className="info-row">
                  <div className="info-label">Type:</div>
                  <div className="info-value">{anime.type}</div>
                </div>
              )}
              
              {anime.episodes && (
                <div className="info-row">
                  <div className="info-label">Episodes:</div>
                  <div className="info-value">{anime.episodes}</div>
                </div>
              )}
              
              {anime.status && (
                <div className="info-row">
                  <div className="info-label">Status:</div>
                  <div className="info-value">{anime.status}</div>
                </div>
              )}
              
              {anime.aired?.string && (
                <div className="info-row">
                  <div className="info-label">Aired:</div>
                  <div className="info-value">{anime.aired.string}</div>
                </div>
              )}
              
              {anime.duration && (
                <div className="info-row">
                  <div className="info-label">Duration:</div>
                  <div className="info-value">{anime.duration}</div>
                </div>
              )}
              
              {anime.rating && (
                <div className="info-row">
                  <div className="info-label">Rating:</div>
                  <div className="info-value">{anime.rating}</div>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Genres */}
      {anime.genres && anime.genres.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div className="header-box" style={{ background: '#669966', fontSize: '11px' }}>
            Genres
          </div>
          <div style={{ padding: '5px' }}>
            {anime.genres.map((genre, index) => (
              <span key={genre.mal_id}>
                <Link href={`/genre/${genre.mal_id}`}>{genre.name}</Link>
                {index < anime.genres.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Studios */}
      {anime.studios && anime.studios.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div className="header-box" style={{ background: '#996633', fontSize: '11px' }}>
            Studios
          </div>
          <div style={{ padding: '5px' }}>
            {anime.studios.map((studio, index) => (
              <span key={studio.mal_id}>
                {studio.name}{index < anime.studios.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Synopsis */}
      {anime.synopsis && (
        <div style={{ marginTop: '10px' }}>
          <div className="header-box" style={{ background: '#336699', fontSize: '11px' }}>
            Synopsis
          </div>
          <div style={{ padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', fontSize: '11px', lineHeight: '1.6' }}>
            {anime.synopsis}
          </div>
        </div>
      )}

      {/* Background */}
      {anime.background && (
        <div style={{ marginTop: '10px' }}>
          <div className="header-box" style={{ background: '#666666', fontSize: '11px' }}>
            Background
          </div>
          <div style={{ padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', fontSize: '11px', lineHeight: '1.6' }}>
            {anime.background}
          </div>
        </div>
      )}
    </div>
  );
}
