import styled from 'styled-components'
import { theme } from '../../theme'

export const NavContainer = styled.div`
  width: 100%;
  /* max-width: ${theme.sizes.pageMaxWidth}; */
  margin: 0 auto;
  background: ${theme.colors.backgroundTan};
  border-bottom: 2px solid ${theme.colors.backgroundBrown};
`

export const OuterContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  position: relative;
`

export const InnerContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    font-weight: bold;
    font-size: 36px;
    font-family: ${theme.fonts.almendra};
    margin-bottom: 12px;
    color: ${theme.colors.backgroundBrown};
    cursor: pointer;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
`

export const UserArea = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 72px;
  top: 36px;

  .initials {
    background: ${theme.colors.backgroundBrown};
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    transition: 0.25s all;

    &:hover {
      background: ${theme.colors.backgroundBrownHover};
    }
  }
`

export const UserDropdown = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 48px;
  right: 0;

  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 5px rgba(50, 50, 50, 0.3);
  border: 2px solid ${theme.colors.backgroundBrown};
  z-index: 10;

  >div {
    white-space: nowrap;
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 2px solid ${theme.colors.backgroundBrown};
    transition: 0.25s all;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: rgba(50, 50, 50, 0.1);
    }
  }
`