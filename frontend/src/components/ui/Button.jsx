 import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${props => props.size === 'small' ? '0.75rem 1.5rem' : props.size === 'large' ? '1.25rem 2.5rem' : '1rem 2rem'};
  font-size: ${props => props.size === 'small' ? '0.9rem' : props.size === 'large' ? '1.2rem' : '1rem'};
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.01em;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #2A7DE1;
          color: white;
          box-shadow: 0 8px 25px -8px rgba(42, 125, 225, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px -10px rgba(42, 125, 225, 0.4);
          }
        `;
      case 'secondary':
        return `
          background: #2ED1A2;
          color: white;
          box-shadow: 0 8px 25px -8px rgba(46, 209, 162, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px -10px rgba(46, 209, 162, 0.4);
          }
        `;
      case 'outline':
        return `
          background: #FFFFFF;
          color: #2A7DE1;
          border: 2px solid #2A7DE1;
          box-shadow: 0 4px 15px -5px rgba(42, 125, 225, 0.2);
          
          &:hover {
            background: #2A7DE1;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(42, 125, 225, 0.3);
          }
        `;
      default:
        return `
          background: #2A7DE1;
          color: white;
          box-shadow: 0 8px 25px -8px rgba(42, 125, 225, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px -10px rgba(42, 125, 225, 0.4);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 480px) {
    padding: ${props => props.size === 'small' ? '0.5rem 1rem' : props.size === 'large' ? '0.9rem 1.75rem' : '0.75rem 1.5rem'};
    font-size: ${props => props.size === 'large' ? '1rem' : '0.9rem'};
  }

  ${props => props.fullWidth && `
    width: 100%;
  `}

  ${props => props.rounded && `
    border-radius: ${props => props.theme.borderRadius.full};
  `}
`;

const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
