import styled from "styled-components"
import { theme } from "../../theme"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 24px;

  border: 2px solid ${theme.colors.backgroundBrown};
  border-radius: 8px;
  width: 324px;

  h3 {
    margin: 0 0 18px 0;
  }
`

export const Input = styled.input`
  padding: 12px;
  border: 2px solid ${theme.colors.backgroundBrown};
  background: ${theme.colors.backgroundTan};
  outline: none;
  border-radius: 8px;
  margin-bottom: 12px;
  width: 60%;
`

export const SwitchLoginSignup = styled.div`
  font-size: 12px;

  span {
    margin-left: 4px;
    text-decoration: underline;
    cursor: pointer;
  }
`

export const Error = styled.div`
  color: ${theme.colors.red};
  font-size: 12px;
  margin-bottom: 12px;
`

export const SelectGroup = styled.div`
  position: relative;
  cursor: pointer;

  >select {
    background: none;
    outline: none;
    box-shadow: none;
    -webkit-appearance: none;
    border: 2px solid ${theme.colors.backgroundBrown};
    padding: 12px;
    border-radius: 8px;
    width: 222px;
    cursor: pointer;
    color: ${props => props.notSelected && theme.colors.textGrayLight};
  }

  svg {
    position: absolute;
    right: 12px;
    top: 12px;
    color: ${theme.colors.backgroundBrown};
    pointer-events: none;
  }
`