import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LayoutDashboard, Users, BookOpen, Bell, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin',              label: 'Dashboard',       Icon: LayoutDashboard },
  { to: '/admin/users',        label: 'Utilisateurs',    Icon: Users },
  { to: '/admin/conseils',     label: 'Conseils Santé',  Icon: BookOpen },
  { to: '/admin/notifications',label: 'Notifications',   Icon: Bell },
];

const Layout = styled.div`
  display: flex; min-height: 100vh; background: #F1F5F9;
`;

const Sidebar = styled.aside`
  width: 240px; min-width: 240px; background: #0F172A;
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  @media (max-width: 768px) { display: none; }
`;

const SidebarTop = styled.div`
  padding: 1.75rem 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
`;

const SidebarLogo = styled.div`
  font-size: 1.3rem; font-weight: 900;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; letter-spacing: -0.03em;
`;

const SidebarBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: rgba(239,68,68,0.15); color: #FCA5A5;
  border: 1px solid rgba(239,68,68,0.25); border-radius: 6px;
  padding: 0.15rem 0.55rem; font-size: 0.68rem; font-weight: 700;
  margin-top: 0.4rem; letter-spacing: 0.05em;
`;

const Nav = styled.nav`
  flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem;
`;

const NavItem = styled(Link)`
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.7rem 0.9rem; border-radius: 10px;
  font-size: 0.88rem; font-weight: 600; text-decoration: none;
  color: ${p => p.$active ? 'white' : 'rgba(255,255,255,0.5)'};
  background: ${p => p.$active ? 'rgba(42,125,225,0.2)' : 'transparent'};
  border: 1px solid ${p => p.$active ? 'rgba(42,125,225,0.3)' : 'transparent'};
  transition: all 0.15s;
  &:hover { color: white; background: rgba(255,255,255,0.06); }
`;

const SidebarBottom = styled.div`
  padding: 1rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.07);
`;

const LogoutBtn = styled.button`
  display: flex; align-items: center; gap: 0.75rem; width: 100%;
  padding: 0.7rem 0.9rem; border-radius: 10px; border: none;
  background: none; color: rgba(255,255,255,0.45); font-size: 0.88rem;
  font-weight: 600; cursor: pointer; transition: all 0.15s;
  &:hover { background: rgba(239,68,68,0.1); color: #FCA5A5; }
`;

const Main = styled.div`
  flex: 1; margin-left: 240px; display: flex; flex-direction: column;
  @media (max-width: 768px) { margin-left: 0; }
`;

const TopBar = styled.header`
  background: white; border-bottom: 1px solid #E2E8F0;
  padding: 0 2rem; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 50;
`;

const PageTitle = styled.h1`
  font-size: 1.15rem; font-weight: 800; color: #0F172A; letter-spacing: -0.02em;
`;

const UserInfo = styled.div`
  display: flex; align-items: center; gap: 0.6rem;
  font-size: 0.85rem; font-weight: 600; color: #64748b;
`;

const Avatar = styled.div`
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.8rem; font-weight: 800;
`;

const Content = styled.main`
  flex: 1; padding: 2rem;
  @media (max-width: 640px) { padding: 1.25rem; }
`;

const AdminLayout = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase() || 'A';

  return (
    <Layout>
      <Sidebar>
        <SidebarTop>
          <SidebarLogo>FastCare</SidebarLogo>
          <SidebarBadge><Shield size={10} /> Administration</SidebarBadge>
        </SidebarTop>

        <Nav>
          {NAV.map(({ to, label, Icon }) => {
            const active = to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(to);
            return (
              <NavItem key={to} to={to} $active={active}>
                <Icon size={16} />
                {label}
              </NavItem>
            );
          })}
        </Nav>

        <SidebarBottom>
          <LogoutBtn onClick={handleLogout}>
            <LogOut size={16} /> Déconnexion
          </LogoutBtn>
        </SidebarBottom>
      </Sidebar>

      <Main>
        <TopBar>
          <PageTitle>{title}</PageTitle>
          <UserInfo>
            <Avatar>{initials}</Avatar>
            {user?.prenom || user?.nom}
          </UserInfo>
        </TopBar>
        <Content>{children}</Content>
      </Main>
    </Layout>
  );
};

export default AdminLayout;
