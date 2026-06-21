import { motion } from 'framer-motion';
import { useState } from 'react';
import type { MovieCardProps } from '../types';
import './MovieCard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function MovieCard({
  title,
  year,
  genre,
  rating,
  posterUrl,
  overview,
}: MovieCardProps) {
  const [posterLoaded, setPosterLoaded] = useState(!posterUrl);

  const handlePosterRef = (node: HTMLImageElement | null) => {
    if (node?.complete) {
      setPosterLoaded(true);
    }
  };

  return (
    <motion.article
      className="movie-card"
      tabIndex={0}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="movie-card-poster-wrap">
        {posterUrl ? (
          <img
            ref={handlePosterRef}
            className={`movie-card-poster${posterLoaded ? ' is-loaded' : ''}`}
            src={posterUrl}
            alt={title}
            draggable={false}
            onLoad={() => setPosterLoaded(true)}
          />
        ) : (
          <div className="movie-card-poster movie-card-poster-placeholder" />
        )}
        <div className="movie-card-tooltip" role="tooltip">
          <p>{overview || 'No overview available.'}</p>
        </div>
      </div>
      <div className="movie-card-body">
        <h2 className="movie-card-title">{title}</h2>
        <p className="movie-card-meta">
          {year} · {genre}
        </p>
        <p className="movie-card-rating">Rating: {rating.toFixed(1)}</p>
      </div>
    </motion.article>
  );
}

export default MovieCard;
