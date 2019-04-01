const SEARCH_KEY = '__search__'
const MAX_LENGTH = 15

export function addHistory (val) {
  let history = localStorage.getItem(SEARCH_KEY) || []

  if (history instanceof Array) {
    history.unshift(val)
  } else {
    history = JSON.parse(history)
    let index = history.findIndex((item) => {
      return item === val
    })
    if (index > -1) {
      history.splice(index, 1)
    }
    history.unshift(val)
  }
  if (history.length > MAX_LENGTH) {
    history.pop()
  }

  localStorage.setItem(SEARCH_KEY, all2String(history))
}

function all2String (val) {
  if (val instanceof Object || val instanceof Array) {
    return JSON.stringify(val)
  } else {
    return String(val)
  }
}

export function getHistory () {
  let history = localStorage.getItem(SEARCH_KEY) || '[]'
  return JSON.parse(history)
}