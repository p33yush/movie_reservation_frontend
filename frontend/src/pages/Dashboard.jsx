import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [reservations, setReservations] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

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
    <div className="glass-panel" style={{ display: 'flex', padding: '20px', gap: '20px', alignItems: 'center', flexWrap: 'wrap', opacity: isPast ? 0.6 : 1 }}>
      
      {/* Poster */}
      <img src={res.showtime.movie.posterUrl || 'https://via.placeholder.com/100x150'} alt="Poster" style={{ width: '100px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }} />
      
      {/* Ticket Details */}
      <div style={{ flex: '1', minWidth: '250px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{res.showtime.movie.title}</h3>
          {/* Status Badge */}
          <span style={{
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
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
          <strong>Time:</strong> {new Date(res.showtime.startTime).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '5px' }}>
          <strong>Seats:</strong> {res.reservedSeats.map(rs => rs.seat.row + rs.seat.number).join(', ')}
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
          <strong>Total Paid:</strong> ${res.totalAmount}
        </p>
      </div>

      {/* QR Code — only for upcoming confirmed tickets */}
      {!isPast && res.status === 'CONFIRMED' && res.qrCode && (
        <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'var(--bg-surface)', borderRadius: '15px', border: '1px dashed var(--primary)' }}>
          <img src={res.qrCode} alt="Ticket QR Code" style={{ width: '120px', height: '120px', borderRadius: '10px', backgroundColor: 'white', padding: '5px' }} />
          <p style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '2px', fontSize: '0.8rem' }}>SCAN AT DOOR</p>
        </div>
      )}
    </div>
  );

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Tickets...</h2>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>

      {/* PROFILE SECTION */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{user?.name || 'Movie Buff'}</h2>
          <p style={{ color: 'var(--text-muted)', margin: '5px 0 0' }}>{user?.email}</p>
          <p style={{ color: 'var(--text-muted)', margin: '3px 0 0', fontSize: '0.85rem' }}>
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Unknown'}
          </p>
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

    </div>
  );
}
