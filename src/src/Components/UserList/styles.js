import styled from "styled-components";
import { theme } from "../../theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

export const Dropdown = styled.div`
  background-color: ${theme.colors.backgroundTan};
  color: ${theme.colors.textGray};
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.accentBrown};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 360px;
  font-family: ${theme.fonts.garamond};
`;

export const Title = styled.h2`
  font-size: 1.2rem;
  color: ${theme.colors.accentBrown};
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  font-family: ${theme.fonts.almendra};
  text-align: center;
`;

export const UserListScroll = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.accentBrown} ${theme.colors.backgroundTan};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.accentBrown};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundTan};
  }
`;

export const UserItem = styled.div`
  padding: 10px;
  margin-bottom: 6px;
  background-color: ${theme.colors.highlightBrown};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: center;
  color: ${theme.colors.offBlack};
  font-weight: bold;

  &:hover {
    background-color: ${theme.colors.highlightBrownHover};
  }

  &:focus {
    outline: none;
  }
`;

export const Username = styled.p`
  margin: 0;
  font-size: 1rem;
`;

export const EmptyMessage = styled.p`
  margin-top: 16px;
  font-style: italic;
  color: ${theme.colors.textGrayLight};
  text-align: center;
`;
