import styled from "styled-components";
import { theme } from "../../theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-family: ${theme.fonts.almendra};
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 90vw;
  max-width: 512px;

  .button {
    display: flex;
    flex: 0.1;
    justify-content: flex-start;
  }

  .title {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  .right {
    flex: 0.1;
    display: flex;
    justify-content: flex-end;
  }
`