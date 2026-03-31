import { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { Users, TrendingUp, Clock, Activity, LogIn, LogOut, AlertTriangle, RefreshCw } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

/* ─── Animations ── */
const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
`;

/* ─── Grille stats ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 1rem; margin-bottom: 1.5rem;
  @media(max-width:1100px){ grid-template-columns:repeat(2,1fr); }
  @media(max-width:540px) { grid-template-columns:1fr; }
`;
const StatCard = styled.div`
  background:white; border-radius:16px; padding:1.25rem 1.5rem;
  box-shadow:0 1px 8px rgba(0,0,0,0.05);
  display:flex; align-items:center; gap:1rem;
  animation:${fadeInUp} 0.4s ease ${p=>p.$delay||'0s'} both;
  border-left: 4px solid ${p=>p.$color||'#2A7DE1'};
`;
const IconWrap = styled.div`
  width:44px; height:44px; border-radius:12px; flex-shrink:0;
  background:${p=>p.$bg}; display:flex; align-items:center; justify-content:center;
`;
const StatVal  = styled.div`font-size:1.8rem; font-weight:900; color:#0F172A; line-height:1;`;
const StatLbl  = styled.div`font-size:0.78rem; font-weight:600; color:#64748b; margin-top:0.25rem;`;

/* ─── Deux colonnes ── */
const TwoCol = styled.div`
  display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;
  @media(max-width:900px){ grid-template-columns:1fr; }
`;

/* ─── Cards ── */
const Panel = styled.div`
  background:white; border-radius:18px;
  box-shadow:0 1px 8px rgba(0,0,0,0.05); overflow:hidden;
  animation:${fadeInUp} 0.4s ease 0.15s both;
`;
const PanelHead = styled.div`
  padding:1rem 1.5rem; border-bottom:1px solid #F1F5F9;
  display:flex; align-items:center; justify-content:space-between;
`;
const PanelTitle = styled.h3`
  font-size:0.9rem; font-weight:800; color:#0F172A;
  display:flex; align-items:center; gap:0.5rem;
`;
const RefreshBtn = styled.button`
  background:none; border:none; color:#94a3b8; cursor:pointer; padding:0.25rem;
  border-radius:6px; transition:color 0.15s;
  &:hover{ color:#2A7DE1; }
`;

/* ─── Table logs ── */
const LogTable = styled.table`width:100%; border-collapse:collapse;`;
const LogTh = styled.th`
  padding:0.6rem 1rem; text-align:left; font-size:0.7rem; font-weight:700;
  color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em;
  background:#FAFCFF; border-bottom:1px solid #F1F5F9;
`;
const LogTr = styled.tr`
  border-bottom:1px solid #F8FAFF;
  &:last-child{ border-bottom:none; }
  &:hover{ background:#FAFCFF; }
`;
const LogTd = styled.td`padding:0.65rem 1rem; font-size:0.82rem; color:#374151;`;

const TypeBadge = styled.span`
  display:inline-flex; align-items:center; gap:0.3rem;
  padding:0.18rem 0.65rem; border-radius:9999px;
  font-size:0.7rem; font-weight:700;
  background:${p=>p.$bg}; color:${p=>p.$color};
`;

const Empty = styled.div`
  padding:2.5rem; text-align:center; color:#94a3b8; font-size:0.85rem;
`;

/* ─── Activity bar chart ── */
const BarChart = styled.div`
  display:flex; align-items:flex-end; gap:0.5rem;
  padding:1.25rem 1.5rem; height:120px;
`;
const Bar = styled.div`
  flex:1; background:${p=>p.$color||'#2A7DE1'}; border-radius:6px 6px 0 0;
  height:${p=>p.$pct||0}%; min-height:4px;
  position:relative; cursor:default;
  transition:opacity 0.2s;
  &:hover{ opacity:0.8; }
`;
const BarLabel = styled.div`
  text-align:center; font-size:0.65rem; font-weight:700;
  color:#94a3b8; margin-top:0.35rem;
`;
const BarWrap = styled.div`flex:1; display:flex; flex-direction:column; justify-content:flex-end;`;

const TYPE_META = {
  LOGIN:          { label:'Connexion',     bg:'rgba(16,185,129,0.1)',  color:'#059669' },
  LOGOUT:         { label:'Déconnexion',   bg:'rgba(100,116,139,0.1)', color:'#475569' },
  LOGIN_FAILED:   { label:'Échec',         bg:'rgba(239,68,68,0.1)',   color:'#DC2626' },
  PASSWORD_RESET: { label:'Réinit. MDP',  bg:'rgba(245,158,11,0.1)',  color:'#D97706' },
};

const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
};

const AdminDashboard = () => {
  const [stats,         setStats]         = useState(null);
  const [actStats,      setActStats]      = useState(null);
  const [logs,          setLogs]          = useState([]);
  const [loadingStats,  setLoadingStats]  = useState(true);
  const [loadingLogs,   setLoadingLogs]   = useState(true);

  const loadAll = async () => {
    setLoadingStats(true);
    setLoadingLogs(true);
    try {
      const [s, a] = await Promise.all([
        axios.get(`${API}/admin/stats`,      authHeader()),
        axios.get(`${API}/admin/logs/stats`, authHeader()),
      ]);
      setStats(s.data.stats);
      setActStats(a.data.activityStats);
      setLogs(a.data.recentLogs || []);
    } catch(e) { console.error(e); }
    finally { setLoadingStats(false); setLoadingLogs(false); }
  };

  useEffect(() => { loadAll(); }, []);

  /* bar chart : max pour normaliser */
  const barData = actStats ? [
    { key:'Connexions',   val: actStats.totalLogins,  color:'#2ED1A2' },
    { key:'Déconnexions', val: actStats.logouts,       color:'#2A7DE1' },
    { key:'Échecs',       val: actStats.failedLogins,  color:'#EF4444' },
  ] : [];
  const maxBar = Math.max(...barData.map(b=>b.val), 1);

  const STAT_CARDS = [
    { key:'totalUsers',    label:'Utilisateurs',       Icon:Users,         bg:'rgba(42,125,225,0.1)',  color:'#2A7DE1', delay:'0s'    },
    { key:'newUsersMonth', label:'Inscrits ce mois',   Icon:TrendingUp,    bg:'rgba(46,209,162,0.1)',  color:'#10B981', delay:'0.05s' },
    { key:'totalJeunes',   label:'Jeûnes enregistrés', Icon:Clock,         bg:'rgba(245,158,11,0.1)',  color:'#F59E0B', delay:'0.1s'  },
    { key:'jeunesActifs',  label:'Jeûnes actifs',      Icon:Activity,      bg:'rgba(239,68,68,0.1)',   color:'#EF4444', delay:'0.15s' },
  ];

  return (
    <AdminLayout title="Vue globale">

      {/* ── Stat cards ── */}
      <StatsGrid>
        {STAT_CARDS.map(({ key, label, Icon, bg, color, delay }) => (
          <StatCard key={key} $color={color} $delay={delay}>
            <IconWrap $bg={bg}><Icon size={20} color={color} /></IconWrap>
            <div>
              <StatVal>{loadingStats ? '—' : (stats?.[key] ?? 0)}</StatVal>
              <StatLbl>{label}</StatLbl>
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      <TwoCol>

        {/* ── Activité 30 jours ── */}
        <Panel>
          <PanelHead>
            <PanelTitle><Activity size={15} /> Activité — 30 derniers jours</PanelTitle>
            <RefreshBtn onClick={loadAll}><RefreshCw size={14} /></RefreshBtn>
          </PanelHead>
          {loadingStats ? <Empty>Chargement…</Empty> : (
            <>
              <BarChart>
                {barData.map(b => (
                  <BarWrap key={b.key}>
                    <Bar $color={b.color} $pct={Math.max((b.val/maxBar)*100, b.val>0?8:0)} title={`${b.key}: ${b.val}`} />
                  </BarWrap>
                ))}
              </BarChart>
              <div style={{ display:'flex', gap:'1.5rem', padding:'0 1.5rem 1.25rem', flexWrap:'wrap' }}>
                {barData.map(b => (
                  <div key={b.key} style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:b.color }} />
                    <span style={{ fontSize:'0.75rem', color:'#64748b', fontWeight:600 }}>{b.key} ({b.val})</span>
                  </div>
                ))}
              </div>

              {/* Mini stats connexion */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderTop:'1px solid #F1F5F9' }}>
                {[
                  { Icon:LogIn,         label:'Connexions',   val:actStats?.totalLogins,  color:'#059669' },
                  { Icon:LogOut,        label:'Déconnexions', val:actStats?.logouts,       color:'#475569' },
                  { Icon:AlertTriangle, label:'Échecs',       val:actStats?.failedLogins,  color:'#DC2626' },
                ].map(({ Icon, label, val, color }) => (
                  <div key={label} style={{ padding:'1rem', textAlign:'center', borderRight:'1px solid #F1F5F9' }}>
                    <Icon size={18} color={color} style={{ marginBottom:4 }} />
                    <div style={{ fontSize:'1.3rem', fontWeight:900, color:'#0F172A' }}>{val ?? '—'}</div>
                    <div style={{ fontSize:'0.72rem', color:'#94a3b8', fontWeight:600 }}>{label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>

        {/* ── Dernières activités ── */}
        <Panel>
          <PanelHead>
            <PanelTitle><LogIn size={15} /> Dernières activités</PanelTitle>
            <RefreshBtn onClick={loadAll}><RefreshCw size={14} /></RefreshBtn>
          </PanelHead>
          {loadingLogs ? <Empty>Chargement…</Empty>
          : logs.length === 0 ? <Empty>Aucune activité enregistrée</Empty>
          : (
            <div style={{ overflowX:'auto', maxHeight:320, overflowY:'auto' }}>
              <LogTable>
                <thead>
                  <tr>
                    <LogTh>Type</LogTh>
                    <LogTh>Email</LogTh>
                    <LogTh>Détails</LogTh>
                    <LogTh>Date & heure</LogTh>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(l => {
                    const meta = TYPE_META[l.type] || { label:l.type, bg:'#F1F5F9', color:'#64748b' };
                    return (
                      <LogTr key={l.id}>
                        <LogTd>
                          <TypeBadge $bg={meta.bg} $color={meta.color}>{meta.label}</TypeBadge>
                        </LogTd>
                        <LogTd style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {l.email || '—'}
                        </LogTd>
                        <LogTd style={{ color:'#94a3b8', fontSize:'0.78rem' }}>{l.details || '—'}</LogTd>
                        <LogTd style={{ whiteSpace:'nowrap', color:'#64748b' }}>{fmt(l.createdAt)}</LogTd>
                      </LogTr>
                    );
                  })}
                </tbody>
              </LogTable>
            </div>
          )}
        </Panel>

      </TwoCol>
    </AdminLayout>
  );
};

export default AdminDashboard;
