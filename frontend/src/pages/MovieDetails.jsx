import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function MovieDetails() {
  const { id } = useParams(); // Grabs the ID from the URL!
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setMovie(data.data);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // A tiny helper function to make database times look pretty (e.g. "2:30 PM")
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;
  if (error) return <h2 style={{ textAlign: 'center', marginTop: '50px', color: 'var(--primary)' }}>{error}</h2>;
  if (!movie) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Section: Movie Info */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '50px' }}>
        {/* Poster */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img 
            src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
            alt={movie.title}
            style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          />
        </div>
        
        {/* Details */}
        <div style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{movie.title}</h1>
          
          <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.1rem' }}>
            <span>{movie.genre}</span>
            <span>•</span>
            <span>{movie.duration} minutes</span>
            <span>•</span>
            <span style={{ color: '#fbbf24' }}>⭐ {movie.rating}/10</span>
          </div>
          
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
            {movie.description}
          </p>
        </div>
      </div>

            {/* Bottom Section: Showtimes Grouped by Venue */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
          Available Showtimes
        </h2>

        {movie.showtimes && movie.showtimes.length > 0 ? (
          (() => {
            // Group showtimes by theatre name
            const grouped = {};
            movie.showtimes.forEach(showtime => {
              const theatreName = showtime.screen.theatre.name;
              if (!grouped[theatreName]) {
                grouped[theatreName] = [];
              }
              grouped[theatreName].push(showtime);
            });

            return Object.keys(grouped).map(theatreName => (
              <div key={theatreName} style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '15px', fontSize: '1.1rem' }}>
                  🎬 {theatreName}
                </h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {grouped[theatreName].map(showtime => (
                    <Link
                      key={showtime.id}
                      to={`/showtimes/${showtime.id}`}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '15px 25px', backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--primary)', borderRadius: '10px',
                        transition: 'all 0.2s ease', color: 'var(--text-main)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                    >
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatTime(showtime.startTime)}</span>
                      <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>{formatDate(showtime.startTime)}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>{showtime.screen.name}</span>
                      <span style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 'bold', marginTop: '3px' }}>${parseFloat(showtime.price).toFixed(2)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ));
          })()
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No showtimes scheduled for this movie yet.</p>
        )}
      </div>


    </div>
  );
}
