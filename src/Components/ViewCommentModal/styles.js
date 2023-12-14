import styled, { css } from "styled-components"
import { theme } from "../../theme"

export const Container = styled.div`
  background: ${theme.colors.backgroundTan};
  border: 2px solid ${theme.colors.backgroundBrown};
  width: 324px;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(50, 50, 50, 0.3);
  text-align: left;
  font-size: 14px;

  ${props => props.commentsPage && css`
    box-shadow: none;
    width: 512px;
  `}

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: ${theme.colors.backgroundBrown};
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
      /* flex: 1; */
      color: #f2b679;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .date {
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

  .comment {
    padding: 12px;
    font-size: 12px;
    max-height: 324px;
    overflow: scroll;

    .name {
      margin-bottom: 8px;
      font-weight: bold;
    }
}

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 12px;
    font-size: 16px;

    border-top: 2px solid ${theme.colors.backgroundBrown};

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