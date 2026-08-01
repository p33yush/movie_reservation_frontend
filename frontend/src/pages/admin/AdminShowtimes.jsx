import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminShowtimes() {
  const { token } = useAuth();
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  // Form state
  const [movieId, setMovieId] = useState('');
  const [screenId, setScreenId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchMovies();
    fetchTheatres();
    fetchShowtimes();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      const data = await response.json();
      if (data.success) setMovies(data.data.movies);
    } catch (err) { console.error(err); }
  };

  const fetchTheatres = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/theatres');
      const data = await response.json();
      if (data.success) setTheatres(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/showtimes');
      const data = await response.json();
      if (data.success) setShowtimes(data.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/showtimes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: parseInt(movieId),
          screenId: parseInt(screenId),
          startTime: new Date(startTime).toISOString(),
          price: parseFloat(price)
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Showtime created!');
        setMovieId(''); setScreenId(''); setStartTime(''); setPrice('');
        fetchShowtimes();
      } else {
        alert(data.error || 'Failed to create showtime');
      }
    } catch (err) {
      alert('Error creating showtime');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this showtime?')) return;
    try {
      await fetch(`http://localhost:3000/api/showtimes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchShowtimes();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  // Build a flat list of all screens across all theatres for the dropdown
  const allScreens = [];
  theatres.forEach(theatre => {
    if (theatre.screens) {
      theatre.screens.forEach(screen => {
        allScreens.push({
          id: screen.id,
          label: `${theatre.name} — ${screen.name}`
        });
      });
    }
  });

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Admin Sub-Navigation */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0, marginRight: 'auto', letterSpacing: '2px' }}>Admin Portal</h1>
        <Link to="/admin/dashboard" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Overview</Link>
        <Link to="/admin/movies" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Movies</Link>
        <Link to="/admin/venues" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Venues</Link>
        <Link to="/admin/showtimes" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px' }}>Showtimes</Link>
      </div>

      {/* CREATE SHOWTIME FORM */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Schedule a Showtime</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <select required value={movieId} onChange={e => setMovieId(e.target.value)} style={inputStyle}>
            <option value="">Select Movie</option>
            {movies.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <select required value={screenId} onChange={e => setScreenId(e.target.value)} style={inputStyle}>
            <option value="">Select Screen</option>
            {allScreens.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <input type="datetime-local" required value={startTime} onChange={e => setStartTime(e.target.value)} style={inputStyle} />
          <input type="number" step="0.01" placeholder="Ticket Price ($)" required value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />

          <button type="submit" className="btn-primary" style={{ padding: '15px', borderRadius: '10px', gridColumn: 'span 2' }}>Create Showtime</button>
        </form>
      </div>

      {/* SHOWTIMES LIST */}
      <h2 style={{ marginBottom: '20px' }}>All Showtimes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {showtimes.map(st => (
          <div key={st.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{st.movie?.title || 'Unknown Movie'}</h3>
              <p style={{ color: 'var(--text-muted)', margin: '5px 0 0' }}>
                {st.screen?.theatre?.name} — {st.screen?.name} • {new Date(st.startTime).toLocaleString()} • ${parseFloat(st.price).toFixed(2)}
              </p>
            </div>
            <button onClick={() => handleDelete(st.id)} style={{ padding: '8px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
