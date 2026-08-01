import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 1. Initialize Stripe (REPLACE THIS WITH YOUR PK_TEST KEY!)
const stripePromise = loadStripe('pk_test_51TxuPsQhdDte6KL9NqSIV5wrbv7WHzBNWZpc9SLK9deaPjQPGgChyVUFdNZzyLIUkYAXK0HNRRzjTzgd3JScznk600OAGC08js');

// 2. The Form Component (Handled entirely by Stripe for security)
function CheckoutForm({selectedSeats}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    // Send the card details securely to Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    });

        if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      navigate('/booking-confirmation', { state: { selectedSeats } });
    } else {
      setErrorMessage('Payment status: ' + paymentIntent?.status);
      setIsProcessing(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
      <PaymentElement />
      {errorMessage && <div style={{ color: 'var(--primary)', marginTop: '10px' }}>{errorMessage}</div>}
      
      <button 
        disabled={isProcessing || !stripe || !elements} 
        className="btn-primary" 
        style={{ width: '100%', padding: '15px', marginTop: '30px', fontSize: '1.2rem', borderRadius: '10px' }}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

// 3. The Main Page Component
export default function Checkout() {
  const location = useLocation();
  const { selectedSeats, showtimeId } = location.state || {}; // The data we passed from SeatSelection!
  const { token } = useAuth();
  
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedSeats || !showtimeId) {
      setError("No seats selected. Please go back.");
      setLoading(false);
      return;
    }

    const createReservation = async () => {
      try {
        const seatIds = selectedSeats.map(seat => seat.id);
        
        // This hits our backend to create the Reservation AND ask Stripe for a secret!
        const response = await fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ showtimeId, seatIds })
        });
        
        const data = await response.json();
        
        if (data.success && data.data.clientSecret) {
          setClientSecret(data.data.clientSecret);
        } else {
          setError(data.message || 'Failed to initialize checkout');
        }
      } catch (err) {
        setError('Checkout error');
      } finally {
        setLoading(false);
      }
    };

    createReservation();
  }, [selectedSeats, showtimeId, token]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Initializing Secure Checkout...</h2>;
  if (error) return <h2 style={{ textAlign: 'center', marginTop: '50px', color: 'var(--primary)' }}>{error}</h2>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }} className="glass-panel">
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Complete Your Booking</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px' }}>
        You are purchasing <strong>{selectedSeats.length}</strong> tickets.
      </p>

      {/* 4. Render Stripe Elements once we have the secret from the backend! */}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, theme: 'night' }}>
          <CheckoutForm selectedSeats={selectedSeats} />
        </Elements>
      )}
    </div>
  );
}
