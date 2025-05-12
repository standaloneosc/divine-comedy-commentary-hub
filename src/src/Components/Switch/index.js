import React from 'react'
import styled from 'styled-components'
import { theme } from '../../theme'

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + .slider {
    background-color: ${theme.colors.accentBrown};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px ${theme.colors.accentBrown};
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(14px);
    -ms-transform: translateX(14px);
    transform: translateX(14px);
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: 0.25s background-color;
    border-radius: 12px;

    &:hover {
      background-color: ${theme.colors.highlightBrown};
    }

    &:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: ${theme.colors.backgroundTan};
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 50%;
    }
  }
`

const Switch = ({ checked, setChecked }) => (
  <SwitchContainer>
    <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
    <span className="slider" />
  </SwitchContainer>
)

export default Switch