import React, { useState } from 'react'
import { format } from 'date-fns'
import { BiUpvote, BiSolidUpvote, BiStar, BiSolidStar, BiSolidXCircle, BiSolidTrash } from "react-icons/bi"
import { useNavigate } from 'react-router-dom'

import { Container } from './styles'
import { ref, set, update } from 'firebase/database'
import { auth, db } from '../../App'
import { getCommentUpdatesToMakeForRanges, getWordId } from '../../Utils/utility'
import { useAuthState } from 'react-firebase-hooks/auth'
import { PART_ABBREVIATIONS } from '../../Utils/constants'

const  ViewCommentModal = ({
  comment, commentKey, close,
  userUpvotes, userSaves,
  commentsPage,
}) => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()

  const [hasUpvoted, setHasUpvoted] = useState(userUpvotes && commentKey in userUpvotes && userUpvotes[commentKey])
  const [hasSaved, setHasSaved] = useState(userSaves && commentKey in userSaves && userSaves[commentKey])

  const createdAt = comment["createdAt"] ? new Date(comment["createdAt"]) : new Date()
  const createdAtDate = format(createdAt, 'MM/dd/yy')
  const upvotes = comment["upvotes"] || 0
  const nameOrYou = comment["user"] === user.uid ? "You" : comment["name"] || "Dantista Anonimo"

  const toggleUpvote = () => {
    set(ref(db, `user-upvotes/${user.uid}/${commentKey}`), !hasUpvoted)

    console.log('toggle upvote for comment', commentKey)
    const key = `${commentKey}/upvotes`
    const newUpvotes = upvotes + (-2 * hasUpvoted + 1)
    const updates = getCommentUpdatesToMakeForRanges(key, comment["user"], comment["ranges"], newUpvotes)

    update(ref(db), updates)
      .then(() => {
        setHasUpvoted(!hasUpvoted)
      })
      .catch(err => {
        console.log("Error upvoting post:", err)
      })
  }

  const toggleSave = () => {
    console.log('toggle save for comment', commentKey)
    set(ref(db, `user-saves/${user.uid}/${commentKey}`), !hasSaved)
      .then(() => {
        setHasSaved(!hasSaved)
      })
      .catch(err => {
        console.log("Error saving post:", err)
      })
  }

  const deleteComment = () => {
    const updates = getCommentUpdatesToMakeForRanges(commentKey, comment["user"], comment["ranges"], null)
    update(ref(db), updates)
      .then(() => {
        if (close) close()
      })
      .catch(err => {
        console.log("Error deleting post:", err)
      })
  }

  const clickCommentRange = (part, canto, startLine, startWord) => {
    const id = getWordId(part, canto, startLine, startWord)
    navigate(`/${part}/${canto}#${id}`)
    if (document.getElementById(id)) {
      document.getElementById(id).scrollIntoView()
    }
  }

  return (
    <Container commentsPage={commentsPage}>
      <div className="header">
        <div className="ranges">
          {comment["ranges"].map((r, idx) => {
            const { part, canto, startLine, endLine, startWord } = r
            const lines = startLine === endLine ? startLine : `${startLine}-${endLine}`
            const comma = idx < comment["ranges"].length - 1? "," : ""

            return (
              <span onClick={() => clickCommentRange(part, canto, startLine, startWord)}>
                {`${PART_ABBREVIATIONS[part]} ${canto}.${lines}${comma}`}
              </span>
            )
          })}
        </div>
        <div className="right">
          <span className="date">{createdAtDate}</span>
          {close && <BiSolidXCircle onClick={close} />}
          {(commentsPage && comment["user"] === user.uid) && <BiSolidTrash onClick={deleteComment} />}
        </div>
      </div>
      <div className="comment">
        <div className="name">{`${nameOrYou} commented`}</div>
        {comment["comment"]}
      </div>
      <div className="actions">
        <div className="action" onClick={toggleUpvote}>
          {comment["upvotes"] || 0}
          {hasUpvoted ? <BiSolidUpvote /> : <BiUpvote />}
        </div>
        <div className="action" onClick={toggleSave}>
          Save
          {hasSaved ? <BiSolidStar /> : <BiStar />}
        </div>
      </div>
    </Container>
  )
}

export default ViewCommentModal