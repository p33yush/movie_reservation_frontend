import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to fetch movies from our backend
  const fetchMovies = async (query = '') => {
    setLoading(true);
    try {
      // If there's a search query, append it to the URL! (Testing our Day 7 Backend Logic)
      const url = query 
        ? `http://localhost:3000/api/movies?search=${query}` 
        : `http://localhost:3000/api/movies`;
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data.movies);
      }
    } catch (err) {
      console.error("Failed to fetch movies", err);
    } finally {
      setLoading(false);
    }
  };

  // Run this once when the page first loads
  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchQuery);
  };

  if (loading && movies.length === 0) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Movies...</h2>;
  }

  return (
    <div>
      {/* HEADER & SEARCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Now Showing</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '20px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)', color: 'white', outline: 'none', width: '250px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '20px' }}>
            Search
          </button>
        </form>
      </div>

      {/* MOVIE GRID */}
      {movies.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No movies found matching "{searchQuery}"</p>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
