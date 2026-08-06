import {useState,useEffect} from 'react';
import {useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SeatSelection(){
    const { id }=useParams();
    const[seatMap,setSeatMap]=useState(null);
    const [selectedSeats,setSelectedSeats]=useState([]);
    const [loading,setLoading]=useState(true);
    const [price,setPrice]=useState(0);

    const {token}=useAuth();
    const navigate=useNavigate();

    useEffect(()=>{
        fetchSeatMap();
    },[id]);

    const fetchSeatMap= async()=>{
        try{
            const response=await fetch(`http://localhost:3000/api/showtimes/${id}/seats`);
            const data = await response.json();
            if(data.success){
                setSeatMap(data.data);
                setPrice(data.data.price);
            }
        }
        catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    const handleSeatClick = async (seat)=> {
        if(seat.status==='RESERVED') return;
        const isSelected = selectedSeats.find(s => s.id===seat.id);

        if(isSelected){
            if(token){
                await fetch(`http://localhost:3000/api/showtimes/${id}/unlock`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json','Authorization':`Bearer ${token}`
                    },
                    body:JSON.stringify({seatId:seat.id})
                });
            }

            setSelectedSeats(selectedSeats.filter(s=>s.id!== seat.id));

        } else{
            if(token){
                const response=await fetch(`http://localhost:3000/api/showtimes/${id}/lock`,{
                    method:'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                     body: JSON.stringify({ seatId: seat.id })
        });
        const data = await response.json();
        if (!data.success) {
          alert('Sorry, that seat was just taken by someone else!');
          return;
        }
      } else {
        alert('You must be logged in to reserve seats!');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  // Helper function to color the seats dynamically
  const getSeatColor = (seat) => {
    if (seat.status === 'RESERVED') return '#772f2fff'; // Dark gray/disabled
    if (selectedSeats.find(s => s.id === seat.id)) return '#22c55e'; // Green if selected
    return 'var(--glass-bg)'; // Default available
  };
  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Seat Map...</h2>;
    if (seatMap && Object.keys(seatMap.seats).length === 0) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>No seat map configured for this screen.</h2>;
  }
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>{seatMap.screenName}</h1>
      
      {/* THE CINEMA SCREEN */}
      <div style={{
        width: '100%', height: '80px', backgroundColor: 'var(--primary)',
        transform: 'perspective(200px) rotateX(-5deg)',
        boxShadow: '0 20px 50px rgba(229, 9, 20, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', letterSpacing: '10px', color: 'white',
        borderRadius: '5px', marginBottom: '60px'
      }}>
        SCREEN
      </div>
      {/* THE SEAT GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        {Object.keys(seatMap.seats).map((rowLetter) => (
          <div key={rowLetter} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '30px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{rowLetter}</div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {seatMap.seats[rowLetter].map((seat) => (
                <button 
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.status === 'RESERVED'}
                  style={{
                    width: '40px', height: '40px',
                    borderRadius: '8px', border: '1px solid var(--glass-border)',
                    backgroundColor: getSeatColor(seat),
                    color: 'white', fontWeight: 'bold',
                    cursor: seat.status === 'RESERVED' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: seat.status === 'RESERVED' ? 0.5 : 1
                  }}
                >
                  {seat.number}
                </button>
              ))}
            </div>
            
            <div style={{ width: '30px', textAlign: 'right', fontWeight: 'bold', color: 'var(--text-muted)' }}>{rowLetter}</div>
          </div>
        ))}
      </div>
            {/* CHECKOUT SECTION */}
      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ fontSize: '1.1rem' }}>
          <div>Selected Seats: <strong>{selectedSeats.length}</strong></div>
          <div style={{ color: 'var(--text-muted)', marginTop: '5px' }}>
            Price per seat: <strong style={{ color: '#4ade80' }}>₹{parseFloat(price).toFixed(2)}</strong>
          </div>
          <div style={{ fontSize: '1.3rem', marginTop: '5px' }}>
            Total: <strong style={{ color: '#4ade80' }}>₹{(parseFloat(price) * selectedSeats.length).toFixed(2)}</strong>
          </div>
        </div>
        <button 
          className="btn-primary" 
          disabled={selectedSeats.length === 0}
          onClick={() => navigate('/checkout', {
            state: {
              selectedSeats, showtimeId: id
            }
          })}
          style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1 }}
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}