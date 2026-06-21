import type { MovieCardProps } from '../types';
import './MovieCard.css';

function MovieCard({ title, year, genre, rating, posterUrl, overview }: MovieCardProps) {
  return (
    <article className="movie-card" tabIndex={0}>
      {posterUrl ? (
        <img className="movie-card-poster" src={posterUrl} alt={title} />
      ) : (
        <div className="movie-card-poster movie-card-poster-placeholder" />
      )}
      <div className="movie-card-body">
        <h2 className="movie-card-title">{title}</h2>
        <p className="movie-card-meta">
          {year} · {genre}
        </p>
        <p className="movie-card-rating">Rating: {rating.toFixed(1)}</p>
      </div>
      <div className="movie-card-tooltip" role="tooltip">
        <p>{overview || 'No overview available.'}</p>
      </div>
    </article>
  );
}

export default MovieCard;
