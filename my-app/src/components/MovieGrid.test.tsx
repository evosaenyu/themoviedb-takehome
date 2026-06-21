import { render, waitFor } from '@testing-library/react';
import { fetchMoviePages, getMovieGenres } from '../api/tmdb';
import type { Genre, TmdbMovie } from '../types';
import MovieGrid from './MovieGrid';

jest.mock('../api/tmdb', () => ({
  fetchMoviePages: jest.fn(),
  getMovieGenres: jest.fn(),
}));

const mockFetchMoviePages = fetchMoviePages as jest.MockedFunction<typeof fetchMoviePages>;
const mockGetMovieGenres = getMovieGenres as jest.MockedFunction<typeof getMovieGenres>;

const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
];

const mockMovies: TmdbMovie[] = [
  {
    id: 1,
    title: 'Inception',
    release_date: '2010-07-16',
    vote_average: 8.4,
    genre_ids: [28],
    poster_path: '/inception.jpg',
    overview: 'A thief who steals corporate secrets through dream-sharing technology.',
  },
  {
    id: 2,
    title: 'Interstellar',
    release_date: '2014-11-07',
    vote_average: 8.6,
    genre_ids: [12],
    poster_path: null,
    overview: 'A team of explorers travel through a wormhole in space.',
  },
];

describe('MovieGrid', () => {
  beforeEach(() => {
    mockGetMovieGenres.mockResolvedValue(mockGenres);
    mockFetchMoviePages.mockResolvedValue({
      movies: mockMovies,
      lastLoadedPage: 1,
      totalPages: 1,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders movie cards after movies load', async () => {
    const { container } = render(<MovieGrid />);

    await waitFor(() => {
      expect(container.querySelectorAll('.movie-card')).toHaveLength(2);
    });

    expect(container.querySelector('.movie-grid')).toBeInTheDocument();
    expect(container.querySelectorAll('.movie-card')).toHaveLength(2);
  });

  it('does not render movie cards while loading', () => {
    mockFetchMoviePages.mockReturnValue(new Promise(() => {}));
    mockGetMovieGenres.mockReturnValue(new Promise(() => {}));

    const { container } = render(<MovieGrid />);

    expect(container.querySelector('.movie-card')).not.toBeInTheDocument();
  });
});
