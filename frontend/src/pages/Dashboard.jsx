import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { token, user, setUser } = useAuth();
  const [reservations, setReservations] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [isEditing,setIsEditing]=useState(false);
  const [editFormData, setEditFormData]=useState({name:'',email:''});
  const [selectedTicket, setSelectedTicket]=useState(null);
  const [isPasswordModalOpen,setIsPasswordModalOpen]=useState(false);
  const [isDeleteModalOpen,setIsDeleteModalOpen]=useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');



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
      onClick={() => setSelectedTicket(res)} // Opens the modal!
      style={{ 
        display: 'flex', 
        padding: '20px', 
        gap: '20px', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        opacity: isPast ? 0.7 : 1, 
        cursor: 'pointer', 
        transition: 'all 0.2s ease',
        backgroundColor: '#1D2330',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      
      {/* Poster */}
      <img src={res.showtime.movie.posterUrl || 'https://via.placeholder.com/100x150?text=No+Poster'} alt="Poster" style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
      
      {/* Ticket Details */}
      <div style={{ flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>{res.showtime.movie.title}</h3>
          
          {/* Status Badge */}
          <span style={{
            padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold',
            backgroundColor: res.status === 'CONFIRMED' ? 'rgba(34, 197, 94, 0.15)' : res.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: res.status === 'CONFIRMED' ? 'var(--success)' : res.status === 'PENDING' ? 'var(--warning)' : '#ef4444'
          }}>
            {res.status}
          </span>
        </div>
        
        <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-secondary)' }}>
          📍 {res.showtime.screen.theatre.name} — {res.showtime.screen.name}
        </p>
        <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-secondary)' }}>
          🕒 {new Date(res.showtime.startTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-secondary)' }}>
          🎟️ Seats: <span style={{ color: 'white', fontWeight: 'bold' }}>{res.reservedSeats.map(rs => rs.seat.row + rs.seat.number).join(', ')}</span>
        </p>
      </div>

      {/* Action Button */}
      <div style={{ padding: '0 10px' }}>
         <button className="btn-secondary" style={{ height: '36px', padding: '0 15px', fontSize: '0.85rem' }}>View Ticket</button>
      </div>
    </div>
  );

  const PastTicketCard = ({ res }) => (
    <div 
      onClick={() => setSelectedTicket(res)} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '20px 25px', 
        gap: '20px', 
        flexWrap: 'wrap', 
        cursor: 'pointer', 
        transition: 'all 0.2s ease',
        backgroundColor: '#171B24',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1D2330'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#171B24'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1', minWidth: '250px' }}>
        <img 
  src={res.showtime.movie.posterUrl || 'https://via.placeholder.com/100x150?text=No+Poster'} 
  alt="Poster" 
  style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
/>

        <div>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'white' }}>{res.showtime.movie.title}</h4>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {new Date(res.showtime.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
      
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', minWidth: '80px', textAlign: 'center' }}>
        ₹{res.totalAmount}
      </div>

      <div style={{ minWidth: '100px', textAlign: 'center' }}>
        <span style={{
          padding: '6px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold',
          backgroundColor: res.status === 'CONFIRMED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: res.status === 'CONFIRMED' ? 'var(--success)' : '#ef4444',
          display: 'inline-block'
        }}>
          {res.status === 'CONFIRMED' ? 'Completed' : res.status}
        </span>
      </div>

      <button className="btn-secondary" style={{ height: '36px', padding: '0 15px', fontSize: '0.85rem' }}>Details</button>
    </div>
  );


  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Tickets...</h2>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>

      {/* PROFILE SECTION */}
      <div style={{
        padding: '30px', 
        marginBottom: '40px', 
        backgroundColor: '#1D2330', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '18px',
        display: 'flex', 
        alignItems: 'center', 
        gap: '30px', 
        flexWrap: 'wrap',
        position: 'relative'
      }}>
        {/* AVATAR */}
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #E50914, #FF6B72)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 10px 25px rgba(229, 9, 20, 0.3)'
        }}>
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        
        {/* INFO & STATS */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          {!isEditing ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              {/* Profile Details */}
              <div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: 'white' }}>{user?.name || 'Movie Buff'}</h2>
                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    📧 {user?.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🗓 Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Unknown'}
                  </span>
                </div>
                
                {/* Stats Row */}
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bookings</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{reservations.upcoming.length + reservations.past.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Movies Seen</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{reservations.past.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Reward Points</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{reservations.past.length * 20}</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <button onClick={handleEditClick} className="btn-secondary" style={{ padding: '0 20px', height: '40px', borderRadius: '10px', fontSize: '0.9rem' }}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
              <input 
                type="text" 
                value={editFormData.name} 
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
                className="input-field" 
                required 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-surface)', color: 'white' }}
              />
              <input 
                type="email" 
                value={editFormData.email} 
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} 
                className="input-field" 
                required 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-surface)', color: 'white' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0 15px', height: '40px', borderRadius: '10px', flex: '1', fontSize: '0.9rem' }}>Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '0 15px', height: '40px', borderRadius: '10px', flex: '1', fontSize: '0.9rem' }}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

            {/* ACCOUNT SETTINGS */}
      <h2>Account Settings</h2>
      <div style={{
        backgroundColor: '#1D2330', 
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '40px',
        overflow: 'hidden'
      }}>
        <div className="settings-row" onClick={handleEditClick}>
          <span className="title">Edit Profile</span>
          <span className="icon">➔</span>
        </div>
        <div className="settings-row" onClick={()=>setIsPasswordModalOpen(true)}>
          <span className="title">Change Password</span>
          <span className="icon">➔</span>
        </div>
        <div className="settings-row danger" onClick={()=>setIsDeleteModalOpen(true)}>
          <span className="title">Delete Account</span>
          <span className="icon">➔</span>
        </div>
      </div>
 

      {/* UPCOMING TICKETS */}
      <h2>Upcoming Tickets</h2>
      {reservations.upcoming.length === 0 ? (
        <div style={{
          padding: '60px 20px', 
          textAlign: 'center', 
          backgroundColor: '#1D2330', 
          borderRadius: '18px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎬</div>
          <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.5rem' }}>No Upcoming Bookings</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Book your next movie and it'll appear here.</p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Movies</Link>
        </div>
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
        <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#171B24', borderRadius: '18px', border: '1px dashed rgba(255, 255, 255, 0.05)' }}>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>No past bookings yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {reservations.past.map(res => (
            <PastTicketCard key={res.id} res={res} />
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
    
          {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(5px)'
          }} 
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div 
            className="glass-panel" 
            style={{ padding: '40px', maxWidth: '400px', width: '100%', position: 'relative' }} 
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setIsPasswordModalOpen(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer', lineHeight: '1' }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: '20px', color: 'white', fontSize: '1.5rem' }}>Change Password</h2>
            
            <form onSubmit={async (e) => { 
                e.preventDefault(); 
                const response = await fetch('http://localhost:3000/api/users/me/password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ oldPassword, newPassword })
                });
                if(response.ok) {
                    setIsPasswordModalOpen(false);
                    setOldPassword('');
                    setNewPassword('');
                } else {
                    const data = await response.json();
                    alert(data.message || 'Failed to update password');
                }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Current Password</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#171B24', color: 'white' }} />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#171B24', color: 'white' }} />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Confirm New Password</label>
                <input type="password" required className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#171B24', color: 'white' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>Update Password</button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {isDeleteModalOpen && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(5px)'
          }} 
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="glass-panel" 
            style={{ padding: '40px', maxWidth: '400px', width: '100%', position: 'relative', textAlign: 'center' }} 
            onClick={(e) => e.stopPropagation()} 
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
            <h2 style={{ marginBottom: '10px', color: 'white', fontSize: '1.5rem' }}>Delete Account?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete your account? All of your ticket history and reward points will be lost. This cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary" style={{ flex: '1', height: '44px' }}>Cancel</button>
              <button 
                type="button"
                onClick={async () => { 
                    const response = await fetch('http://localhost:3000/api/users/me', {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if(response.ok) {
                        setUser(null);
                        localStorage.removeItem('token');
                        window.location.href = '/';
                    }
                    setIsDeleteModalOpen(false); 
                }} 
                className="btn-primary" 
                style={{ flex: '1', height: '44px', backgroundColor: '#ef4444' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
