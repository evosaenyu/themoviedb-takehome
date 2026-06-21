import type { LoadMoreButtonProps } from '../types';
import './LoadMoreButton.css';

function LoadMoreButton({ onClick, loading }: LoadMoreButtonProps) {
  return (
    <div className="load-more">
      <button
        type="button"
        className="load-more-button"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load more movies'}
      </button>
    </div>
  );
}

export default LoadMoreButton;
