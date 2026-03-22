'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Anime } from '@/types/anime';
import { getAnimeBySeason, SeasonFilters } from '@/lib/api';
import AnimeGrid from '@/components/AnimeGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

const SEASON_NAMES: Record<string, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall'
};

function SeasonContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const year = params.year as string;
  const season = params.season as string;
  const page = parseInt(searchParams.get('page') || '1');
  
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Filters
  const [type, setType] = useState(searchParams.get('type') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [orderBy, setOrderBy] = useState(searchParams.get('order_by') || 'score');
  const [sort, setSort] = useState(searchParams.get('sort') || 'desc');
  const [minScore, setMinScore] = useState(searchParams.get('min_score') || '');
  const [maxScore, setMaxScore] = useState(searchParams.get('max_score') || '');

  useEffect(() => {
    async function fetchSeasonAnime() {
      if (!year || !season) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const filters: SeasonFilters = {
          year: parseInt(year),
          season,
          page,
          limit: 25,
          type: type || undefined,
          rating: rating || undefined,
          orderBy: orderBy || undefined,
          sort: sort || undefined,
          minScore: minScore || undefined,
          maxScore: maxScore || undefined
        };

        const response = await getAnimeBySeason(filters);
        
        setAnimeList(response.data);
        setHasNextPage(response.pagination.has_next_page);
        setTotalResults(response.pagination.items.total);
      } catch (err) {
        console.error('Error fetching season anime:', err);
        setError('Failed to load anime for this season. Please try again.');
        setAnimeList([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }

    fetchSeasonAnime();
  }, [year, season, page, type, rating, orderBy, sort, minScore, maxScore]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/seasons/${year}/${season}?${params.toString()}`);
  };

  const seasonName = SEASON_NAMES[season] || season;

  // Get adjacent seasons for navigation
  const getAdjacentSeasons = () => {
    const seasonOrder = ['winter', 'spring', 'summer', 'fall'];
    const currentIndex = seasonOrder.indexOf(season);
    const yearNum = parseInt(year);
    
    let prevSeason, prevYear, nextSeason, nextYear;
    
    if (currentIndex > 0) {
      prevSeason = seasonOrder[currentIndex - 1];
      prevYear = yearNum;
    } else {
      prevSeason = 'fall';
      prevYear = yearNum - 1;
    }
    
    if (currentIndex < 3) {
      nextSeason = seasonOrder[currentIndex + 1];
      nextYear = yearNum;
    } else {
      nextSeason = 'winter';
      nextYear = yearNum + 1;
    }
    
    return { prevSeason, prevYear, nextSeason, nextYear };
  };

  const { prevSeason, prevYear, nextSeason, nextYear } = getAdjacentSeasons();

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p className="error-text">{error}</p>
        <Link href="/seasons"><button>Back to Seasons</button></Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Link */}
      <div style={{ marginBottom: '10px', fontSize: '11px' }}>
        <Link href="/seasons">&lt;&lt; Back to Seasons</Link>
      </div>

      {/* Season Header */}
      <div className="header-box" style={{ background: '#336699' }}>
        {seasonName} {year} Anime
      </div>

      {/* Season Navigation */}
      <div style={{ padding: '10px', background: '#e8e8e8', border: '1px solid #ddd', marginBottom: '10px', textAlign: 'center' }}>
        <Link href={`/seasons/${prevYear}/${prevSeason}`}>
          <button style={{ marginRight: '10px' }}>&lt;&lt; {SEASON_NAMES[prevSeason]} {prevYear}</button>
        </Link>
        <Link href="/seasons">
          <button>All Seasons</button>
        </Link>
        <Link href={`/seasons/${nextYear}/${nextSeason}`}>
          <button style={{ marginLeft: '10px' }}>{SEASON_NAMES[nextSeason]} {nextYear} &gt;&gt;</button>
        </Link>
      </div>
      
      <div style={{ padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', marginBottom: '10px' }}>
        <div style={{ fontSize: '11px', marginBottom: '10px', fontWeight: 'bold' }}>
          {totalResults.toLocaleString()} anime found for {seasonName} {year}
        </div>

        {/* Filters */}
        <table style={{ width: '100%', background: '#eee', border: '1px solid #ccc' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '18%' }}>
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
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '18%' }}>
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
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '18%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Sort By:</div>
                <select value={orderBy} onChange={(e) => handleFilterChange('orderBy', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
                  <option value="score">Score</option>
                  <option value="popularity">Popularity</option>
                  <option value="title">Title</option>
                  <option value="members">Members</option>
                  <option value="favorites">Favorites</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '18%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Order:</div>
                <select value={sort} onChange={(e) => handleFilterChange('sort', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '5px', width: '28%' }}>
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
          basePath={`/seasons/${year}/${season}`}
        />
      )}
    </div>
  );
}

export default function SeasonDetailsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <SeasonContent />
    </Suspense>
  );
}
