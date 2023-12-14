import { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
import { BsFillCircleFill } from "react-icons/bs"
import { useAuthState } from 'react-firebase-hooks/auth'
import { ref, update, push, child, serverTimestamp } from "firebase/database"

import { auth, db } from '../../App'

import Button from "../Button"
import Spacer from '../Spacer'

import { PART_ABBREVIATIONS } from "../../Utils/constants"
import { getCommentUpdatesToMakeForRanges } from "../../Utils/utility"

import {
  Container, TextBox, RangeBox, Label,
  Actions, Remove, RangeItem, Checkbox
} from "./styles"

const SelectAndCommentModal = ({
  modalVisible, cancel, highlightedRanges, deleteRange, isCommenting, setIsCommenting,
}) => {
  const [user] = useAuthState(auth)

  const [comment, setComment] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [visible, setVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (modalVisible) {
      setVisible(true)
    }
  }, [modalVisible])

  const doneSelecting = () => {
    if (!highlightedRanges.length) return

    setIsCommenting(true)
  }

  const submitComment = () => {
    if (!highlightedRanges.length || !comment) return
    setSubmitLoading(true)

    const commentData = {
      user: user.uid,
      name: user.displayName,
      ranges: highlightedRanges,
      comment,
      upvotes: 0,
      createdAt: serverTimestamp(),
      private: isPrivate,
    }

    const newCommentKey = push(child(ref(db), 'comments')).key
    const updates = getCommentUpdatesToMakeForRanges(newCommentKey, user.uid, highlightedRanges, commentData)

    update(ref(db), updates)
      .then(() => {
        setSubmitLoading(false)
        setComment("")
        setIsCommenting(false)
        cancel()
      })
      .catch(err => {
        console.log("Error submitting comment:", err)
      })
  }

  if (!modalVisible) return null

  return (
    <Container visible={visible ? 1 : 0}>
      {isCommenting ? (
        <>
          <Label>Write your comment</Label>
          <TextBox value={comment} onChange={e => setComment(e.target.value)}/>
          <Checkbox>
            <input
              type="checkbox"
              id="public-private-checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
            <label for="public-private-checkbox">Make this comment private so only I can view it</label>
          </Checkbox>
          <Actions>
            <Button text="Back" onClick={() => setIsCommenting(false)} />
            <Spacer width="12px" />
            <Button text="Submit Comment" onClick={submitComment} loading={submitLoading} />
          </Actions>
        </>
      ) : (
        <>
        <Label>Select range(s) to comment on</Label>
        <RangeBox>
            {highlightedRanges.length === 0 ?
              <RangeItem light>
                Highlight text with your cursor to select...
              </RangeItem>
            : highlightedRanges.map((r, idx) => {
              const { part, canto, startLine, endLine } = r
              const lines = startLine === endLine ? startLine : `${startLine}-${endLine}`

              return (
                <RangeItem key={`range-${idx}`}>
                  <BsFillCircleFill style={{ fontSize: '6px', marginRight: '12px' }}/>
                  {`${PART_ABBREVIATIONS[part]} ${canto}.${lines}`}
                  <Remove onClick={() => deleteRange(idx)}>
                    <IoMdClose />
                  </Remove>
                </RangeItem>
              )
            })}
        </RangeBox>
        <Actions>
          <Button text="Cancel" onClick={cancel} />
          <Spacer width="12px" />
          <Button text="Done Selecting" onClick={doneSelecting} />
        </Actions>
        </>
      )}
      
    </Container>
  )
}

export default SelectAndCommentModal