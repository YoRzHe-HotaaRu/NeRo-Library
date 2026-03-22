'use client';

import { Anime } from '@/types/anime';
import Image from 'next/image';
import Link from 'next/link';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const title = anime.title_english || anime.title;
  const imageUrl = anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url;
  
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      background: 'white',
      marginBottom: '10px'
    }}>
      <Link href={`/anime/${anime.mal_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <table style={{ width: '100%', border: 'none' }}>
          <tbody>
            <tr>
              <td style={{ width: '80px', border: 'none', padding: '5px', verticalAlign: 'top' }}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    width={70}
                    height={95}
                    style={{ border: '1px solid #999', display: 'block' }}
                  />
                ) : (
                  <div style={{ 
                    width: '70px', 
                    height: '95px', 
                    background: '#eee', 
                    border: '1px solid #999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: '#999'
                  }}>
                    No Image
                  </div>
                )}
              </td>
              <td style={{ border: 'none', padding: '5px', verticalAlign: 'top' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '3px' }}>
                  {title}
                </div>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>
                  {anime.type || 'Unknown'} {anime.episodes ? `- ${anime.episodes} eps` : ''}
                </div>
                {anime.score && (
                  <div style={{ fontSize: '10px' }}>
                    Score: <span style={{ fontWeight: 'bold', color: '#cc6600' }}>{anime.score.toFixed(1)}</span>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Link>
    </div>
  );
}
