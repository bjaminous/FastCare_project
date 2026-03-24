import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import FastCareLogo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2A7DE1 0%, #2ED1A2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 480px) {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: clamp(1.6rem, 5vw, 2rem);
  font-weight: 800;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;

  &:hover { color: #374151; }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', motDePasse: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData.email, formData.motDePasse);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Email ou mot de passe incorrect';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo><FastCareLogo visibleWidth={180} /></Logo>
        <Title>{t('auth.login.title')}</Title>
        <Subtitle>{t('auth.login.subtitle')}</Subtitle>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">{t('auth.login.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="motDePasse">{t('auth.login.password')}</Label>
            <PasswordContainer>
              <Input
                id="motDePasse"
                name="motDePasse"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.motDePasse}
                onChange={handleChange}
                required
                fullWidth
              />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </PasswordContainer>
          </InputGroup>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? t('common.loading') : t('auth.login.submit')}
            {!isLoading && <LogIn size={20} />}
          </Button>
        </Form>

        <Divider><span>ou</span></Divider>

        <Footer>
          {t('auth.login.noAccount')} <Link to="/register" style={{ color: '#2A7DE1', fontWeight: 600 }}>{t('auth.login.register')}</Link>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
