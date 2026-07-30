import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // We grab the login function from the context we just built!
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // clear previous errors
    
    // Call our context function
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/'); // Redirect to Home on success
    } else {
      setError(result.error || 'Failed to login');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }} className="glass-panel">
      <div style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back</h2>
        
        {/* If there is an error, display it in a red box */}
        {error && (
          <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.2)', color: 'var(--primary)', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
