import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Call the backend directly to register
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Automatically log them in after successful registration!
        await login(email, password);
        navigate('/');
      } else {
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }} className="glass-panel">
      <div style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.2)', color: 'var(--primary)', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Register
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}
