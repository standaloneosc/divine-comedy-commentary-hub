const getUniqueCantos = ranges => {
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

let test = [
  { part: 'inferno', canto: 1, startLine: 1, endLine: 1 },
  { part: 'inferno', canto: 1, startLine: 5, endLine: 8 },
  { part: 'paradiso', canto: 1, startLine: 1, endLine: 3 },
  { part: 'purgatorio', canto: 10, startLine: 3, endLine: 6 }
]

console.log(getUniqueCantos(test))