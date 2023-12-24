import styled from "styled-components"
import { theme } from "../../theme"

export const InputStyle = styled.input`
  padding: 12px;
  border: 2px solid ${theme.colors.backgroundBrown};
  background: ${theme.colors.backgroundTan};
  outline: none;
  border-radius: 8px;
  margin-bottom: 12px;
  width: 60%;
`