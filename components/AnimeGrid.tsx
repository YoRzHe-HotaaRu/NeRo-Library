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
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '5px' }}>
        <tbody>
          {Array.from({ length: Math.ceil(animeList.length / 3) }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {animeList.slice(rowIndex * 3, rowIndex * 3 + 3).map((anime) => (
                <td key={anime.mal_id} style={{ width: '33%', verticalAlign: 'top', border: 'none', padding: '0' }}>
                  <AnimeCard anime={anime} />
                </td>
              ))}
              {animeList.slice(rowIndex * 3, rowIndex * 3 + 3).length < 3 && 
                Array.from({ length: 3 - animeList.slice(rowIndex * 3, rowIndex * 3 + 3).length }).map((_, i) => (
                  <td key={`empty-${i}`} style={{ width: '33%', border: 'none', padding: '0' }}></td>
                ))
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
