import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword]=useState('');

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
    if(password !== confirmPassword){
      setError('Passwords do not match');
      return;
    }
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

              {/* Welcome Header */}
        <div className="auth-header">
          <h2 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to continue booking your favorite movies.' 
              : 'Join MovieRes and book movies in seconds.'}
          </p>
        </div>
        
        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0 0 25px 0' }} />



                {/* Tab Toggle */}
        <div style={{ display: 'flex', marginBottom: '25px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <button
            onClick={() => switchTab(true)}
            className={`auth-tab ${isLogin ? 'active' : ''}`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab(false)}
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
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

                    {/* Confirm Password field — only visible during Register */}
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                minLength="6" 
                style={inputStyle} 
              />
            </div>
          )}
                    {/* Terms and Privacy Checkbox */}
          {!isLogin && (
            <label className="auth-checkbox-container">
              <input type="checkbox" required />
              <span className="auth-checkbox-label">
                I agree to the <span style={{ color: 'white' }}>Terms</span> & <span style={{ color: 'white' }}>Privacy Policy</span>
              </span>
            </label>
          )}



          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

      </div>
    </div>
  </div>
  );
}
