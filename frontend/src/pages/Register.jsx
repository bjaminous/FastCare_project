import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const RegisterContainer = styled.div`
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

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 520px;
  padding: 2.5rem;

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 0.25rem;
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
`;

const Title = styled.h2`
  font-size: clamp(1.3rem, 4vw, 1.5rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.82rem;
`;

const Optional = styled.span`
  font-weight: 400;
  color: #9ca3af;
  font-size: 0.72rem;
  margin-left: 0.2rem;
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', motDePasse: '',
    telephone: '', dateNaissance: '', poidsInitial: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/goal-selection');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Une erreur est survenue';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>FastCare</Logo>
        <Title>Créer mon compte</Title>
        <Subtitle>Rejoignez des milliers de personnes qui prennent soin d'eux</Subtitle>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Form onSubmit={handleSubmit}>

          {/* Prénom + Nom */}
          <Row>
            <InputGroup>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" name="prenom" type="text" placeholder="Jean"
                value={form.prenom} onChange={handleChange} fullWidth />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="nom">Nom <span style={{color:'#ef4444'}}>*</span></Label>
              <Input id="nom" name="nom" type="text" placeholder="Dupont"
                value={form.nom} onChange={handleChange} required fullWidth />
            </InputGroup>
          </Row>

          {/* Email */}
          <InputGroup>
            <Label htmlFor="email">Email <span style={{color:'#ef4444'}}>*</span></Label>
            <Input id="email" name="email" type="email" placeholder="jean.dupont@email.com"
              value={form.email} onChange={handleChange} required fullWidth />
          </InputGroup>

          {/* Mot de passe */}
          <InputGroup>
            <Label htmlFor="motDePasse">Mot de passe <span style={{color:'#ef4444'}}>*</span></Label>
            <PasswordContainer>
              <Input id="motDePasse" name="motDePasse"
                type={showPassword ? 'text' : 'password'}
                placeholder="6 caractères minimum"
                value={form.motDePasse} onChange={handleChange} required fullWidth />
              <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </PasswordContainer>
          </InputGroup>

          <Divider><span>Informations optionnelles</span></Divider>

          {/* Téléphone + Date de naissance */}
          <Row>
            <InputGroup>
              <Label htmlFor="telephone">Téléphone <Optional>(opt.)</Optional></Label>
              <Input id="telephone" name="telephone" type="tel" placeholder="+33 6 00 00 00 00"
                value={form.telephone} onChange={handleChange} fullWidth />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="dateNaissance">Date de naissance <Optional>(opt.)</Optional></Label>
              <Input id="dateNaissance" name="dateNaissance" type="date"
                value={form.dateNaissance} onChange={handleChange} fullWidth />
            </InputGroup>
          </Row>

          {/* Poids initial */}
          <InputGroup>
            <Label htmlFor="poidsInitial">Poids initial (kg) <Optional>(opt.)</Optional></Label>
            <Input id="poidsInitial" name="poidsInitial" type="number"
              placeholder="70" min="20" step="0.1"
              value={form.poidsInitial} onChange={handleChange} fullWidth />
          </InputGroup>

          <Button type="submit" variant="primary" size="large" disabled={isLoading} fullWidth>
            {isLoading ? 'Création du compte...' : "Créer mon compte"}
            {!isLoading && <UserPlus size={20} />}
          </Button>
        </Form>

        <Footer>
          Déjà un compte ? <Link to="/login" style={{ color: '#2A7DE1', fontWeight: 600 }}>Se connecter</Link>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
