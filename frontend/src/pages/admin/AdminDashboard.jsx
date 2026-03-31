import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Users, TrendingUp, Clock, Activity } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem;
  margin-bottom: 2rem;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: white; border-radius: 18px; padding: 1.5rem;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  display: flex; align-items: flex-start; gap: 1rem;
`;
const IconWrap = styled.div`
  width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
  background: ${p => p.$bg}; display: flex; align-items: center; justify-content: center;
`;
const StatInfo = styled.div``;
const StatValue = styled.div`font-size: 2rem; font-weight: 900; color: #0F172A; line-height: 1;`;
const StatLabel = styled.div`font-size: 0.82rem; font-weight: 600; color: #64748b; margin-top: 0.35rem;`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F4C3A 100%);
  border-radius: 20px; padding: 2rem; color: white; margin-bottom: 1.5rem;
`;
const WelcomeTitle = styled.h2`
  font-size: 1.4rem; font-weight: 900; margin-bottom: 0.4rem; letter-spacing: -0.02em;
  span { background: linear-gradient(90deg,#60A5FA,#2ED1A2);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
`;
const WelcomeSub = styled.p`font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.6;`;

const CARDS = [
  { key: 'totalUsers',    label: 'Utilisateurs inscrits', Icon: Users,      bg: 'rgba(42,125,225,0.1)',  color: '#2A7DE1' },
  { key: 'newUsersMonth', label: 'Nouveaux ce mois',      Icon: TrendingUp,  bg: 'rgba(46,209,162,0.1)', color: '#10B981' },
  { key: 'totalJeunes',   label: 'Jeûnes enregistrés',    Icon: Clock,       bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  { key: 'jeunesActifs',  label: 'Jeûnes en cours',       Icon: Activity,    bg: 'rgba(239,68,68,0.1)',  color: '#EF4444' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/admin/stats`, authHeader())
      .then(r => setStats(r.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <WelcomeCard>
        <WelcomeTitle>Bienvenue dans l'<span>espace admin</span></WelcomeTitle>
        <WelcomeSub>Gérez les utilisateurs, les contenus et les communications de FastCare depuis ce tableau de bord.</WelcomeSub>
      </WelcomeCard>

      <Grid>
        {CARDS.map(({ key, label, Icon, bg, color }) => (
          <StatCard key={key}>
            <IconWrap $bg={bg}>
              <Icon size={20} color={color} />
            </IconWrap>
            <StatInfo>
              <StatValue>{loading ? '—' : (stats?.[key] ?? 0)}</StatValue>
              <StatLabel>{label}</StatLabel>
            </StatInfo>
          </StatCard>
        ))}
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboard;
