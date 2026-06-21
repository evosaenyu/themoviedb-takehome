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

export type FetchMoviePagesResult = {
  movies: TmdbMovie[];
  lastLoadedPage: number;
  totalPages: number;
};

export type SortOption = 'rating' | 'year' | 'title';
export type SortOrder = 'asc' | 'desc';

export type MovieCardProps = {
  title: string;
  year: number;
  genre: string;
  rating: number;
  posterUrl?: string;
  overview: string;
};
