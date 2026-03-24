import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { BookOpen, Plus, Trash2, Edit3, Save, X, Calendar } from 'lucide-react';
import AppNav from '../components/AppNav';

const API = 'http://localhost:5000/api';
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
`;

const Page = styled.div`min-height:100vh;background:#F8FAFF;padding-bottom:5rem;`;
const Content = styled.div`
  max-width:1060px;width:100%;margin:0 auto;padding:2.5rem 2.5rem;
  @media(max-width:768px){padding:1.75rem 1.25rem;}
  @media(max-width:480px){padding:1.25rem 1rem;}
`;

const Header = styled.div`
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1rem;margin-bottom:2rem;flex-wrap:wrap;
  animation:${fadeInUp} 0.4s ease both;
`;
const PageTitle = styled.h1`
  font-size:clamp(1.5rem,3vw,2rem);font-weight:900;color:#0F172A;
  letter-spacing:-0.02em;margin-bottom:0.25rem;
`;
const PageSub = styled.p`font-size:0.88rem;color:#64748b;`;
const NewBtn = styled.button`
  display:flex;align-items:center;gap:0.5rem;
  background:linear-gradient(135deg,#2A7DE1,#2ED1A2);
  color:white;border:none;border-radius:12px;
  padding:0.7rem 1.25rem;font-size:0.88rem;font-weight:800;
  cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;
  box-shadow:0 6px 20px -4px rgba(42,125,225,0.4);flex-shrink:0;
  &:hover{transform:translateY(-2px);box-shadow:0 10px 28px -4px rgba(42,125,225,0.45);}
`;

/* ── Formulaire nouvelle entrée ── */
const ComposeCard = styled.div`
  background:white;border-radius:22px;padding:1.75rem;
  border:2px solid rgba(42,125,225,0.18);
  box-shadow:0 4px 24px rgba(42,125,225,0.08);
  margin-bottom:2rem;
  animation:${fadeInUp} 0.35s ease both;
`;
const ComposeTop = styled.div`
  display:flex;align-items:center;gap:1rem;margin-bottom:1rem;
`;
const ComposeDateInput = styled.input`
  border:1.5px solid rgba(42,125,225,0.15);border-radius:10px;
  padding:0.45rem 0.75rem;font-size:0.85rem;font-weight:600;color:#0F172A;
  outline:none;&:focus{border-color:#2A7DE1;}
`;
const ComposeLabel = styled.div`font-size:0.85rem;font-weight:700;color:#64748b;`;
const Textarea = styled.textarea`
  width:100%;min-height:140px;padding:1rem;resize:vertical;
  border:1.5px solid rgba(42,125,225,0.12);border-radius:14px;
  font-size:0.9rem;color:#334155;line-height:1.7;outline:none;
  font-family:inherit;transition:border 0.2s;
  &:focus{border-color:#2A7DE1;}
  &::placeholder{color:#94a3b8;}
`;
const ComposeActions = styled.div`display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1rem;`;
const CancelBtn = styled.button`
  background:none;border:1.5px solid rgba(42,125,225,0.15);
  color:#64748b;border-radius:10px;padding:0.55rem 1.1rem;
  font-size:0.85rem;font-weight:700;cursor:pointer;
  &:hover{background:#F1F5F9;}
`;
const SaveBtn = styled.button`
  display:flex;align-items:center;gap:0.4rem;
  background:linear-gradient(135deg,#2A7DE1,#2ED1A2);
  color:white;border:none;border-radius:10px;
  padding:0.55rem 1.25rem;font-size:0.85rem;font-weight:800;
  cursor:pointer;&:disabled{opacity:0.5;cursor:default;}
`;

/* ── Liste des entrées ── */
const EmptyState = styled.div`
  text-align:center;padding:3rem 2rem;color:#94a3b8;
  background:white;border-radius:20px;border:1.5px solid rgba(42,125,225,0.07);
  .emoji{font-size:2.5rem;margin-bottom:0.75rem;}
  p{font-size:0.88rem;font-weight:600;margin-bottom:1.5rem;}
`;
const EntryCard = styled.div`
  background:white;border-radius:20px;padding:1.5rem;
  border:1.5px solid rgba(42,125,225,0.08);
  box-shadow:0 2px 14px rgba(0,0,0,0.04);
  margin-bottom:1rem;
  animation:${fadeInUp} 0.4s ease ${p=>p.delay||'0s'} both;
`;
const EntryHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;
`;
const EntryDate = styled.div`
  display:flex;align-items:center;gap:0.45rem;
  font-size:0.8rem;font-weight:700;color:#64748b;
`;
const EntryActions = styled.div`display:flex;gap:0.4rem;`;
const IconBtn = styled.button`
  background:none;border:none;cursor:pointer;padding:0.35rem;border-radius:8px;
  color:#94a3b8;transition:all 0.15s;
  &:hover{background:${p=>p.danger?'rgba(239,68,68,0.08)':'rgba(42,125,225,0.08)'};
    color:${p=>p.danger?'#EF4444':'#2A7DE1'};}
`;
const EntryText = styled.p`
  font-size:0.9rem;color:#334155;line-height:1.75;white-space:pre-wrap;
  word-break:break-word;
`;
const EditTextarea = styled(Textarea)`min-height:100px;margin-bottom:0.75rem;`;
const EditActions = styled.div`display:flex;justify-content:flex-end;gap:0.6rem;`;

const formatDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR',
  { weekday:'long', day:'numeric', month:'long', year:'numeric' });
const toInputDate = (d) => d.toISOString().split('T')[0];
const capitalize = (s) => s ? s[0].toUpperCase() + s.slice(1) : '';

export default function Journal() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [composing, setComposing] = useState(false);
  const [newDate, setNewDate] = useState(toInputDate(new Date()));
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const load = async () => {
    try {
      const res = await axios.get(`${API}/journals`, auth());
      setEntries(res.data.sort((a,b) => b.date.localeCompare(a.date)));
    } catch { /* silencieux */ }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${API}/journals`, { date: newDate, contenu: newText.trim() }, auth());
      setNewText(''); setComposing(false);
      load();
    } catch { /* silencieux */ }
    setSaving(false);
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(`${API}/journals/${id}`, { contenu: editText.trim() }, auth());
      setEditingId(null);
      load();
    } catch { /* silencieux */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('journal.deleteConfirm'))) return;
    try {
      await axios.delete(`${API}/journals/${id}`, auth());
      load();
    } catch { /* silencieux */ }
  };

  return (
    <Page>
      <AppNav />
      <Content>
        <Header>
          <div>
            <PageTitle>{t('journal.title')}</PageTitle>
            <PageSub>{t('journal.subtitle')}</PageSub>
          </div>
          {!composing && (
            <NewBtn onClick={() => { setComposing(true); setNewDate(toInputDate(new Date())); setNewText(''); }}>
              <Plus size={16}/> {t('journal.newEntry')}
            </NewBtn>
          )}
        </Header>

        {/* Composer */}
        {composing && (
          <ComposeCard>
            <ComposeTop>
              <BookOpen size={18} color="#2A7DE1"/>
              <ComposeLabel>{t('journal.date')}</ComposeLabel>
              <ComposeDateInput type="date" value={newDate}
                max={toInputDate(new Date())}
                onChange={e => setNewDate(e.target.value)}/>
            </ComposeTop>
            <Textarea placeholder={t('journal.placeholder')}
              value={newText} onChange={e => setNewText(e.target.value)} autoFocus/>
            <ComposeActions>
              <CancelBtn onClick={() => setComposing(false)}><X size={14}/> {t('journal.cancel')}</CancelBtn>
              <SaveBtn disabled={!newText.trim() || saving} onClick={handleCreate}>
                <Save size={14}/> {saving ? 'Enregistrement…' : 'Enregistrer'}
              </SaveBtn>
            </ComposeActions>
          </ComposeCard>
        )}

        {/* Liste */}
        {entries.length === 0 && !composing ? (
          <EmptyState>
            <div className="emoji">📖</div>
            <p>{t('journal.noEntries')}</p>
            <NewBtn onClick={() => setComposing(true)} style={{ display:'inline-flex' }}>
              <Plus size={16}/> {t('journal.newEntry')}
            </NewBtn>
          </EmptyState>
        ) : (
          entries.map((e, i) => (
            <EntryCard key={e.id} delay={`${i * 0.05}s`}>
              <EntryHeader>
                <EntryDate>
                  <Calendar size={13}/>
                  {capitalize(formatDate(e.date))}
                </EntryDate>
                <EntryActions>
                  <IconBtn onClick={() => { setEditingId(e.id); setEditText(e.contenu); }}>
                    <Edit3 size={15}/>
                  </IconBtn>
                  <IconBtn danger onClick={() => handleDelete(e.id)}>
                    <Trash2 size={15}/>
                  </IconBtn>
                </EntryActions>
              </EntryHeader>
              {editingId === e.id ? (
                <>
                  <EditTextarea value={editText} onChange={ev => setEditText(ev.target.value)} autoFocus/>
                  <EditActions>
                    <CancelBtn onClick={() => setEditingId(null)}><X size={13}/> {t('journal.cancel')}</CancelBtn>
                    <SaveBtn onClick={() => handleUpdate(e.id)}>
                      <Save size={13}/> {t('journal.save')}
                    </SaveBtn>
                  </EditActions>
                </>
              ) : (
                <EntryText>{e.contenu}</EntryText>
              )}
            </EntryCard>
          ))
        )}
      </Content>
    </Page>
  );
}
