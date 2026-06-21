const BASE_URL = 'https://api.themoviedb.org/3';

export type TmdbMovie = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  poster_path: string | null;
  overview: string;
};

export type DiscoverMoviesResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export type Genre = {
  id: number;
  name: string;
};

export type GenreListResponse = {
    genres: Genre[];
};

export async function discoverMovies(): Promise<DiscoverMoviesResponse> {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('Missing REACT_APP_TMDB_API_KEY');
  }

  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('sort_by', 'rating.desc');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const data: DiscoverMoviesResponse = await response.json();
  return data;
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
