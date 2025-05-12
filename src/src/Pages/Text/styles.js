import styled, { css } from "styled-components"
import { theme } from "../../theme"

export const CantoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: ${theme.fonts.garamond};
  position: relative;

  .title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-weight: bold;
    font-size: 24px;

    width: 100%;

    >div {
      flex: 1;
    }

    .groupToggle {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      font-size: 12px;
      font-weight: normal;

      b {
        margin-left: 3px;
      }

      select {
        outline: none;
      }
    }
  }

  @media screen and (max-width: ${theme.sizes.tablet}) {
    .title {
      flex-direction: column;

      .groupToggle {
        margin-top: 8px;
      }
    }
  }

  .body {
    display: flex;
    font-size: 18px;

    .lineNumbers {
      text-align: right;
      margin-right: 20px;
      color: ${theme.colors.textGrayLight};
    }

    .lines {
      text-align: left;
      color: ${theme.colors.offBlack};
      margin-top: -2px;
    }

    .comments {
      margin-left: 12px;
    }

    .terzina {
      margin: 24px 0;
    }
  }
`

export const Line = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;

  .word {
    transition: 0.25s all;
    background: ${theme.colors.backgroundTan};
  }

  .word {
    white-space: pre;

    &:last-child {
      white-space: unset;
    }
  }

  .word.hover-highlighted {
    background: ${theme.colors.highlightBrownHover};
  }

  .word.viewing-highlighted {
    background: ${theme.colors.highlightBrown};
  }

  .word.highlighted {
    background: rgba(240, 151, 60, 0.7);
  }
`

export const ActionContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
`

export const CommentsHolder = styled.div`
  display: flex;
  align-items: center;
  height: 1.305em;
  position: relative;

  .viewCommentModal {
    position: absolute;
    left: 48px;
    top: 0;
  }
`

export const CommentBubble = styled.div`
  background: ${theme.colors.backgroundTanHover};
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 12px;
  margin-right: -16px;
  box-shadow: 0 2px 5px rgba(50, 50, 50, 0.3);

  transition: 0.25s all;
  cursor: pointer;
  z-index: 1;

  &:first-child {
    z-index: 2;
  }

  &:hover {
    background: ${theme.colors.highlightBrownHover};
  }

  ${props => props.selected && css`
    background: ${theme.colors.highlightBrown};
    z-index: 3;

    &:hover {
      background: ${theme.colors.highlightBrown};
    }
  `}
`

export const Painting = styled.div`
  width: 324px;
  position: absolute;
  left: 4%;
  top: 60px;

  img {
    width: 100%;
    height: auto;
  }

  @media screen and (max-width: 1248px) {
    display: none;
  }

  p {
    margin: 0;
    text-align: left;
    color: ${theme.colors.textGray};
    font-size: 14px;

    &:nth-child(3) {
      color: ${theme.colors.textGrayLight};
    }
  }
`