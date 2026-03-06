import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Droplets } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const TimerContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const TimerCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  padding: 3rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
`;

const TimerDisplay = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 2rem;
  font-family: 'Courier New', monospace;
  
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const TimerType = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TypeButton = styled(Button)`
  ${props => props.active && `
    background-color: ${props.theme.colors.primary};
    color: white;
  `}
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ProgressRing = styled.svg`
  transform: rotate(-90deg);
  margin-bottom: 2rem;
`;

const ProgressCircle = styled.circle`
  transition: stroke-dashoffset 0.5s ease;
`;

const InfoSection = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const InfoTitle = styled.h4`
  color: #374151;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoList = styled.ul`
  list-style: none;
  color: #64748b;
  line-height: 1.6;
  
  li {
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #4f46e5;
    }
  }
`;

const Timer = () => {
  const [selectedType, setSelectedType] = useState('16/8');
  const [timeLeft, setTimeLeft] = useState(16 * 60 * 60); // 16 heures en secondes
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(16 * 60 * 60);
  const intervalRef = useRef(null);

  const fastingTypes = {
    '16/8': { hours: 16, name: 'Intermittent 16/8', description: 'Jeûne 16h, alimentation 8h' },
    '24': { hours: 24, name: 'Jeûne 24h', description: 'Jeûne complet d\'une journée' },
    'custom': { hours: 18, name: 'Personnalisé', description: 'Durée personnalisée' }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Notification de fin
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('FastCare', {
                body: 'Votre jeûne est terminé !',
                icon: '/favicon.ico'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    // Demander la permission pour les notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const hours = fastingTypes[type].hours;
    const newTotalTime = hours * 60 * 60;
    setTotalTime(newTotalTime);
    setTimeLeft(newTotalTime);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const hours = fastingTypes[selectedType].hours;
    const newTotalTime = hours * 60 * 60;
    setTotalTime(newTotalTime);
    setTimeLeft(newTotalTime);
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <TimerContainer>
      <TimerCard>
        <Title>Timer de Jeûne</Title>
        <Subtitle>Suivez votre temps de jeûne en temps réel</Subtitle>

        <TimerType>
          {Object.entries(fastingTypes).map(([key, value]) => (
            <TypeButton
              key={key}
              variant={selectedType === key ? 'primary' : 'outline'}
              active={selectedType === key}
              onClick={() => handleTypeChange(key)}
            >
              {value.name}
            </TypeButton>
          ))}
        </TimerType>

        <ProgressRing width="260" height="260">
          <ProgressCircle
            cx="130"
            cy="130"
            r="120"
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          <ProgressCircle
            cx="130"
            cy="130"
            r="120"
            stroke="#4f46e5"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </ProgressRing>

        <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>

        <Controls>
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            size="large"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
            {isRunning ? 'Pause' : 'Commencer'}
          </Button>
          <Button variant="outline" size="large" onClick={resetTimer}>
            <RotateCcw size={24} />
            Réinitialiser
          </Button>
        </Controls>

        <InfoSection>
          <InfoTitle>
            <Droplets size={20} />
            Conseils d'hydratation
          </InfoTitle>
          <InfoList>
            <li>Buvez de l'eau régulièrement pendant le jeûne</li>
            <li>Ajoutez un peu de sel pour maintenir l'équilibre électrolytique</li>
            <li>Évitez les boissons sucrées et l'alcool</li>
            <li>Écoutez votre corps et ajustez selon vos besoins</li>
          </InfoList>
        </InfoSection>
      </TimerCard>
    </TimerContainer>
  );
};

export default Timer;
