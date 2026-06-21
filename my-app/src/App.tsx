import { useEffect, useMemo, useState } from 'react';
import MovieCard from './components/MovieCard';
import { discoverMovies, Genre, getMovieGenres, TmdbMovie } from './api/tmdb';
import './App.css';

type SortOption = 'rating' | 'year' | 'title';
type SortOrder = 'asc' | 'desc';

function App() {
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    discoverMovies()
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => {
        setError(err.message);
      });
    getMovieGenres()
      .then((data) => {
        setGenres(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const displayedMovies = useMemo(() => {
    let result = [...movies];

    if (selectedGenreId !== null) {
      result = result.filter((movie) => movie.genre_ids.includes(selectedGenreId));
    }

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
        default:
          comparison = movies.indexOf(a) - movies.indexOf(b);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [movies, selectedGenreId, sortBy, sortOrder]);

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

      {displayedMovies.length === 0 && !error ? (
        <p className="empty-state">No movies match your filter.</p>
      ) : (
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
      )}
    </main>
  );
}

export default App;
