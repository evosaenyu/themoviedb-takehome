const BASE_URL = 'https://api.themoviedb.org/3';

export type TmdbMovie = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  poster_path: string | null;
};

export type DiscoverMoviesResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export async function discoverMovies(): Promise<DiscoverMoviesResponse> {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('Missing REACT_APP_TMDB_API_KEY');
  }

  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('sort_by', 'popularity.desc');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const data: DiscoverMoviesResponse = await response.json();
  console.log('discover/movie response:', data);
  return data;
}