import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { Bell, CheckCheck, Zap, Trophy, Info, Heart, Droplets, ArrowRight } from 'lucide-react';

const API = 'http://localhost:5000/api';
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });

const fadeIn = keyframes`from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}`;
const pulse  = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.2)}`;

const Wrap = styled.div`position:relative;`;

const BellBtn = styled.button`
  position:relative;background:none;border:none;cursor:pointer;
  padding:0.4rem;border-radius:10px;color:#475569;
  display:flex;align-items:center;justify-content:center;
  transition:background 0.15s;
  &:hover{background:rgba(42,125,225,0.08);color:#2A7DE1;}
`;
const Badge = styled.span`
  position:absolute;top:2px;right:2px;
  min-width:16px;height:16px;border-radius:9999px;
  background:linear-gradient(135deg,#EF4444,#F97316);
  color:white;font-size:0.6rem;font-weight:900;
  display:flex;align-items:center;justify-content:center;
  padding:0 3px;border:2px solid white;
  animation:${pulse} 2s ease infinite;
`;

const Panel = styled.div`
  position:absolute;top:calc(100% + 10px);right:0;
  width:340px;max-width:calc(100vw - 1.5rem);
  background:white;border-radius:18px;
  border:1.5px solid rgba(42,125,225,0.1);
  box-shadow:0 16px 48px -8px rgba(0,0,0,0.15);
  z-index:500;overflow:hidden;
  animation:${fadeIn} 0.2s ease both;
  @media(max-width:480px){right:-1rem;}
`;
const PanelHead = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding:1rem 1.25rem 0.75rem;
  border-bottom:1px solid rgba(42,125,225,0.06);
`;
const PanelTitle = styled.div`font-size:0.9rem;font-weight:800;color:#0F172A;`;
const MarkAllBtn = styled.button`
  background:none;border:none;cursor:pointer;
  font-size:0.75rem;font-weight:700;color:#2A7DE1;
  display:flex;align-items:center;gap:0.25rem;
  &:hover{text-decoration:underline;}
`;

const List = styled.div`max-height:340px;overflow-y:auto;`;
const Item = styled.div`
  display:flex;align-items:flex-start;gap:0.85rem;
  padding:0.9rem 1.25rem;cursor:pointer;
  background:${p => p.$unread ? 'rgba(42,125,225,0.03)' : 'white'};
  border-bottom:1px solid rgba(42,125,225,0.05);
  transition:background 0.15s;
  &:hover{background:rgba(42,125,225,0.06);}
  &:last-child{border-bottom:none;}
`;
const ItemIcon = styled.div`
  width:36px;height:36px;min-width:36px;border-radius:10px;
  background:${p=>p.$bg};color:${p=>p.$color};
  display:flex;align-items:center;justify-content:center;
`;
const ItemBody = styled.div`flex:1;`;
const ItemMsg = styled.div`
  font-size:0.83rem;font-weight:${p=>p.$unread?700:500};
  color:${p=>p.$unread?'#0F172A':'#475569'};line-height:1.45;
`;
const ItemTime = styled.div`font-size:0.72rem;color:#94a3b8;margin-top:0.2rem;`;
const UnreadDot = styled.div`
  width:7px;height:7px;border-radius:50%;background:#2A7DE1;
  margin-top:5px;flex-shrink:0;
`;

const Empty = styled.div`
  padding:2.5rem 1.5rem;text-align:center;
  color:#94a3b8;font-size:0.85rem;font-weight:600;
  .e{font-size:1.75rem;margin-bottom:0.5rem;}
`;
const PanelFoot = styled.div`
  padding:0.75rem 1.25rem;
  border-top:1px solid rgba(42,125,225,0.06);
`;
const SeeAllBtn = styled.button`
  display:flex;align-items:center;justify-content:center;gap:0.4rem;
  width:100%;background:none;border:1.5px solid rgba(42,125,225,0.15);
  color:#2A7DE1;font-size:0.8rem;font-weight:700;
  padding:0.5rem;border-radius:10px;cursor:pointer;transition:all 0.15s;
  &:hover{background:rgba(42,125,225,0.06);}
`;

const ICONS = {
  JEUNE_COMPLETE: { icon: Trophy,   bg:'rgba(245,158,11,0.1)',  color:'#D97706' },
  STREAK:         { icon: Zap,      bg:'rgba(239,68,68,0.1)',   color:'#EF4444' },
  HYDRATATION:    { icon: Droplets, bg:'rgba(42,125,225,0.1)',  color:'#2A7DE1' },
  RAPPEL_JEUNE:   { icon: Bell,     bg:'rgba(139,92,246,0.1)',  color:'#8B5CF6' },
  OBJECTIF_POIDS: { icon: Trophy,   bg:'rgba(46,209,162,0.1)',  color:'#059669' },
  BIENVENUE:      { icon: Info,     bg:'rgba(46,209,162,0.1)',  color:'#059669' },
  CONSEIL:        { icon: Heart,    bg:'rgba(46,209,162,0.1)',  color:'#059669' },
  RAPPEL:         { icon: Zap,      bg:'rgba(42,125,225,0.1)',  color:'#2A7DE1' },
  default:        { icon: Info,     bg:'rgba(100,116,139,0.1)', color:'#64748b' },
};

const timeAgo = (d) => {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60)   return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400)return `Il y a ${Math.floor(diff/3600)}h`;
  return new Date(d).toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
};

export default function NotificationBell() {
  const navigate              = useNavigate();
  const [notifs, setNotifs]   = useState([]);
  const [open,   setOpen]     = useState(false);
  const panelRef              = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/notifications/unread`, authH());
      setNotifs(res.data || []);
    } catch { /* silencieux */ }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000); // poll toutes les 60s
    return () => clearInterval(interval);
  }, [load]);

  // Ferme au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifs.filter(n => !n.lue).length;

  const handleMarkOne = async (id) => {
    try {
      await axios.post(`${API}/notifications/${id}/read`, {}, authH());
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, lue: true } : n));
    } catch { /* silencieux */ }
  };

  const handleMarkAll = async () => {
    try {
      await axios.post(`${API}/notifications/mark-all-read`, {}, authH());
      setNotifs(prev => prev.map(n => ({ ...n, lue: true })));
    } catch { /* silencieux */ }
  };

  return (
    <Wrap ref={panelRef}>
      <BellBtn onClick={() => setOpen(v => !v)} title="Notifications">
        <Bell size={20}/>
        {unreadCount > 0 && <Badge>{unreadCount > 9 ? '9+' : unreadCount}</Badge>}
      </BellBtn>

      {open && (
        <Panel>
          <PanelHead>
            <PanelTitle>Notifications</PanelTitle>
            {unreadCount > 0 && (
              <MarkAllBtn onClick={handleMarkAll}>
                <CheckCheck size={13}/> Tout marquer lu
              </MarkAllBtn>
            )}
          </PanelHead>

          <List>
            {notifs.length === 0 ? (
              <Empty>
                <div className="e">🔔</div>
                <div>Aucune notification pour le moment</div>
              </Empty>
            ) : (
              notifs.map(n => {
                const meta = ICONS[n.type] || ICONS.default;
                const Icon = meta.icon;
                return (
                  <Item key={n.id} $unread={!n.lue} onClick={() => handleMarkOne(n.id)}>
                    <ItemIcon $bg={meta.bg} $color={meta.color}><Icon size={16}/></ItemIcon>
                    <ItemBody>
                      <ItemMsg $unread={!n.lue}>{n.message}</ItemMsg>
                      <ItemTime>{n.dateEnvoi ? timeAgo(n.dateEnvoi) : ''}</ItemTime>
                    </ItemBody>
                    {!n.lue && <UnreadDot/>}
                  </Item>
                );
              })
            )}
          </List>
          <PanelFoot>
            <SeeAllBtn onClick={() => { setOpen(false); navigate('/mes-notifications'); }}>
              Voir tout l'historique <ArrowRight size={13} />
            </SeeAllBtn>
          </PanelFoot>
        </Panel>
      )}
    </Wrap>
  );
}
