import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMoviePages, getMovieGenres } from './api/tmdb';
import MovieCard from './components/MovieCard';
import type { Genre, SortOption, SortOrder, TmdbMovie } from './types';
import { filterByGenre, mergeMovies, sortMovies } from './utils';
import './App.css';

const INITIAL_PAGE_COUNT = 5;
const LOAD_MORE_PAGE_COUNT = 5;

function App() {
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
  }, [sortBy, sortOrder]);

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
    const sortedSource = movies.slice(0, sortedMovieCount);
    const appendedSource = movies.slice(sortedMovieCount);

    const sortedMovies = sortMovies(
      filterByGenre(sortedSource, selectedGenreId),
      sortBy,
      sortOrder,
    );
    const appendedMovies = filterByGenre(appendedSource, selectedGenreId);

    return [...sortedMovies, ...appendedMovies];
  }, [movies, sortedMovieCount, selectedGenreId, sortBy, sortOrder]);

  return (
    <main className="app">
      <h1 className="app-title">Movies</h1>

      <div className="toolbar">
        <div className="toolbar-section">
          <span className="toolbar-label">Filter</span>
          <div className="toolbar-controls">
            <button
              type="button"
              className={`chip ${selectedGenreId === null ? 'chip-active' : ''}`}
              onClick={() => setSelectedGenreId(null)}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                className={`chip ${selectedGenreId === genre.id ? 'chip-active' : ''}`}
                onClick={() => setSelectedGenreId(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-section toolbar-section-sort">
          <span className="toolbar-label">Sort</span>
          <div className="toolbar-sort">
            <select
              id="sort"
              className="input-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="title">Title</option>
              <option value="year">Release year</option>
              <option value="rating">Rating</option>
            </select>
            <select
              id="sort-order"
              className="input-control"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && displayedMovies.length === 0 && !error ? (
        <p className="empty-state">No movies match your filter.</p>
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
          {hasMore && (
            <div className="load-more">
              <button
                type="button"
                className="load-more-button"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load more movies'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default App;
