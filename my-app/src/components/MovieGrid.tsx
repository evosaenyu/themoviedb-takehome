import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMoviePages, getMovieGenres } from '../api/tmdb';
import type { Genre, SortOption, SortOrder, TmdbMovie } from '../types';
import { filterByGenre, mergeMovies, sortMovies } from '../utils';
import LoadMoreButton from './LoadMoreButton';
import MovieCard from './MovieCard';
import Toolbar from './Toolbar';
import './MovieGrid.css';
import Search from './Search';

const INITIAL_PAGE_COUNT = 2;
const LOAD_MORE_PAGE_COUNT = 2;

function MovieGrid() {
  const [lastLoadedPage, setLastLoadedPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [sortedMovieCount, setSortedMovieCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);

  useEffect(() => {
    getMovieGenres()
      .then((data) => {
        setGenres(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    setSortedMovieCount(movies.length);
  }, [sortBy, sortOrder, movies.length]);

  useEffect(() => {
    setLoading(true);

    fetchMoviePages(1, INITIAL_PAGE_COUNT)
      .then(({ movies: fetchedMovies, lastLoadedPage: loadedThrough, totalPages: pagesTotal }) => {
        setMovies(fetchedMovies);
        setSortedMovieCount(fetchedMovies.length);
        setLastLoadedPage(loadedThrough);
        setTotalPages(pagesTotal);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load movies');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const hasMore = lastLoadedPage < totalPages;

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const { movies: fetchedMovies, lastLoadedPage: loadedThrough, totalPages: pagesTotal } =
        await fetchMoviePages(lastLoadedPage + 1, LOAD_MORE_PAGE_COUNT, totalPages);

      setTotalPages(pagesTotal);
      setMovies((prev) => mergeMovies(prev, fetchedMovies));
      setLastLoadedPage(loadedThrough);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more movies');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, lastLoadedPage, loadingMore, totalPages]);

  const displayedMovies = useMemo(() => {
    const sortedSource = searchResults.length > 0 ? searchResults : movies.slice(0, sortedMovieCount);
    const appendedSource = searchResults.length > 0 ? [] : movies.slice(sortedMovieCount);

    const sortedMovies = sortMovies(
      filterByGenre(sortedSource, selectedGenreId),
      sortBy,
      sortOrder,
    );
    const appendedMovies = filterByGenre(appendedSource, selectedGenreId);

    return [...sortedMovies, ...appendedMovies];
  }, [movies, sortedMovieCount, selectedGenreId, sortBy, sortOrder, searchResults]);

  return (
    <>
      <Search setSearchResults={setSearchResults} />
      <Toolbar
        genres={genres}
        selectedGenreId={selectedGenreId}
        onGenreChange={setSelectedGenreId}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && displayedMovies.length === 0 && !error ? (
        <p className="movie-grid-empty">No movies match your filter.</p>
      ) : (
        <>
          <div className="movie-grid">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                year={Number(movie.release_date?.slice(0, 4)) || 0}
                genre={genres.find((genre) => genre.id === movie.genre_ids[0])?.name || 'Unknown'}
                rating={movie.vote_average}
                posterUrl={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : undefined
                }
                overview={movie.overview}
              />
            ))}
          </div>
          {hasMore && <LoadMoreButton onClick={loadMore} loading={loadingMore} />}
        </>
      )}
    </>
  );
}

export default MovieGrid;
