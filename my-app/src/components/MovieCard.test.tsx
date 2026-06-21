import { render } from '@testing-library/react';
import MovieCard from './MovieCard';

const defaultProps = {
  title: 'Inception',
  year: 2010,
  genre: 'Sci-Fi',
  rating: 8.4,
  overview: 'A thief who steals corporate secrets through dream-sharing technology.',
};

describe('MovieCard', () => {
  it('renders core layout class names', () => {
    const { container } = render(<MovieCard {...defaultProps} />);

    expect(container.querySelector('.movie-card')).toBeInTheDocument();
    expect(container.querySelector('.movie-card-body')).toBeInTheDocument();
    expect(container.querySelector('.movie-card-title')).toBeInTheDocument();
    expect(container.querySelector('.movie-card-meta')).toBeInTheDocument();
    expect(container.querySelector('.movie-card-rating')).toBeInTheDocument();
    expect(container.querySelector('.movie-card-tooltip')).toBeInTheDocument();
  });

  it('renders poster image class when posterUrl is provided', () => {
    const { container } = render(
      <MovieCard {...defaultProps} posterUrl="https://example.com/poster.jpg" />,
    );

    const poster = container.querySelector('.movie-card-poster');
    expect(poster).toBeInTheDocument();
    expect(poster?.tagName).toBe('IMG');
    expect(container.querySelector('.movie-card-poster-placeholder')).not.toBeInTheDocument();
  });

  it('renders placeholder poster classes when posterUrl is missing', () => {
    const { container } = render(<MovieCard {...defaultProps} />);

    const poster = container.querySelector('.movie-card-poster');
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveClass('movie-card-poster-placeholder');
    expect(poster?.tagName).toBe('DIV');
  });
});
