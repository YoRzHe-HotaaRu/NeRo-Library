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

      {/* Genres Table */}
      <table>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Genre Name</th>
            <th style={{ width: '30%' }}>Anime Count</th>
            <th style={{ width: '30%' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.mal_id}>
              <td>
                <Link href={`/genre/${genre.mal_id}`}>{genre.name}</Link>
              </td>
              <td>{genre.count.toLocaleString()} anime</td>
              <td>
                <Link href={`/genre/${genre.mal_id}`}>
                  <button>Browse</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="separator" />

      {/* Popular Genres */}
      <div className="header-box" style={{ background: '#669966' }}>
        Popular Genres
      </div>
      
      <table>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Genre</th>
            <th style={{ width: '50%' }}>Count</th>
          </tr>
        </thead>
        <tbody>
          {genres
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)
            .map((genre) => (
              <tr key={genre.mal_id}>
                <td>
                  <Link href={`/genre/${genre.mal_id}`}>{genre.name}</Link>
                </td>
                <td>{genre.count.toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
