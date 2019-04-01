import {cloneDeep} from 'lodash'

export function shuffle (arr) {
  let res = cloneDeep(arr)
  let len = res.length
  for (let i = len - 1; i > 0; i--) {
    let a = Math.floor(Math.random() * (i + 1))
    let temp = res[i]
    res[i] = res[a]
    res[a] = temp
  }
  return {arr, res}
}

export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}