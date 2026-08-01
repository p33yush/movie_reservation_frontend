export default function Footer() {
  return (
    <footer style={{
      marginTop: '80px',
      padding: '30px 40px',
      borderTop: '1px solid var(--glass-border)',
      backgroundColor: 'var(--bg-surface)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <p>© {new Date().getFullYear()} MovieRes. All rights reserved.</p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <span>About</span>
        <span>Contact</span>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </div>
    </footer>
  );
}
