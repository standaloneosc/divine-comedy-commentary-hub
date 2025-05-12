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
// src/Pages/UserComments/styles.js
export const StatsContainer = styled.div`
  background: ${theme.colors.backgroundTan};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid ${theme.colors.accentBrown};

  h3 {
    margin-top: 0;
    text-align: center;
  }
`;

export const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid ${theme.colors.accentBrownLight};
  }

  th {
    font-weight: bold;
    background-color: ${theme.colors.backgroundTanClick};
  }

  tr:hover {
    background-color: ${theme.colors.backgroundTanClick};
  }
`;
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