'use client';

import { Anime } from '@/types/anime';
import AnimeCard from './AnimeCard';

interface AnimeGridProps {
  animeList: Anime[];
  title?: string;
}

export default function AnimeGrid({ animeList, title }: AnimeGridProps) {
  if (!animeList || animeList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        No anime found
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="header-box" style={{ background: '#996633' }}>
          {title}
        </div>
      )}
      <div className="anime-grid">
        {animeList.map((anime, index) => (
          <div key={`${anime.mal_id}-${index}`} className="anime-grid-item">
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        @media (max-width: 600px) {
          .anime-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}
