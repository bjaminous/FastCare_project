import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }

  ${props => props.error && `
    border-color: ${props.theme.colors.error};
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

const Input = ({ ...props }) => {
  return <StyledInput {...props} />;
};

export default Input;
