import styled from 'styled-components'

const SpacerStyle = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
`

const Spacer = ({ width = 0, height = 0 }) => {
  return <SpacerStyle width={width} height={height} />
}

export default Spacer