import { useEffect, useState } from 'react';
import './Search.css';
import type { TmdbMovie } from '../types';

function Search({ setSearchResults }: { setSearchResults: (results: TmdbMovie[]) => void }) {
  
  const [search, setSearch] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length === 0) {
        setSearchResults([]);
        return;
      }
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${search}`)
        .then(response => response.json())
        .then(data => {
          setSearchResults(data.results);
        })
        .catch(error => console.error('Error:', error));
    }, 500);
    return () => clearTimeout(timer);
  }, [search, setSearchResults]);
  
  return (
    <div className="search">
      <input className="search-input" type="text" placeholder="Search" value={search} onChange={handleSearch} />
    </div>
  );

}

export default Search;