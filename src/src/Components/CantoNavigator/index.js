import { useNavigate } from "react-router-dom"

import { CantoItem, CantosContainer, PartContainer } from './styles'


const CantoNavigator = ({ hideCantoNav, currentPart, currentCanto }) => {
  const navigate = useNavigate()
  
  return (
    <CantosContainer>
      <PartContainer>
        <div className='partTitle'>Inferno</div>
        <div className='list'>
          {[...Array(34).keys()].map((i, idx) => (
            <CantoItem
              current={currentPart === 'inferno' && currentCanto === idx + 1 ? 1 : 0}
              onClick={() => {
                hideCantoNav && hideCantoNav()
                navigate(`/inferno/${idx + 1}`)
              }}
              key={`button-inferno-${idx}`}
            >
              {i + 1}
            </CantoItem>
          ))}
        </div>
      </PartContainer>
      <PartContainer>
        <div className='partTitle'>Purgatorio</div>
        <div className='list'>
          {[...Array(33).keys()].map((i, idx) => (
            <CantoItem
              current={currentPart === 'purgatorio' && currentCanto === idx + 1 ? 1 : 0}
              onClick={() => {
                hideCantoNav && hideCantoNav()
                navigate(`/purgatorio/${idx + 1}`)
              }}
              key={`button-purgatorio-${idx}`}
            >
              {i + 1}
            </CantoItem>
          ))}
        </div>
      </PartContainer>
      <PartContainer>
        <div className='partTitle'>Paradiso</div>
        <div className='list'>
          {[...Array(33).keys()].map((i, idx) => (
            <CantoItem
              current={currentPart === 'paradiso' && currentCanto === idx + 1 ? 1 : 0}
              onClick={() => {
                hideCantoNav && hideCantoNav()
                navigate(`/paradiso/${idx + 1}`)
              }}
              key={`button-paradiso-${idx}`}
            >
              {i + 1}
            </CantoItem>
          ))}
        </div>
      </PartContainer>
    </CantosContainer>
  )
}

export default CantoNavigator