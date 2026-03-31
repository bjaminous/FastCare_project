import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('fc_token') || null);

  const saveSession = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('fc_user', JSON.stringify(userData));
    localStorage.setItem('fc_token', jwt);
  };

  const login = useCallback(async (email, motDePasse) => {
    const res = await axios.post(`${API}/auth/login`, { email, motDePasse });
    saveSession(res.data.user, res.data.token);
    return res.data;
  }, []);

  const register = useCallback(async ({ prenom, nom, email, motDePasse, telephone, dateNaissance, poidsInitial, taille }) => {
    const body = { nom, email, motDePasse };
    if (prenom)        body.prenom        = prenom;
    if (telephone)     body.telephone     = telephone;
    if (dateNaissance) body.dateNaissance = dateNaissance;
    if (poidsInitial)  body.poidsInitial  = Number(poidsInitial);
    if (taille)        body.taille        = Number(taille);
    const res = await axios.post(`${API}/auth/register`, body);
    saveSession(res.data.user, res.data.token);
    // Notification de bienvenue
    try {
      await axios.post(`${API}/notifications`, {
        type: 'BIENVENUE',
        message: `Bienvenue sur FastCare${prenom ? `, ${prenom}` : ''} ! 👋 Commencez par choisir votre objectif.`,
        dateEnvoi: new Date(),
      }, { headers: { Authorization: `Bearer ${res.data.token}` } });
    } catch { /* silencieux */ }
    return res.data;
  }, []);

  const updateUser = useCallback(async (fields) => {
    const jwt = localStorage.getItem('fc_token');
    const res = await axios.put(`${API}/user/update`, fields, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const updated = res.data.user;
    setUser(updated);
    localStorage.setItem('fc_user', JSON.stringify(updated));
    return updated;
  }, []);

  const logout = useCallback(() => {
    // On NE supprime PAS le jeûne — il doit persister après reconnexion
    setUser(null);
    setToken(null);
    localStorage.removeItem('fc_user');
    localStorage.removeItem('fc_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
};
