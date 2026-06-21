import type {
  DiscoverMoviesResponse,
  FetchMoviePagesResult,
  Genre,
  GenreListResponse,
} from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';

export async function discoverMovies(page: number): Promise<DiscoverMoviesResponse> {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('Missing REACT_APP_TMDB_API_KEY');
  }

  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('sort_by', 'rating.desc');
  url.searchParams.set('page', String(page));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const data: DiscoverMoviesResponse = await response.json();
  return data;
}

export async function fetchMoviePages(
  fromPage: number,
  count: number,
  maxPage?: number,
): Promise<FetchMoviePagesResult> {
  const pages = Array.from({ length: count }, (_, index) => fromPage + index).filter(
    (page) => maxPage === undefined || page <= maxPage,
  );

  if (pages.length === 0) {
    return {
      movies: [],
      lastLoadedPage: Math.max(0, fromPage - 1),
      totalPages: maxPage ?? 0,
    };
  }

  const responses = await Promise.all(pages.map((page) => discoverMovies(page)));
  const lastResponse = responses[responses.length - 1]!;

  return {
    movies: responses.flatMap((response) => response.results),
    lastLoadedPage: pages[pages.length - 1]!,
    totalPages: lastResponse.total_pages,
  };
}

export async function getMovieGenres(): Promise<Genre[]> {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('Missing REACT_APP_TMDB_API_KEY');
  }
  const url = new URL(`${BASE_URL}/genre/movie/list`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }
  const data: GenreListResponse = await response.json();
  return data.genres;
}
