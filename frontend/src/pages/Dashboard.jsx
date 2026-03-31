import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const API = 'http://localhost:5000/api';
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });
import { useFasting, FASTING_TYPES } from '../context/FastingContext';
import {
  Timer, Flame, Droplets, TrendingUp, Zap, Moon, Heart,
  Scale, Brain, ArrowRight, Play, Trophy, Calendar,
  PenLine, BarChart2, Lightbulb, Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppNav from '../components/AppNav';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;
const progressAnim = keyframes`
  from { width: 0; }
`;

const Page = styled.div`
  min-height: 100vh; background: #F8FAFF;
  padding-bottom: 5rem; /* espace pour la barre mobile */
`;

const Content = styled.div`
  max-width: 1280px; width: 100%; margin: 0 auto;
  padding: 2.5rem 2.5rem;
  @media(max-width:768px){ padding: 1.75rem 1.25rem; }
  @media(max-width:480px){ padding: 1.25rem 1rem; }
`;

/* ── Greeting ── */
const Greeting = styled.div`
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.5s ease both;
`;
const GreetTitle = styled.h1`
  font-size: clamp(1.5rem,3.5vw,2.2rem); font-weight: 900; color: #0F172A;
  letter-spacing: -0.02em; margin-bottom: 0.3rem;
  span { background: linear-gradient(90deg,#2A7DE1,#2ED1A2);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
`;
const GreetSub = styled.p`font-size: 0.9rem; color: #64748b; font-weight: 500;`;

/* ── Hero card (statut jeûne actuel) ── */
const HeroCard = styled.div`
  background: linear-gradient(135deg,#0F172A 0%,#1E3A5F 60%,#0F4C3A 100%);
  border-radius: 24px; padding: 2rem;
  margin-bottom: 2rem; position: relative; overflow: hidden;
  animation: ${popIn} 0.5s ease 0.05s both;
  @media(max-width:480px){ padding: 1.5rem; }
`;
const HeroOrb = styled.div`
  position:absolute; border-radius:50%; filter:blur(60px); pointer-events:none;
  &.a{width:300px;height:300px;background:rgba(42,125,225,0.2);top:-120px;left:-80px;}
  &.b{width:250px;height:250px;background:rgba(46,209,162,0.15);bottom:-80px;right:-60px;}
`;
const HeroTop = styled.div`
  display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem;
  gap:1rem; flex-wrap:wrap;
`;
const HeroLabel = styled.div`
  font-size:0.75rem;font-weight:700;color:rgba(255,255,255,0.55);
  text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.4rem;
`;
const HeroTime = styled.div`
  font-size: clamp(2.5rem,7vw,4rem); font-weight:900; color:white;
  letter-spacing:-0.04em; line-height:1;
`;
const HeroSub = styled.div`font-size:0.85rem;color:rgba(255,255,255,0.55);margin-top:0.3rem;`;
const StatusBadge = styled.div`
  display:inline-flex;align-items:center;gap:0.4rem;
  background:rgba(46,209,162,0.2);border:1px solid rgba(46,209,162,0.35);
  color:#2ED1A2;padding:0.35rem 0.85rem;border-radius:9999px;
  font-size:0.78rem;font-weight:800;
`;
const Dot = styled.span`
  width:7px;height:7px;background:#2ED1A2;border-radius:50%;
  animation:${keyframes`0%,100%{opacity:1}50%{opacity:0.3}`} 1.5s ease infinite;
  display:inline-block;
`;
const ProgressBar = styled.div`
  background:rgba(255,255,255,0.1);border-radius:9999px;height:8px;margin-top:1.5rem;
  overflow:hidden;
`;
const ProgressFill = styled.div`
  height:100%;border-radius:9999px;
  background:linear-gradient(90deg,#2A7DE1,#2ED1A2);
  width:${p=>p.pct}%;
  animation:${progressAnim} 1s ease 0.3s both;
`;
const ProgressRow = styled.div`
  display:flex;justify-content:space-between;margin-top:0.5rem;
  font-size:0.75rem;color:rgba(255,255,255,0.45);font-weight:600;
`;
const StartBtn = styled.button`
  display:flex;align-items:center;gap:0.5rem;
  background:linear-gradient(135deg,#2A7DE1,#2ED1A2);
  border:none;color:white;font-size:0.9rem;font-weight:800;
  padding:0.75rem 1.5rem;border-radius:12px;cursor:pointer;
  margin-top:1.5rem;transition:transform 0.2s,box-shadow 0.2s;
  box-shadow:0 8px 24px -6px rgba(42,125,225,0.45);
  &:hover{transform:translateY(-2px);box-shadow:0 14px 32px -6px rgba(42,125,225,0.5);}
`;

/* ── Stats grid ── */
const StatsGrid = styled.div`
  display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;
  @media(max-width:900px){grid-template-columns:repeat(2,1fr);}
  @media(max-width:480px){grid-template-columns:repeat(2,1fr);gap:0.75rem;}
`;
const StatCard = styled.div`
  background:white;border-radius:18px;padding:1.25rem;
  border:1.5px solid rgba(42,125,225,0.07);
  box-shadow:0 2px 12px rgba(0,0,0,0.04);
  animation:${fadeInUp} 0.5s ease ${p=>p.delay||'0s'} both;
`;
const StatIcon = styled.div`
  width:38px;height:38px;border-radius:10px;
  background:${p=>p.bg};display:flex;align-items:center;justify-content:center;
  color:${p=>p.color};margin-bottom:0.75rem;
`;
const StatValue = styled.div`font-size:1.6rem;font-weight:900;color:#0F172A;line-height:1;`;
const StatLabel = styled.div`font-size:0.75rem;color:#64748b;font-weight:600;margin-top:0.3rem;`;
const StatTrend = styled.div`
  font-size:0.72rem;font-weight:700;margin-top:0.4rem;
  color:${p=>p.up?'#059669':'#94a3b8'};
`;

/* ── Raccourcis rapides ── */
const QuickGrid = styled.div`
  display:grid;grid-template-columns:repeat(4,1fr);gap:0.85rem;margin-bottom:2rem;
  animation:${fadeInUp} 0.5s ease 0.08s both;
  @media(max-width:768px){grid-template-columns:repeat(2,1fr);}
`;
const QuickBtn = styled.button`
  display:flex;flex-direction:column;align-items:center;gap:0.5rem;
  background:white;border:1.5px solid rgba(42,125,225,0.08);
  border-radius:16px;padding:1.1rem 0.75rem;cursor:pointer;
  transition:all 0.2s;text-align:center;
  &:hover{
    border-color:${p=>p.$color||'#2A7DE1'};
    transform:translateY(-3px);
    box-shadow:0 8px 24px -6px ${p=>p.$shadow||'rgba(42,125,225,0.2)'};
  }
`;
const QuickIcon = styled.div`
  width:42px;height:42px;border-radius:13px;
  background:${p=>p.$bg};color:${p=>p.$color};
  display:flex;align-items:center;justify-content:center;
`;
const QuickLabel = styled.div`font-size:0.78rem;font-weight:700;color:#475569;`;

/* ── Two columns ── */
const TwoCol = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem;
  @media(max-width:768px){grid-template-columns:1fr;}
`;

/* ── Section ── */
const SectionHead = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;
`;
const SectionTitle = styled.h2`
  font-size:1.05rem;font-weight:900;color:#0F172A;letter-spacing:-0.01em;
`;
const SeeAll = styled.button`
  display:flex;align-items:center;gap:0.3rem;background:none;border:none;
  font-size:0.8rem;font-weight:700;color:#2A7DE1;cursor:pointer;
  &:hover{text-decoration:underline;}
`;

/* ── Historique ── */
const HistoryCard = styled.div`
  background:white;border-radius:18px;padding:1.25rem;
  border:1.5px solid rgba(42,125,225,0.07);
  animation:${fadeInUp} 0.5s ease 0.2s both;
`;
const HistoryRow = styled.div`
  display:flex;align-items:center;gap:0.85rem;
  padding:0.65rem 0;
  border-bottom:1px solid rgba(42,125,225,0.06);
  &:last-child{border-bottom:none;}
`;
const HistoryDot = styled.div`
  width:38px;height:38px;min-width:38px;border-radius:10px;
  background:${p=>p.bg};display:flex;align-items:center;justify-content:center;
  color:${p=>p.color};font-size:0.8rem;font-weight:900;
`;
const HistoryInfo = styled.div`flex:1;`;
const HistoryTitle = styled.div`font-size:0.88rem;font-weight:700;color:#0F172A;`;
const HistoryDate = styled.div`font-size:0.75rem;color:#94a3b8;margin-top:0.1rem;`;
const HistoryDur = styled.div`font-size:0.85rem;font-weight:800;color:#2A7DE1;`;
const EmptyState = styled.div`
  text-align:center;padding:2rem 1rem;color:#94a3b8;
  font-size:0.88rem;font-weight:600;
  .emoji{font-size:2rem;margin-bottom:0.5rem;}
`;

/* ── Objectif actuel ── */
const GoalCard = styled.div`
  background:white;border-radius:18px;padding:1.25rem;
  border:1.5px solid rgba(42,125,225,0.07);
  animation:${fadeInUp} 0.5s ease 0.25s both;
`;
const GoalBanner = styled.div`
  background:${p=>p.bg};border-radius:14px;padding:1.25rem;
  display:flex;align-items:center;gap:1rem;margin-bottom:1rem;
`;
const GoalIconBox = styled.div`
  width:48px;height:48px;min-width:48px;border-radius:14px;
  background:rgba(255,255,255,0.18);border:1.5px solid rgba(255,255,255,0.25);
  display:flex;align-items:center;justify-content:center;color:white;
`;
const GoalName = styled.div`font-size:1rem;font-weight:900;color:white;`;
const GoalDesc = styled.div`font-size:0.78rem;color:rgba(255,255,255,0.7);margin-top:0.2rem;`;
const ChangeGoalBtn = styled.button`
  display:flex;align-items:center;gap:0.4rem;width:100%;
  background:none;border:1.5px solid rgba(42,125,225,0.15);
  color:#2A7DE1;font-size:0.83rem;font-weight:700;
  padding:0.6rem;border-radius:10px;cursor:pointer;justify-content:center;
  transition:all 0.2s;
  &:hover{background:rgba(42,125,225,0.06);}
`;

/* ── Tips ── */
const TipsCard = styled.div`
  background:white;border-radius:18px;padding:1.25rem;
  border:1.5px solid rgba(42,125,225,0.07);
  animation:${fadeInUp} 0.5s ease 0.3s both;
`;
const Tip = styled.div`
  display:flex;align-items:flex-start;gap:0.75rem;padding:0.65rem 0;
  border-bottom:1px solid rgba(42,125,225,0.06);
  &:last-child{border-bottom:none;}
`;
const TipIcon = styled.div`
  width:34px;height:34px;min-width:34px;border-radius:9px;
  background:${p=>p.bg};display:flex;align-items:center;justify-content:center;
  color:${p=>p.color};
`;
const TipText = styled.div`font-size:0.83rem;color:#334155;line-height:1.55;font-weight:500;`;

/* ── Streak banner ── */
const StreakBanner = styled.div`
  background:linear-gradient(135deg,#FEF3C7,#FDE68A);
  border:1.5px solid rgba(245,158,11,0.3);
  border-radius:18px;padding:1.1rem 1.5rem;
  display:flex;align-items:center;gap:1rem;
  margin-bottom:2rem;
  animation:${fadeInUp} 0.5s ease 0.1s both;
`;
const StreakText = styled.div`flex:1;`;
const StreakTitle = styled.div`font-size:0.95rem;font-weight:800;color:#92400E;`;
const StreakSub = styled.div`font-size:0.78rem;color:#B45309;margin-top:0.15rem;`;

/* ─── Goal meta ─── */
const GOAL_META = {
  'health':      { label:'Santé & Vitalité',         icon:Heart,  bg:'linear-gradient(135deg,#EF4444,#F97316)', desc:'Énergie et bien-être global' },
  'weight-loss': { label:'Perte de Poids',            icon:Scale,  bg:'linear-gradient(135deg,#3B82F6,#8B5CF6)', desc:'Déficit naturel, résultats durables' },
  'spiritual':   { label:'Ramadan / Carême',          icon:Moon,   bg:'linear-gradient(135deg,#F59E0B,#EF4444)', desc:'Accompagnement spirituel' },
  'learning':    { label:'Découverte & Apprentissage',icon:Brain,  bg:'linear-gradient(135deg,#2ED1A2,#06B6D4)', desc:'Protocoles progressifs' },
};

const TIPS_BY_GOAL = {
  'health': [
    { icon: Droplets, bg:'rgba(59,130,246,0.1)', color:'#3B82F6', text:'Buvez 2L d\'eau minimum. Pendant le jeûne, l\'eau, le thé et le café noir sont autorisés.' },
    { icon: Zap,      bg:'rgba(245,158,11,0.1)', color:'#D97706', text:'Une légère baisse d\'énergie au début est normale. Elle disparaît en 3-5 jours.' },
    { icon: Moon,     bg:'rgba(139,92,246,0.1)', color:'#7C3AED', text:'Essayez de terminer votre dernier repas 3h avant le coucher pour optimiser le sommeil.' },
  ],
  'weight-loss': [
    { icon: Flame,    bg:'rgba(239,68,68,0.1)',  color:'#EF4444', text:'Ne compensez pas à l\'Iftar. Mangez normalement — c\'est la clé du déficit naturel.' },
    { icon: TrendingUp,bg:'rgba(46,209,162,0.1)',color:'#059669', text:'Pesez-vous le matin, à jeun, toujours dans les mêmes conditions pour des données fiables.' },
    { icon: Droplets, bg:'rgba(59,130,246,0.1)', color:'#3B82F6', text:'La soif est souvent confondue avec la faim. Buvez un grand verre avant de manger.' },
  ],
  'spiritual': [
    { icon: Moon,     bg:'rgba(245,158,11,0.1)', color:'#D97706', text:'Hydratez-vous bien entre Iftar et Suhoor : visez 8 verres d\'eau répartis sur la nuit.' },
    { icon: Heart,    bg:'rgba(239,68,68,0.1)',  color:'#EF4444', text:'Brisez le jeûne avec des dattes et de l\'eau — la tradition et la science s\'accordent.' },
    { icon: Zap,      bg:'rgba(46,209,162,0.1)', color:'#059669', text:'Évitez les aliments trop sucrés ou trop gras à l\'Iftar pour préserver votre énergie.' },
  ],
  'learning': [
    { icon: Heart,    bg:'rgba(46,209,162,0.1)', color:'#059669', text:'Commencez doucement : 12h de jeûne, c\'est déjà excellent. Ne forcez rien.' },
    { icon: Zap,      bg:'rgba(245,158,11,0.1)', color:'#D97706', text:'La faim par vague, ça passe ! Attendez 20 minutes — elle disparaît souvent d\'elle-même.' },
    { icon: TrendingUp,bg:'rgba(42,125,225,0.1)',color:'#2A7DE1', text:'Notez vos ressentis chaque jour. Vous verrez votre corps s\'adapter semaine après semaine.' },
  ],
};

const DEFAULT_TIPS = [
  { icon: Droplets, bg:'rgba(59,130,246,0.1)', color:'#3B82F6', text:'Buvez 2L d\'eau minimum par jour, répartis tout au long de la journée.' },
  { icon: Zap,      bg:'rgba(245,158,11,0.1)', color:'#D97706', text:'Choisissez votre objectif pour recevoir des conseils personnalisés.' },
  { icon: Timer,    bg:'rgba(42,125,225,0.1)', color:'#2A7DE1', text:'La régularité est la clé. Même un jeûne court chaque jour est plus efficace qu\'un long de temps en temps.' },
];

const formatTime = (seconds) => {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
};

/* ── helper temps ── */
const getGreeting = (t) => {
  const h = new Date().getHours();
  if (h < 12) return t('dashboard.greetingMorning');
  if (h < 18) return t('dashboard.greetingAfternoon');
  return t('dashboard.greetingEvening');
};

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isRunning, isCompleted, fastingType, targetSeconds, hasSession, getElapsed } = useFasting();
  const [elapsed, setElapsed] = useState(() => getElapsed());
  const rafRef = useRef(null);

  useEffect(() => {
    const tick = () => { setElapsed(getElapsed()); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getElapsed]);

  const timeLeft = Math.max(0, targetSeconds - elapsed);
  const progress = targetSeconds > 0 ? Math.min((elapsed / targetSeconds) * 100, 100) : 0;
  const fastingTypeName = FASTING_TYPES[fastingType]?.name ?? '16/8';

  const goal = localStorage.getItem('fastingGoal');
  const goalMeta = goal ? GOAL_META[goal] : null;
  const GoalIcon = goalMeta?.icon;
  const tips = goal ? (TIPS_BY_GOAL[goal] || DEFAULT_TIPS) : DEFAULT_TIPS;

  const [history, setHistory]       = useState([]);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [apiError, setApiError]     = useState(null);

  const loadHistory = useCallback(async () => {
    setApiError(null);
    try {
      const res = await axios.get(`${API}/jeunes`, auth());
      setHistory(res.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Erreur inconnue';
      const status = err?.response?.status;
      setApiError(`${status ? `[${status}] ` : ''}${msg}`);
    }
    setStatsLoaded(true);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // Rappel de commencer le jeûne (après 20h, une fois par jour, si pas de session active)
  useEffect(() => {
    if (!user || hasSession) return;
    const hour = new Date().getHours();
    if (hour < 20) return;
    const today = new Date().toDateString();
    const key = `fc_fast_reminder_${user.id}`;
    if (localStorage.getItem(key) === today) return;
    localStorage.setItem(key, today);
    axios.post(`${API}/notifications`, {
      type: 'RAPPEL_JEUNE',
      message: '🌙 Il est l\'heure de commencer votre jeûne ! Démarrez votre timer pour ce soir.',
      dateEnvoi: new Date(),
    }, auth()).catch(() => {});
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('FastCare 🌙', { body: 'Il est l\'heure de commencer votre jeûne !', icon: '/favicon.ico' });
    }
  }, [user, hasSession]);

  // Rafraîchit les stats quand la fenêtre reprend le focus (retour depuis Timer)
  useEffect(() => {
    const onFocus = () => loadHistory();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadHistory]);

  const hasFastingData = hasSession;
  const termines = history.filter(j => j.statut === 'TERMINE');
  const totalFasts = termines.length;
  const totalHours = Math.round(
    termines.reduce((acc, j) => {
      if (!j.dateFin) return acc;
      return acc + (new Date(j.dateFin) - new Date(j.dateDebut)) / 3600000;
    }, 0)
  );
  const avgDuration = termines.length > 0
    ? `${(totalHours / termines.length).toFixed(1)}h`
    : '—';

  // Streak : compter les jours consécutifs avec au moins 1 jeûne terminé
  const streak = (() => {
    if (!termines.length) return 0;
    const days = [...new Set(termines.map(j =>
      new Date(j.dateDebut).toISOString().split('T')[0]
    ))].sort().reverse();
    let count = 0;
    let cursor = new Date(); cursor.setHours(0,0,0,0);
    for (const d of days) {
      const day = new Date(d + 'T00:00:00');
      const diff = Math.round((cursor - day) / 86400000);
      if (diff <= 1) { count++; cursor = day; }
      else break;
    }
    return count;
  })();

  return (
    <Page>
      <AppNav />
      <Content>

        {/* ── Bonjour ── */}
        <Greeting>
          <GreetTitle>
            {getGreeting(t)},{' '}
            <span>{user?.prenom || user?.nom || 'Champion'} 👋</span>
          </GreetTitle>
          <GreetSub>
            {hasFastingData
              ? 'Voici le résumé de votre progression.'
              : 'Prêt à démarrer votre premier jeûne ?'}
          </GreetSub>
        </Greeting>

        {/* ── Streak ── */}
        {streak > 1 && (
          <StreakBanner>
            <span style={{ fontSize: '2rem' }}>🔥</span>
            <StreakText>
              <StreakTitle>{streak} jours consécutifs — belle série !</StreakTitle>
              <StreakSub>Continuez comme ça, votre corps s'adapte de mieux en mieux.</StreakSub>
            </StreakText>
            <Trophy size={24} color="#D97706" />
          </StreakBanner>
        )}

        {/* ── Hero : statut jeûne ── */}
        <HeroCard>
          <HeroOrb className="a" /><HeroOrb className="b" />
          <HeroTop>
            <div>
              <HeroLabel>
                {isCompleted ? t('dashboard.fastCompleted') : hasSession ? t('dashboard.fastInProgress') : t('dashboard.noFast')}
              </HeroLabel>
              <HeroTime>{hasSession || isCompleted ? formatTime(timeLeft) : '00:00:00'}</HeroTime>
              <HeroSub>
                {isCompleted
                  ? `${fastingTypeName} · 100% accompli 🎉`
                  : hasSession
                    ? `${fastingTypeName} · ${Math.round(progress)}% accompli`
                    : 'Appuyez sur le bouton pour démarrer'}
              </HeroSub>
            </div>
            <StatusBadge>
              <Dot style={{ background: isCompleted ? '#059669' : isRunning ? '#2ED1A2' : '#F59E0B' }} />
              {isCompleted ? t('dashboard.done') : isRunning ? t('dashboard.active') : hasSession ? t('dashboard.paused') : t('dashboard.ready')}
            </StatusBadge>
          </HeroTop>
          <ProgressBar><ProgressFill pct={isCompleted ? 100 : progress} /></ProgressBar>
          <ProgressRow>
            <span>{formatTime(elapsed)} écoulé</span>
            <span>Objectif {FASTING_TYPES[fastingType]?.hours}h</span>
          </ProgressRow>
          <StartBtn onClick={() => navigate('/timer')}>
            <Play size={16} />
            {isCompleted ? t('dashboard.newFast') : isRunning ? t('dashboard.seeFast') : hasSession ? t('dashboard.resumeFast') : t('dashboard.startFast')}
          </StartBtn>
        </HeroCard>

        {/* ── Raccourcis rapides ── */}
        <QuickGrid>
          {[
            { label: t('dashboard.shortcuts.addTracking'), icon:Plus,      path:'/suivi',        bg:'rgba(42,125,225,0.1)',  color:'#2A7DE1', shadow:'rgba(42,125,225,0.2)' },
            { label: t('dashboard.shortcuts.myJournal'),  icon:PenLine,   path:'/journal',      bg:'rgba(46,209,162,0.1)',  color:'#059669', shadow:'rgba(46,209,162,0.2)' },
            { label: t('dashboard.shortcuts.stats'),      icon:BarChart2, path:'/statistiques', bg:'rgba(139,92,246,0.1)',  color:'#7C3AED', shadow:'rgba(139,92,246,0.2)' },
            { label: t('dashboard.shortcuts.tips'),       icon:Lightbulb, path:'/conseils',     bg:'rgba(245,158,11,0.1)',  color:'#D97706', shadow:'rgba(245,158,11,0.2)' },
          ].map(q => {
            const Icon = q.icon;
            return (
              <QuickBtn key={q.path} $color={q.color} $shadow={q.shadow} onClick={() => navigate(q.path)}>
                <QuickIcon $bg={q.bg} $color={q.color}><Icon size={20}/></QuickIcon>
                <QuickLabel>{q.label}</QuickLabel>
              </QuickBtn>
            );
          })}
        </QuickGrid>

        {/* ── Stats ── */}
        <StatsGrid>
          {[
            { icon: Timer,      bg:'rgba(42,125,225,0.1)',  color:'#2A7DE1', value: totalFasts || '0',   label: t('dashboard.stats.completed'),  trend: null, delay:'0.1s' },
            { icon: Flame,      bg:'rgba(239,68,68,0.1)',   color:'#EF4444', value: `${totalHours}h`,     label: t('dashboard.stats.totalHours'), trend: null, delay:'0.15s' },
            { icon: TrendingUp, bg:'rgba(46,209,162,0.1)',  color:'#059669', value: avgDuration,          label: t('dashboard.stats.avgDuration'),trend: null, delay:'0.2s' },
            { icon: Calendar,   bg:'rgba(245,158,11,0.1)',  color:'#D97706', value: `${streak}j`,         label: t('dashboard.stats.streak'),     trend: streak > 0, delay:'0.25s' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <StatCard key={i} delay={s.delay}>
                <StatIcon bg={s.bg} color={s.color}><Icon size={18} /></StatIcon>
                <StatValue>{s.value}</StatValue>
                <StatLabel>{s.label}</StatLabel>
                {s.trend !== null && (
                  <StatTrend up={s.trend}>{s.trend ? '↑ En progression' : 'Commencez !'}</StatTrend>
                )}
              </StatCard>
            );
          })}
        </StatsGrid>

        <TwoCol>
          {/* ── Historique ── */}
          <div>
            <SectionHead>
              <SectionTitle>{t('dashboard.history.title')}</SectionTitle>
              <SeeAll onClick={loadHistory}>{t('dashboard.refresh')}</SeeAll>
            </SectionHead>
            {apiError && (
              <div style={{
                background:'rgba(239,68,68,0.06)', border:'1.5px solid rgba(239,68,68,0.2)',
                borderRadius:'12px', padding:'0.75rem 1rem', marginBottom:'0.75rem',
                fontSize:'0.8rem', color:'#DC2626', fontWeight:600,
              }}>
                ⚠️ Erreur API : {apiError}
              </div>
            )}
            <HistoryCard>
              {!statsLoaded ? (
                <EmptyState><div style={{ color:'#94a3b8', fontSize:'0.85rem' }}>Chargement…</div></EmptyState>
              ) : termines.length === 0 ? (
                <EmptyState>
                  <div className="emoji">🌱</div>
                  <div>Votre historique apparaîtra ici après votre premier jeûne.</div>
                </EmptyState>
              ) : (
                termines.slice(0, 5).map((j, i) => {
                  const dur = j.dateFin
                    ? ((new Date(j.dateFin) - new Date(j.dateDebut)) / 3600000).toFixed(1) + 'h'
                    : '—';
                  return (
                    <HistoryRow key={j.id}>
                      <HistoryDot bg="rgba(42,125,225,0.1)" color="#2A7DE1">⏱</HistoryDot>
                      <HistoryInfo>
                        <HistoryTitle>Jeûne #{termines.length - i}</HistoryTitle>
                        <HistoryDate>{formatDate(j.dateDebut)}</HistoryDate>
                      </HistoryInfo>
                      <HistoryDur>{dur}</HistoryDur>
                    </HistoryRow>
                  );
                })
              )}
            </HistoryCard>
          </div>

          {/* ── Objectif + Tips ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            {/* Objectif actuel */}
            <div>
              <SectionHead>
                <SectionTitle>Mon objectif</SectionTitle>
              </SectionHead>
              <GoalCard>
                {goalMeta ? (
                  <>
                    <GoalBanner bg={goalMeta.bg}>
                      <GoalIconBox><GoalIcon size={22} /></GoalIconBox>
                      <div>
                        <GoalName>{goalMeta.label}</GoalName>
                        <GoalDesc>{goalMeta.desc}</GoalDesc>
                      </div>
                    </GoalBanner>
                    <ChangeGoalBtn onClick={() => navigate('/goal-selection')}>
                      Changer d'objectif <ArrowRight size={14}/>
                    </ChangeGoalBtn>
                  </>
                ) : (
                  <>
                    <EmptyState style={{ paddingTop:'1rem', paddingBottom:'1rem' }}>
                      <div className="emoji">🎯</div>
                      <div>Vous n'avez pas encore choisi d'objectif.</div>
                    </EmptyState>
                    <ChangeGoalBtn onClick={() => navigate('/goal-selection')}>
                      Choisir mon objectif <ArrowRight size={14}/>
                    </ChangeGoalBtn>
                  </>
                )}
              </GoalCard>
            </div>

            {/* Conseils du jour */}
            <div>
              <SectionHead>
                <SectionTitle>Conseils du jour</SectionTitle>
              </SectionHead>
              <TipsCard>
                {tips.map((t, i) => {
                  const TIcon = t.icon;
                  return (
                    <Tip key={i}>
                      <TipIcon bg={t.bg} color={t.color}><TIcon size={16}/></TipIcon>
                      <TipText>{t.text}</TipText>
                    </Tip>
                  );
                })}
              </TipsCard>
            </div>
          </div>
        </TwoCol>

      </Content>
    </Page>
  );
};

export default Dashboard;
