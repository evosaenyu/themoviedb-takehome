import { useEffect, useState } from 'react';
import MovieCard from './components/MovieCard';
import { discoverMovies, TmdbMovie } from './api/tmdb';
import './App.css';

function App() {
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    discoverMovies()
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <main className="app">
      <h1 className="app-title">Movies</h1>
      {error && <p>{error}</p>}
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          year={Number(movie.release_date?.slice(0, 4)) || 0}
          genre="—"
          rating={movie.vote_average}
          posterUrl={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : undefined
          }
        />
      ))}
    </main>
  );
}

export default App;
