import { useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { Send, CheckCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const scaleIn = keyframes`
  from { opacity:0; transform:scale(0.9); }
  to   { opacity:1; transform:scale(1); }
`;

const Card = styled.div`
  background: white; border-radius: 20px; padding: 2rem;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06); max-width: 600px;
`;
const CardTitle = styled.h2`
  font-size: 1.05rem; font-weight: 900; color: #0F172A;
  margin-bottom: 0.4rem; letter-spacing: -0.02em;
`;
const CardSub = styled.p`font-size: 0.85rem; color: #64748b; margin-bottom: 1.75rem; line-height: 1.6;`;

const Field = styled.div`display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.1rem;`;
const Label = styled.label`font-size: 0.8rem; font-weight: 700; color: #374151;`;
const Select = styled.select`
  padding: 0.65rem 0.9rem; border: 1.5px solid #E2E8F0; border-radius: 10px;
  font-size: 0.88rem; color: #0F172A; background: white; outline: none;
  &:focus { border-color: #2A7DE1; }
`;
const Textarea = styled.textarea`
  padding: 0.75rem 0.9rem; border: 1.5px solid #E2E8F0; border-radius: 10px;
  font-size: 0.9rem; color: #0F172A; outline: none; resize: vertical; min-height: 120px;
  line-height: 1.55;
  &:focus { border-color: #2A7DE1; }
`;
const SendBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; background: linear-gradient(135deg,#2A7DE1,#2ED1A2); color: white;
  border: none; border-radius: 12px; padding: 0.85rem; font-size: 0.97rem;
  font-weight: 800; cursor: pointer; transition: opacity 0.2s; margin-top: 0.5rem;
  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.45; cursor: default; }
`;

const SuccessBanner = styled.div`
  background: rgba(16,185,129,0.08); border: 1.5px solid rgba(16,185,129,0.25);
  border-radius: 14px; padding: 1.1rem 1.25rem;
  display: flex; align-items: center; gap: 0.75rem;
  animation: ${scaleIn} 0.3s ease both; margin-top: 1.25rem;
`;
const SuccessText = styled.div`
  font-size: 0.9rem; font-weight: 700; color: #059669;
`;

const ErrorBanner = styled.div`
  background: rgba(239,68,68,0.07); border: 1.5px solid rgba(239,68,68,0.2);
  border-radius: 14px; padding: 0.9rem 1.1rem;
  font-size: 0.88rem; color: #DC2626; font-weight: 600; margin-top: 1rem;
`;

const TYPES = [
  { value: 'INFO',      label: 'Info générale' },
  { value: 'CONSEIL',   label: 'Conseil santé' },
  { value: 'ALERTE',    label: 'Alerte importante' },
  { value: 'BIENVENUE', label: 'Message de bienvenue' },
];

const AdminNotifs = () => {
  const [message, setMessage] = useState('');
  const [type, setType]       = useState('INFO');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setSuccess(null);
    setError('');
    try {
      const res = await axios.post(`${API}/admin/notifications/broadcast`, { message, type }, authHeader());
      setSuccess(res.data.message);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout title="Notifications">
      <Card>
        <CardTitle>Envoyer une notification globale</CardTitle>
        <CardSub>
          Ce message sera envoyé à <strong>tous les utilisateurs</strong> de FastCare et apparaîtra dans leur centre de notifications.
        </CardSub>

        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Type de notification</Label>
            <Select value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </Field>
          <Field>
            <Label>Message</Label>
            <Textarea
              required
              placeholder="Rédigez votre message ici…"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </Field>
          <SendBtn type="submit" disabled={sending || !message.trim()}>
            <Send size={17} />
            {sending ? 'Envoi en cours…' : 'Envoyer à tous les utilisateurs'}
          </SendBtn>
        </form>

        {success && (
          <SuccessBanner>
            <CheckCircle size={20} color="#059669" />
            <SuccessText>{success}</SuccessText>
          </SuccessBanner>
        )}
        {error && <ErrorBanner>{error}</ErrorBanner>}
      </Card>
    </AdminLayout>
  );
};

export default AdminNotifs;
