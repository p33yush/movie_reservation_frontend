import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import {AuthProvider} from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Cinema Express</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>

        <div style={{ padding: '40px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
