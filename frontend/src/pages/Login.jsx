import styled from 'styled-components';
import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
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
  
  &:hover {
    color: #374151;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
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
  
  a {
    color: #4f46e5;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'une connexion
    setTimeout(() => {
      console.log('Tentative de connexion:', formData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Connexion</Title>
        <Subtitle>Bon retour sur FastCare</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordContainer>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
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
            {isLoading ? 'Connexion...' : 'Se connecter'}
            <LogIn size={20} />
          </Button>
        </Form>

        <Divider>
          <span>ou</span>
        </Divider>

        <Button variant="outline" fullWidth>
          Continuer avec Google
        </Button>

        <Footer>
          Pas encore de compte ? <a href="/register">S'inscrire</a>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
