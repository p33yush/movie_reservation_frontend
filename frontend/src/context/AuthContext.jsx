import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Whenever the token changes, save it to localStorage and fetch the user profile
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Hit our backend to get the user's details using their token
  const fetchUserProfile = async (jwtToken) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      } else {
        setToken(null); // Invalid token, log them out
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // The login function we will call from our Login page
  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.success) {
      setToken(data.data.accessToken);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// A custom hook so our components can just do: const { user, login } = useAuth();
export const useAuth = () => useContext(AuthContext);
