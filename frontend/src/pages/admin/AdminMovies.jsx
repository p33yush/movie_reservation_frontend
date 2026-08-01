import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminMovies() {
  const { token } = useAuth();
  const [movies, setMovies] = useState([]);
  
  // Form state for creating a new movie
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      const data = await response.json();
      if (data.success) {
        setMovies(data.data.movies);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      // 1. Send the new movie to our secure backend endpoint using the Admin token
      const response = await fetch('http://localhost:3000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          duration: parseInt(duration),
          rating: parseFloat(rating),
          posterUrl
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Movie added successfully!");
        setTitle(''); setDuration(''); setRating(''); setPosterUrl('');
        fetchMovies(); // Refresh the list instantly
      } else {
        alert(data.error || "Failed to add movie");
      }
    } catch (err) {
      alert("Error adding movie");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchMovies(); 
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Admin Sub-Navigation */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0, marginRight: 'auto', letterSpacing: '2px' }}>Admin Portal</h1>
        <Link to="/admin/dashboard" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Overview</Link>
        <Link to="/admin/movies" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px' }}>Manage Movies</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        
        {/* ADD MOVIE FORM */}
        <div className="glass-panel" style={{ padding: '30px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '20px' }}>Add New Movie</h2>
          <form onSubmit={handleCreateMovie} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Movie Title" required value={title} onChange={e => setTitle(e.target.value)} className="form-input" />
            <input type="number" placeholder="Duration (mins)" required value={duration} onChange={e => setDuration(e.target.value)} className="form-input" />
            <input type="number" step="0.1" placeholder="Rating (0-10)" required value={rating} onChange={e => setRating(e.target.value)} className="form-input" />
            <input type="url" placeholder="Poster Image URL" value={posterUrl} onChange={e => setPosterUrl(e.target.value)} className="form-input" />
            
            <button type="submit" className="btn-primary" style={{ padding: '15px', marginTop: '10px', borderRadius: '10px' }}>Add Movie to Database</button>
          </form>
        </div>

        {/* MOVIE LIST */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Movie Catalog</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {movies.map(movie => (
              <div key={movie.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src={movie.posterUrl || 'https://via.placeholder.com/50x75'} alt="Poster" style={{ width: '50px', borderRadius: '5px' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{movie.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{movie.duration} mins • {movie.rating}/10</p>
                  </div>
                </div>
                
                <button onClick={() => handleDelete(movie.id)} style={{ padding: '8px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
