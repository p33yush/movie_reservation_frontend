import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

import Input from '../components/ui/Input';
import Button from '../components/ui/Button';


export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGenre,setSelectedGenre] = useState('');


  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance'];


  // Function to fetch movies from our backend
  const fetchMovies = async (query = '', genre = '') => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/movies?`;
      if (query) url += `search=${query}&`;
      if (genre && genre !== 'All') url += `genre=${genre}`;

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
    fetchMovies(searchQuery,selectedGenre);
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    fetchMovies(searchQuery, genre);
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
          <Input 
            type="text" 
            placeholder="Search movies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '300px', 
              height: '44px', 
              borderRadius: '30px', 
              backgroundColor: '#1D2330', 
              border: '1px solid rgba(255,255,255,0.08)',
              paddingLeft: '20px',
              color: 'white'
            }}
          />
          <Button 
            type="submit"
            style={{ 
              height: '44px', 
              borderRadius: '30px', 
              backgroundColor: '#E50914', 
              padding: '0 18px' 
            }}
          >
            Search
          </Button>
        </form>

      </div>

            {/* GENRE FILTERS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
          >
            {genre}
          </button>
        ))}
      </div>


      {/* MOVIE GRID */}
      {movies.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No movies found matching {searchQuery}</p>
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
