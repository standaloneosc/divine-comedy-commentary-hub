import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { ButtonContainer } from './styles';
import { theme } from '../../theme';

const Button = ({
  text, onClick, icon, primary, loading, small, disabled
}) => {
  if (loading) {
    return (
      <ButtonContainer 
        iconOnly={icon && !text ? 1 : 0}
        primary={primary}
        small={small}
      >
        <ThreeDots
          width="30"
          color={theme.colors.accentBrown}
        />
      </ButtonContainer>
    )
  }

  return (
    <ButtonContainer
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      iconOnly={icon && !text ? 1 : 0}
      primary={primary}
      small={small}
      disabled={disabled}
    >
      {icon ? icon : null}
      {text && <span>{text}</span>} {/* Make sure text is wrapped in a <span> */}
    </ButtonContainer>
  );
};

export default Button;
