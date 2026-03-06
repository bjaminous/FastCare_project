import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Heart, Shield, Zap, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-15px) rotate(0.5deg); }
    66% { transform: translateY(8px) rotate(-0.5deg); }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  color: white;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
`;

const HeroSection = styled(Card)`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #06B6D4, #0891B2, #67E8F9);
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #67E8F9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: #000000;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-weight: 600;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(Card)`
  padding: 3rem 2.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #06B6D4, #0891B2, #67E8F9);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 30px 60px -15px rgba(6, 182, 212, 0.3);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 2rem;
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #67E8F9 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  box-shadow: 0 12px 30px -10px rgba(6, 182, 212, 0.4);
  position: relative;
  flex-shrink: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, #06B6D4, #0891B2, #67E8F9);
    border-radius: 24px;
    z-index: -1;
    opacity: 0.15;
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 800;
  color: #000000;
  margin-bottom: 1.2rem;
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  color: #1a1a1a;
  line-height: 1.7;
  font-size: 1rem;
  font-weight: 500;
  flex-grow: 1;
`;

const StatsSection = styled(Card)`
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #06B6D4, #0891B2, #67E8F9);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  padding: 1rem;
`;

const StatNumber = styled.div`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #67E8F9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const StatLabel = styled.div`
  color: #000000;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const About = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <AboutContainer>
      <Header>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft size={20} />
          Retour
        </Button>
      </Header>

      <Content>
        <HeroSection>
          <Title>À propos de FastCare</Title>
          <Subtitle>
            FastCare est votre compagnon intelligent pour un jeûne sain et équilibré. 
            Notre mission est de vous accompagner dans votre parcours de bien-être avec des outils 
            modernes et une approche personnalisée.
          </Subtitle>
        </HeroSection>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <Heart size={28} />
            </FeatureIcon>
            <FeatureTitle>Santé avant tout</FeatureTitle>
            <FeatureDescription>
              Des méthodes de jeûne éprouvées et sécurisées, 
              adaptées à votre niveau et vos objectifs.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Shield size={28} />
            </FeatureIcon>
            <FeatureTitle>Suivi intelligent</FeatureTitle>
            <FeatureDescription>
              Analytics avancés pour comprendre votre corps 
              et optimiser vos résultats jour après jour.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Zap size={28} />
            </FeatureIcon>
            <FeatureTitle>Interface intuitive</FeatureTitle>
            <FeatureDescription>
              Une expérience utilisateur fluide et agréable 
              sur tous vos appareils, mobile comme desktop.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Users size={28} />
            </FeatureIcon>
            <FeatureTitle>Communauté active</FeatureTitle>
            <FeatureDescription>
              Rejoignez des milliers d'utilisateurs 
              partagent leurs expériences et leurs succès.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>

        <StatsSection>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1e293b' }}>
            FastCare en chiffres
          </h2>
          <StatsGrid>
            <StatItem>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Utilisateurs actifs</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>1M+</StatNumber>
              <StatNumber>Jeûnes complétés</StatNumber>
              <StatLabel>Heures de jeûne</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>4.8★</StatNumber>
              <StatLabel>Note moyenne</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Support disponible</StatLabel>
            </StatItem>
          </StatsGrid>
        </StatsSection>
      </Content>
    </AboutContainer>
  );
};

export default About;
