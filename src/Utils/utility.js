import { PART_ABBREVIATIONS } from "./constants"

export const capitalize = word => word[0].toUpperCase() + word.slice(1)

export const splitWithIndex = (str, delim=" ") => {
  var ret = []
  var splits=str.split(delim)
  var index=0
  for(var i=0; i<splits.length; i++){
    ret.push([index,splits[i]])
    index+=splits[i].length+delim.length
  }
  return ret
}

export const wordIndices = (str, delim = " ") => {
  const words = str.split(delim)

  const indices = words.reduce((prev, curr, idx) => [...prev, prev[idx] + curr.length + delim.length], [0])
  return indices
}

export const getWordId = (partName, cantoNum, lineNum, wordNum) => `${partName}-canto-${cantoNum}-line-${lineNum}-word-${wordNum}`

export const getCantoNumFromId = id => {
  const pieces = id.split("-")

  return Number(pieces[2])
}

export const getLineNumFromId = id => {
  const pieces = id.split("-")

  return Number(pieces[4])
}

export const getWordNumFromId = id => {
  const pieces = id.split("-")

  return Number(pieces[6])
}

export const countWords = str => str.split(" ").length

export const parseCantoParam = (cantoParam, part) => {
  if (isNaN(cantoParam)) {
    return undefined
  } else if (
    Number(cantoParam) > 34 || 
    Number(cantoParam) < 1 || 
    ((part === 'purgatorio' || part === 'paradiso') && Number(cantoParam > 33))
  ) {
    return undefined
  } else {
    return Number(cantoParam)
  }
}

export const getInitials = name => {
  if (!name) return "DA"

  const names = name.split(" ")
  return (`${names[0][0]}${names[names.length - 1][0]}`).toUpperCase()
}

export const getUniqueCantos = ranges => {
  let parts = ranges.map(r => r["part"])
  parts = new Set([...parts])

  let ret = {}

  for (let part of parts) {
    const applicableRanges = ranges.filter(r => r["part"] === part)
    let cantos = applicableRanges.map(r => r["canto"])
    cantos = new Set([...cantos])
    ret[part] = cantos
  }

  return ret
}

export const getCommentUpdatesToMakeForRanges = (keyAndSubfield, userUid, ranges, data) => {
    const updates = {};
    updates['/comments/' + keyAndSubfield] = data;
    updates['/user-comments/' + userUid + '/' + keyAndSubfield] = data
    
    const uniqueCantos = getUniqueCantos(ranges)
    for (let part in uniqueCantos) {
      console.log('part', part)
      console.log('cantos', uniqueCantos[part])
      for (let canto of uniqueCantos[part]) {
        console.log('canto')
        updates['/canto-comments/' + part + '/' + canto + '/' + keyAndSubfield] = data
      }
    }

    return updates
}

export const getRangeDescriptionForRanges = ranges => {
  let ret = []

  for (let r of ranges) {
    const { part, canto, startLine, endLine } = r
    const lines = startLine === endLine ? startLine : `${startLine}-${endLine}`
    ret.push(`${PART_ABBREVIATIONS[part]} ${canto}.${lines}`)
  }

  return ret.join(", ")
}


/************** TRASH *****************/

export const roundIndexDownToPreviousWord = (str, idx) => {
  const indices = wordIndices(str, " ")

  for (let wordIndex of indices.reverse()) {
    if (idx > wordIndex) {
      return wordIndex
    }
  }
}

export const getWordNumberOfStrIndex = (str, idx) => {
  const indices = wordIndices(str, " ")

  for (let [i, wordIndex] of indices.reverse().entries()) {
    if (idx > wordIndex) {
      return indices.length - i - 1
    }
  }
}

export const roundIndexUpToNextWord = (str, idx) => {
  const indices = wordIndices(str, " ")
  
  for (let wordIndex of indices) {
    if (idx < wordIndex) {
      return wordIndex - 1
    }
  }
}