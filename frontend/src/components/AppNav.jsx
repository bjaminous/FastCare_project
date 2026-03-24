import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';
import FastCareLogo from './Logo';
import styled, { keyframes, css } from 'styled-components';
import { Timer, LayoutDashboard, User, LogOut, ChevronDown, TrendingUp, BookOpen, Lightbulb, BarChart2, GraduationCap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Nav = styled.nav`
  position: sticky; top: 0; z-index: 200;
  background: rgba(255,255,255,0.96); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(42,125,225,0.09);
  height: 76px; padding: 0 2rem;
  display: flex; align-items: center; justify-content: space-between;
  overflow: visible;
  @media(max-width:480px){ padding: 0 1rem; }
`;

const LogoWrap = styled.div`
  cursor: pointer; flex-shrink: 0;
  position: relative; z-index: 201;
`;

const Links = styled.div`
  display: flex; align-items: center; gap: 0.25rem;
  @media(max-width:600px){ display: none; }
`;

const NavLink = styled.button`
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: none; cursor: pointer;
  font-size: 0.82rem; font-weight: 700; padding: 0.45rem 0.65rem; border-radius: 10px;
  color: ${p => p.active ? '#2A7DE1' : '#475569'};
  background: ${p => p.active ? 'rgba(42,125,225,0.08)' : 'transparent'};
  transition: all 0.18s;
  &:hover { background: rgba(42,125,225,0.07); color: #2A7DE1; }
`;

const Right = styled.div`display: flex; align-items: center; gap: 0.75rem;`;

const Avatar = styled.button`
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: 1.5px solid rgba(42,125,225,0.15);
  border-radius: 12px; padding: 0.35rem 0.75rem 0.35rem 0.4rem;
  cursor: pointer; transition: all 0.18s;
  &:hover { background: rgba(42,125,225,0.06); border-color: rgba(42,125,225,0.3); }
`;
const AvatarCircle = styled.div`
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg,#2A7DE1,#2ED1A2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 900; color: white; flex-shrink: 0;
`;
const AvatarName = styled.span`
  font-size: 0.85rem; font-weight: 700; color: #0F172A;
  max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  @media(max-width:400px){ display: none; }
`;

const Dropdown = styled.div`
  position: absolute; top: calc(100% + 8px); right: 0;
  background: white; border-radius: 16px; padding: 0.5rem;
  box-shadow: 0 16px 48px -8px rgba(0,0,0,0.18);
  border: 1px solid rgba(42,125,225,0.1);
  min-width: 190px;
  animation: ${slideDown} 0.18s ease both;
`;
const DropItem = styled.button`
  display: flex; align-items: center; gap: 0.65rem;
  width: 100%; background: none; border: none; cursor: pointer;
  font-size: 0.88rem; font-weight: 600; color: ${p => p.danger ? '#EF4444' : '#334155'};
  padding: 0.6rem 0.75rem; border-radius: 10px; text-align: left; transition: background 0.15s;
  &:hover { background: ${p => p.danger ? 'rgba(239,68,68,0.07)' : 'rgba(42,125,225,0.07)'}; }
`;
const DropDivider = styled.div`height: 1px; background: rgba(42,125,225,0.08); margin: 0.3rem 0;`;

/* Mobile bottom bar */
const MobileBar = styled.div`
  display: none;
  @media(max-width:600px){
    display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
    background: rgba(255,255,255,0.97); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(42,125,225,0.1);
    padding: 0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom));
  }
`;
const MobileTab = styled.button`
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
  background: none; border: none; cursor: pointer; padding: 0.35rem 0;
  color: ${p => p.active ? '#2A7DE1' : '#94a3b8'};
  font-size: 0.65rem; font-weight: 700; transition: color 0.18s;
  ${p => p.active && css`
    svg { filter: drop-shadow(0 0 6px rgba(42,125,225,0.4)); }
  `}
`;

const AppNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const LINKS = [
    { path: '/dashboard',    label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/timer',        label: t('nav.fasting'),   icon: Timer },
    { path: '/suivi',        label: t('nav.tracking'),  icon: TrendingUp },
    { path: '/statistiques', label: t('nav.stats'),     icon: BarChart2 },
    { path: '/journal',      label: t('nav.journal'),   icon: BookOpen },
    { path: '/conseils',     label: t('nav.tips'),      icon: Lightbulb },
    { path: '/apprendre',    label: t('nav.learn'),     icon: GraduationCap },
    { path: '/mon-espace',   label: t('nav.mySpace'),   icon: User },
  ];

  const MOBILE_LINKS = [
    { path: '/dashboard',    label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/timer',        label: t('nav.fasting'),   icon: Timer },
    { path: '/suivi',        label: t('nav.tracking'),  icon: TrendingUp },
    { path: '/statistiques', label: t('nav.stats'),     icon: BarChart2 },
  ];

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = [user?.prenom, user?.nom].filter(Boolean).map(s => s[0].toUpperCase()).join('') || '?';
  const displayName = user?.prenom || user?.nom || user?.email?.split('@')[0] || 'Moi';
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <Nav>
        <LogoWrap onClick={() => navigate('/dashboard')}><FastCareLogo visibleWidth={160} /></LogoWrap>

        <Links>
          {LINKS.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} active={pathname === path} onClick={() => navigate(path)}>
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </Links>

        <Right>
          <LanguageSwitcher />
          <NotificationBell />
          <div style={{ position: 'relative' }} ref={dropRef}>
            <Avatar onClick={() => setOpen(v => !v)}>
              <AvatarCircle>{initials}</AvatarCircle>
              <AvatarName>{displayName}</AvatarName>
              <ChevronDown size={14} color="#94a3b8" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
            </Avatar>
            {open && (
              <Dropdown>
                <DropItem onClick={() => { navigate('/statistiques'); setOpen(false); }}>
                  <BarChart2 size={15} /> {t('nav.stats')}
                </DropItem>
                <DropItem onClick={() => { navigate('/suivi'); setOpen(false); }}>
                  <TrendingUp size={15} /> {t('nav.tracking')}
                </DropItem>
                <DropItem onClick={() => { navigate('/journal'); setOpen(false); }}>
                  <BookOpen size={15} /> {t('nav.journal')}
                </DropItem>
                <DropItem onClick={() => { navigate('/conseils'); setOpen(false); }}>
                  <Lightbulb size={15} /> {t('nav.tips')}
                </DropItem>
                <DropItem onClick={() => { navigate('/apprendre'); setOpen(false); }}>
                  <GraduationCap size={15} /> {t('nav.learn')}
                </DropItem>
                <DropItem onClick={() => { navigate('/mon-espace'); setOpen(false); }}>
                  <User size={15} /> {t('nav.mySpace')}
                </DropItem>
                <DropDivider />
                <DropItem danger onClick={handleLogout}>
                  <LogOut size={15} /> {t('nav.logout')}
                </DropItem>
              </Dropdown>
            )}
          </div>
        </Right>
      </Nav>

      <MobileBar>
        {MOBILE_LINKS.map(({ path, label, icon: Icon }) => (
          <MobileTab key={path} active={pathname === path} onClick={() => navigate(path)}>
            <Icon size={22} />
            {label}
          </MobileTab>
        ))}
      </MobileBar>
    </>
  );
};

export default AppNav;
