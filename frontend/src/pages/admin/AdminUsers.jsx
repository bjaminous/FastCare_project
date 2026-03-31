import { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { Search, Ban, Trash2, UserCheck, RotateCcw, Users, UserX, ShieldOff, Clock } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

/* ── Onglets ── */
const Tabs = styled.div`
  display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;
`;
const Tab = styled.button`
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0.5rem 1.1rem; border-radius: 10px; border: 1.5px solid;
  font-size: 0.83rem; font-weight: 700; cursor: pointer; transition: all 0.18s;
  border-color: ${p => p.$active ? p.$color || '#2A7DE1' : 'rgba(42,125,225,0.15)'};
  background: ${p => p.$active ? (p.$bg || 'rgba(42,125,225,0.08)') : 'white'};
  color: ${p => p.$active ? (p.$color || '#2A7DE1') : '#64748b'};
  &:hover { border-color: ${p => p.$color || '#2A7DE1'}; color: ${p => p.$color || '#2A7DE1'}; }
`;
const TabCount = styled.span`
  background: ${p => p.$bg}; color: ${p => p.$color};
  border-radius: 9999px; padding: 0.05rem 0.5rem;
  font-size: 0.7rem; font-weight: 900;
`;

/* ── Toolbar ── */
const Toolbar = styled.div`
  display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;
  @media (max-width: 540px) { flex-direction: column; align-items: stretch; }
`;
const SearchWrap = styled.div`
  position: relative; flex: 1; max-width: 360px;
  @media (max-width: 540px) { max-width: 100%; }
`;
const SearchIcon = styled.div`
  position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
  color: #94a3b8; pointer-events: none;
`;
const SearchInput = styled.input`
  width: 100%; padding: 0.65rem 0.9rem 0.65rem 2.4rem;
  border: 1.5px solid #E2E8F0; border-radius: 10px;
  font-size: 0.88rem; color: #0F172A; background: white;
  outline: none; box-sizing: border-box;
  &:focus { border-color: #2A7DE1; }
`;
const Count = styled.div`font-size: 0.82rem; font-weight: 600; color: #64748b; white-space: nowrap;`;

/* ── Table ── */
const TableWrap = styled.div`
  background: white; border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  animation: ${fadeIn} 0.3s ease both;
`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`
  padding: 0.85rem 1rem; text-align: left; font-size: 0.75rem;
  font-weight: 700; color: #64748b; text-transform: uppercase;
  letter-spacing: 0.06em; background: #F8FAFF;
  border-bottom: 1px solid #E2E8F0;
`;
const Tr = styled.tr`
  border-bottom: 1px solid #F1F5F9;
  &:last-child { border-bottom: none; }
  &:hover { background: #FAFCFF; }
  opacity: ${p => p.$supprime ? 0.65 : 1};
`;
const Td = styled.td`padding: 0.85rem 1rem; font-size: 0.875rem; color: #374151;`;

const Badge = styled.span`
  display: inline-block; padding: 0.2rem 0.65rem; border-radius: 9999px;
  font-size: 0.72rem; font-weight: 700;
  background: ${p => p.$supprime ? 'rgba(100,116,139,0.1)' : p.$banni ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'};
  color: ${p => p.$supprime ? '#64748b' : p.$banni ? '#DC2626' : '#059669'};
`;

const ActionBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.35rem 0.7rem; border-radius: 8px; border: none;
  font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  background: ${p => p.$danger ? 'rgba(239,68,68,0.08)' : p.$warn ? 'rgba(245,158,11,0.08)' : p.$success ? 'rgba(16,185,129,0.08)' : 'rgba(42,125,225,0.08)'};
  color: ${p => p.$danger ? '#DC2626' : p.$warn ? '#D97706' : p.$success ? '#059669' : '#2A7DE1'};
  &:hover { opacity: 0.75; }
  & + & { margin-left: 0.4rem; }
`;

const Empty = styled.div`
  padding: 3rem; text-align: center; color: #94a3b8; font-size: 0.9rem;
  .e { font-size: 2rem; margin-bottom: 0.5rem; }
`;

/* ── Info banner ── */
const InfoBanner = styled.div`
  background: ${p => p.$bg || 'rgba(42,125,225,0.06)'};
  border: 1.5px solid ${p => p.$border || 'rgba(42,125,225,0.15)'};
  border-radius: 12px; padding: 0.75rem 1rem;
  font-size: 0.82rem; color: ${p => p.$color || '#2A7DE1'};
  font-weight: 600; margin-bottom: 1rem;
  display: flex; align-items: center; gap: 0.5rem;
`;

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('actifs'); // actifs | inactifs | bannis | supprimes

  const load = () => {
    setLoading(true);
    axios.get(`${API}/admin/users`, authHeader())
      .then(r => setUsers(r.data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleBan = async (id) => {
    await axios.put(`${API}/admin/users/${id}/ban`, {}, authHeader());
    load();
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer ${nom} ? L'utilisateur sera archivé et pourra être restauré.`)) return;
    await axios.delete(`${API}/admin/users/${id}`, authHeader());
    load();
  };

  const handleRestore = async (id) => {
    await axios.put(`${API}/admin/users/${id}/restore`, {}, authHeader());
    load();
  };

  const INACTIF_JOURS = 30;
  const isInactif = (u) => {
    if (u.supprime || u.banni || u.role === 'admin') return false;
    if (!u.dernierConnexion) {
      // jamais connecté depuis plus de 7 jours après inscription
      const inscription = new Date(u.dateInscription);
      return (Date.now() - inscription) > 7 * 86400 * 1000;
    }
    return (Date.now() - new Date(u.dernierConnexion)) > INACTIF_JOURS * 86400 * 1000;
  };

  const inactifs  = users.filter(u => isInactif(u));
  const actifs    = users.filter(u => !u.supprime && !u.banni && u.role !== 'admin' && !isInactif(u));
  const bannis    = users.filter(u => !u.supprime && u.banni);
  const supprimes = users.filter(u => u.supprime);

  const listByTab = { actifs, inactifs, bannis, supprimes };
  const current = (listByTab[tab] || actifs).filter(u =>
    `${u.prenom || ''} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { key: 'actifs',    label: 'Actifs',    icon: Users,    count: actifs.length,    color: '#059669', bg: 'rgba(16,185,129,0.08)',  countBg: 'rgba(16,185,129,0.12)',  countColor: '#059669' },
    { key: 'inactifs',  label: 'Inactifs',  icon: Clock,    count: inactifs.length,  color: '#D97706', bg: 'rgba(245,158,11,0.08)',  countBg: 'rgba(245,158,11,0.12)',  countColor: '#D97706' },
    { key: 'bannis',    label: 'Bannis',    icon: ShieldOff,count: bannis.length,    color: '#DC2626', bg: 'rgba(239,68,68,0.08)',   countBg: 'rgba(239,68,68,0.12)',   countColor: '#DC2626' },
    { key: 'supprimes', label: 'Supprimés', icon: UserX,    count: supprimes.length, color: '#64748b', bg: 'rgba(100,116,139,0.08)', countBg: 'rgba(100,116,139,0.12)', countColor: '#64748b' },
  ];

  const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

  return (
    <AdminLayout title="Utilisateurs">

      <Tabs>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <Tab key={t.key} $active={tab === t.key} $color={t.color} $bg={t.bg}
              onClick={() => { setTab(t.key); setSearch(''); }}>
              <Icon size={14} />
              {t.label}
              <TabCount $bg={t.countBg} $color={t.countColor}>{t.count}</TabCount>
            </Tab>
          );
        })}
      </Tabs>

      {tab === 'inactifs' && inactifs.length > 0 && (
        <InfoBanner $bg="rgba(245,158,11,0.05)" $border="rgba(245,158,11,0.2)" $color="#D97706">
          <Clock size={14} /> Aucune connexion depuis plus de 30 jours (ou jamais connectés après inscription).
        </InfoBanner>
      )}
      {tab === 'bannis' && bannis.length > 0 && (
        <InfoBanner $bg="rgba(239,68,68,0.05)" $border="rgba(239,68,68,0.15)" $color="#DC2626">
          <Ban size={14} /> Ces utilisateurs ne peuvent plus se connecter. Cliquez "Réactiver" pour lever le bannissement.
        </InfoBanner>
      )}
      {tab === 'supprimes' && supprimes.length > 0 && (
        <InfoBanner $bg="rgba(100,116,139,0.05)" $border="rgba(100,116,139,0.15)" $color="#475569">
          <UserX size={14} /> Ces comptes ont été supprimés mais restent archivés. Vous pouvez les restaurer.
        </InfoBanner>
      )}

      <Toolbar>
        <SearchWrap>
          <SearchIcon><Search size={15} /></SearchIcon>
          <SearchInput
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrap>
        <Count>{current.length} utilisateur{current.length !== 1 ? 's' : ''}</Count>
      </Toolbar>

      <TableWrap key={tab}>
        <Table>
          <thead>
            <tr>
              <Th>Utilisateur</Th>
              <Th>Email</Th>
              <Th>Inscription</Th>
              {tab === 'supprimes' && <Th>Supprimé le</Th>}
              {tab === 'inactifs'  && <Th>Dernière connexion</Th>}
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={6}><Empty>Chargement…</Empty></Td></tr>
            ) : current.length === 0 ? (
              <tr><Td colSpan={6}>
                <Empty>
                  <div className="e">{tab === 'supprimes' ? '🗑️' : tab === 'bannis' ? '🚫' : tab === 'inactifs' ? '💤' : '✅'}</div>
                  <div>
                    {tab === 'supprimes' ? 'Aucun utilisateur supprimé'
                      : tab === 'bannis'   ? 'Aucun utilisateur banni'
                      : tab === 'inactifs' ? 'Aucun utilisateur inactif'
                      : 'Aucun utilisateur trouvé'}
                  </div>
                </Empty>
              </Td></tr>
            ) : current.map(u => (
              <Tr key={u.id} $supprime={u.supprime}>
                <Td style={{ fontWeight: 600, color: '#0F172A' }}>
                  {u.prenom || ''} {u.nom}
                </Td>
                <Td style={{ color: '#64748b' }}>{u.email}</Td>
                <Td>{fmt(u.dateInscription)}</Td>
                {tab === 'supprimes' && <Td style={{ color: '#94a3b8' }}>{fmt(u.dateSuppression)}</Td>}
                {tab === 'inactifs'  && <Td style={{ color: '#D97706' }}>{u.dernierConnexion ? fmt(u.dernierConnexion) : 'Jamais connecté'}</Td>}
                <Td>
                  <Badge $banni={u.banni} $supprime={u.supprime}>
                    {u.supprime ? 'Supprimé' : u.banni ? 'Banni' : 'Actif'}
                  </Badge>
                </Td>
                <Td>
                  {u.supprime ? (
                    <ActionBtn $success onClick={() => handleRestore(u.id)}>
                      <RotateCcw size={13} /> Restaurer
                    </ActionBtn>
                  ) : (
                    <>
                      <ActionBtn $warn={u.banni} onClick={() => handleBan(u.id)}>
                        {u.banni ? <UserCheck size={13} /> : <Ban size={13} />}
                        {u.banni ? 'Réactiver' : 'Bannir'}
                      </ActionBtn>
                      {u.role !== 'admin' && (
                        <ActionBtn $danger onClick={() => handleDelete(u.id, `${u.prenom || ''} ${u.nom}`)}>
                          <Trash2 size={13} /> Supprimer
                        </ActionBtn>
                      )}
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </AdminLayout>
  );
};

export default AdminUsers;
