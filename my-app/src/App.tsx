import MovieCard from './components/MovieCard';

function App() {
  return (
    <main style={{ padding: '24px' }}>
      <MovieCard title="Movie title" year={2026} genre="Drama" rating={6} />
    </main>
  );
}

export default App;
