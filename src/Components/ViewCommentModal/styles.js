import styled, { css } from "styled-components"
import { theme } from "../../theme"

export const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 324px;

  .replyBox {
    border-color: ${theme.colors.accentBrownLight};

    .header {
      background: ${theme.colors.accentBrownLight};
    }
  }
`

export const Container = styled.div`
  background: ${theme.colors.backgroundTan};
  border: 2px solid ${theme.colors.accentBrown};
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(50, 50, 50, 0.3);
  text-align: left;
  font-size: 14px;
  margin-bottom: 12px;

  ${props => props.commentsPage && css`
    box-shadow: none;
    width: 512px;
  `}

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: ${theme.colors.accentBrown};
    color: white;
    font-size: 14px;

    .ranges {
      /* flex: 1; */
      display: flex;
      align-self: center;
      justify-content: flex-start;
      overflow-x: scroll;
      font-weight: bold;

      span {
        margin: 0 2px;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .right {
      color: #f2b679;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .date {
        margin-right: 8px;
      }

      .edit {
        margin-right: 8px;
      }

      svg {
        cursor: pointer;

        &:hover {
          color: #ffe3c7;
        }
      }
    }
  }

  .reply {
    border-bottom: 1px solid ${theme.colors.backgroundTanClick};
    &:last-child {
      border: none;
    }
  }

  .comment {
    padding: 12px;
    max-height: 324px;
    overflow: scroll;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    
    white-space: pre-line;
    font-size: 12px;

    .name {
      margin-bottom: 8px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      
      span {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }

      .date {
        color: ${theme.colors.textGray};
        font-weight: normal;
      }
    }

    textarea {
      flex: 1;
      border: 2px solid ${theme.colors.accentBrown};
      outline: none;
      border-radius: 8px;
      padding: 12px;
      min-height: 124px;
      font-family: ${theme.fonts.garamond};
    }

    .editButtons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
    }
  }

  .reply {

  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 12px;
    font-size: 16px;

    border-top: 2px solid ${theme.colors.accentBrown};

    .action {
      display: flex;
      align-items: center;
      transition: 0.25s all;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;

      svg {
        margin-left: 8px;
      }

      &:hover {
        background: rgba(50, 50, 50, 0.1);
      }
    }
  }
`
