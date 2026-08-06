import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <Card style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2 className="mb-20" style={{ textAlign: 'center' }}>Welcome Back</h2>

      {/* If there is an error, display it in a red box */}
      {error && (
        <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.2)', color: 'var(--primary)', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-col gap-15">
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" style={{ marginTop: '10px' }}>
          Sign In
        </Button>
      </form>
    </Card>
  );
}
