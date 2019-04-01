import {commonParams, ERR_OK, debug} from './config'
import axios from 'axios'

export function getRank () {
  const url = debug ? '/api/getRank' : 'http://116.85.12.75/api/getRank'

  const data = Object.assign({}, commonParams, {
    _: 1552361346374,
    g_tk: 1066166902,
    uin: 0,
    format: 'json',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    if (res.data.code === ERR_OK) {
      return Promise.resolve(res.data)
    } else {
      throw new Error('wrong')
    }
  })
}

export function getRankDetail (id) {
  const url = debug ? '/api/getRankDetail' : 'http://116.85.12.75/api/getRankDetail'
  const data = Object.assign({}, commonParams, {
    tpl: 3,
    page: 'detail',
    date: format(id),
    topid: id,
    type: 'top',
    song_begin: 0,
    song_num: 400,
    loginUin: 0,
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
      throw new Error('api getRankDetail wrong')
    }
  })
}

function format (id) {
  if (id === 4 || id === 27) {
    let date = new Date().toLocaleDateString().split('/')
    let month = date[1]
    let day = date[2]
    if (month.length === 1) {
      date[1] = 0 + month
    }
    if (day.length === 1) {
      date[1] = 0 + day
    }
    return date.join('-')
  }
  return '2019_9'
}