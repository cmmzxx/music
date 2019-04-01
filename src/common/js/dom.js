export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  if (el.className.length === 0) {
    el.className = className
    return 0
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getDate (el, name, val) {
  if (!val) {
    return el.getAttribute(name)
  }
  el.setAttribute(name, val)
}