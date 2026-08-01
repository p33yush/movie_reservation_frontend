import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ fontSize: '8rem', margin: 0, color: 'var(--primary)' }}>404</h1>
      <h2 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn-primary" style={{ padding: '12px 30px', borderRadius: '10px', textDecoration: 'none' }}>
        Go Home
      </Link>
    </div>
  );
}
