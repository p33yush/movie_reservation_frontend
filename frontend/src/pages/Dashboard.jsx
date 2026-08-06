import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { token, user, setUser } = useAuth();
  const [reservations, setReservations] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [isEditing,setIsEditing]=useState(false);
  const [editFormData, setEditFormData]=useState({name:'',email:''});
  const [selectedTicket, setSelectedTicket]=useState(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data); // Update global user state (Header will update!)
        setIsEditing(false); // Close form
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };
  
  // Helper to open the form pre-filled with current data
  const handleEditClick = () => {
    setEditFormData({ name: user.name || '', email: user.email || '' });
    setIsEditing(true);
  };



  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/me/reservations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setReservations(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchReservations();
  }, [token]);

  // Reusable ticket card — used for both upcoming and past
  const TicketCard = ({ res, isPast }) => (
    <div 
      className="glass-panel" 
      onClick={() => setSelectedTicket(res)} // Opens the modal!
      style={{ 
        display: 'flex', padding: '20px', gap: '20px', alignItems: 'center', 
        flexWrap: 'wrap', opacity: isPast ? 0.6 : 1, 
        cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' 
      }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)'; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      
      {/* Poster */}
      <img src={res.showtime.movie.posterUrl || 'https://via.placeholder.com/100x150'} alt="Poster" style={{ width: '100px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }} />
      
      {/* Ticket Details */}
      <div style={{ flex: '1', minWidth: '250px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{res.showtime.movie.title}</h3>
          {/* Status Badge */}
          <span style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
            backgroundColor: res.status === 'CONFIRMED' ? 'rgba(74, 222, 128, 0.2)' : res.status === 'PENDING' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: res.status === 'CONFIRMED' ? '#4ade80' : res.status === 'PENDING' ? '#fbbf24' : '#ef4444'
          }}>
            {res.status}
          </span>
        </div>
        <p style={{ fontSize: '1rem', marginBottom: '5px' }}>
          <strong>Theatre:</strong> {res.showtime.screen.theatre.name} — {res.showtime.screen.name}
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '5px' }}>
          <strong>Time:</strong> {new Date(res.showtime.startTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '5px' }}>
          <strong>Seats:</strong> {res.reservedSeats.map(rs => rs.seat.row + rs.seat.number).join(', ')}
        </p>
      </div>
    </div>
  );


  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Tickets...</h2>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>

      {/* PROFILE SECTION */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        
        <div style={{ flex: '1' }}>
          {!isEditing ? (
            <>
              <h2 style={{ margin: 0 }}>{user?.name || 'Movie Buff'}</h2>
              <p style={{ color: 'var(--text-muted)', margin: '5px 0 0' }}>{user?.email}</p>
              <p style={{ color: 'var(--text-muted)', margin: '3px 0 0', fontSize: '0.85rem' }}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
              <button onClick={handleEditClick} className="btn-primary" style={{ marginTop: '10px', padding: '5px 15px', borderRadius: '5px', fontSize: '0.9rem' }}>
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
              <input 
                type="text" 
                value={editFormData.name} 
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
                className="input-field" 
                required 
              />
              <input 
                type="email" 
                value={editFormData.email} 
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} 
                className="input-field" 
                required 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '8px 15px', borderRadius: '5px', flex: '1' }}>Save</button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--glass-border)', color: 'white', flex: '1' }}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>


      {/* UPCOMING TICKETS */}
      <h2>Upcoming Tickets</h2>
      {reservations.upcoming.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>No upcoming tickets. Go book a movie!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', marginBottom: '40px' }}>
          {reservations.upcoming.map(res => (
            <TicketCard key={res.id} res={res} isPast={false} />
          ))}
        </div>
      )}

      {/* PAST TICKETS */}
      <h2>Past Bookings</h2>
      {reservations.past.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No past bookings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {reservations.past.map(res => (
            <TicketCard key={res.id} res={res} isPast={true} />
          ))}
        </div>
      )}

            {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(5px)'
          }} 
          onClick={() => setSelectedTicket(null)}
        >
          <div 
            className="glass-panel" 
            style={{ padding: '40px', maxWidth: '450px', width: '100%', position: 'relative', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }} 
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedTicket(null)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer', lineHeight: '1' }}
            >
              &times;
            </button>
            
            <h2 style={{ marginBottom: '5px', color: 'var(--primary)', fontSize: '1.8rem' }}>{selectedTicket.showtime.movie.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>{selectedTicket.showtime.screen.theatre.name} — {selectedTicket.showtime.screen.name}</p>

            {/* Huge QR Code Container */}
            {selectedTicket.status === 'CONFIRMED' && selectedTicket.qrCode ? (
              <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '15px', display: 'inline-block', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <img src={selectedTicket.qrCode} alt="QR" style={{ width: '220px', height: '220px', display: 'block' }} />
              </div>
            ) : (
              <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '15px', display: 'inline-flex', marginBottom: '30px', width: '220px', height: '220px', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--glass-border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>QR Code Unavailable</span>
              </div>
            )}

            <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-surface)', padding: '25px', borderRadius: '15px', fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p style={{ margin: 0 }}><strong>Date & Time:</strong> {new Date(selectedTicket.showtime.startTime).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p style={{ margin: 0 }}><strong>Seats:</strong> {selectedTicket.reservedSeats.map(rs => rs.seat.row + rs.seat.number).join(', ')}</p>
              <p style={{ margin: 0 }}><strong>Total Paid:</strong> <span style={{ color: '#4ade80' }}>₹{selectedTicket.totalAmount}</span></p>
              <p style={{ margin: 0 }}><strong>Booking ID:</strong> <span style={{ fontFamily: 'monospace' }}>#{selectedTicket.id.toString().padStart(6, '0')}</span></p>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
