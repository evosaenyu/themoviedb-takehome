import type { SortOption, SortOrder, TmdbMovie } from './types';

export function mergeMovies(existing: TmdbMovie[], incoming: TmdbMovie[]): TmdbMovie[] {
  const seen = new Set(existing.map((movie) => movie.id));
  const unique = incoming.filter((movie) => !seen.has(movie.id));
  return unique.length === 0 ? existing : [...existing, ...unique];
}

export function sortMovies(
  movies: TmdbMovie[],
  sortBy: SortOption,
  sortOrder: SortOrder,
): TmdbMovie[] {
  const result = [...movies];

  result.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'rating':
        comparison = a.vote_average - b.vote_average;
        break;
      case 'year':
        comparison = a.release_date.localeCompare(b.release_date);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
}

export function filterByGenre(movies: TmdbMovie[], genreId: number | null): TmdbMovie[] {
  if (genreId === null) return movies;
  return movies.filter((movie) => movie.genre_ids.includes(genreId));
}
