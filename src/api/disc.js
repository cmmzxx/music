import {commonParams, ERR_OK, debug} from './config'
import axios from 'axios'

export function getDiscDetail (disstid) {
  const url = debug ? '/api/getDiscDetail' : 'http://116.85.12.75/api/getDiscDetail'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    let data = res.data.cdlist[0]
    // console.log(data)
    if (res.data.code === ERR_OK && data) {
      return Promise.resolve(data)
    } else {
      throw new Error('wrong')
    }
  })
}