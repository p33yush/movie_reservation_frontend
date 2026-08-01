import { useLocation, Link } from 'react-router-dom';

export default function BookingConfirmation() {
  const location = useLocation();
  const { selectedSeats } = location.state || {};

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px' }}>

      {/* Checkmark Animation */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        backgroundColor: 'rgba(74, 222, 128, 0.2)', border: '3px solid #4ade80',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 30px', fontSize: '2.5rem'
      }}>
        ✓
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Booking Confirmed!</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px' }}>
        Your {selectedSeats?.length || ''} ticket{selectedSeats?.length !== 1 ? 's' : ''} have been booked successfully.
      </p>

      <div className="glass-panel" style={{ padding: '25px', marginBottom: '30px', textAlign: 'left' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
          A confirmation email with your QR code ticket will be sent shortly.
          You can also view your tickets anytime from your Dashboard.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link to="/dashboard" className="btn-primary" style={{ padding: '12px 30px', borderRadius: '10px', textDecoration: 'none' }}>
          View My Tickets
        </Link>
        <Link to="/" style={{ padding: '12px 30px', borderRadius: '10px', textDecoration: 'none', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
          Book Another Movie
        </Link>
      </div>

    </div>
  );
}
