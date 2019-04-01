import {commonParams, ERR_OK, debug} from './config.js'
import axios from 'axios'

export function getHotSearch () {
  const url = debug ? '/api/getHotSearch' : 'http://116.85.12.75/api/getHotSearch'

  const data = Object.assign({}, commonParams, {
    loginUin: 1021621923,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    if (res.data.code === ERR_OK) {
      return Promise.resolve(res.data)
    } else {
      throw new Error('getHotSearc wrong')
    }
  })
}

export function searchQuery (query, p, showSinger, perpage) {
  const url = debug ? '/api/searchQuery' : 'http://116.85.12.75/api/searchQuery'

  const data = Object.assign({}, commonParams, {
    catZhida: showSinger ? 1 : 0,
    p,
    perpage,
    n: perpage,
    w: query,
    '_': 1552531669199,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    if (res.data.code === ERR_OK) {
      return Promise.resolve(res.data)
    } else {
      throw new Error('searchQuery wrong')
    }
  })
}