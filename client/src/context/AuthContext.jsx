import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      setUser({ email });
    }
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    
    localStorage.setItem('accessToken', res.data.access_token);
    localStorage.setItem('refreshToken', res.data.refresh_token);
    localStorage.setItem('userEmail', credentials.email);
    
    document.cookie = `refresh_token=${res.data.refresh_token}; path=/`;

    setUser({ email: credentials.email });
  };

  const logout = () => {
    localStorage.clear();
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);