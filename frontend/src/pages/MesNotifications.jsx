import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import {
  Bell, CheckCheck, Trophy, Zap, Info, Heart, Droplets,
  ArrowLeft, RefreshCw, Filter,
} from 'lucide-react';
import AppNav from '../components/AppNav';

const API = 'http://localhost:5000/api';
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
`;

const Page = styled.div`min-height:100vh; background:#F8FAFF; padding-bottom:5rem;`;

const Hero = styled.div`
  background: linear-gradient(135deg,#0F172A 0%,#1E3A5F 60%,#0F4C3A 100%);
  padding: 2.5rem 2rem 3rem; position:relative; overflow:hidden;
`;
const HeroOrb = styled.div`
  position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none;
  &.a{width:300px;height:300px;background:rgba(42,125,225,0.2);top:-120px;left:-60px;}
  &.b{width:250px;height:250px;background:rgba(46,209,162,0.15);bottom:-80px;right:-40px;}
`;
const HeroTitle = styled.h1`
  font-size:clamp(1.5rem,4vw,2.2rem); font-weight:900; color:white;
  letter-spacing:-0.03em; margin:0 0 0.3rem; position:relative;
`;
const HeroSub = styled.p`font-size:0.9rem; color:rgba(255,255,255,0.55); margin:0; position:relative;`;

const Content = styled.div`
  max-width:760px; width:100%; margin:0 auto;
  padding: 2rem 1.5rem;
  @media(max-width:640px){ padding:1.25rem 1rem; }
`;

const Toolbar = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem;
`;
const FilterRow = styled.div`display:flex; gap:0.5rem; flex-wrap:wrap;`;
const FilterBtn = styled.button`
  padding:0.35rem 0.9rem; border-radius:9999px; font-size:0.78rem; font-weight:700;
  cursor:pointer; transition:all 0.18s;
  background:${p => p.$active ? 'linear-gradient(135deg,#2A7DE1,#2ED1A2)' : 'white'};
  color:${p => p.$active ? 'white' : '#64748b'};
  border:1.5px solid ${p => p.$active ? 'transparent' : 'rgba(42,125,225,0.15)'};
  &:hover{ border-color:#2A7DE1; color:${p => p.$active ? 'white' : '#2A7DE1'}; }
`;
const ActionBtn = styled.button`
  display:flex; align-items:center; gap:0.4rem;
  background:none; border:1.5px solid rgba(42,125,225,0.18);
  color:#2A7DE1; font-size:0.8rem; font-weight:700;
  padding:0.35rem 0.85rem; border-radius:10px; cursor:pointer; transition:all 0.15s;
  &:hover{ background:rgba(42,125,225,0.06); }
  &:disabled{ opacity:0.4; cursor:default; }
`;

const Card = styled.div`
  background:white; border-radius:18px;
  border:1.5px solid rgba(42,125,225,0.07);
  box-shadow:0 2px 12px rgba(0,0,0,0.04);
  overflow:hidden;
  animation:${fadeInUp} 0.4s ease both;
`;

const NotifItem = styled.div`
  display:flex; align-items:flex-start; gap:0.9rem;
  padding:1rem 1.25rem;
  background:${p => p.$unread ? 'rgba(42,125,225,0.03)' : 'white'};
  border-bottom:1px solid rgba(42,125,225,0.05);
  cursor:pointer; transition:background 0.15s;
  &:last-child{ border-bottom:none; }
  &:hover{ background:rgba(42,125,225,0.06); }
`;
const IconBox = styled.div`
  width:40px; height:40px; min-width:40px; border-radius:12px;
  background:${p=>p.$bg}; color:${p=>p.$color};
  display:flex; align-items:center; justify-content:center;
  margin-top:2px;
`;
const Body = styled.div`flex:1;`;
const Msg = styled.div`
  font-size:0.88rem; line-height:1.5;
  font-weight:${p=>p.$unread?700:500};
  color:${p=>p.$unread?'#0F172A':'#475569'};
`;
const Meta = styled.div`
  display:flex; align-items:center; gap:0.75rem; margin-top:0.3rem;
`;
const Time = styled.span`font-size:0.72rem; color:#94a3b8;`;
const TypeTag = styled.span`
  font-size:0.68rem; font-weight:700; padding:0.1rem 0.5rem;
  border-radius:9999px; background:${p=>p.$bg}; color:${p=>p.$color};
`;
const UnreadDot = styled.div`
  width:8px; height:8px; border-radius:50%; background:#2A7DE1;
  margin-top:6px; flex-shrink:0;
`;

const Empty = styled.div`
  padding:4rem 2rem; text-align:center; color:#94a3b8;
  .e{ font-size:2.5rem; margin-bottom:1rem; }
  p{ font-size:0.9rem; font-weight:600; }
`;

const Stats = styled.div`
  display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem; margin-bottom:1.5rem;
  @media(max-width:480px){ grid-template-columns:repeat(3,1fr); }
`;
const StatBox = styled.div`
  background:white; border-radius:14px; padding:0.85rem 1rem;
  border:1.5px solid rgba(42,125,225,0.07);
  text-align:center;
`;
const StatNum = styled.div`font-size:1.5rem; font-weight:900; color:#0F172A;`;
const StatLbl = styled.div`font-size:0.72rem; font-weight:600; color:#94a3b8; margin-top:0.1rem;`;

const ICONS = {
  JEUNE_COMPLETE: { icon:Trophy,   bg:'rgba(245,158,11,0.1)',  color:'#D97706', tag:'Jeûne', tagBg:'rgba(245,158,11,0.1)', tagColor:'#D97706' },
  STREAK:         { icon:Zap,      bg:'rgba(239,68,68,0.1)',   color:'#EF4444', tag:'Série',  tagBg:'rgba(239,68,68,0.1)', tagColor:'#EF4444' },
  HYDRATATION:    { icon:Droplets, bg:'rgba(42,125,225,0.1)',  color:'#2A7DE1', tag:'Eau',    tagBg:'rgba(42,125,225,0.1)', tagColor:'#2A7DE1' },
  RAPPEL_JEUNE:   { icon:Bell,     bg:'rgba(139,92,246,0.1)',  color:'#8B5CF6', tag:'Rappel', tagBg:'rgba(139,92,246,0.1)', tagColor:'#8B5CF6' },
  OBJECTIF_POIDS: { icon:Trophy,   bg:'rgba(46,209,162,0.1)',  color:'#059669', tag:'Poids',  tagBg:'rgba(46,209,162,0.1)', tagColor:'#059669' },
  BIENVENUE:      { icon:Info,     bg:'rgba(46,209,162,0.1)',  color:'#059669', tag:'Accueil',tagBg:'rgba(46,209,162,0.1)', tagColor:'#059669' },
  CONSEIL:        { icon:Heart,    bg:'rgba(239,68,68,0.1)',   color:'#EF4444', tag:'Conseil',tagBg:'rgba(239,68,68,0.1)', tagColor:'#EF4444' },
  RAPPEL:         { icon:Zap,      bg:'rgba(42,125,225,0.1)',  color:'#2A7DE1', tag:'Rappel', tagBg:'rgba(42,125,225,0.1)', tagColor:'#2A7DE1' },
  INFO:           { icon:Info,     bg:'rgba(100,116,139,0.1)', color:'#64748b', tag:'Info',   tagBg:'rgba(100,116,139,0.1)', tagColor:'#64748b' },
  ALERTE:         { icon:Zap,      bg:'rgba(239,68,68,0.1)',   color:'#EF4444', tag:'Alerte', tagBg:'rgba(239,68,68,0.1)', tagColor:'#EF4444' },
  default:        { icon:Info,     bg:'rgba(100,116,139,0.1)', color:'#64748b', tag:'Info',   tagBg:'rgba(100,116,139,0.1)', tagColor:'#64748b' },
};

const FILTERS = [
  { key:'all',        label:'Toutes' },
  { key:'unread',     label:'Non lues' },
  { key:'HYDRATATION',label:'Hydratation' },
  { key:'CONSEIL',    label:'Conseils' },
  { key:'RAPPEL_JEUNE',label:'Rappels' },
];

const fmtTime = (d) => {
  if (!d) return '';
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60)    return 'À l\'instant';
  if (diff < 3600)  return `Il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff/3600)}h`;
  if (diff < 604800)return `Il y a ${Math.floor(diff/86400)}j`;
  return new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' });
};

const MesNotifications = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs]   = useState([]);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/notifications/history`, authH());
      setNotifs(res.data || []);
    } catch { /* silencieux */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkOne = async (id) => {
    try {
      await axios.post(`${API}/notifications/${id}/read`, {}, authH());
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, lue: true } : n));
    } catch { /* silencieux */ }
  };

  const handleMarkAll = async () => {
    try {
      await axios.post(`${API}/notifications/mark-all-read`, {}, authH());
      setNotifs(prev => prev.map(n => ({ ...n, lue: true })));
    } catch { /* silencieux */ }
  };

  const unread = notifs.filter(n => !n.lue).length;

  const filtered = notifs.filter(n => {
    if (filter === 'all')    return true;
    if (filter === 'unread') return !n.lue;
    return n.type === filter;
  });

  return (
    <Page>
      <AppNav />

      <Hero>
        <HeroOrb className="a" /><HeroOrb className="b" />
        <div style={{ maxWidth:760, margin:'0 auto', position:'relative' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            display:'inline-flex', alignItems:'center', gap:'0.4rem',
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
            color:'rgba(255,255,255,0.75)', fontSize:'0.82rem', fontWeight:700,
            padding:'0.4rem 0.9rem', borderRadius:'10px', cursor:'pointer',
            marginBottom:'1rem',
          }}>
            <ArrowLeft size={14} /> Retour au tableau de bord
          </button>
          <HeroTitle>
            <Bell size={22} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.5rem' }} />
            Mes notifications
          </HeroTitle>
          <HeroSub>{notifs.length} notification{notifs.length > 1 ? 's' : ''} au total · {unread} non lue{unread > 1 ? 's' : ''}</HeroSub>
        </div>
      </Hero>

      <Content>
        <Stats>
          <StatBox>
            <StatNum>{notifs.length}</StatNum>
            <StatLbl>Total</StatLbl>
          </StatBox>
          <StatBox>
            <StatNum style={{ color:'#2A7DE1' }}>{unread}</StatNum>
            <StatLbl>Non lues</StatLbl>
          </StatBox>
          <StatBox>
            <StatNum style={{ color:'#059669' }}>{notifs.length - unread}</StatNum>
            <StatLbl>Lues</StatLbl>
          </StatBox>
        </Stats>

        <Toolbar>
          <FilterRow>
            {FILTERS.map(f => (
              <FilterBtn key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </FilterBtn>
            ))}
          </FilterRow>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <ActionBtn onClick={load} disabled={loading}>
              <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Actualiser
            </ActionBtn>
            {unread > 0 && (
              <ActionBtn onClick={handleMarkAll}>
                <CheckCheck size={13} /> Tout marquer lu
              </ActionBtn>
            )}
          </div>
        </Toolbar>

        <Card>
          {loading ? (
            <Empty><div className="e">⏳</div><p>Chargement…</p></Empty>
          ) : filtered.length === 0 ? (
            <Empty>
              <div className="e">🔔</div>
              <p>{filter === 'all' ? 'Aucune notification pour le moment.' : 'Aucune notification dans cette catégorie.'}</p>
            </Empty>
          ) : (
            filtered.map(n => {
              const meta = ICONS[n.type] || ICONS.default;
              const Icon = meta.icon;
              return (
                <NotifItem key={n.id} $unread={!n.lue} onClick={() => !n.lue && handleMarkOne(n.id)}>
                  <IconBox $bg={meta.bg} $color={meta.color}><Icon size={18} /></IconBox>
                  <Body>
                    <Msg $unread={!n.lue}>{n.message}</Msg>
                    <Meta>
                      <Time>{fmtTime(n.dateEnvoi)}</Time>
                      <TypeTag $bg={meta.tagBg} $color={meta.tagColor}>{meta.tag}</TypeTag>
                    </Meta>
                  </Body>
                  {!n.lue && <UnreadDot />}
                </NotifItem>
              );
            })
          )}
        </Card>
      </Content>
    </Page>
  );
};

export default MesNotifications;
