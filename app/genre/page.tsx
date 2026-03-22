'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Genre } from '@/types/anime';
import { getGenres } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function GenrePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getGenres();
        setGenres(response.data);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchGenres();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="header-box" style={{ background: '#336699' }}>
        Browse by Genre
      </div>
      
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '15px' }}>
        Explore anime by your favorite genres. Click on any genre to see anime in that category.
      </p>

      {/* Genres List - Stacked on mobile */}
      <div className="genre-list">
        <div className="genre-list-header">
          <span style={{ flex: '1', fontWeight: 'bold' }}>Genre Name</span>
          <span style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>Count</span>
          <span style={{ width: '70px', textAlign: 'center', fontWeight: 'bold' }}>Action</span>
        </div>
        {genres.map((genre) => (
          <div key={genre.mal_id} className="genre-item">
            <span className="genre-name">
              <Link href={`/genre/${genre.mal_id}`}>{genre.name}</Link>
            </span>
            <span className="genre-count">{genre.count.toLocaleString()}</span>
            <span className="genre-action">
              <Link href={`/genre/${genre.mal_id}`}>
                <button style={{ fontSize: '10px', padding: '3px 8px' }}>Browse</button>
              </Link>
            </span>
          </div>
        ))}
      </div>

      <hr className="separator" />

      {/* Popular Genres */}
      <div className="header-box" style={{ background: '#669966' }}>
        Popular Genres
      </div>
      
      <div className="genre-list">
        <div className="genre-list-header">
          <span style={{ flex: '1', fontWeight: 'bold' }}>Genre</span>
          <span style={{ width: '100px', textAlign: 'right', fontWeight: 'bold' }}>Count</span>
        </div>
        {genres
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
          .map((genre) => (
            <div key={genre.mal_id} className="genre-item">
              <span className="genre-name">
                <Link href={`/genre/${genre.mal_id}`}>{genre.name}</Link>
              </span>
              <span className="genre-count">{genre.count.toLocaleString()}</span>
            </div>
          ))}
      </div>

      <style jsx>{`
        .genre-list {
          width: 100%;
          border: 1px solid #ccc;
        }

        .genre-list-header {
          display: flex;
          background: #336699;
          color: white;
          padding: 8px 10px;
          font-size: 12px;
        }

        .genre-item {
          display: flex;
          align-items: center;
          padding: 8px 10px;
          border-bottom: 1px solid #ddd;
          font-size: 12px;
        }

        .genre-item:nth-child(even) {
          background: #f9f9f9;
        }

        .genre-item:last-child {
          border-bottom: none;
        }

        .genre-name {
          flex: 1;
        }

        .genre-count {
          width: 80px;
          text-align: right;
          padding-right: 10px;
        }

        .genre-action {
          width: 70px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .genre-list-header {
            display: none;
          }

          .genre-item {
            flex-wrap: wrap;
            padding: 10px;
            gap: 5px;
          }

          .genre-name {
            width: 100%;
            font-size: 14px;
            margin-bottom: 5px;
          }

          .genre-name::before {
            content: 'Genre: ';
            font-weight: bold;
            color: #666;
            font-size: 11px;
          }

          .genre-count {
            width: auto;
            text-align: left;
            font-size: 13px;
          }

          .genre-count::before {
            content: 'Count: ';
            font-weight: bold;
            color: #666;
            font-size: 11px;
          }

          .genre-action {
            width: auto;
            margin-left: auto;
          }

          .genre-action::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
