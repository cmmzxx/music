// 获取歌曲url时用到的uid参数
let _uid = ''
export function getUid () {
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    const n = (new Date()).getUTCMilliseconds()
    _uid = '' + Math.round(2147483647 * Math.random()) * n % 1e10
  }
  return _uid
}