import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Search, Ban, Trash2, UserCheck } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

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

const Count = styled.div`
  font-size: 0.82rem; font-weight: 600; color: #64748b; white-space: nowrap;
`;

const TableWrap = styled.div`
  background: white; border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
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
`;
const Td = styled.td`padding: 0.85rem 1rem; font-size: 0.875rem; color: #374151;`;

const Badge = styled.span`
  display: inline-block; padding: 0.2rem 0.65rem; border-radius: 9999px;
  font-size: 0.72rem; font-weight: 700;
  background: ${p => p.$banni ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'};
  color: ${p => p.$banni ? '#DC2626' : '#059669'};
`;

const ActionBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.35rem 0.7rem; border-radius: 8px; border: none;
  font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  background: ${p => p.$danger ? 'rgba(239,68,68,0.08)' : p.$warn ? 'rgba(245,158,11,0.08)' : 'rgba(42,125,225,0.08)'};
  color: ${p => p.$danger ? '#DC2626' : p.$warn ? '#D97706' : '#2A7DE1'};
  &:hover { opacity: 0.75; }
  & + & { margin-left: 0.4rem; }
`;

const Empty = styled.div`
  padding: 3rem; text-align: center; color: #94a3b8; font-size: 0.9rem;
`;

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm(`Supprimer définitivement ${nom} ? Cette action est irréversible.`)) return;
    await axios.delete(`${API}/admin/users/${id}`, authHeader());
    load();
  };

  const filtered = users.filter(u =>
    `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Utilisateurs">
      <Toolbar>
        <SearchWrap>
          <SearchIcon><Search size={15} /></SearchIcon>
          <SearchInput
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrap>
        <Count>{filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''}</Count>
      </Toolbar>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Utilisateur</Th>
              <Th>Email</Th>
              <Th>Inscription</Th>
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={5}><Empty>Chargement…</Empty></Td></tr>
            ) : filtered.length === 0 ? (
              <tr><Td colSpan={5}><Empty>Aucun utilisateur trouvé</Empty></Td></tr>
            ) : filtered.map(u => (
              <Tr key={u.id}>
                <Td style={{ fontWeight: 600, color: '#0F172A' }}>
                  {u.prenom || ''} {u.nom}
                </Td>
                <Td>{u.email}</Td>
                <Td>{u.dateInscription ? new Date(u.dateInscription).toLocaleDateString('fr-FR') : '—'}</Td>
                <Td>
                  <Badge $banni={u.banni}>{u.banni ? 'Banni' : 'Actif'}</Badge>
                </Td>
                <Td>
                  <ActionBtn $warn={u.banni} onClick={() => handleBan(u.id)}>
                    {u.banni ? <UserCheck size={13} /> : <Ban size={13} />}
                    {u.banni ? 'Réactiver' : 'Bannir'}
                  </ActionBtn>
                  {u.role !== 'admin' && (
                    <ActionBtn $danger onClick={() => handleDelete(u.id, `${u.prenom || ''} ${u.nom}`)}>
                      <Trash2 size={13} /> Supprimer
                    </ActionBtn>
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
