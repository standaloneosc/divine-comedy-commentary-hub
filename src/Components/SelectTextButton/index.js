import { useEffect, useState } from "react";
import { ButtonContainer } from "./styles"
import { LuTextCursorInput } from "react-icons/lu";


const SelectTextButton = ({ modalVisible, openModal }) => {
  const [selecting, setSelecting] = useState(false)

  const changeModalToVisible = () => setTimeout(openModal, 250)

  useEffect(() => {
    if (!modalVisible) {
      setSelecting(false)
    }
  }, [modalVisible])

  if (modalVisible) {
    return null
  }

  return (
    <ButtonContainer
      selecting={selecting ? 1 : 0}
      onClick={() => {
        setSelecting(!selecting)
        if (!selecting) {
          changeModalToVisible()
        }
      }}
    >
      {!selecting ? <LuTextCursorInput /> :
      null
      }
    </ButtonContainer>
  )
}

export default SelectTextButton