import { countWords, getWordId } from "./utility"
import _ from 'underscore'

export const highlightRanges = (ranges, canto, highlightedClassName) => {
  for (let r of ranges) {
    if (r["canto"] !== canto["number"]) continue
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

        if (!el.classList.contains(highlightedClassName)) {
          el.classList.add(highlightedClassName);
        }
      }
    }
  }
}