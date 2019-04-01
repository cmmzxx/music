import originJsonp from 'jsonp'

export default function jsonp (url, date, option) {
  url += ~url.indexOf('?') ? '&' : '?' + param(date)
  console.log(url)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, date) => {
      if (!err) {
        resolve(date)
      } else {
        reject(err)
      }
    })
  })
}

function param (date) {
  let url = ''
  for (var k in date) {
    let value = date[k] !== undefined ? date[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url.substring(1)
}