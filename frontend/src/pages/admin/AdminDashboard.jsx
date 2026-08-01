import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the massive stats object we built on Backend Day 10
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Analytics...</h2>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Admin Sub-Navigation */}
            {/* Admin Sub-Navigation */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0, marginRight: 'auto', letterSpacing: '2px' }}>Admin Portal</h1>
        <Link to="/admin/dashboard" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px' }}>Overview</Link>
        <Link to="/admin/movies" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Movies</Link>
        <Link to="/admin/venues" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Venues</Link>
        <Link to="/admin/showtimes" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--primary)' }}>Showtimes</Link>
      </div>


      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid #4ade80' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Total Revenue</h3>
          <h1 style={{ fontSize: '3.5rem', color: '#4ade80', margin: 0 }}>${stats?.totalRevenue?.toFixed(2) || '0.00'}</h1>
        </div>
        
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid #60a5fa' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Tickets Sold</h3>
          <h1 style={{ fontSize: '3.5rem', color: '#60a5fa', margin: 0 }}>{stats?.ticketsSold || 0}</h1>
        </div>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid #a78bfa' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Registered Users</h3>
          <h1 style={{ fontSize: '3.5rem', color: '#a78bfa', margin: 0 }}>{stats?.totalUsers || 0}</h1>
        </div>

      </div>

      {/* Revenue by Movie Table */}
      <h2>Revenue by Movie</h2>
      <div className="glass-panel" style={{ marginTop: '20px', padding: '20px' }}>
        {stats?.revenueByMovie?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No revenue data available yet.</p>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '15px', color: 'var(--text-muted)' }}>MOVIE TITLE</th>
                <th style={{ padding: '15px', textAlign: 'right', color: 'var(--text-muted)' }}>TOTAL EARNED</th>
              </tr>
            </thead>
            <tbody>
              {stats?.revenueByMovie?.map((movie, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>{movie.title}</td>
                  <td style={{ padding: '15px', textAlign: 'right', color: '#4ade80', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    ${movie.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
