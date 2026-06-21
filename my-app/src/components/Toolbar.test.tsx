import { render, screen } from '@testing-library/react';
import type { Genre } from '../types';
import Toolbar from './Toolbar';

const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 35, name: 'Comedy' },
];

const defaultProps = {
  genres: mockGenres,
  selectedGenreId: null,
  onGenreChange: jest.fn(),
  sortBy: 'rating' as const,
  onSortByChange: jest.fn(),
  sortOrder: 'desc' as const,
  onSortOrderChange: jest.fn(),
};

describe('Toolbar filter section', () => {
  it('renders the filter section', () => {
    const { container } = render(<Toolbar {...defaultProps} />);

    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(container.querySelector('.toolbar-controls')).toBeInTheDocument();
  });

  it('renders All and genre chips from dummy data', () => {
    render(<Toolbar {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adventure' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Comedy' })).toBeInTheDocument();
  });

  it('renders a chip button for each dummy genre', () => {
    const { container } = render(<Toolbar {...defaultProps} />);

    const chips = container.querySelectorAll('.toolbar-controls .chip');
    expect(chips).toHaveLength(mockGenres.length + 1);
  });
});
