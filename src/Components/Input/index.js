import React from 'react'
import { InputStyle } from './styles'

const Input = ({
    value, setValue, upperCaseOnly, maxLength, ...props
}) => {
  return (
    <InputStyle
      value={value}
      onChange={e => {
        if (e.target.value.length > maxLength) return

        if (upperCaseOnly) {
          setValue(e.target.value.toUpperCase())
        } else {
          setValue(e.target.value)
        }
      }}
      {...props}
    />
  )
}

export default Input