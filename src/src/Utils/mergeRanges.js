export const mergeRangesAllParts = ranges => {
  let parts = ranges.map(r => r["part"])
  parts = new Set([...parts])

  let ret = []

  for (let part of parts) {
    const applicableRanges = ranges.filter(r => r["part"] === part)
    const mergedRanges = mergeRanges(applicableRanges)
    ret = [...ret, ...mergedRanges]
  }

  return ret
}

export const mergeRangesAllCantos = ranges => {
  let cantos = ranges.map(r => r["canto"])
  cantos = new Set([...cantos])

  let ret = []

  for (let canto of cantos) {
    const applicableRanges = ranges.filter(r => r["canto"] === canto)
    const mergedRanges = mergeRanges(applicableRanges)
    ret = [...ret, ...mergedRanges]
  }

  return ret
}

export const mergeRanges = ranges => {
  if (ranges.length === 0) return []

  // Sort the ranges based on startLine and then startWord
  ranges.sort((a, b) => {
    if (a.startLine !== b.startLine) {
      return a.startLine - b.startLine;
    }
    return a.startWord - b.startWord;
  });

  // Initialize the mergedRanges array with the first range
  const mergedRanges = [ranges[0]];

  // Iterate through the sorted ranges and merge overlapping or adjacent ranges
  for (let i = 1; i < ranges.length; i++) {
    const currentRange = ranges[i];
    const lastMergedRange = mergedRanges[mergedRanges.length - 1];

    // Check for overlapping or adjacent ranges
    if (
      currentRange.startLine < lastMergedRange.endLine ||
      (currentRange.startLine === lastMergedRange.endLine &&
      currentRange.startWord <= lastMergedRange.endWord + 1)
    ) {
      // Merge the ranges if there is an overlap
      if (currentRange.endLine > lastMergedRange.endLine) {
        lastMergedRange.endWord = currentRange.endWord
      } else {
        lastMergedRange.endWord = Math.max(lastMergedRange.endWord, currentRange.endWord);
      }

      lastMergedRange.endLine = Math.max(lastMergedRange.endLine, currentRange.endLine);
    } else {
      // Add the current range to the mergedRanges array if no overlap
      mergedRanges.push(currentRange);
    }
  }

  return mergedRanges;
}

// sorted
let inputRanges = [
  { startLine: 1, endLine: 2, startWord: 1, endWord: 5 },
  { startLine: 1, endLine: 2, startWord: 6, endWord: 10 },
  { startLine: 2, endLine: 3, startWord: 3, endWord: 8 },
  { startLine: 4, endLine: 5, startWord: 1, endWord: 4 }
]

// r1: 1.2 - 3.4
// r2: 2.5 - 4.6

inputRanges = [
  { startLine: 1, endLine: 3, startWord: 2, endWord: 4 },
  { startLine: 2, endLine: 4, startWord: 5, endWord: 6 },
  { startLine: 1, endLine: 1, startWord: 3, endWord: 7 },
]

inputRanges = []

const result = mergeRanges(inputRanges);
console.log(result);
