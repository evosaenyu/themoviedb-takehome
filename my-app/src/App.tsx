import { useEffect, useState } from 'react';
import MovieCard from './components/MovieCard';
import { discoverMovies, Genre, getMovieGenres, TmdbMovie } from './api/tmdb';
import './App.css';

function App() {
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
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

  return (
    <main className="app">
      <h1 className="app-title">Movies</h1>
      {error && <p>{error}</p>}
      <div className="movie-grid">
        {movies.map((movie) => (
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
          />
        ))}
      </div>
    </main>
  );
}

export default App;
