import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-only state
  const [name, setName] = useState('');

  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Clear the form when switching tabs
  const switchTab = (loginMode) => {
    setIsLogin(loginMode);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Failed to login');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (data.success) {
        await login(email, password);
        navigate('/');
      } else {
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: 'white',
    outline: 'none'
  };


  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-overlay"></div>
      
      <div className="auth-card-wrapper">
        <div className="glass-panel" style={{ padding: '40px' }}>


        {/* Tab Toggle */}
        <div style={{ display: 'flex', marginBottom: '25px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <button
            onClick={() => switchTab(true)}
            style={{
              flex: 1, padding: '12px', fontWeight: 'bold', fontSize: '1rem',
              backgroundColor: isLogin ? 'var(--primary)' : 'transparent',
              color: isLogin ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s ease'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab(false)}
            style={{
              flex: 1, padding: '12px', fontWeight: 'bold', fontSize: '1rem',
              backgroundColor: !isLogin ? 'var(--primary)' : 'transparent',
              color: !isLogin ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.2)', color: 'var(--primary)', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* The Form */}
        <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Name field — only visible during Register */}
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" style={inputStyle} />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

      </div>
    </div>
  </div>
  );
}
