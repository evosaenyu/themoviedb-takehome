import './MovieCard.css';

type MovieCardProps = {
  title: string;
  year: number;
  genre: string;
  rating: number;
  posterUrl?: string;
};

function MovieCard({ title, year, genre, rating, posterUrl }: MovieCardProps) {
  return (
    <article className="movie-card">
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
    </article>
  );
}

export default MovieCard;
