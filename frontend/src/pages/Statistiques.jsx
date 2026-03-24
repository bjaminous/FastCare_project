import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Flame, Scale, Zap, Smile,
  Trophy, Calendar, Timer, BarChart2, RefreshCw,
} from 'lucide-react';
import AppNav from '../components/AppNav';

const API = 'http://localhost:5000/api';
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

/* ── Layout ── */
const Page = styled.div`min-height:100vh;background:#F8FAFF;padding-bottom:5rem;`;
const PageHeader = styled.div`
  display:flex;align-items:flex-start;justify-content:space-between;
  margin-bottom:2rem;flex-wrap:wrap;gap:1rem;
  animation:${fadeInUp} 0.4s ease both;
`;
const RefreshBtn = styled.button`
  display:flex;align-items:center;gap:0.4rem;
  background:white;border:1.5px solid rgba(42,125,225,0.15);
  border-radius:10px;padding:0.55rem 1rem;
  font-size:0.83rem;font-weight:700;color:#2A7DE1;cursor:pointer;
  transition:background 0.15s;&:hover{background:rgba(42,125,225,0.05);}
`;
const Content = styled.div`
  max-width:1280px;width:100%;margin:0 auto;padding:2.5rem 2.5rem;
  @media(max-width:768px){padding:1.75rem 1.25rem;}
  @media(max-width:480px){padding:1.25rem 1rem;}
`;
const PageTitle = styled.h1`
  font-size:clamp(1.5rem,3vw,2rem);font-weight:900;color:#0F172A;
  letter-spacing:-0.02em;margin-bottom:0.25rem;
  animation:${fadeInUp} 0.4s ease both;
`;
const PageSub = styled.p`
  font-size:0.88rem;color:#64748b;margin-bottom:2rem;
  animation:${fadeInUp} 0.4s ease 0.04s both;
`;

/* ── KPI cards ── */
const KpiGrid = styled.div`
  display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;
  animation:${fadeInUp} 0.45s ease 0.06s both;
  @media(max-width:900px){grid-template-columns:repeat(2,1fr);}
  @media(max-width:480px){grid-template-columns:repeat(2,1fr);gap:0.75rem;}
`;
const KpiCard = styled.div`
  background:white;border-radius:18px;padding:1.25rem;
  border:1.5px solid rgba(42,125,225,0.07);
  box-shadow:0 2px 12px rgba(0,0,0,0.04);
`;
const KpiIcon = styled.div`
  width:36px;height:36px;border-radius:10px;
  background:${p=>p.bg};color:${p=>p.color};
  display:flex;align-items:center;justify-content:center;margin-bottom:0.7rem;
`;
const KpiValue = styled.div`font-size:1.6rem;font-weight:900;color:#0F172A;line-height:1;`;
const KpiLabel = styled.div`font-size:0.75rem;color:#64748b;font-weight:600;margin-top:0.3rem;`;
const KpiTrend = styled.div`
  display:flex;align-items:center;gap:0.25rem;
  font-size:0.72rem;font-weight:700;margin-top:0.4rem;
  color:${p=>p.positive?'#059669':'#EF4444'};
`;

/* ── Section ── */
const TwoCol = styled.div`
  display:grid;grid-template-columns:1.4fr 1fr;gap:1.5rem;margin-bottom:1.5rem;
  @media(max-width:900px){grid-template-columns:1fr;}
`;
const ChartCard = styled.div`
  background:white;border-radius:20px;padding:1.5rem;
  border:1.5px solid rgba(42,125,225,0.07);
  box-shadow:0 2px 14px rgba(0,0,0,0.04);
  animation:${fadeInUp} 0.5s ease ${p=>p.delay||'0.08s'} both;
`;
const ChartTitle = styled.div`
  display:flex;align-items:center;gap:0.5rem;
  font-size:0.95rem;font-weight:800;color:#0F172A;margin-bottom:1.25rem;
`;
const ChartIcon = styled.div`
  width:28px;height:28px;border-radius:8px;
  background:${p=>p.bg};color:${p=>p.color};
  display:flex;align-items:center;justify-content:center;
`;

/* ── Empty state ── */
const EmptyChart = styled.div`
  height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  color:#94a3b8;gap:0.5rem;
  .emoji{font-size:2rem;}
  p{font-size:0.82rem;font-weight:600;}
`;

/* ── Mood donut ── */
const MoodGrid = styled.div`display:flex;flex-direction:column;gap:0.6rem;`;
const MoodRow = styled.div`
  display:flex;align-items:center;gap:0.75rem;
`;
const MoodEmoji = styled.div`font-size:1.2rem;min-width:24px;text-align:center;`;
const MoodBar = styled.div`
  flex:1;height:8px;border-radius:9999px;background:#F1F5F9;overflow:hidden;
`;
const MoodFill = styled.div`
  height:100%;border-radius:9999px;
  background:${p=>p.color};
  width:${p=>p.pct}%;
  transition:width 0.8s ease;
`;
const MoodCount = styled.div`font-size:0.78rem;font-weight:700;color:#64748b;min-width:28px;text-align:right;`;

/* ── Streak banner ── */
const StreakCard = styled.div`
  background:linear-gradient(135deg,#FEF3C7,#FDE68A);
  border:1.5px solid rgba(245,158,11,0.3);
  border-radius:18px;padding:1.25rem 1.5rem;
  display:flex;align-items:center;gap:1rem;
  margin-bottom:1.5rem;
  animation:${fadeInUp} 0.5s ease 0.1s both;
`;

/* ── Tooltip custom ── */
const CustomTooltipBox = styled.div`
  background:white;border:1.5px solid rgba(42,125,225,0.15);
  border-radius:10px;padding:0.6rem 0.9rem;
  box-shadow:0 4px 16px rgba(0,0,0,0.08);
  font-size:0.8rem;font-weight:700;color:#0F172A;
`;

/* ── Helpers ── */
const MOODS = [
  { key:'tres-bien', emoji:'😄', label:'Très bien', color:'#059669' },
  { key:'bien',      emoji:'🙂', label:'Bien',      color:'#2A7DE1' },
  { key:'moyen',     emoji:'😐', label:'Moyen',     color:'#D97706' },
  { key:'fatigue',   emoji:'😴', label:'Fatigué',   color:'#F59E0B' },
  { key:'difficile', emoji:'😣', label:'Difficile', color:'#EF4444' },
];

const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' });
const fmtDateFull = (d) => new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });

const calcStreak = (fasts) => {
  const days = [...new Set(fasts.map(j =>
    new Date(j.dateDebut).toISOString().split('T')[0]
  ))].sort().reverse();
  let count = 0;
  let cursor = new Date(); cursor.setHours(0,0,0,0);
  for (const d of days) {
    const day = new Date(d + 'T00:00:00');
    const diff = Math.round((cursor - day) / 86400000);
    if (diff <= 1) { count++; cursor = day; } else break;
  }
  return count;
};

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <CustomTooltipBox>
      <div style={{ color:'#64748b', marginBottom:'0.2rem' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.value}{unit || ''}</div>
      ))}
    </CustomTooltipBox>
  );
};

export default function Statistiques() {
  const { t } = useTranslation();
  const [jeunes,  setJeunes]  = useState([]);
  const [suivis,  setSuivis]  = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rj, rs] = await Promise.all([
        axios.get(`${API}/jeunes`,  authH()),
        axios.get(`${API}/suivis`,  authH()),
      ]);
      setJeunes(rj.data || []);
      setSuivis(rs.data || []);
    } catch { /* silencieux */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Computed ── */
  const termines = jeunes.filter(j => j.statut === 'TERMINE' && j.dateFin);

  const totalFasts = termines.length;
  const totalHours = termines.reduce((acc, j) =>
    acc + (new Date(j.dateFin) - new Date(j.dateDebut)) / 3600000, 0
  );
  const avgHours = totalFasts > 0 ? totalHours / totalFasts : 0;
  const bestFast = termines.length > 0
    ? Math.max(...termines.map(j => (new Date(j.dateFin) - new Date(j.dateDebut)) / 3600000))
    : 0;
  const streak = calcStreak(termines);

  /* Chart : durées des jeûnes (30 derniers) */
  const fastChartData = [...termines].reverse().slice(-30).map((j, i) => ({
    name: fmtDate(j.dateDebut),
    heures: parseFloat(((new Date(j.dateFin) - new Date(j.dateDebut)) / 3600000).toFixed(1)),
  }));

  /* Chart : poids (suivi) */
  const poidsData = [...suivis]
    .filter(s => s.poids)
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(-20)
    .map(s => ({ name: fmtDate(s.date), poids: s.poids }));

  /* Chart : énergie */
  const energieData = [...suivis]
    .filter(s => s.energie)
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(-20)
    .map(s => ({ name: fmtDate(s.date), energie: s.energie }));

  /* Mood distribution */
  const moodCounts = {};
  suivis.forEach(s => { if (s.humeur) moodCounts[s.humeur] = (moodCounts[s.humeur] || 0) + 1; });
  const moodMax = Math.max(1, ...Object.values(moodCounts));

  /* Poids trend */
  const derniersPoids = poidsData.slice(-2);
  const poidsTrend = derniersPoids.length === 2
    ? derniersPoids[1].poids - derniersPoids[0].poids : null;

  const isEmpty = totalFasts === 0 && suivis.length === 0;

  return (
    <Page>
      <AppNav />
      <Content>
        <PageHeader>
          <div>
            <PageTitle>Mes statistiques</PageTitle>
            <PageSub>{t('stats.subtitle')}</PageSub>
          </div>
          <RefreshBtn onClick={loadData}>
            <RefreshCw size={14}/> Actualiser
          </RefreshBtn>
        </PageHeader>

        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', fontWeight:600 }}>
            Chargement de vos statistiques…
          </div>
        ) : isEmpty ? (
          <ChartCard style={{ textAlign:'center', padding:'4rem 2rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📊</div>
            <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#0F172A', marginBottom:'0.5rem' }}>
              {t('stats.noData')}
            </div>
            <div style={{ fontSize:'0.88rem', color:'#64748b' }}>
              Complétez votre premier jeûne et votre premier suivi pour voir vos statistiques ici.
            </div>
          </ChartCard>
        ) : (
          <>
            {/* ── Streak ── */}
            {streak >= 2 && (
              <StreakCard>
                <span style={{ fontSize:'2rem' }}>🔥</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:900, color:'#92400E', fontSize:'0.95rem' }}>
                    {streak} jours consécutifs — vous êtes en feu !
                  </div>
                  <div style={{ fontSize:'0.78rem', color:'#B45309', marginTop:'0.15rem' }}>
                    Continuez, votre corps s'adapte de mieux en mieux.
                  </div>
                </div>
                <Trophy size={22} color="#D97706" />
              </StreakCard>
            )}

            {/* ── KPIs ── */}
            <KpiGrid>
              {[
                {
                  icon: Timer, bg:'rgba(42,125,225,0.1)', color:'#2A7DE1',
                  value: totalFasts, label: t('stats.totalFasts'),
                  trend: null,
                },
                {
                  icon: Flame, bg:'rgba(239,68,68,0.1)', color:'#EF4444',
                  value: `${Math.round(totalHours)}${t('common.hours')}`, label: t('stats.totalHours'),
                  trend: null,
                },
                {
                  icon: BarChart2, bg:'rgba(139,92,246,0.1)', color:'#7C3AED',
                  value: `${avgHours.toFixed(1)}${t('common.hours')}`, label: t('stats.avgDuration'),
                  trend: null,
                },
                {
                  icon: Trophy, bg:'rgba(245,158,11,0.1)', color:'#D97706',
                  value: `${bestFast.toFixed(1)}h`, label: t('stats.bestFast'),
                  trend: null,
                },
              ].map((k, i) => {
                const Icon = k.icon;
                return (
                  <KpiCard key={i}>
                    <KpiIcon bg={k.bg} color={k.color}><Icon size={17}/></KpiIcon>
                    <KpiValue>{k.value}</KpiValue>
                    <KpiLabel>{k.label}</KpiLabel>
                  </KpiCard>
                );
              })}
            </KpiGrid>

            {/* ── Jeûnes + Poids ── */}
            <TwoCol>
              <ChartCard delay="0.08s">
                <ChartTitle>
                  <ChartIcon bg="rgba(42,125,225,0.1)" color="#2A7DE1"><Timer size={14}/></ChartIcon>
                  {t('stats.fastingHistory')}
                </ChartTitle>
                {fastChartData.length === 0 ? (
                  <EmptyChart><div className="emoji">⏱</div><p>Aucun jeûne terminé</p></EmptyChart>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={fastChartData} barSize={fastChartData.length > 10 ? 8 : 18}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize:11, fill:'#94a3b8' }} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} tickLine={false} axisLine={false} unit="h" />
                      <Tooltip content={<CustomTooltip unit="h" />} />
                      <Bar dataKey="heures" radius={[6,6,0,0]}>
                        {fastChartData.map((_, i) => (
                          <Cell key={i}
                            fill={`url(#gradBar)`}
                            opacity={i === fastChartData.length - 1 ? 1 : 0.6 + (i / fastChartData.length) * 0.4}
                          />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2A7DE1" />
                          <stop offset="100%" stopColor="#2ED1A2" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <ChartCard delay="0.12s">
                <ChartTitle>
                  <ChartIcon bg="rgba(46,209,162,0.1)" color="#059669"><Smile size={14}/></ChartIcon>
                  {t('stats.moodDistribution')}
                </ChartTitle>
                {Object.keys(moodCounts).length === 0 ? (
                  <EmptyChart><div className="emoji">😊</div><p>Aucun suivi d'humeur</p></EmptyChart>
                ) : (
                  <MoodGrid style={{ marginTop:'0.5rem' }}>
                    {MOODS.map(m => {
                      const count = moodCounts[m.key] || 0;
                      if (!count) return null;
                      return (
                        <MoodRow key={m.key}>
                          <MoodEmoji>{m.emoji}</MoodEmoji>
                          <MoodBar>
                            <MoodFill color={m.color} pct={(count / moodMax) * 100} />
                          </MoodBar>
                          <MoodCount>{count}</MoodCount>
                        </MoodRow>
                      );
                    })}
                  </MoodGrid>
                )}
              </ChartCard>
            </TwoCol>

            {/* ── Poids + Énergie ── */}
            <TwoCol>
              <ChartCard delay="0.14s">
                <ChartTitle>
                  <ChartIcon bg="rgba(59,130,246,0.1)" color="#3B82F6"><Scale size={14}/></ChartIcon>
                  {t('stats.weightEvolution')}
                  {poidsTrend !== null && (
                    <span style={{
                      marginLeft:'auto', fontSize:'0.78rem', fontWeight:700,
                      color: poidsTrend < 0 ? '#059669' : poidsTrend > 0 ? '#EF4444' : '#94a3b8',
                      display:'flex', alignItems:'center', gap:'0.2rem'
                    }}>
                      {poidsTrend < 0 ? <TrendingDown size={13}/> : <TrendingUp size={13}/>}
                      {poidsTrend > 0 ? '+' : ''}{poidsTrend.toFixed(1)} kg
                    </span>
                  )}
                </ChartTitle>
                {poidsData.length < 2 ? (
                  <EmptyChart><div className="emoji">⚖️</div><p>2 pesées minimum pour voir la courbe</p></EmptyChart>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={poidsData}>
                      <defs>
                        <linearGradient id="gradPoids" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize:11, fill:'#94a3b8' }} tickLine={false} />
                      <YAxis
                        tick={{ fontSize:11, fill:'#94a3b8' }} tickLine={false} axisLine={false}
                        domain={['auto', 'auto']} unit="kg"
                      />
                      <Tooltip content={<CustomTooltip unit=" kg" />} />
                      <Area dataKey="poids" stroke="#3B82F6" strokeWidth={2.5}
                        fill="url(#gradPoids)" dot={{ r:4, fill:'#3B82F6', strokeWidth:0 }}
                        activeDot={{ r:6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <ChartCard delay="0.18s">
                <ChartTitle>
                  <ChartIcon bg="rgba(245,158,11,0.1)" color="#D97706"><Zap size={14}/></ChartIcon>
                  {t('stats.energyLevel')}
                </ChartTitle>
                {energieData.length < 2 ? (
                  <EmptyChart><div className="emoji">⚡</div><p>2 entrées minimum pour voir la courbe</p></EmptyChart>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={energieData}>
                      <defs>
                        <linearGradient id="gradEnergie" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#D97706" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize:11, fill:'#94a3b8' }} tickLine={false} />
                      <YAxis domain={[1,10]} ticks={[1,3,5,7,10]}
                        tick={{ fontSize:11, fill:'#94a3b8' }} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip unit="/10" />} />
                      <Area dataKey="energie" stroke="#D97706" strokeWidth={2.5}
                        fill="url(#gradEnergie)" dot={{ r:4, fill:'#D97706', strokeWidth:0 }}
                        activeDot={{ r:6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </TwoCol>

            {/* ── Calendrier activité (heatmap simplifié) ── */}
            <ChartCard delay="0.2s">
              <ChartTitle>
                <ChartIcon bg="rgba(42,125,225,0.1)" color="#2A7DE1"><Calendar size={14}/></ChartIcon>
                {t('stats.activityHeatmap')}
              </ChartTitle>
              <ActivityHeatmap jeunes={termines} />
            </ChartCard>
          </>
        )}
      </Content>
    </Page>
  );
}

/* ── Mini heatmap 30j ── */
function ActivityHeatmap({ jeunes }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const fastsByDay = {};
  jeunes.forEach(j => {
    const day = new Date(j.dateDebut).toISOString().split('T')[0];
    if (!fastsByDay[day]) fastsByDay[day] = 0;
    fastsByDay[day]++;
  });

  return (
    <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
      {days.map(day => {
        const count = fastsByDay[day] || 0;
        const today = new Date().toISOString().split('T')[0];
        return (
          <div key={day} title={`${new Date(day + 'T12:00:00').toLocaleDateString('fr-FR', { day:'numeric', month:'short' })} · ${count} jeûne${count > 1 ? 's' : ''}`}
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: count > 0
                ? `rgba(42,125,225,${Math.min(0.2 + count * 0.4, 1)})`
                : day === today ? 'rgba(42,125,225,0.08)' : '#F1F5F9',
              border: day === today ? '2px solid rgba(42,125,225,0.3)' : '2px solid transparent',
              cursor: 'default',
              transition: 'transform 0.1s',
            }}
          />
        );
      })}
      <div style={{ width:'100%', display:'flex', justifyContent:'space-between',
        fontSize:'0.72rem', color:'#94a3b8', fontWeight:600, marginTop:'0.5rem' }}>
        <span>il y a 30 jours</span>
        <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          Moins <div style={{ width:14, height:14, borderRadius:3, background:'#F1F5F9', display:'inline-block' }}/>&nbsp;
          <div style={{ width:14, height:14, borderRadius:3, background:'rgba(42,125,225,0.3)', display:'inline-block' }}/>&nbsp;
          <div style={{ width:14, height:14, borderRadius:3, background:'rgba(42,125,225,0.9)', display:'inline-block' }}/> Plus
        </span>
      </div>
    </div>
  );
}
