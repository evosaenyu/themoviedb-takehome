import type { SortOption, SortOrder, ToolbarProps } from '../types';
import './Toolbar.css';

function Toolbar({
  genres,
  selectedGenreId,
  onGenreChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <span className="toolbar-label">Filter</span>
        <div className="toolbar-controls">
          <button
            type="button"
            className={`chip ${selectedGenreId === null ? 'chip-active' : ''}`}
            onClick={() => onGenreChange(null)}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              className={`chip ${selectedGenreId === genre.id ? 'chip-active' : ''}`}
              onClick={() => onGenreChange(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section toolbar-section-sort">
        <span className="toolbar-label">Sort</span>
        <div className="toolbar-sort">
          <select
            id="sort"
            className="input-control"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
          >
            <option value="title">Title</option>
            <option value="year">Release year</option>
            <option value="rating">Rating</option>
          </select>
          <select
            id="sort-order"
            className="input-control"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
