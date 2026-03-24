import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import {
  Scale, Zap, Smile, CheckCircle2, Plus, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import AppNav from '../components/AppNav';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;
const popIn = keyframes`
  from { opacity:0; transform:scale(0.88); }
  to   { opacity:1; transform:scale(1); }
`;

/* ── Layout ── */
const Page = styled.div`min-height:100vh;background:#F8FAFF;padding-bottom:5rem;`;
const Content = styled.div`
  max-width:1060px;width:100%;margin:0 auto;padding:2.5rem 2.5rem;
  @media(max-width:768px){padding:1.75rem 1.25rem;}
  @media(max-width:480px){padding:1.25rem 1rem;}
`;

/* ── Header ── */
const PageTitle = styled.h1`
  font-size:clamp(1.5rem,3vw,2rem);font-weight:900;color:#0F172A;
  letter-spacing:-0.02em;margin-bottom:0.3rem;
  animation:${fadeInUp} 0.4s ease both;
`;
const PageSub = styled.p`
  font-size:0.88rem;color:#64748b;margin-bottom:2rem;
  animation:${fadeInUp} 0.4s ease 0.05s both;
`;

/* ── Date nav ── */
const DateNav = styled.div`
  display:flex;align-items:center;justify-content:center;gap:1rem;
  background:white;border-radius:16px;padding:0.85rem 1.5rem;
  border:1.5px solid rgba(42,125,225,0.08);margin-bottom:2rem;
  box-shadow:0 2px 12px rgba(0,0,0,0.04);
  animation:${fadeInUp} 0.4s ease 0.08s both;
`;
const NavBtn = styled.button`
  background:none;border:none;cursor:pointer;
  color:#2A7DE1;display:flex;align-items:center;padding:0.3rem;
  border-radius:8px;transition:background 0.15s;
  &:hover{background:rgba(42,125,225,0.08);}
`;
const DateLabel = styled.div`
  font-size:1rem;font-weight:800;color:#0F172A;min-width:160px;text-align:center;
`;
const TodayBadge = styled.span`
  font-size:0.7rem;font-weight:700;background:rgba(42,125,225,0.1);
  color:#2A7DE1;border-radius:9999px;padding:0.15rem 0.55rem;margin-left:0.5rem;
`;

/* ── Form card ── */
const FormCard = styled.div`
  background:white;border-radius:22px;padding:2rem;
  border:1.5px solid rgba(42,125,225,0.08);
  box-shadow:0 2px 16px rgba(0,0,0,0.05);
  animation:${fadeInUp} 0.45s ease 0.1s both;
`;
const FormSection = styled.div`margin-bottom:2rem;&:last-child{margin-bottom:0;}`;
const Label = styled.div`
  display:flex;align-items:center;gap:0.5rem;
  font-size:0.9rem;font-weight:800;color:#0F172A;margin-bottom:1rem;
`;
const LabelIcon = styled.div`
  width:30px;height:30px;border-radius:9px;
  background:${p=>p.bg};display:flex;align-items:center;justify-content:center;
  color:${p=>p.color};
`;

/* Poids */
const WeightRow = styled.div`display:flex;align-items:center;gap:1rem;`;
const WeightInput = styled.input`
  width:120px;padding:0.7rem 1rem;border-radius:12px;
  border:2px solid rgba(42,125,225,0.15);font-size:1.1rem;font-weight:800;
  color:#0F172A;text-align:center;outline:none;transition:border 0.2s;
  &:focus{border-color:#2A7DE1;}
  &::-webkit-inner-spin-button{-webkit-appearance:none;}
`;
const WeightUnit = styled.span`font-size:1rem;font-weight:700;color:#64748b;`;

/* Énergie slider */
const SliderWrap = styled.div`position:relative;padding-bottom:1.5rem;`;
const Slider = styled.input`
  width:100%;-webkit-appearance:none;height:8px;border-radius:9999px;
  background:linear-gradient(to right,#2A7DE1 ${p=>((p.value-1)/9)*100}%,#E2E8F0 ${p=>((p.value-1)/9)*100}%);
  outline:none;cursor:pointer;
  &::-webkit-slider-thumb{
    -webkit-appearance:none;width:24px;height:24px;border-radius:50%;
    background:linear-gradient(135deg,#2A7DE1,#2ED1A2);
    box-shadow:0 4px 12px rgba(42,125,225,0.4);cursor:pointer;
  }
`;
const SliderLabels = styled.div`
  display:flex;justify-content:space-between;margin-top:0.5rem;
  font-size:0.72rem;color:#94a3b8;font-weight:600;
`;
const EnergyValue = styled.span`
  font-size:1.5rem;font-weight:900;color:#2A7DE1;margin-left:1rem;
`;
const EnergyDesc = ['','Épuisé','Très fatigué','Fatigué','Peu d\'énergie','Moyen',
  'Correct','Bien','Très bien','Excellent','Au top ! 🚀'];

/* Humeur emoji */
const MoodGrid = styled.div`
  display:grid;grid-template-columns:repeat(5,1fr);gap:0.6rem;
  @media(max-width:400px){grid-template-columns:repeat(3,1fr);}
`;
const MoodBtn = styled.button`
  display:flex;flex-direction:column;align-items:center;gap:0.3rem;
  background:${p=>p.selected?'rgba(42,125,225,0.08)':'white'};
  border:2px solid ${p=>p.selected?'#2A7DE1':'rgba(42,125,225,0.1)'};
  border-radius:14px;padding:0.75rem 0.5rem;cursor:pointer;
  transition:all 0.18s;
  &:hover{border-color:#2A7DE1;transform:translateY(-2px);}
  ${p=>p.selected && css`animation:${popIn} 0.2s ease both;`}
`;
const MoodEmoji = styled.div`font-size:1.75rem;line-height:1;`;
const MoodLabel = styled.div`font-size:0.65rem;font-weight:700;color:${p=>p.selected?'#2A7DE1':'#94a3b8'};`;

const MOODS = [
  { key:'tres-bien',  tKey:'great',  emoji:'😄', label:'Très bien' },
  { key:'bien',       tKey:'good',   emoji:'🙂', label:'Bien' },
  { key:'moyen',      tKey:'okay',   emoji:'😐', label:'Moyen' },
  { key:'fatigue',    tKey:'tired',  emoji:'😴', label:'Fatigué' },
  { key:'difficile',  tKey:'hard',   emoji:'😣', label:'Difficile' },
];

/* Save button */
const SaveBtn = styled.button`
  width:100%;margin-top:2rem;
  background:linear-gradient(135deg,#2A7DE1,#2ED1A2);
  color:white;border:none;border-radius:14px;
  padding:1rem;font-size:1rem;font-weight:800;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:0.6rem;
  transition:transform 0.2s,box-shadow 0.2s;
  box-shadow:0 8px 24px -6px rgba(42,125,225,0.4);
  &:hover{transform:translateY(-2px);box-shadow:0 14px 32px -6px rgba(42,125,225,0.45);}
  &:disabled{opacity:0.5;cursor:default;transform:none;}
`;
const SuccessMsg = styled.div`
  display:flex;align-items:center;gap:0.5rem;justify-content:center;
  margin-top:1rem;font-size:0.88rem;font-weight:700;color:#059669;
  animation:${fadeInUp} 0.3s ease both;
`;

/* ── Historique ── */
const HistTitle = styled.h2`
  font-size:1.1rem;font-weight:900;color:#0F172A;
  margin:2.5rem 0 1rem;
`;
const HistList = styled.div`display:flex;flex-direction:column;gap:0.75rem;`;
const HistRow = styled.div`
  background:white;border-radius:16px;padding:1rem 1.25rem;
  border:1.5px solid rgba(42,125,225,0.07);
  display:flex;align-items:center;gap:1rem;flex-wrap:wrap;
  animation:${fadeInUp} 0.4s ease ${p=>p.delay||'0s'} both;
`;
const HistDate = styled.div`font-size:0.8rem;font-weight:700;color:#64748b;min-width:80px;`;
const HistChip = styled.div`
  display:inline-flex;align-items:center;gap:0.3rem;
  background:${p=>p.bg||'rgba(42,125,225,0.08)'};
  color:${p=>p.color||'#2A7DE1'};
  border-radius:9999px;padding:0.25rem 0.7rem;font-size:0.78rem;font-weight:700;
`;
const EmptyHist = styled.div`
  text-align:center;padding:2rem;color:#94a3b8;font-size:0.88rem;font-weight:600;
  background:white;border-radius:16px;border:1.5px solid rgba(42,125,225,0.07);
  .emoji{font-size:2rem;margin-bottom:0.5rem;}
`;

/* ── Helpers ── */
const toInputDate = (d) => d.toISOString().split('T')[0];
const formatDisplay = (d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR',
  { weekday:'long', day:'numeric', month:'long' });
const capitalize = (s) => s ? s[0].toUpperCase() + s.slice(1) : '';

const energyColor = (v) => v >= 8 ? '#059669' : v >= 5 ? '#D97706' : '#EF4444';
const poidsTrend = (suivis) => {
  const avecPoids = suivis.filter(s => s.poids).slice(0,2);
  if (avecPoids.length < 2) return null;
  return avecPoids[0].poids - avecPoids[1].poids;
};

export default function SuiviQuotidien() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [date, setDate] = useState(toInputDate(new Date()));
  const [poids, setPoids] = useState('');
  const [energie, setEnergie] = useState(7);
  const [humeur, setHumeur] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const [editId, setEditId] = useState(null);

  const isToday = date === toInputDate(new Date());

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API}/suivis`, auth());
      setHistory(res.data);
    } catch { /* silencieux */ }
  };

  useEffect(() => { loadHistory(); }, []);

  // Pré-remplir si une entrée existe déjà pour la date sélectionnée
  useEffect(() => {
    const existing = history.find(s => s.date === date);
    if (existing) {
      setPoids(existing.poids ?? '');
      setEnergie(existing.energie ?? 7);
      setHumeur(existing.humeur ?? '');
      setEditId(existing.id);
    } else {
      setPoids('');
      setEnergie(7);
      setHumeur('');
      setEditId(null);
    }
  }, [date, history]);

  const shiftDate = (days) => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + days);
    if (d <= new Date()) setDate(toInputDate(d));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const body = {
        date,
        ...(poids ? { poids: parseFloat(poids) } : {}),
        energie,
        ...(humeur ? { humeur } : {}),
      };
      if (editId) {
        await axios.patch(`${API}/suivis/${editId}`, body, auth());
      } else {
        await axios.post(`${API}/suivis`, body, auth());
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadHistory();
      // Notif objectif de poids atteint (si poids < poidsInitial et jamais envoyé)
      if (poids && user?.poidsInitial) {
        const current = parseFloat(poids);
        const initial = parseFloat(user.poidsInitial);
        const key = `fc_poids_notif_${user.id}`;
        const lastNotifPoids = parseFloat(localStorage.getItem(key) || '9999');
        if (current < initial && current < lastNotifPoids) {
          localStorage.setItem(key, current);
          const perte = (initial - current).toFixed(1);
          axios.post(`${API}/notifications`, {
            type: 'OBJECTIF_POIDS',
            message: `⚖️ Bravo ! Vous avez perdu ${perte} kg depuis le début. Continuez ! 💪`,
            dateEnvoi: new Date(),
          }, auth()).catch(() => {});
        }
      }
    } catch { /* erreur gérée silencieusement */ }
    setLoading(false);
  };

  const trend = poidsTrend(history);

  return (
    <Page>
      <AppNav />
      <Content>
        <PageTitle>{t('tracking.title')}</PageTitle>
        <PageSub>{t('tracking.subtitle')}</PageSub>

        {/* ── Navigation date ── */}
        <DateNav>
          <NavBtn onClick={() => shiftDate(-1)}><ChevronLeft size={20}/></NavBtn>
          <DateLabel>
            {capitalize(formatDisplay(date))}
            {isToday && <TodayBadge>{t('common.today')}</TodayBadge>}
          </DateLabel>
          <NavBtn onClick={() => shiftDate(1)} disabled={isToday}
            style={{ opacity: isToday ? 0.3 : 1 }}>
            <ChevronRight size={20}/>
          </NavBtn>
        </DateNav>

        {/* ── Formulaire ── */}
        <FormCard>
          {/* Poids */}
          <FormSection>
            <Label>
              <LabelIcon bg="rgba(59,130,246,0.1)" color="#3B82F6"><Scale size={16}/></LabelIcon>
              Poids du matin
              {trend !== null && (
                <span style={{ marginLeft:'auto', fontSize:'0.78rem', fontWeight:700,
                  color: trend < 0 ? '#059669' : trend > 0 ? '#EF4444' : '#94a3b8',
                  display:'flex', alignItems:'center', gap:'0.2rem' }}>
                  {trend < 0 ? <TrendingDown size={14}/> : trend > 0 ? <TrendingUp size={14}/> : <Minus size={14}/>}
                  {trend < 0 ? `−${Math.abs(trend).toFixed(1)}` : trend > 0 ? `+${trend.toFixed(1)}` : '='}kg
                </span>
              )}
            </Label>
            <WeightRow>
              <WeightInput type="number" step="0.1" min="30" max="300"
                placeholder="—" value={poids}
                onChange={e => setPoids(e.target.value)} />
              <WeightUnit>kg</WeightUnit>
            </WeightRow>
          </FormSection>

          {/* Énergie */}
          <FormSection>
            <Label>
              <LabelIcon bg="rgba(245,158,11,0.1)" color="#D97706"><Zap size={16}/></LabelIcon>
              {t('tracking.energy')}
              <EnergyValue>{energie}/10</EnergyValue>
              <span style={{ fontSize:'0.78rem', color: energyColor(energie), fontWeight:700, marginLeft:'0.25rem' }}>
                {EnergyDesc[energie]}
              </span>
            </Label>
            <SliderWrap>
              <Slider type="range" min="1" max="10" value={energie}
                onChange={e => setEnergie(Number(e.target.value))} />
              <SliderLabels><span>Épuisé</span><span>Au top</span></SliderLabels>
            </SliderWrap>
          </FormSection>

          {/* Humeur */}
          <FormSection>
            <Label>
              <LabelIcon bg="rgba(46,209,162,0.1)" color="#059669"><Smile size={16}/></LabelIcon>
              {t('tracking.mood')}
            </Label>
            <MoodGrid>
              {MOODS.map(m => (
                <MoodBtn key={m.key} selected={humeur === m.key} onClick={() => setHumeur(m.key)}>
                  <MoodEmoji>{m.emoji}</MoodEmoji>
                  <MoodLabel selected={humeur === m.key}>{t('tracking.moods.' + m.tKey)}</MoodLabel>
                </MoodBtn>
              ))}
            </MoodGrid>
          </FormSection>

          <SaveBtn onClick={handleSave} disabled={loading}>
            {loading ? 'Enregistrement…' : editId
              ? <><CheckCircle2 size={18}/> Mettre à jour</>
              : <><Plus size={18}/> Enregistrer</>}
          </SaveBtn>
          {success && (
            <SuccessMsg><CheckCircle2 size={16}/> Entrée enregistrée avec succès !</SuccessMsg>
          )}
        </FormCard>

        {/* ── Historique ── */}
        <HistTitle>{t('tracking.history')}</HistTitle>
        {history.length === 0 ? (
          <EmptyHist>
            <div className="emoji">📊</div>
            <div>Votre historique apparaîtra ici après votre premier enregistrement.</div>
          </EmptyHist>
        ) : (
          <HistList>
            {history.slice(0, 10).map((s, i) => {
              const mood = MOODS.find(m => m.key === s.humeur);
              return (
                <HistRow key={s.id} delay={`${i * 0.04}s`}>
                  <HistDate>{capitalize(formatDisplay(s.date))}</HistDate>
                  {s.poids && <HistChip bg="rgba(59,130,246,0.08)" color="#3B82F6">⚖️ {s.poids} kg</HistChip>}
                  {s.energie && <HistChip bg={`rgba(${s.energie>=8?'5,150,105':s.energie>=5?'217,119,6':'239,68,68'},0.1)`}
                    color={energyColor(s.energie)}>⚡ {s.energie}/10</HistChip>}
                  {mood && <HistChip bg="rgba(46,209,162,0.08)" color="#059669">{mood.emoji} {t('tracking.moods.' + mood.tKey)}</HistChip>}
                </HistRow>
              );
            })}
          </HistList>
        )}
      </Content>
    </Page>
  );
}
