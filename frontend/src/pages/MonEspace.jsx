import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import {
  User, Mail, Phone, Calendar, Weight,
  Edit3, Heart, Scale,
  Moon, Brain, CheckCircle, Save, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppNav from '../components/AppNav';

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #F8FAFF;
`;

const TopBar = styled.div`
  background: white;
  border-bottom: 1px solid rgba(42,125,225,0.08);
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TopLogo = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  cursor: pointer;
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: ${p => p.danger ? '1.5px solid #fecaca' : 'none'};
  color: ${p => p.danger ? '#dc2626' : '#64748b'};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover {
    background: ${p => p.danger ? '#fef2f2' : 'rgba(42,125,225,0.06)'};
    color: ${p => p.danger ? '#dc2626' : '#2A7DE1'};
  }
`;

const Content = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  @media (max-width: 768px) { padding: 2rem 1.25rem; }
  @media (max-width: 480px) { padding: 1.5rem 1rem; }
`;

// ─── Hero Card ────────────────────────────────────────────────────────────────

const HeroCard = styled.div`
  background: linear-gradient(135deg, #2A7DE1 0%, #2ED1A2 100%);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  animation: ${fadeInUp} 0.5s ease both;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
    gap: 1.25rem;
  }
`;

const Avatar = styled.div`
  width: 88px;
  height: 88px;
  min-width: 88px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  border: 3px solid rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  color: white;
`;

const HeroInfo = styled.div`
  flex: 1;
  h1 {
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 900;
    color: white;
    margin-bottom: 0.35rem;
    letter-spacing: -0.02em;
  }
  p { color: rgba(255,255,255,0.8); font-size: 0.9rem; font-weight: 500; }
`;

const MemberBadge = styled.div`
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.35);
  color: white;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.6rem;
`;

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  border: 1px solid rgba(42,125,225,0.06);
  animation: ${fadeInUp} 0.5s ease both;
  animation-delay: ${p => p.delay || '0s'};

  @media (max-width: 480px) { padding: 1.5rem; }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 800;
  color: #0F172A;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .icon-wrap {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, rgba(42,125,225,0.1), rgba(46,209,162,0.1));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2A7DE1;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const CancelBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #F1F5F9;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover { background: #E2E8F0; }
`;

// ─── Info Grid ────────────────────────────────────────────────────────────────

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  background: #F8FAFF;
  border-radius: 12px;
  border: 1.5px solid ${p => p.editing ? 'rgba(42,125,225,0.3)' : 'rgba(42,125,225,0.06)'};
  transition: border-color 0.2s;
`;

const InfoIcon = styled.div`
  width: 38px;
  height: 38px;
  min-width: 38px;
  background: ${p => p.bg || 'linear-gradient(135deg, #2A7DE1, #2ED1A2)'};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const InfoText = styled.div`
  flex: 1;
  min-width: 0;

  .label {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.2rem;
  }
  .value {
    font-size: 0.95rem;
    font-weight: 700;
    color: #0F172A;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .empty {
    font-size: 0.88rem;
    color: #cbd5e1;
    font-style: italic;
  }
`;

const EditInput = styled.input`
  width: 100%;
  background: white;
  border: 1.5px solid rgba(42,125,225,0.35);
  border-radius: 6px;
  padding: 0.35rem 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0F172A;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: #2A7DE1; }
  &:disabled {
    background: #F1F5F9;
    cursor: not-allowed;
    color: #94a3b8;
  }
`;

const ErrorMsg = styled.p`
  color: #dc2626;
  font-size: 0.82rem;
  margin-top: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
`;

const SuccessMsg = styled.p`
  color: #059669;
  font-size: 0.82rem;
  margin-top: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

// ─── Goal Section ─────────────────────────────────────────────────────────────

const GoalDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(42,125,225,0.05), rgba(46,209,162,0.05));
  border: 2px solid rgba(42,125,225,0.15);
  border-radius: 16px;
`;

const GoalIconBox = styled.div`
  width: 56px;
  height: 56px;
  min-width: 56px;
  background: ${p => p.bg};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 16px -4px ${p => p.shadow};
`;

const GoalInfo = styled.div`
  flex: 1;
  h3 { font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 0.3rem; }
  p  { font-size: 0.85rem; color: #64748b; line-height: 1.5; }
`;

const NoGoalBox = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  p { font-size: 0.9rem; margin-bottom: 1rem; }
`;

const ChooseGoalBtn = styled.button`
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOALS = {
  health:      { label: 'Santé & Vitalité',    desc: 'Améliorer votre bien-être général et votre énergie grâce au jeûne régulier.', icon: Heart, bg: 'linear-gradient(135deg,#EF4444,#F97316)', shadow: 'rgba(239,68,68,0.3)' },
  'weight-loss':{ label: 'Perte de Poids',     desc: 'Atteindre vos objectifs de poids de façon saine et durable.',                icon: Scale, bg: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', shadow: 'rgba(59,130,246,0.3)' },
  spiritual:   { label: 'Spirituel · Ramadan', desc: 'Pratiquer le jeûne pour des raisons religieuses avec un suivi adapté.',      icon: Moon,  bg: 'linear-gradient(135deg,#F59E0B,#EF4444)', shadow: 'rgba(245,158,11,0.3)' },
  learning:    { label: 'Apprentissage',        desc: 'Découvrir le jeûne progressivement dans un cadre sécurisé.',                 icon: Brain, bg: 'linear-gradient(135deg,#2ED1A2,#06B6D4)', shadow: 'rgba(46,209,162,0.3)' },
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' }) : null;
const getInitials = (p, n) => ((p?.[0] || '') + (n?.[0] || '')).toUpperCase() || '?';
const getFullName = (p, n) => [p, n].filter(Boolean).join(' ') || n || 'Utilisateur';

// ─── Component ────────────────────────────────────────────────────────────────

const MonEspace = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { t } = useTranslation();

  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [form, setForm]         = useState({});

  const goalId = localStorage.getItem('fastingGoal');
  const goal   = goalId ? GOALS[goalId] : null;

  const handleLogout = () => { logout(); navigate('/'); };

  const startEdit = () => {
    setForm({
      prenom:        user.prenom        || '',
      nom:           user.nom           || '',
      telephone:     user.telephone     || '',
      dateNaissance: user.dateNaissance || '',
      poidsInitial:  user.poidsInitial  || '',
    });
    setError('');
    setSuccess(false);
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setError(''); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.nom.trim()) { setError('Le nom est obligatoire.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        prenom:        form.prenom        || undefined,
        nom:           form.nom,
        telephone:     form.telephone     || undefined,
        dateNaissance: form.dateNaissance || undefined,
        poidsInitial:  form.poidsInitial  ? Number(form.poidsInitial) : undefined,
      };
      await updateUser(payload);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) { navigate('/login'); return null; }

  const GoalIcon = goal?.icon;

  const field = (label, name, icon, iconBg, type = 'text', disabled = false) => (
    <InfoItem editing={editing && !disabled}>
      <InfoIcon bg={iconBg}>{icon}</InfoIcon>
      <InfoText>
        <div className="label">{label}</div>
        {editing && !disabled ? (
          <EditInput
            name={name}
            type={type}
            value={form[name] ?? ''}
            onChange={handleChange}
            placeholder={label}
          />
        ) : (
          user[name]
            ? <div className="value">{name === 'dateNaissance' ? formatDate(user[name]) : user[name]}</div>
            : <div className="empty">Non renseigné</div>
        )}
      </InfoText>
    </InfoItem>
  );

  return (
    <Page>
      <AppNav />

      <Content>

        {/* Hero */}
        <HeroCard>
          <Avatar>{getInitials(user.prenom, user.nom)}</Avatar>
          <HeroInfo>
            <h1>{getFullName(user.prenom, user.nom)}</h1>
            <p>{user.email}</p>
            <MemberBadge>
              <CheckCircle size={12} />
              Membre depuis {formatDate(user.dateInscription)}
            </MemberBadge>
          </HeroInfo>
        </HeroCard>

        {/* Informations personnelles */}
        <Card delay="0.1s">
          <CardHeader>
            <CardTitle>
              <span className="icon-wrap"><User size={16} /></span>
              Mes informations
            </CardTitle>
            {editing ? (
              <EditActions>
                <CancelBtn onClick={cancelEdit}><X size={14} /> Annuler</CancelBtn>
                <SaveBtn onClick={handleSave} disabled={saving}>
                  <Save size={14} /> {saving ? 'Enregistrement...' : 'Sauvegarder'}
                </SaveBtn>
              </EditActions>
            ) : (
              <IconBtn onClick={startEdit}><Edit3 size={14} /> Modifier</IconBtn>
            )}
          </CardHeader>

          <InfoGrid>
            {field('Prénom',            'prenom',        <User size={18} />,     'linear-gradient(135deg,#2A7DE1,#60A5FA)')}
            {field('Nom',               'nom',           <User size={18} />,     'linear-gradient(135deg,#2A7DE1,#60A5FA)')}
            {field('Email',             'email',         <Mail size={18} />,     'linear-gradient(135deg,#8B5CF6,#EC4899)', 'email', true)}
            {field('Téléphone',         'telephone',     <Phone size={18} />,    'linear-gradient(135deg,#10B981,#06B6D4)', 'tel')}
            {field('Date de naissance', 'dateNaissance', <Calendar size={18} />, 'linear-gradient(135deg,#F59E0B,#EF4444)', 'date')}
            {field('Poids initial (kg)','poidsInitial',  <Weight size={18} />,   'linear-gradient(135deg,#2ED1A2,#2A7DE1)', 'number')}
          </InfoGrid>

          {error   && <ErrorMsg>{error}</ErrorMsg>}
          {success && <SuccessMsg><CheckCircle size={15} /> {t('mySpace.saved')}</SuccessMsg>}
        </Card>

        {/* Objectif */}
        <Card delay="0.2s">
          <CardHeader>
            <CardTitle>
              <span className="icon-wrap"><Heart size={16} /></span>
              Mon objectif de jeûne
            </CardTitle>
            {goal && (
              <IconBtn onClick={() => navigate('/goal-selection')}><Edit3 size={14} /> Changer</IconBtn>
            )}
          </CardHeader>

          {goal ? (
            <GoalDisplay>
              <GoalIconBox bg={goal.bg} shadow={goal.shadow}><GoalIcon size={26} /></GoalIconBox>
              <GoalInfo>
                <h3>{goal.label}</h3>
                <p>{goal.desc}</p>
              </GoalInfo>
              <CheckCircle size={22} color="#2ED1A2" />
            </GoalDisplay>
          ) : (
            <NoGoalBox>
              <p>Vous n'avez pas encore choisi d'objectif.</p>
              <ChooseGoalBtn onClick={() => navigate('/goal-selection')}>
                Choisir mon objectif
              </ChooseGoalBtn>
            </NoGoalBox>
          )}
        </Card>

      </Content>
    </Page>
  );
};

export default MonEspace;
