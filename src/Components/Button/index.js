import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { ButtonContainer } from './styles'
import { theme } from '../../theme'

const Button = ({ text, onClick, icon, primary, loading }) => {
  if (loading) {
    return (
      <ButtonContainer 
        iconOnly={icon && !text ? 1 : 0}
        primary={primary}
      >
        <ThreeDots
          width="30"
          color={theme.colors.backgroundBrown}
        />
      </ButtonContainer>
    )
  }

  return ( 
  <ButtonContainer
    onClick = {onClick}
    iconOnly={icon && !text ? 1 : 0}
    primary={primary}
  >
    {icon ? icon : null}
    {text}
  </ButtonContainer>  
  )
}
                
export default Button