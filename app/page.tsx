'use client';

import { useState, useEffect } from 'react';
import { Anime } from '@/types/anime';
import { getTopAnime, getSeasonalAnime } from '@/lib/api';
import AnimeGrid from '@/components/AnimeGrid';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const topResponse = await getTopAnime(1, 12);
        const seasonalResponse = await getSeasonalAnime(1, 12);
        
        setTopAnime(topResponse.data);
        setSeasonalAnime(seasonalResponse.data);
      } catch (err) {
        console.error('Error fetching anime data:', err);
        setError('Failed to load anime data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
      {/* Welcome Section */}
      <div className="header-box" style={{ background: '#336699', textAlign: 'center' }}>
        Welcome to NeRo Library
      </div>
      
      <div style={{ textAlign: 'center', padding: '10px', marginBottom: '15px' }}>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
          Discover, explore, and search through thousands of anime series and movies.<br />
          Powered by MyAnimeList data.
        </p>
        <SearchBar placeholder="Search for anime..." />
      </div>

      <hr className="separator" />

      {/* Top Anime Section */}
      <AnimeGrid animeList={topAnime} title="Top Rated Anime" />

      <hr className="separator" />

      {/* Seasonal Anime Section */}
      <AnimeGrid animeList={seasonalAnime} title="Currently Airing" />

      <hr className="separator" />

      {/* Features Section */}
      <div className="header-box" style={{ background: '#669966' }}>
        Explore NeRo Library
      </div>
      
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: '33%', textAlign: 'center', verticalAlign: 'top', padding: '10px' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>&#128269;</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Search</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Find any anime by title, genre, or studio with our powerful search
              </div>
            </td>
            <td style={{ width: '33%', textAlign: 'center', verticalAlign: 'top', padding: '10px' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>&#128202;</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Detailed Info</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Get comprehensive details including ratings, episodes, studios, and more
              </div>
            </td>
            <td style={{ width: '33%', textAlign: 'center', verticalAlign: 'top', padding: '10px' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>&#127919;</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Browse by Genre</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Explore anime by your favorite genres and discover new series
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
