import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } else if (response.status === 401 || response.status === 403) {
                // Only clear token if explicitly unauthorized
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } else {
                // For other errors (500, network), keep the token but maybe don't set user yet
                // or rely on cached user data if strictly needed. 
                // ideally we just don't logout the user for a blip.
                console.warn(`Auth verification failed with status ${response.status}. Session preserved.`);
            }
        } catch (error) {
            console.error("Auth verification failed (Network/Server):", error);
            // Do NOT wipe token on network error. 
            // The user stays "logged in" potentially with stale data, or loading state can be handled.
            // but logging them out due to a connection drop is bad UX.
        } finally {
            setLoading(false);
        }
    };

    verifyUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
