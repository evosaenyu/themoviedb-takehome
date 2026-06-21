import MovieCard from './components/MovieCard';
import './App.css';

function App() {
  return (
    <main className="app">
      <h1 className="app-title">Movies</h1>
      <MovieCard title="Movie title" year={2026} genre="Drama" rating={6} />
    </main>
  );
}

export default App;
