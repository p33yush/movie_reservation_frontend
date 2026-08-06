import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '80px',
      padding: '60px 40px',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      backgroundColor: '#171B24',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      color: 'var(--text-muted)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ color: 'var(--primary)', margin: 0, letterSpacing: '2px', fontSize: '1.5rem' }}>MOVIERES</h2>
        <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
          Book movies effortlessly with real-time seat selection and secure online payments.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>Quick Links</h3>
        <Link to="#" className="nav-link" style={{ width: 'fit-content' }}>About</Link>
        <Link to="/" className="nav-link" style={{ width: 'fit-content' }}>Movies</Link>
        <Link to="#" className="nav-link" style={{ width: 'fit-content' }}>Contact</Link>
        <Link to="#" className="nav-link" style={{ width: 'fit-content' }}>Privacy</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>Social</h3>
        <Link to="#" className="nav-link" style={{ width: 'fit-content' }}>Instagram</Link>
        <Link to="#" className="nav-link" style={{ width: 'fit-content' }}>Twitter</Link>
        <Link to="#" className="nav-link" style={{ width: 'fit-content' }}>GitHub</Link>
      </div>
    </footer>
  );
}
