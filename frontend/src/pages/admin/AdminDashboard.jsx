import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AnimatedNumber from '../../components/ui/AnimatedNumber';


export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchStats = async () => {
    try {
      // FIX: Changed from /dashboard to /stats
      let url = 'http://localhost:3000/api/admin/stats?';
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
    // FIX: Added startDate and endDate as dependencies so it re-fetches when they change!
  }, [token, startDate, endDate]); 

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
      
                       {/* Date Filters */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
        <strong style={{ color: 'var(--text-muted)' }}>Filter by Date:</strong>
        <Input 
          type="date" 
          value={startDate} 
          onChange={e => setStartDate(e.target.value)} 
        />
        <span style={{ color: 'var(--text-muted)' }}>to</span>
        <Input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        {(startDate || endDate) && (
          <Button onClick={() => { setStartDate(''); setEndDate(''); }} >
            Clear Filters
          </Button>
        )}
      </div>




            {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        
        <Card style={{ padding: '30px', textAlign: 'center', border: 'none', borderTop: '4px solid var(--success)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Total Revenue</h3>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--success)', margin: 0 }}>
  <AnimatedNumber end={stats?.totalRevenue || 0} decimals={2} prefix="₹" />
</h1>

        </Card>
        
        <Card style={{ padding: '30px', textAlign: 'center', border: 'none', borderTop: '4px solid var(--secondary)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Tickets Sold</h3>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--secondary)', margin: 0 }}>
  <AnimatedNumber end={stats?.ticketsSold || 0} />
</h1>

        </Card>

        <Card style={{ padding: '30px', textAlign: 'center', border: 'none', borderTop: '4px solid #a78bfa' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Registered Users</h3>
         <h1 style={{ fontSize: '3.5rem', color: '#a78bfa', margin: 0 }}>
  <AnimatedNumber end={stats?.totalUsers || 0} />
</h1>

        </Card>

      </div>


            {/* Revenue by Movie Table */}
      <h2>Revenue by Movie</h2>
      <div className="glass-panel" style={{ marginTop: '20px', padding: '20px' }}>
        {stats?.revenueByMovie?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No revenue data available yet.</p>
        ) : (
                    <table className="data-table">
            <thead>
              <tr>
                <th>MOVIE TITLE</th>
                <th style={{ textAlign: 'center' }}>TICKETS SOLD</th>
                <th style={{ textAlign: 'right' }}>TOTAL EARNED</th>
              </tr>
            </thead>
            <tbody>
              {stats?.revenueByMovie?.map((movie, index) => (
                <tr key={index}>
                  <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{movie.title}</td>
                  <td style={{ textAlign: 'center', color: 'var(--secondary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {movie.tickets}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--success)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    ₹{movie.revenue.toFixed(2)}
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
