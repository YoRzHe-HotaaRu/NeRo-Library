'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSeasons, Season } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const SEASON_NAMES: Record<string, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall'
};

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSeasons() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getSeasons();
        setSeasons(response.data);
      } catch (err) {
        console.error('Error fetching seasons:', err);
        setError('Failed to load seasons. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchSeasons();
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
        Browse Anime by Season
      </div>

      <p style={{ color: '#666', textAlign: 'center', marginBottom: '15px' }}>
        Explore anime by season and year. Click on any season to see what aired during that time.
      </p>

      {/* Quick Links to Current and Recent Seasons */}
      <div className="header-box" style={{ background: '#669966' }}>
        Quick Links
      </div>
      
      <div style={{ padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', marginBottom: '15px', textAlign: 'center' }}>
        <Link href="/seasons/2026/winter" style={{ margin: '0 10px' }}>Winter 2026</Link> |
        <Link href="/seasons/2025/fall" style={{ margin: '0 10px' }}>Fall 2025</Link> |
        <Link href="/seasons/2025/summer" style={{ margin: '0 10px' }}>Summer 2025</Link> |
        <Link href="/seasons/2025/spring" style={{ margin: '0 10px' }}>Spring 2025</Link>
      </div>

      {/* All Seasons by Year */}
      {seasons.map((yearData) => (
        <div key={yearData.year} style={{ marginBottom: '15px' }}>
          <div className="header-box" style={{ background: '#996633' }}>
            {yearData.year}
          </div>
          
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                {yearData.seasons.map((season) => (
                  <td key={season} style={{ width: '25%', textAlign: 'center', padding: '10px' }}>
                    <Link href={`/seasons/${yearData.year}/${season}`}>
                      <button style={{ width: '100%', padding: '10px' }}>
                        {SEASON_NAMES[season] || season}
                      </button>
                    </Link>
                  </td>
                ))}
                {/* Fill empty cells if less than 4 seasons */}
                {yearData.seasons.length < 4 && 
                  Array.from({ length: 4 - yearData.seasons.length }).map((_, i) => (
                    <td key={`empty-${i}`} style={{ width: '25%' }}></td>
                  ))
                }
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* Legend */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', fontSize: '10px' }}>
        <strong>Season Guide:</strong><br />
        <strong>Winter:</strong> January - March | 
        <strong> Spring:</strong> April - June | 
        <strong> Summer:</strong> July - September | 
        <strong> Fall:</strong> October - December
      </div>
    </div>
  );
}
