import { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const CATEGORIES = ['alimentation', 'hydratation', 'sport', 'sommeil', 'mental'];

const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
`;

const Toolbar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;
`;
const AddBtn = styled.button`
  display: flex; align-items: center; gap: 0.45rem;
  background: linear-gradient(135deg,#2A7DE1,#2ED1A2); color: white;
  border: none; border-radius: 10px; padding: 0.6rem 1.1rem;
  font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: opacity 0.2s;
  &:hover { opacity: 0.88; }
`;
const Title = styled.h2`font-size: 1rem; font-weight: 800; color: #0F172A;`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;
`;
const ConseilCard = styled.div`
  background: white; border-radius: 16px; padding: 1.25rem;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  animation: ${fadeInUp} 0.3s ease both;
  display: flex; flex-direction: column; gap: 0.6rem;
`;
const CatBadge = styled.span`
  display: inline-block; padding: 0.18rem 0.6rem; border-radius: 9999px;
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  background: rgba(42,125,225,0.1); color: #2A7DE1;
`;
const CardTitle = styled.div`font-size: 0.95rem; font-weight: 800; color: #0F172A;`;
const CardBody  = styled.div`font-size: 0.83rem; color: #64748b; line-height: 1.55; flex: 1;`;
const CardActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.25rem;`;
const ActBtn = styled.button`
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.35rem;
  padding: 0.45rem; border-radius: 8px; border: none; cursor: pointer;
  font-size: 0.78rem; font-weight: 700; transition: opacity 0.15s;
  background: ${p => p.$danger ? 'rgba(239,68,68,0.08)' : 'rgba(42,125,225,0.08)'};
  color: ${p => p.$danger ? '#DC2626' : '#2A7DE1'};
  &:hover { opacity: 0.7; }
`;

/* ── Modal ── */
const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 500;
  background: rgba(15,23,42,0.5); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
`;
const Modal = styled.div`
  background: white; border-radius: 20px; padding: 2rem;
  max-width: 480px; width: 100%;
  box-shadow: 0 24px 60px rgba(0,0,0,0.2); position: relative;
`;
const ModalTitle = styled.h2`font-size: 1.1rem; font-weight: 900; color: #0F172A; margin-bottom: 1.25rem;`;
const CloseBtn = styled.button`
  position: absolute; top: 1rem; right: 1rem;
  background: #F1F5F9; border: none; border-radius: 50%;
  width: 30px; height: 30px; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #E2E8F0; }
`;
const Field = styled.div`display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem;`;
const Label = styled.label`font-size: 0.8rem; font-weight: 700; color: #374151;`;
const Input = styled.input`
  padding: 0.65rem 0.9rem; border: 1.5px solid #E2E8F0; border-radius: 10px;
  font-size: 0.88rem; color: #0F172A; outline: none;
  &:focus { border-color: #2A7DE1; }
`;
const Textarea = styled.textarea`
  padding: 0.65rem 0.9rem; border: 1.5px solid #E2E8F0; border-radius: 10px;
  font-size: 0.88rem; color: #0F172A; outline: none; resize: vertical; min-height: 100px;
  &:focus { border-color: #2A7DE1; }
`;
const Select = styled.select`
  padding: 0.65rem 0.9rem; border: 1.5px solid #E2E8F0; border-radius: 10px;
  font-size: 0.88rem; color: #0F172A; background: white; outline: none;
  &:focus { border-color: #2A7DE1; }
`;
const SubmitBtn = styled.button`
  width: 100%; background: linear-gradient(135deg,#2A7DE1,#2ED1A2); color: white;
  border: none; border-radius: 12px; padding: 0.8rem; font-size: 0.95rem;
  font-weight: 800; cursor: pointer; transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

const Empty = styled.div`
  padding: 3rem; text-align: center; color: #94a3b8; font-size: 0.9rem;
  grid-column: 1/-1;
`;

const EMPTY_FORM = { titre: '', contenu: '', categorie: 'alimentation' };

const AdminConseils = () => {
  const [conseils, setConseils]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null); // null = nouveau
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  const load = () => {
    setLoading(true);
    axios.get(`${API}/admin/conseils`, authHeader())
      .then(r => setConseils(r.data.conseils || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ titre: c.titre, contenu: c.contenu, categorie: c.categorie }); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.put(`${API}/admin/conseils/${editing.id}`, form, authHeader());
      } else {
        await axios.post(`${API}/admin/conseils`, form, authHeader());
      }
      closeModal();
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce conseil ?')) return;
    await axios.delete(`${API}/admin/conseils/${id}`, authHeader());
    load();
  };

  return (
    <AdminLayout title="Conseils Santé">
      <Toolbar>
        <Title>{conseils.length} conseil{conseils.length !== 1 ? 's' : ''}</Title>
        <AddBtn onClick={openNew}><Plus size={15} /> Nouveau conseil</AddBtn>
      </Toolbar>

      <Grid>
        {loading ? <Empty>Chargement…</Empty>
          : conseils.length === 0 ? <Empty>Aucun conseil pour l'instant.</Empty>
          : conseils.map(c => (
            <ConseilCard key={c.id}>
              <CatBadge>{c.categorie}</CatBadge>
              <CardTitle>{c.titre}</CardTitle>
              <CardBody>{c.contenu}</CardBody>
              <CardActions>
                <ActBtn onClick={() => openEdit(c)}><Pencil size={13} /> Modifier</ActBtn>
                <ActBtn $danger onClick={() => handleDelete(c.id)}><Trash2 size={13} /> Supprimer</ActBtn>
              </CardActions>
            </ConseilCard>
          ))}
      </Grid>

      {showModal && (
        <Overlay onClick={closeModal}>
          <Modal onClick={e => e.stopPropagation()}>
            <CloseBtn onClick={closeModal}><X size={14} /></CloseBtn>
            <ModalTitle>{editing ? 'Modifier le conseil' : 'Nouveau conseil'}</ModalTitle>
            <form onSubmit={handleSubmit}>
              <Field>
                <Label>Titre</Label>
                <Input required value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} placeholder="Titre du conseil" />
              </Field>
              <Field>
                <Label>Contenu</Label>
                <Textarea required value={form.contenu} onChange={e => setForm({...form, contenu: e.target.value})} placeholder="Contenu du conseil…" />
              </Field>
              <Field>
                <Label>Catégorie</Label>
                <Select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <SubmitBtn type="submit" disabled={saving}>
                {saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer le conseil'}
              </SubmitBtn>
            </form>
          </Modal>
        </Overlay>
      )}
    </AdminLayout>
  );
};

export default AdminConseils;
