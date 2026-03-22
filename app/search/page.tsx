'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Anime } from '@/types/anime';
import { searchAnime, SearchFilters } from '@/lib/api';
import AnimeGrid from '@/components/AnimeGrid';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query.trim()) {
        setAnimeList([]);
        setTotalResults(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const filters: SearchFilters = {
          query,
          page,
          limit: 25,
          type: searchParams.get('type') || undefined,
          status: searchParams.get('status') || undefined,
          rating: searchParams.get('rating') || undefined,
          orderBy: searchParams.get('order_by') || 'score',
          sort: searchParams.get('sort') || 'desc',
          minScore: searchParams.get('min_score') || undefined,
          maxScore: searchParams.get('max_score') || undefined
        };

        const response = await searchAnime(filters);
        setAnimeList(response.data);
        setHasNextPage(response.pagination.has_next_page);
        setTotalResults(response.pagination.items.total);
      } catch (err) {
        console.error('Error searching anime:', err);
        setError('Failed to search anime. Please try again.');
        setAnimeList([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query, page, searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  if (!query.trim()) {
    return (
      <div>
        <div className="header-box" style={{ background: '#336699' }}>
          Search Anime
        </div>
        <div style={{ textAlign: 'center', padding: '15px' }}>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Enter a search term to find anime series and movies
          </p>
          <SearchBar placeholder="Search for anime..." />
        </div>

        <hr className="separator" />

        {/* Search Tips */}
        <div className="header-box" style={{ background: '#669966' }}>
          Search Tips
        </div>
        <table style={{ width: '100%', background: '#f9f9f9', border: '1px solid #ddd' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', verticalAlign: 'top', padding: '10px', borderRight: '1px solid #ddd' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>What You Can Search:</div>
                <ul style={{ fontSize: '11px', color: '#666', margin: 0, paddingLeft: '20px' }}>
                  <li>Anime titles (English or Japanese)</li>
                  <li>Partial names (e.g., "attack" for Attack on Titan)</li>
                  <li>Studios (e.g., "Mappa", "Toei")</li>
                  <li>Characters or themes</li>
                </ul>
              </td>
              <td style={{ width: '50%', verticalAlign: 'top', padding: '10px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>After Searching:</div>
                <ul style={{ fontSize: '11px', color: '#666', margin: 0, paddingLeft: '20px' }}>
                  <li>Use filters to narrow results by Type, Status, or Rating</li>
                  <li>Sort by Score, Popularity, or Title</li>
                  <li>Set a minimum/maximum score range</li>
                  <li>Click any anime to view full details</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="separator" />

        {/* Popular Searches */}
        <div className="header-box" style={{ background: '#996633' }}>
          Popular Searches
        </div>
        <div style={{ padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>Try searching for these popular anime:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
            {['Naruto', 'One Piece', 'Attack on Titan', 'Dragon Ball', 'Death Note', 'Demon Slayer', 'My Hero Academia', 'Fullmetal Alchemist'].map((term) => (
              <a 
                key={term} 
                href={`/search?q=${encodeURIComponent(term)}`}
                style={{ 
                  padding: '4px 10px', 
                  background: '#eee', 
                  border: '1px solid #ccc', 
                  fontSize: '10px',
                  textDecoration: 'none',
                  color: '#333'
                }}
              >
                {term}
              </a>
            ))}
          </div>
        </div>

        <hr className="separator" />

        {/* Browse Alternatives */}
        <div className="header-box" style={{ background: '#cc6666' }}>
          Or Browse By
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '33%', textAlign: 'center', padding: '15px' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>&#127919;</div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Genre</div>
                <a href="/genre">
                  <button>Browse Genres</button>
                </a>
              </td>
              <td style={{ width: '33%', textAlign: 'center', padding: '15px' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>&#127774;</div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Season</div>
                <a href="/seasons">
                  <button>Browse Seasons</button>
                </a>
              </td>
              <td style={{ width: '33%', textAlign: 'center', padding: '15px' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>&#127942;</div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Top Rated</div>
                <a href="/">
                  <button>View Top Anime</button>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <div className="header-box" style={{ background: '#336699' }}>
        Search Results
      </div>
      
      <div style={{ padding: '10px', background: '#f9f9f9', border: '1px solid #ddd', marginBottom: '10px' }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <SearchBar placeholder="Search for anime..." />
        </div>
        
        <div style={{ fontSize: '11px', marginBottom: '10px', fontWeight: 'bold' }}>
          {totalResults > 0 
            ? `Found ${totalResults} results for "${query}"`
            : `No results found for "${query}"`
          }
        </div>

        {/* Filters */}
        <div className="filter-row">
          <div className="filter-item">
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Type:</div>
            <select value={searchParams.get('type') || ''} onChange={(e) => handleFilterChange('type', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
              <option value="">All</option>
              <option value="tv">TV</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
              <option value="ona">ONA</option>
              <option value="music">Music</option>
            </select>
          </div>
          <div className="filter-item">
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Rating:</div>
            <select value={searchParams.get('rating') || ''} onChange={(e) => handleFilterChange('rating', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
              <option value="">All</option>
              <option value="g">G - All Ages</option>
              <option value="pg">PG - Children</option>
              <option value="pg13">PG-13 - Teens</option>
              <option value="r17">R-17+</option>
              <option value="r">R+ - Mild Nudity</option>
            </select>
          </div>
          <div className="filter-item">
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Sort By:</div>
            <select value={searchParams.get('order_by') || 'score'} onChange={(e) => handleFilterChange('order_by', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
              <option value="score">Score</option>
              <option value="popularity">Popularity</option>
              <option value="title">Title</option>
              <option value="members">Members</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>
          <div className="filter-item">
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Order:</div>
            <select value={searchParams.get('sort') || 'desc'} onChange={(e) => handleFilterChange('sort', e.target.value)} style={{ width: '100%', fontSize: '10px' }}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <div className="filter-item">
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px' }}>Score Range:</div>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <input type="number" min="0" max="10" step="0.5" value={searchParams.get('min_score') || ''} onChange={(e) => handleFilterChange('min_score', e.target.value)} placeholder="Min" style={{ width: '50px', fontSize: '10px' }} />
              <span style={{ fontSize: '10px' }}>-</span>
              <input type="number" min="0" max="10" step="0.5" value={searchParams.get('max_score') || ''} onChange={(e) => handleFilterChange('max_score', e.target.value)} placeholder="Max" style={{ width: '50px', fontSize: '10px' }} />
            </div>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner size="lg" />}

      {error && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p className="error-text">{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <AnimeGrid animeList={animeList} />
          
          {animeList.length > 0 && (
            <Pagination
              currentPage={page}
              hasNextPage={hasNextPage}
              basePath="/search"
            />
          )}
        </>
      )}

      <style jsx>{`
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          align-items: flex-end;
        }

        .filter-item {
          flex: 1;
          min-width: 80px;
          background: white;
          border: 1px solid #ddd;
          padding: 5px;
        }

        @media (max-width: 600px) {
          .filter-row {
            flex-wrap: wrap;
          }

          .filter-item {
            flex: 0 0 calc(50% - 5px);
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <SearchContent />
    </Suspense>
  );
}
