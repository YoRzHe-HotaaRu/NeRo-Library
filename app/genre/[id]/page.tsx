'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Anime, Genre } from '@/types/anime';
import { getAnimeByGenre, getGenres, GenreFilters } from '@/lib/api';
import AnimeGrid from '@/components/AnimeGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

function GenreContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const genreId = params.id as string;
  const page = parseInt(searchParams.get('page') || '1');
  
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Filters
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [orderBy, setOrderBy] = useState(searchParams.get('order_by') || 'score');
  const [sort, setSort] = useState(searchParams.get('sort') || 'desc');
  const [minScore, setMinScore] = useState(searchParams.get('min_score') || '');
  const [maxScore, setMaxScore] = useState(searchParams.get('max_score') || '');

  useEffect(() => {
    async function fetchGenreData() {
      if (!genreId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const filters: GenreFilters = {
          genreId: parseInt(genreId),
          page,
          limit: 25,
          type: type || undefined,
          status: status || undefined,
          rating: rating || undefined,
          orderBy: orderBy || undefined,
          sort: sort || undefined,
          minScore: minScore || undefined,
          maxScore: maxScore || undefined
        };

        const [genresResponse, animeResponse] = await Promise.all([
          getGenres(),
          getAnimeByGenre(filters)
        ]);
        
        const foundGenre = genresResponse.data.find(g => g.mal_id === parseInt(genreId));
        setGenre(foundGenre || null);
        
        setAnimeList(animeResponse.data);
        setHasNextPage(animeResponse.pagination.has_next_page);
        setTotalResults(animeResponse.pagination.items.total);
      } catch (err) {
        console.error('Error fetching genre data:', err);
        setError('Failed to load anime for this genre. Please try again.');
        setAnimeList([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }

    fetchGenreData();
  }, [genreId, page, type, status, rating, orderBy, sort, minScore, maxScore]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/genre/${genreId}?${params.toString()}`);
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p className="error-text">{error}</p>
        <Link href="/genre"><button>Back to Genres</button></Link>
      </div>
    );
  }

  if (!genre) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: '#666' }}>Genre not found</p>
        <Link href="/genre"><button>Back to Genres</button></Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Link */}
      <div style={{ marginBottom: '10px', fontSize: '11px' }}>
        <Link href="/genre">&lt;&lt; Back to Genres</Link>
      </div>

      {/* Genre Header */}
      <div className="header-box" style={{ background: '#336699' }}>
        {genre.name}
      </div>
      
      <div style={{ padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', marginBottom: '10px' }}>
        <div style={{ fontSize: '11px', marginBottom: '10px', fontWeight: 'bold' }}>
          {totalResults.toLocaleString()} anime found in this genre
        </div>

        {/* Filters */}
        <table style={{ width: '100%', background: '#eee', border: '1px solid #ccc' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '16%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Type:</div>
                <select value={type} onChange={(e) => handleFilterChange('type', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
                  <option value="">All</option>
                  <option value="tv">TV</option>
                  <option value="movie">Movie</option>
                  <option value="ova">OVA</option>
                  <option value="special">Special</option>
                  <option value="ona">ONA</option>
                  <option value="music">Music</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '16%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Status:</div>
                <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
                  <option value="">All</option>
                  <option value="airing">Airing</option>
                  <option value="complete">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '16%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Rating:</div>
                <select value={rating} onChange={(e) => handleFilterChange('rating', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
                  <option value="">All</option>
                  <option value="g">G - All Ages</option>
                  <option value="pg">PG - Children</option>
                  <option value="pg13">PG-13 - Teens</option>
                  <option value="r17">R-17+</option>
                  <option value="r">R+ - Mild Nudity</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '16%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Sort By:</div>
                <select value={orderBy} onChange={(e) => handleFilterChange('orderBy', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
                  <option value="score">Score</option>
                  <option value="popularity">Popularity</option>
                  <option value="title">Title</option>
                  <option value="members">Members</option>
                  <option value="favorites">Favorites</option>
                  <option value="episodes">Episodes</option>
                  <option value="start_date">Start Date</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '16%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Order:</div>
                <select value={sort} onChange={(e) => handleFilterChange('sort', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '20%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Score Range:</div>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <input type="number" min="0" max="10" step="0.5" value={minScore} onChange={(e) => handleFilterChange('minScore', e.target.value)} placeholder="Min" style={{ width: '45%', fontSize: '10px' }} />
                  <span style={{ fontSize: '10px' }}>-</span>
                  <input type="number" min="0" max="10" step="0.5" value={maxScore} onChange={(e) => handleFilterChange('maxScore', e.target.value)} placeholder="Max" style={{ width: '45%', fontSize: '10px' }} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Anime Grid */}
      <AnimeGrid animeList={animeList} />
      
      {/* Pagination */}
      {animeList.length > 0 && (
        <Pagination
          currentPage={page}
          hasNextPage={hasNextPage}
          basePath={`/genre/${genreId}`}
        />
      )}
    </div>
  );
}

export default function GenreDetailsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <GenreContent />
    </Suspense>
  );
}
