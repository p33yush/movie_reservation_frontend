import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import {AuthProvider, useAuth} from './context/AuthContext';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import AdminVenues from './pages/admin/AdminVenues';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import BookingConfirmation from './pages/BookingConfirmation';

function Header(){
  const {user,logout}=useAuth();
  const navigate=useNavigate();

  return(
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      height: '72px',
      padding: '0 40px', 
      backgroundColor: 'rgba(20,20,24,0.8)', 
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)' 
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', letterSpacing: '2px' }}>
        MOVIERES
      </Link>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className="nav-link">Admin Panel</Link>
        )}

        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={() => { logout(); navigate('/auth'); }} className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem', borderRadius: '10px' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem', borderRadius: '10px', textDecoration: 'none' }}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      
        
        <Header/>
        <div style={{ padding: '40px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/showtimes/:id" element={<SeatSelection />} />
            <Route path="/checkout" element = {<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/movies" element={<ProtectedRoute adminOnly={true}><AdminMovies /></ProtectedRoute>} />
            <Route path="/admin/venues" element={<ProtectedRoute adminOnly={true}><AdminVenues /></ProtectedRoute>} />
            <Route path="/admin/showtimes" element={<ProtectedRoute adminOnly={true}><AdminShowtimes /></ProtectedRoute>} />
            <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
