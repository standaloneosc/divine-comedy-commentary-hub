import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import _ from 'underscore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ref, onValue } from "firebase/database"

import { auth, db } from '../../App'

import BaseLayout from '../../Layouts/BaseLayout/index'
import Home from '../Home'
import SelectTextButton from '../../Components/SelectTextButton'
import SelectAndCommentModal from "../../Components/SelectAndCommentModal"
import ViewCommentModal from '../../Components/ViewCommentModal'

import { HIGHLIGHTED_CLASS, HOVER_HIGHLIGHTED_CLASS, SELECT_DEFAULT, VIEWING_HIGHLIGHTED_CLASS } from '../../Utils/constants'
import { mergeRangesAllParts } from '../../Utils/mergeRanges'
import { capitalize, countWords, getInitials, getLineNumFromId, getWordId, getWordNumFromId, parseCantoParam } from '../../Utils/utility'
import { ActionContainer, CantoContainer, CommentBubble, CommentsHolder, Line, Painting } from './styles'
import { highlightRanges } from '../../Utils/highlightRanges'
import { paintings } from '../../Utils/assets'
import Switch from '../../Components/Switch'
import Spacer from '../../Components/Spacer'
import { UserDataContext } from '../../Utils/context'

const Text = ({ part, commediaData, userUpvotes, userSaves }) => {
  const [user, userLoading, userError] = useAuthState(auth)
  const userData = useContext(UserDataContext)

  const navigate = useNavigate()
  const location = useLocation()

  const [modalVisible, setModalVisible] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [highlightedRanges, setHighlightedRanges] = useState([])
  const [hoverRanges, setHoverRanges] = useState([])

  const [viewingCommentKey, setViewingCommentKey] = useState(null)
  const [viewingCommentLine, setViewingCommentLine] = useState(null)
  const [onlyShowGroup, setOnlyShowGroup] = useState(false)

  const [cantoComments, setCantoComments] = useState(null)
  const [allGroups, setAllGroups] = useState(null)

  const viewingComment = (viewingCommentKey && cantoComments)
    ? cantoComments[Object.keys(cantoComments).find(k => k === viewingCommentKey)]
    : null

  let canto
  const { canto: cantoParam } = useParams()

  // Scroll to proper place!
  useEffect(() => {
    if (!location.hash || !canto) return
    const id = location.hash.slice(1)
    const el = document.getElementById(id)

    if (el) {
      el.scrollIntoView()
    }
  }, [location, canto])

  // Data fetching
  useEffect(() => {
    const cantoNum = parseCantoParam(cantoParam, part)
    if (!cantoNum) return
    setCantoComments([])

    const commentsRef = ref(db, `canto-comments/${part}/${cantoNum}`);
    return onValue(commentsRef, snapshot => {
      if (snapshot.exists()) {
        let comments = snapshot.val()
        Object.keys(comments).forEach(k => {
          if ((comments[k]["private"] && comments[k]["user"] !== user.uid) || comments[k]["deleted"]) {
            delete comments[k]
          }
        })
        setCantoComments(comments)
      }
    });
  }, [user, cantoParam, part])

  useEffect(() => {
    const groupsRef = ref(db, `groups`)
    return onValue(groupsRef, snapshot => {
      if (snapshot.exists()) {
        const groups = snapshot.val()
        setAllGroups(groups)
      }
    })
  }, [])

  useEffect(() => {
    highlightRanges(highlightedRanges, canto, HIGHLIGHTED_CLASS)
  }, [highlightedRanges, canto, part, cantoParam])

  useEffect(() => {
    if (hoverRanges.length) {
      highlightRanges(hoverRanges, canto, HOVER_HIGHLIGHTED_CLASS)
    }
    if (viewingComment) {
      highlightRanges(viewingComment["ranges"], canto, VIEWING_HIGHLIGHTED_CLASS)
    }
    
  }, [hoverRanges, viewingComment, canto, part, cantoParam])

  if (userLoading) {
      return (
        <BaseLayout>
          <p>Loading...</p>
        </BaseLayout>
      )
  } else if (userError) {
    return (
      <BaseLayout>
        <p>An authentication error occurred. Please  
          <span
            onClick={() => navigate("/auth")}
            style={{ marginLeft: '4px', textDecoration: 'underline', cursor: 'pointer' }}
          >
            try again
          </span>
          .
        </p>
      </BaseLayout>
    )
  } else if (!user) {
    return <Navigate to="/auth" />
  }

  const deleteRange = rangeIdx => {
    removeHighlightingFromRange(rangeIdx, highlightedRanges, HIGHLIGHTED_CLASS)

    const newRanges = [...highlightedRanges]
    newRanges.splice(rangeIdx, 1)
    setHighlightedRanges(newRanges)
  }

  const removeHighlightingFromRange = (rangeIdx, ranges, classToRemove=HIGHLIGHTED_CLASS) => {
    const r = ranges[rangeIdx]

    if (r["canto"] !== canto["number"]) return

    const lineRange = _.range(r["startLine"], r["endLine"] + 1)

    for (let line of lineRange) {
      let wordRange
      if (lineRange.length === 1) {
        wordRange = _.range(r["startWord"], r["endWord"] + 1)
      } else if (line === r["startLine"]) {
        wordRange = _.range(r["startWord"], countWords(canto["lines"][line - 1]) + 1)
      } else if (line === r["endLine"]) {
        wordRange = _.range(1, r["endWord"] + 1)
      } else {
        wordRange = _.range(1, countWords(canto["lines"][line - 1]) + 1)
      }

      for (let word of wordRange) {
        const el = document.getElementById(getWordId(r["part"], r["canto"], line, word))
        if (!el) continue

        if (el.classList.contains(classToRemove)) {
          el.classList.remove(classToRemove)
        }
      }
    }
  }

  const cancelHighlighting = () => {
    for (let i = 0; i < highlightedRanges.length; i++) {
      removeHighlightingFromRange(i, highlightedRanges, HIGHLIGHTED_CLASS)
    }

    setHighlightedRanges([])
    setModalVisible(false)
  }

  const unhoverHighlighting = () => {
    for (let i = 0; i < hoverRanges.length; i++) {
      removeHighlightingFromRange(i, hoverRanges, HOVER_HIGHLIGHTED_CLASS)
    }

    setHoverRanges([])
  }

  const unhighlightViewedComment = () => {
    if (!viewingComment) return
    for (let i = 0; i < viewingComment["ranges"].length; i++) {
      removeHighlightingFromRange(i, viewingComment["ranges"], VIEWING_HIGHLIGHTED_CLASS)
    }

    setViewingCommentKey(null)
    setViewingCommentLine(null)
  }

  if (!commediaData) {
    return (
      <BaseLayout>
        <p>Loading...</p>
      </BaseLayout>
    )
  }

  const cantoNum = parseCantoParam(cantoParam, part)
  if (!cantoNum) return <Home />
  canto = commediaData[part][cantoNum - 1]

  if (!canto) {
    return (
      <Home />
    )
  }

  // console.log("Canto data:", canto)
  // console.log("Comment data:", cantoComments)

  const onMouseUpLines = () => {
    if (!modalVisible || isCommenting) return

    const sel = window.getSelection()

    let startLineNum, startWordNum, endLineNum, endWordNum

    let anchorId
    if (sel.anchorNode.id) {
      anchorId = sel.anchorNode.id
    } else {
      anchorId = sel.anchorNode.parentElement.id
    }

    startLineNum = getLineNumFromId(anchorId)
    startWordNum = getWordNumFromId(anchorId)

    let focusId
    if (sel.focusNode.id) {
      focusId = sel.focusNode.id
    } else {
      focusId = sel.focusNode.parentElement.id
    }

    endLineNum = getLineNumFromId(focusId)
    endWordNum = getWordNumFromId(focusId)

    let startOffset = sel.anchorOffset
    let endOffset = sel.focusOffset

    if (startLineNum === endLineNum && startOffset === endOffset) return

    if (startLineNum > endLineNum) {
      let tmp = startLineNum
      startLineNum = endLineNum
      endLineNum = tmp

      tmp = startWordNum
      startWordNum = endWordNum
      endWordNum = tmp
    } else if (startWordNum > endWordNum) {
      [startWordNum, endWordNum] = [endWordNum, startWordNum]
    }

    console.log(`Selected text: ${startLineNum}.${startWordNum} - ${endLineNum}.${endWordNum}`)

    if (isNaN(startLineNum) || isNaN(endLineNum) || isNaN(startWordNum) || isNaN(endWordNum)) {
      console.log("Got NaN, parent info:", sel)
      return
    }

    const newRange = {
      part,
      canto: canto["number"],
      startLine: startLineNum,
      endLine: endLineNum,
      startWord: startWordNum,
      endWord: endWordNum,
    }
    let ranges = mergeRangesAllParts([...highlightedRanges, newRange])
    setHighlightedRanges(ranges)

    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
  }

  const getCommentsNodeForLine = lineNum => {
    let comments = []

    for (let key in cantoComments) {
      if (key === "undefined") continue
      
      const comment = cantoComments[key]
      for (let r of comment["ranges"]) {
        if (r["startLine"] === lineNum && r["part"] === part && r["canto"] === cantoNum) {
          comments.push({ ...comment, key })
          continue
        }
      }
    }

    console.log('only:', onlyShowGroup)
    if (onlyShowGroup === true) {
      comments = comments.filter(c => c.group === userData.group)
    } else if (onlyShowGroup && onlyShowGroup !== SELECT_DEFAULT) {
      // Admin has selected a group to filter by
      comments = comments.filter(c => c.group === onlyShowGroup)
    }

    if (!comments.length) return <CommentsHolder />

    return (
      <CommentsHolder>
        {comments
          .sort((a, b) => b["upvotes"] - a["upvotes"])
          .slice(0, 3)
          .map((c, idx) => (
          <>
            <CommentBubble
              onMouseEnter={() => setHoverRanges(c["ranges"])}
              onMouseLeave={unhoverHighlighting}
              onClick={() => {
                unhighlightViewedComment()
                setViewingCommentKey(c["key"])
                setViewingCommentLine(lineNum)
              }}
              selected={viewingCommentKey === c["key"] ? 1 : 0}
              key={`bubble-${lineNum}-${idx}`}
            >
              {getInitials(c["name"])}
            </CommentBubble>
          </>
        ))}
        {(viewingCommentLine === lineNum && viewingComment) && (
          <div className="viewCommentModal">
            <ViewCommentModal
              comment={viewingComment}
              commentKey={viewingCommentKey}
              userUpvotes={userUpvotes}
              userSaves={userSaves}
              close={unhighlightViewedComment}
            />
          </div>
        )}
      </CommentsHolder>
    )
  }
  
  return (
    <BaseLayout canto={cantoNum} part={part}>
      <CantoContainer>
        {`${part}_canto_${cantoNum}` in paintings && (
          <Painting>
            <img src={paintings[`${part}_canto_${cantoNum}`]["src"]} alt={paintings[`${part}_canto_${cantoNum}`]["description"]} />
            <p>{paintings[`${part}_canto_${cantoNum}`]["description"]}</p>
            {paintings[`${part}_canto_${cantoNum}`]["subDescription"] && <p>{paintings[`${part}_canto_${cantoNum}`]["subDescription"]}</p>}
          </Painting>
        )}
        <div className='title'>
          <div></div>
          <div>{`${capitalize(part)} ${canto["name"].toUpperCase()}`}</div>
          {userData?.admin && !!allGroups ? (
            <div className="groupToggle">
              Only show comments from
              <Spacer width="6px" />
              <select value={onlyShowGroup} onChange={e => setOnlyShowGroup(e.target.value)}>
                <option value={SELECT_DEFAULT}>Select a group</option>
                {Object.keys(allGroups).map(k => (
                  <option value={k}>{allGroups[k].name}</option>
                ))}
              </select>
            </div>
          )
          : userData?.groupName && userData?.group && !userData?.admin ? (
            <div className="groupToggle">
              <Switch checked={onlyShowGroup} setChecked={setOnlyShowGroup} />
              <Spacer width="8px" />
              Only show comments from
              <b>{userData.groupName}</b>
            </div>
          ) : <div />}
        </div>
        <div className="body">
          <div className='lineNumbers'>
            {canto["terzinas"].map((t, tIdx) => <div className="terzina" key={`number-terzina-${tIdx}`}>
              {t.map((_l, lIdx) => 
                <Line key={`number-line-${tIdx * 3 + lIdx + 1}`}>
                  {tIdx * 3 + lIdx + 1}
                </Line>
              )}
            </div>)}
          </div>
          <div className="lines" onMouseUp={onMouseUpLines}>
            {canto["terzinas"].map((t, tIdx) => <div className="terzina" key={`text-terzina-${tIdx}`}>
              {t.map((l, lIdx) => {
                const lineNum = tIdx * 3 + lIdx + 1
                return (
                  <Line id={lineNum} key={`text-line-${lineNum}`}>
                    {l.split(" ").map((wd, wIdx) => (
                        <div
                          className="word"
                          id={getWordId(part, canto["number"], lineNum, wIdx + 1)}
                          key={getWordId(part, canto["number"], lineNum, wIdx + 1)}
                        >
                          {`${wd} `}
                        </div>
                    ))}
                  </Line>
                )
            })}
            </div>)}
          </div>
          <div className="comments">
            {canto["terzinas"].map((t, tIdx) => <div className="terzina" key={`comments-terzina-${tIdx}`}>
              {t.map((_l, lIdx) => {
                const lineNum = tIdx * 3 + lIdx + 1
                return (
                  <Line key={`comments-line-${lineNum}`}>
                    {getCommentsNodeForLine(lineNum)}
                  </Line>
                )
            })}
            </div>)}
          </div>
        </div>
      </CantoContainer>
      <ActionContainer>
          <SelectAndCommentModal
            modalVisible={modalVisible}
            cancel={cancelHighlighting}
            setModalVisible={setModalVisible}
            highlightedRanges={highlightedRanges}
            deleteRange={deleteRange}
            isCommenting={isCommenting}
            setIsCommenting={setIsCommenting}
          /> 
          <SelectTextButton
            modalVisible={modalVisible}
            openModal={() => {
              setModalVisible(true)
              unhighlightViewedComment()
            }}
          />
      </ActionContainer>
    </BaseLayout>
  )
}

export default Text