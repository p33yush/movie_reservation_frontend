import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminVenues() {
  const { token } = useAuth();
  const [theatres, setTheatres] = useState([]);

  // Theatre form
  const [theatreName, setTheatreName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Screen form
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [screenName, setScreenName] = useState('');
  const [totalSeats, setTotalSeats] = useState('');

  const fetchTheatres = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/theatres');
      const data = await response.json();
      if (data.success) {
        setTheatres(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/theatres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: theatreName, city, address })
      });
      const data = await response.json();
      if (data.success) {
        alert('Theatre created!');
        setTheatreName(''); setCity(''); setAddress('');
        fetchTheatres();
      } else {
        alert(data.error || 'Failed to create theatre');
      }
    } catch (err) {
      alert('Error creating theatre');
    }
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/theatres/${selectedTheatreId}/screens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: screenName,
          totalSeats: parseInt(totalSeats)
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Screen created!');
        setScreenName(''); setTotalSeats('');
        fetchTheatres();
      } else {
        alert(data.error || 'Failed to create screen');
      }
    } catch (err) {
      alert('Error creating screen');
    }
  };

    const handleDeleteTheatre = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theatre and ALL its screens?')) return;

    const el = document.getElementById(`theatre-${id}`);
    if (el) el.classList.add('animate-exit');

    try {
      const response = await fetch(`http://localhost:3000/api/theatres/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) setTimeout(()=>  fetchTheatres(),300);
      else {
        if (el) el.classList.remove('animate-exit');
        alert(await response.text());
      }
    }catch (err) { alert('Failed to delete'); }
  };

  const handleDeleteScreen = async (theatreId, screenId) => {
    if (!window.confirm('Are you sure you want to delete this screen?')) return;

    const el = document.getElementById(`screen-${screenId}`);
    if (el) el.classList.add('animate-exit');

    try {
      const response = await fetch(`http://localhost:3000/api/theatres/${theatreId}/screens/${screenId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setTimeout(() => fetchTheatres(), 300);
      else {
        if (el) el.classList.remove('animate-exit');
        alert(await response.text());
      }
    } catch (err) { alert('Failed to delete'); }
  };


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
        <Link to="/admin/venues" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px' }}>Venues</Link>
        <Link to="/admin/showtimes" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Showtimes</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

        {/* CREATE THEATRE */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Add Theatre</h2>
          <form onSubmit={handleCreateTheatre} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Theatre Name" required value={theatreName} onChange={e => setTheatreName(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="City" required value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Full Address" required value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
            <button type="submit" className="btn-primary" style={{ padding: '15px', borderRadius: '10px' }}>Create Theatre</button>
          </form>
        </div>

        {/* CREATE SCREEN */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Add Screen</h2>
          <form onSubmit={handleCreateScreen} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <select required value={selectedTheatreId} onChange={e => setSelectedTheatreId(e.target.value)} style={inputStyle}>
              <option value="">Select a Theatre</option>
              {theatres.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <input type="text" placeholder="Screen Name (e.g. Screen 1)" required value={screenName} onChange={e => setScreenName(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Total Seats" required value={totalSeats} onChange={e => setTotalSeats(e.target.value)} style={inputStyle} />
            <button type="submit" className="btn-primary" style={{ padding: '15px', borderRadius: '10px' }}>Create Screen</button>
          </form>
        </div>

      </div>

            {/* THEATRE LIST */}
      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>All Theatres</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {theatres.map(theatre => (
          <div key={theatre.id} id={`theatre-${theatre.id}`} className="glass-panel hover-lift animate-enter" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '5px' }}>{theatre.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>{theatre.city} — {theatre.address}</p>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {theatre.screens && theatre.screens.map(screen => (
                  <div key={screen.id} id={`screen-${screen.id}`} className="animate-enter" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                    <span style={{ padding: '5px 15px', fontSize: '0.9rem' }}>
                      {screen.name} ({screen.totalSeats} seats)
                    </span>
                    <button onClick={() => handleDeleteScreen(theatre.id, screen.id)} style={{ padding: '5px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => handleDeleteTheatre(theatre.id)} style={{ padding: '8px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Delete Theatre
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
