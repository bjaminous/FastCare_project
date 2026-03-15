import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API = 'http://localhost:5000/api';
const authHeader = () => {
  const token = localStorage.getItem('fc_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const FastingContext = createContext(null);

const getKey = () => {
  try {
    const u = JSON.parse(localStorage.getItem('fc_user'));
    return u?.id ? `fc_fasting_${u.id}` : 'fc_fasting';
  } catch { return 'fc_fasting'; }
};

const load = () => {
  try {
    const raw = localStorage.getItem(getKey());
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const save = (data) => localStorage.setItem(getKey(), JSON.stringify(data));
const clear = () => localStorage.removeItem(getKey());

// ─── Durées cibles ───────────────────────────────────────────────────────────
// Types affichés comme boutons principaux
export const FASTING_TYPES = {
  '16/8':   { hours: 16, name: 'Intermittent 16/8', description: 'Jeûne 16h, alimentation 8h' },
  '24':     { hours: 24, name: 'Jeûne 24h',          description: "Jeûne complet d'une journée" },
  'custom': { hours: 16, name: 'Personnalisé',        description: 'Choisissez votre durée' },
};

// Options disponibles dans la modale "Personnalisé"
export const CUSTOM_OPTIONS = [
  { key: '12/12', hours: 12, name: '12/12', label: 'Débutant',     desc: 'Jeûne 12h · alimentation 12h · idéal pour commencer' },
  { key: '14/10', hours: 14, name: '14/10', label: 'Doux',         desc: 'Jeûne 14h · alimentation 10h · recommandé aux femmes' },
  { key: '16/8',  hours: 16, name: '16/8',  label: 'Populaire',    desc: 'Jeûne 16h · alimentation 8h · le plus pratiqué au monde' },
  { key: '18/6',  hours: 18, name: '18/6',  label: 'Avancé',       desc: 'Jeûne 18h · alimentation 6h · autophagie renforcée' },
  { key: '20/4',  hours: 20, name: '20/4',  label: 'Guerrier',     desc: 'Jeûne 20h · alimentation 4h · régime du guerrier' },
  { key: '24',    hours: 24, name: 'OMAD',  label: '1 repas/jour', desc: 'Jeûne 24h · un seul repas par jour' },
  { key: '36',    hours: 36, name: '36h+',  label: 'Prolongé',     desc: 'Jeûne 36h · avancé · avis médical recommandé ⚠️' },
];

export const FastingProvider = ({ children }) => {
  const { user } = useAuth();

  const [session, setSession] = useState(() => {
    const s = load();
    if (s && !FASTING_TYPES[s.fastingType]) return null;
    return s;
  });

  // Recharge la session lors d'une connexion (pas à la déconnexion — le jeûne doit persister)
  useEffect(() => {
    if (!user?.id) return;
    const s = load();
    if (s && !FASTING_TYPES[s.fastingType]) { setSession(null); return; }
    setSession(s);
  }, [user?.id]);

  // Calcule l'élapsé en secondes à l'instant T
  const getElapsed = useCallback((s = null) => {
    const data = s ?? load();
    if (!data) return 0;
    if (data.isRunning) {
      return (data.elapsedWhenPaused || 0) + Math.floor((Date.now() - data.startTime) / 1000);
    }
    return data.elapsedWhenPaused || 0;
  }, []);

  const start = useCallback(async (type = '16/8', customHours = null) => {
    const data = { startTime: Date.now(), fastingType: type, isRunning: true, elapsedWhenPaused: 0, ...(customHours ? { customHours } : {}) };
    save(data);
    setSession(data);
    // Sync backend
    try {
      const res = await axios.post(`${API}/jeunes/start`, {}, authHeader());
      const jeuneId = res.data?.id;
      if (jeuneId) {
        const updated = { ...data, jeuneId };
        save(updated);
        setSession(updated);
      }
    } catch (err) {
      // Si un jeûne orphelin existe déjà en DB, on récupère son ID pour pouvoir le stopper proprement
      const existing = err?.response?.data?.jeune;
      if (existing?.id) {
        const updated = { ...data, jeuneId: existing.id };
        save(updated);
        setSession(updated);
      }
      // Sinon on continue en local sans jeuneId
    }
  }, []);

  const pause = useCallback(() => {
    const current = load();
    if (!current || !current.isRunning) return;
    const data = { ...current, isRunning: false, elapsedWhenPaused: getElapsed(current) };
    save(data);
    setSession(data);
  }, [getElapsed]);

  const resume = useCallback(() => {
    const current = load();
    if (!current || current.isRunning) return;
    const data = { ...current, isRunning: true, startTime: Date.now() };
    save(data);
    setSession(data);
  }, []);

  // finalize : jeûne complété naturellement → sauvegarde backend + marque terminé localement
  const finalize = useCallback(async () => {
    const current = load();
    if (!current) return;
    const elapsed = (current.elapsedWhenPaused || 0) + (current.isRunning ? Math.floor((Date.now() - current.startTime) / 1000) : 0);
    const data = { ...current, isRunning: false, elapsedWhenPaused: elapsed, completed: true };
    save(data);
    setSession(data);

    let jeuneId = current.jeuneId;

    // Si pas de jeuneId (start backend avait échoué), on tente un start immédiat + stop
    if (!jeuneId) {
      try {
        const res = await axios.post(`${API}/jeunes/start`, {}, authHeader());
        jeuneId = res.data?.id;
      } catch { /* déjà en cours ou hors ligne */ }
    }

    if (jeuneId) {
      try {
        const res = await axios.patch(`${API}/jeunes/${jeuneId}/stop`, {}, authHeader());
        const duree = res.data?.dureeHeures;
        // Notification de complétion
        await axios.post(`${API}/notifications`, {
          type: 'JEUNE_COMPLETE',
          message: `Bravo ! Vous avez complété un jeûne${duree ? ` de ${duree.toFixed(1)}h` : ''} 🎉`,
          dateEnvoi: new Date(),
        }, authHeader());
        // Notification de streak
        try {
          const jeunes = await axios.get(`${API}/jeunes`, authHeader());
          const days = new Set(
            (jeunes.data || [])
              .filter(j => j.statut === 'TERMINE')
              .map(j => new Date(j.dateDebut).toDateString())
          );
          let streak = 0;
          const d = new Date();
          while (days.has(new Date(d).toDateString())) {
            streak++;
            d.setDate(d.getDate() - 1);
          }
          if (streak >= 2) {
            await axios.post(`${API}/notifications`, {
              type: 'STREAK',
              message: `🔥 Série de ${streak} jour${streak > 1 ? 's' : ''} consécutif${streak > 1 ? 's' : ''} ! Continuez comme ça !`,
              dateEnvoi: new Date(),
            }, authHeader());
          }
        } catch { /* silencieux */ }
      } catch { /* silencieux */ }
    }
  }, []);

  // reset : abandon ou réinitialisation manuelle → sauvegarde backend + efface local
  const reset = useCallback(async () => {
    const current = load();
    if (current?.jeuneId) {
      try {
        await axios.patch(`${API}/jeunes/${current.jeuneId}/stop`, {}, authHeader());
      } catch { /* silencieux */ }
    }
    clear();
    setSession(null);
  }, []);

  const changeType = useCallback((type, customHours = null) => {
    reset();
    const data = { startTime: null, fastingType: type, isRunning: false, elapsedWhenPaused: 0, ...(customHours ? { customHours } : {}) };
    save(data);
    setSession(data);
  }, [reset]);

  // Si le type est 'custom', on utilise customHours stocké dans la session
  const targetHours = session?.fastingType === 'custom'
    ? (session?.customHours ?? 16)
    : (FASTING_TYPES[session?.fastingType]?.hours ?? 16);
  const targetSeconds = targetHours * 3600;
  const isRunning   = session?.isRunning ?? false;
  const isCompleted = session?.completed ?? false;
  const fastingType = (session?.fastingType && FASTING_TYPES[session.fastingType]) ? session.fastingType : '16/8';
  const hasSession  = !!session && !session.completed; // une session complétée n'est plus "active"

  return (
    <FastingContext.Provider value={{
      session, isRunning, fastingType, targetSeconds, targetHours, hasSession,
      getElapsed, start, pause, resume, reset, finalize, changeType,
      isCompleted,
    }}>
      {children}
    </FastingContext.Provider>
  );
};

export const useFasting = () => {
  const ctx = useContext(FastingContext);
  if (!ctx) throw new Error('useFasting doit être utilisé dans FastingProvider');
  return ctx;
};
