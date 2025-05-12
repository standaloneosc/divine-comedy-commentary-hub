import React, { useContext, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { BiUpvote, BiSolidUpvote, BiStar, BiSolidStar, BiSolidXCircle, BiSolidTrash, BiSolidEditAlt } from "react-icons/bi"
import { RiReplyFill, RiReplyLine } from "react-icons/ri"
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { child, push, ref, serverTimestamp, set, update } from 'firebase/database'

import { auth, db } from '../../App'
import Button from '../Button'
import Spacer from '../Spacer'

import { PART_ABBREVIATIONS } from '../../Utils/constants'
import { getCommentUpdatesToMakeForRanges, getWordId } from '../../Utils/utility'
import { UserDataContext } from '../../Utils/context'

import { Container, OuterContainer } from './styles'

const ViewCommentModal = ({
  comment, commentKey, close,
  userUpvotes, userSaves,
  commentsPage,
}) => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const userData = useContext(UserDataContext)

  const [hasUpvoted, setHasUpvoted] = useState(userUpvotes && commentKey in userUpvotes && userUpvotes[commentKey])
  const [hasSaved, setHasSaved] = useState(userSaves && commentKey in userSaves && userSaves[commentKey])

  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment["comment"])
  const [editLoading, setEditLoading] = useState(false)

  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)

  const createdAt = comment["createdAt"] ? new Date(comment["createdAt"]) : new Date()
  const createdAtDate = format(createdAt, 'MM/dd/yy')
  const createdAtTime = comment.timestamp || format(createdAt, 'h:mm a')
  const upvotes = comment["upvotes"] || 0
  const nameOrYou = comment["user"] === user.uid ? "You" : comment["name"] || "Dantista Anonimo"

  useEffect(() => {
    setReplyText("")
    setEditText("")
    setReplying(false)
    setEditing(false)
  }, [commentKey])

  const toggleUpvote = () => {
    set(ref(db, `user-upvotes/${user.uid}/${commentKey}`), !hasUpvoted)

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
    set(ref(db, `user-saves/${user.uid}/${commentKey}`), !hasSaved)
      .then(() => {
        setHasSaved(!hasSaved)
      })
      .catch(err => {
        console.log("Error saving post:", err)
      })
  }

  const deleteComment = async () => {
    if (user.uid !== comment["user"]) return

    const keyAndSubfield = `${commentKey}/deleted`
    const updates = getCommentUpdatesToMakeForRanges(keyAndSubfield, user.uid, comment["ranges"], true)

    try {
      await update(ref(db), updates)
      if (close) close()
    } catch (err) {
      console.log("Error deleting post:", err)
    }
  }

  const editComment = async () => {
    if (user.uid !== comment["user"]) return

    setEditLoading(true)
    const keyAndSubfield = `${commentKey}/comment`
    const updates = getCommentUpdatesToMakeForRanges(keyAndSubfield, user.uid, comment["ranges"], editText)

    try {
      await update(ref(db), updates)
      setEditing(false)
    } catch (err) {
      console.log("Error editing comment:", err)
    }
    setEditLoading(false)
  }

  const cancelEditing = () => {
    setEditText(comment["comment"])
    setEditing(false)
  }

  const addReply = async () => {
    if (!replyText.length || userData?.demo) return

    setReplyLoading(true)
    const replyKey = push(child(ref(db), `comments/${commentKey}/replies`)).key
    const keyAndSubfield = `${commentKey}/replies/${replyKey}`
    const replyData = {
      reply: replyText,
      createdAt: serverTimestamp(),
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      user: user.uid,
      name: user.displayName,
    }
    const updates = getCommentUpdatesToMakeForRanges(keyAndSubfield, comment["user"], comment["ranges"], replyData)

    try {
      await update(ref(db), updates)
      setReplying(false)
      setReplyText("")
    } catch (err) {
      console.log("Error adding reply:", err)
    }
    setReplyLoading(false)
  }

  const cancelReply = () => {
    setReplying(false)
    setReplyText("")
  }

  const clickCommentRange = (part, canto, startLine, startWord) => {
    const id = getWordId(part, canto, startLine, startWord)
    navigate(`/${part}/${canto}#${id}`)
    if (document.getElementById(id)) {
      document.getElementById(id).scrollIntoView()
    }
  }

  const clickUsername = u => {
    if (u === user.uid) {
      navigate("/comments")
    } else {
      navigate(`/user/${u}`)
    }
  }

  return (
    <OuterContainer>
      <Container commentsPage={commentsPage}>
        <div className="header">
          <div className="ranges">
            {comment["ranges"].map((r, idx) => {
              const { part, canto, startLine, endLine, startWord } = r
              const lines = startLine === endLine ? startLine : `${startLine}-${endLine}`
              const comma = idx < comment["ranges"].length - 1? "," : ""

              return (
                <span onClick={() => clickCommentRange(part, canto, startLine, startWord)} key={`range-${idx}`}>
                  {`${PART_ABBREVIATIONS[part]} ${canto}.${lines}${comma}`}
                </span>
              )
            })}
          </div>
          <div className="right">
            <span className="date">{createdAtDate} at {createdAtTime}</span>
            {close && <BiSolidXCircle onClick={close} />}
            {comment["deleted"] ? (
              <>Deleted</>
            ) : (commentsPage && comment["user"] === user.uid) && (
              <>
                <BiSolidEditAlt className="edit" onClick={() => setEditing(true)} />
                <BiSolidTrash onClick={deleteComment} />
              </>
            )}
          </div>
        </div>
        <div className="comment">
          <div className="name">
            <div>
              <span onClick={() => clickUsername(comment["user"])}>{nameOrYou}</span> 
              {' '}commented
            </div>
          </div>
          {editing 
            ? <>
                <textarea 
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <div className='editButtons'>
                  <Button small text="Cancel" onClick={cancelEditing} />
                  <Spacer width="12px" />
                  <Button small text="Submit" onClick={editComment} loading={editLoading} />
                </div>
              </>
            : comment["comment"]
          }
        </div>
        <div className="actions">
          <div className="action" onClick={toggleUpvote}>
            {comment["upvotes"] || 0}
            {hasUpvoted ? <BiSolidUpvote /> : <BiUpvote />}
          </div>
          <div className="action" onClick={() => setReplying(!replying)}>
            Reply
            {replying ? <RiReplyFill /> : <RiReplyLine />}
          </div>
          <div className="action" onClick={toggleSave}>
            Save
            {hasSaved ? <BiSolidStar /> : <BiStar />}
          </div>
        </div>
      </Container>
      {replying && (
        <Container commentsPage={commentsPage}>
          <div className='header'>
            <div className='ranges'>Add a Reply</div>
          </div>
          <div className="comment">
            <textarea 
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <div className='editButtons'>
              <Button small text="Cancel" onClick={cancelReply} />
              <Spacer width="12px" />
              <Button small text="Submit" onClick={addReply} loading={replyLoading} disabled={userData?.demo} />
            </div>
            {userData?.demo && <div className="error">You can not add replies with a guest/demo account.</div>}
          </div>
        </Container>
      )}
      {comment?.replies && (
        <Container commentsPage={commentsPage} className='replyBox'>
          <div className='header'>
            <div className='ranges'>Replies</div>
          </div>
          {Object.keys(comment.replies).map(k => {
            const reply = comment.replies[k]
            const nameOrYou = reply.user === user.uid ? "You" : reply["name"] || "Dantista Anonimo"
            const replyTime = reply.timestamp || format(new Date(reply.createdAt), 'h:mm a')

            return (
              <div className="comment reply" key={k}>
                <div className="name">
                  <div>
                    <span onClick={() => clickUsername(reply.user)}>{nameOrYou}</span> 
                    {' '}replied
                  </div>
                  <div className="date">{format(new Date(reply.createdAt), 'MM/dd/yy')} at {replyTime}</div>
                </div>
                {reply.reply}
              </div>
            )
          })}
      </Container>
      )}
    </OuterContainer>
  )
}

export default ViewCommentModal