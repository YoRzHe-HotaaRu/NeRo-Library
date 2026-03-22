import { Anime, AnimeResponse, AnimeSearchResult, Genre } from '@/types/anime';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Simple cache to avoid duplicate API requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Rate limiting helper - Jikan API allows 3 req/sec, we use 1 req/sec to be safe
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests
const MAX_RETRIES = 3;

async function rateLimitedFetch(url: string): Promise<Response> {
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    
    lastRequestTime = Date.now();
    const response = await fetch(url);
    
    if (response.status !== 429) {
      return response;
    }
    
    // Rate limited - wait longer before retrying
    retries++;
    const retryDelay = Math.min(1000 * Math.pow(2, retries), 10000); // Exponential backoff, max 10s
    console.warn(`Rate limited (429), retrying in ${retryDelay}ms... (attempt ${retries}/${MAX_RETRIES})`);
    await delay(retryDelay);
  }
  
  throw new Error(`HTTP error! status: 429 - Too many retries`);
}

export async function getTopAnime(page: number = 1, limit: number = 25): Promise<AnimeResponse> {
  const cacheKey = `top-anime-${page}-${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/top/anime?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching top anime:', error);
    throw error;
  }
}

export async function getSeasonalAnime(page: number = 1, limit: number = 25): Promise<AnimeResponse> {
  const cacheKey = `seasonal-anime-${page}-${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/seasons/now?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
    throw error;
  }
}

export interface SearchFilters {
  query?: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  rating?: string;
  orderBy?: string;
  sort?: string;
  minScore?: string;
  maxScore?: string;
}

export async function searchAnime(filters: SearchFilters = {}): Promise<AnimeSearchResult> {
  const { query = '', page = 1, limit = 25, type, status, rating, orderBy, sort, minScore, maxScore } = filters;
  
  const cacheKey = `search-${JSON.stringify(filters)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (rating) params.set('rating', rating);
    if (orderBy) params.set('order_by', orderBy);
    if (sort) params.set('sort', sort);
    if (minScore) params.set('min_score', minScore);
    if (maxScore) params.set('max_score', maxScore);

    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/anime?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}

export async function getAnimeById(id: number): Promise<{ data: Anime }> {
  const cacheKey = `anime-${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/anime/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}

export interface GenreFilters {
  genreId: number;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  rating?: string;
  orderBy?: string;
  sort?: string;
  minScore?: string;
  maxScore?: string;
}

export async function getAnimeByGenre(filters: GenreFilters): Promise<AnimeResponse> {
  const { genreId, page = 1, limit = 25, type, status, rating, orderBy, sort, minScore, maxScore } = filters;
  
  const cacheKey = `genre-${JSON.stringify(filters)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    params.set('genres', genreId.toString());
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (rating) params.set('rating', rating);
    if (orderBy) params.set('order_by', orderBy);
    if (sort) params.set('sort', sort);
    if (minScore) params.set('min_score', minScore);
    if (maxScore) params.set('max_score', maxScore);

    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/anime?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching anime by genre:', error);
    throw error;
  }
}

export async function getGenres(): Promise<{ data: Genre[] }> {
  const cacheKey = 'genres';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/genres/anime`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}

export async function getRandomAnime(): Promise<{ data: Anime }> {
  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/random/anime`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching random anime:', error);
    throw error;
  }
}

export interface Season {
  year: number;
  seasons: string[];
}

export interface SeasonInfo {
  year: number;
  season: string;
}

export async function getSeasons(): Promise<{ data: Season[] }> {
  const cacheKey = 'seasons';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/seasons`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    throw error;
  }
}

export interface SeasonFilters {
  year: number;
  season: string;
  page?: number;
  limit?: number;
  type?: string;
  rating?: string;
  orderBy?: string;
  sort?: string;
  minScore?: string;
  maxScore?: string;
}

export async function getAnimeBySeason(filters: SeasonFilters): Promise<AnimeResponse> {
  const { year, season, page = 1, limit = 25, type, rating, orderBy, sort, minScore, maxScore } = filters;
  
  const cacheKey = `season-${JSON.stringify(filters)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    if (type) params.set('type', type);
    if (rating) params.set('rating', rating);
    if (orderBy) params.set('order_by', orderBy);
    if (sort) params.set('sort', sort);
    if (minScore) params.set('min_score', minScore);
    if (maxScore) params.set('max_score', maxScore);

    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/seasons/${year}/${season}?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching anime by season:', error);
    throw error;
  }
}
