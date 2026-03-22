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
    <div className="anime-card">
      <Link href={`/anime/${anime.mal_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
        <div className="anime-card-image">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={60}
              height={85}
              style={{ border: '1px solid #999', display: 'block' }}
            />
          ) : (
            <div style={{ 
              width: '60px', 
              height: '85px', 
              background: '#eee', 
              border: '1px solid #999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#999'
            }}>
              No Image
            </div>
          )}
        </div>
        <div className="anime-card-info">
          <div className="anime-card-title">
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
        </div>
      </Link>

      <style jsx>{`
        .anime-card {
          border: 1px solid #ccc;
          background: white;
          margin-bottom: 5px;
        }

        .anime-card-image {
          flex-shrink: 0;
          padding: 4px;
        }

        .anime-card-info {
          padding: 4px 6px;
          flex: 1;
          min-width: 0;
        }

        .anime-card-title {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        @media (max-width: 480px) {
          .anime-card-title {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
