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

      const data = await res.json()

      if (res.ok) {
        setLibraryStatus(status)
        setMessage('Added to library!')
      } else {
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

  const libraryButtons = [
    { status: 'watching', icon: '&#9654;', label: 'Watch', color: '#4CAF50' },
    { status: 'completed', icon: '&#10003;', label: 'Done', color: '#2196F3' },
    { status: 'plan_to_watch', icon: '&#9734;', label: 'Plan', color: '#FF9800' },
    { status: 'on_hold', icon: '&#9208;', label: 'Hold', color: '#9C27B0' },
    { status: 'dropped', icon: '&#10005;', label: 'Drop', color: '#f44336' }
  ];

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

              {/* Add to Library - Compact Icon Style */}
              <div style={{ marginTop: '8px', padding: '6px', background: '#f9f9f9', border: '1px solid #ddd' }}>
                {session ? (
                  <>
                    {libraryStatus ? (
                      <div style={{ textAlign: 'center', fontSize: '10px' }}>
                        <div style={{ 
                          color: libraryButtons.find(b => b.status === libraryStatus)?.color || '#669966', 
                          fontWeight: 'bold', 
                          marginBottom: '4px',
                          fontSize: '11px'
                        }}>
                          &#10003; {libraryStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <Link href="/library" style={{ fontSize: '10px' }}>View Library</Link>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textAlign: 'center' }}>
                          + Add to Library
                        </div>
                        {message && (
                          <div style={{ 
                            fontSize: '9px', 
                            color: message.includes('Added') ? '#669966' : '#cc0000', 
                            marginBottom: '4px', 
                            textAlign: 'center' 
                          }}>
                            {message}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {libraryButtons.map((btn) => (
                            <button
                              key={btn.status}
                              onClick={() => addToLibrary(btn.status)}
                              disabled={addingToLibrary}
                              title={btn.label}
                              style={{ 
                                fontSize: '14px', 
                                padding: '4px 6px',
                                background: btn.color,
                                color: 'white',
                                border: '1px solid #999',
                                cursor: 'pointer',
                                lineHeight: 1,
                                minWidth: '28px',
                                opacity: addingToLibrary ? 0.5 : 1
                              }}
                              dangerouslySetInnerHTML={{ __html: btn.icon }}
                            />
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '3px' }}>
                          {libraryButtons.map((btn) => (
                            <span key={btn.status} style={{ fontSize: '8px', color: '#999', width: '28px', textAlign: 'center' }}>
                              {btn.label.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '10px' }}>
                    <Link href="/login">Login</Link> to save
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

              {/* Members & Favorites */}
              {(anime.members || anime.favorites) && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  background: '#f9f9f9', 
                  border: '1px solid #ddd',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '40px',
                  fontSize: '10px'
                }}>
                  {anime.members && (
                    <div style={{ textAlign: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 30 30" style={{ display: 'block', margin: '0 auto' }}>
                        <circle cx="15" cy="10" r="5" fill="#669966">
                          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <path d="M5 25 Q15 18 25 25" fill="#669966" opacity="0.5">
                          <animate attributeName="d" values="M5 25 Q15 25 25 25;M5 25 Q15 18 25 25;M5 25 Q15 25 25 25" dur="2s" repeatCount="indefinite" />
                        </path>
                      </svg>
                      <div style={{ fontWeight: 'bold', marginTop: '3px' }}>{(anime.members / 1000).toFixed(0)}K</div>
                      <div style={{ color: '#666' }}>Members</div>
                    </div>
                  )}
                  {anime.favorites && (
                    <div style={{ textAlign: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 30 30" style={{ display: 'block', margin: '0 auto' }}>
                        <path d="M15 25 L5 15 Q5 5 15 10 Q25 5 25 15 Z" fill="#cc3333">
                          <animate attributeName="transform" type="scale" values="1;1.1;1" dur="1s" repeatCount="indefinite" additive="sum" />
                        </path>
                      </svg>
                      <div style={{ fontWeight: 'bold', color: '#cc3333', marginTop: '3px' }}>{(anime.favorites / 1000).toFixed(1)}K</div>
                      <div style={{ color: '#666' }}>Favorites</div>
                    </div>
                  )}
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
