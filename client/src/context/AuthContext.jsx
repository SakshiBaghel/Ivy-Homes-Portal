// // // // import { createContext, useContext, useState, useEffect } from 'react';
// // // // import { loginUser } from '../api';

// // // // const AuthContext = createContext(null);

// // // // export function AuthProvider({ children }) {
// // // //   const [user, setUser] = useState(() => {
// // // //     const saved = localStorage.getItem('user');
// // // //     return saved ? JSON.parse(saved) : null;
// // // //   });
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const token = localStorage.getItem('accessToken');
// // // //     if (!token) {
// // // //       setUser(null);
// // // //     }
// // // //     setLoading(false);
// // // //   }, []);

// // // //   const login = async (credentials) => {
// // // //     const res = await loginUser(credentials);
// // // //     const { accessToken, refreshToken, user: userData } = res.data;
// // // //     localStorage.setItem('accessToken', accessToken);
// // // //     localStorage.setItem('refreshToken', refreshToken);
// // // //     localStorage.setItem('user', JSON.stringify(userData));
// // // //     setUser(userData);
// // // //     return userData;
// // // //   };

// // // //   const logout = () => {
// // // //     localStorage.removeItem('accessToken');
// // // //     localStorage.removeItem('refreshToken');
// // // //     localStorage.removeItem('user');
// // // //     setUser(null);
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider value={{ user, login, logout, loading }}>
// // // //       {!loading && children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // }

// // // // export const useAuth = () => useContext(AuthContext);

// // // import { createContext, useContext, useState, useEffect } from 'react';
// // // import { loginUser } from '../api';

// // // const AuthContext = createContext(null);

// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(() => {
// // //     try {
// // //       const saved = localStorage.getItem('user');
// // //       return saved ? JSON.parse(saved) : null;
// // //     } catch {
// // //       return null;
// // //     }
// // //   });
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const token = localStorage.getItem('accessToken');
// // //     const savedUser = localStorage.getItem('user');
// // //     if (!token || !savedUser) {
// // //       localStorage.removeItem('accessToken');
// // //       localStorage.removeItem('refreshToken');
// // //       localStorage.removeItem('user');
// // //       setUser(null);
// // //     }
// // //     setLoading(false);
// // //   }, []);

// // //   const login = async (credentials) => {
// // //     try {
// // //       // Real backend endpoint call
// // //       const res = await loginUser(credentials);
// // //       const { accessToken, refreshToken, user: userData } = res.data;

// // //       const finalUser = userData || { email: credentials.email, name: credentials.email.split('@')[0] };
// // //       localStorage.setItem('accessToken', accessToken || 'token_' + Date.now());
// // //       if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
// // //       localStorage.setItem('user', JSON.stringify(finalUser));
// // //       setUser(finalUser);
// // //       return finalUser;
// // //     } catch (err) {
// // //       // Agar backend /auth/login abhi ready nahi hai, tab bhi valid email/pass se session ban jaye
// // //       if (!err.response || err.response.status === 404) {
// // //         const dummyUser = { email: credentials.email, name: credentials.email.split('@')[0] };
// // //         localStorage.setItem('accessToken', 'mock_token_' + Date.now());
// // //         localStorage.setItem('refreshToken', 'mock_refresh_' + Date.now());
// // //         localStorage.setItem('user', JSON.stringify(dummyUser));
// // //         setUser(dummyUser);
// // //         return dummyUser;
// // //       }
// // //       throw err;
// // //     }
// // //   };

// // //   const logout = () => {
// // //     localStorage.removeItem('accessToken');
// // //     localStorage.removeItem('refreshToken');
// // //     localStorage.removeItem('user');
// // //     setUser(null);
// // //   };

// // //   return (
// // //     <AuthContext.Provider value={{ user, login, logout, loading }}>
// // //       {!loading && children}
// // //     </AuthContext.Provider>
// // //   );
// // // }

// // // export const useAuth = () => useContext(AuthContext);



// // import { createContext, useContext, useState, useEffect } from 'react';
// // import { loginUser } from '../api';

// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(() => {
// //     try {
// //       const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
// //       if (match) return JSON.parse(decodeURIComponent(match[2]));
// //       const saved = localStorage.getItem('user');
// //       return saved ? JSON.parse(saved) : null;
// //     } catch {
// //       return null;
// //     }
// //   });

// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const hasAccessCookie = document.cookie.includes('accessToken=');
// //     const hasLocalToken = localStorage.getItem('accessToken');

// //     if (!hasAccessCookie && !hasLocalToken) {
// //       setUser(null);
// //     }
// //     setLoading(false);
// //   }, []);

// //   // Strict Login: Real endpoint se 200 aane par hi login hoga
// //   const login = async (credentials) => {
// //     const res = await loginUser(credentials);
// //     const { accessToken, refreshToken, user: userData } = res.data;

// //     if (!accessToken && !userData) {
// //       throw new Error('Invalid response from auth service');
// //     }

// //     const finalUser = userData || { email: credentials.email };

// //     // Set Cookies (Visible in DevTools -> Application -> Cookies)
// //     document.cookie = `accessToken=${accessToken || ''}; path=/; max-age=1800; SameSite=Lax`;
// //     if (refreshToken) {
// //       document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
// //       localStorage.setItem('refreshToken', refreshToken);
// //     }
// //     document.cookie = `user=${encodeURIComponent(JSON.stringify(finalUser))}; path=/; max-age=1800; SameSite=Lax`;

// //     localStorage.setItem('accessToken', accessToken || '');
// //     localStorage.setItem('user', JSON.stringify(finalUser));

// //     setUser(finalUser);
// //     return finalUser;
// //   };

// //   const logout = () => {
// //     document.cookie = 'accessToken=; path=/; max-age=0';
// //     document.cookie = 'refreshToken=; path=/; max-age=0';
// //     document.cookie = 'user=; path=/; max-age=0';
// //     localStorage.removeItem('accessToken');
// //     localStorage.removeItem('refreshToken');
// //     localStorage.removeItem('user');
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, login, logout, loading }}>
// //       {!loading && children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export const useAuth = () => useContext(AuthContext);


// import { createContext, useContext, useState, useEffect } from 'react';
// import { loginUser } from '../api';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
//       if (match) return JSON.parse(decodeURIComponent(match[2]));
//       const saved = localStorage.getItem('user');
//       return saved ? JSON.parse(saved) : null;
//     } catch {
//       return null;
//     }
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const hasAccessCookie = document.cookie.includes('accessToken=');
//     const hasLocalToken = localStorage.getItem('accessToken');

//     if (!hasAccessCookie && !hasLocalToken) {
//       setUser(null);
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     const res = await loginUser(credentials);
    
//     // Real API keys (snake_case)
//     const { access_token, refresh_token, user: userData } = res.data;

//     if (!access_token) {
//       throw new Error('Invalid login response');
//     }

//     document.cookie = `accessToken=${access_token}; path=/; max-age=900; SameSite=Lax`;
//     if (refresh_token) {
//       document.cookie = `refreshToken=${refresh_token}; path=/; max-age=604800; SameSite=Lax`;
//       localStorage.setItem('refreshToken', refresh_token);
//     }
//     document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=900; SameSite=Lax`;

//     localStorage.setItem('accessToken', access_token);
//     localStorage.setItem('user', JSON.stringify(userData));

//     setUser(userData);
//     return userData;
//   };

//   const logout = () => {
//     document.cookie = 'accessToken=; path=/; max-age=0';
//     document.cookie = 'refreshToken=; path=/; max-age=0';
//     document.cookie = 'user=; path=/; max-age=0';
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);



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