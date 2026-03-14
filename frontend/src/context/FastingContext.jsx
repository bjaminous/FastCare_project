import { createContext, useContext, useState, useCallback } from 'react';

const FastingContext = createContext(null);

const LS_KEY = 'fc_fasting';

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const save = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));
const clear = () => localStorage.removeItem(LS_KEY);

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
  const [session, setSession] = useState(() => {
    const s = load();
    // migration : si l'ancien type 'custom' ou '24' est stocké mais plus valide, reset
    if (s && !FASTING_TYPES[s.fastingType]) return null;
    return s;
  });

  // Calcule l'élapsé en secondes à l'instant T
  const getElapsed = useCallback((s = null) => {
    const data = s ?? load();
    if (!data) return 0;
    if (data.isRunning) {
      return (data.elapsedWhenPaused || 0) + Math.floor((Date.now() - data.startTime) / 1000);
    }
    return data.elapsedWhenPaused || 0;
  }, []);

  const start = useCallback((type = '16/8', customHours = null) => {
    const data = { startTime: Date.now(), fastingType: type, isRunning: true, elapsedWhenPaused: 0, ...(customHours ? { customHours } : {}) };
    save(data);
    setSession(data);
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

  const reset = useCallback(() => {
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
  const isRunning = session?.isRunning ?? false;
  const fastingType = (session?.fastingType && FASTING_TYPES[session.fastingType]) ? session.fastingType : '16/8';
  const hasSession = !!session;

  return (
    <FastingContext.Provider value={{
      session, isRunning, fastingType, targetSeconds, targetHours, hasSession,
      getElapsed, start, pause, resume, reset, changeType,
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
