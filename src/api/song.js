import {commonParams, ERR_OK, debug} from './config'
import {getUid} from 'common/js/uid'
import axios from 'axios'

// 传入歌曲数据（处理过的musicData）
export function getSongUrl (songs) {
  const url = debug ? '/api/getPurlUrl' : 'http://116.85.12.75/api/getPurlUrl'
  let songmids = []
  let songtypes = []
  songs.forEach((song) => {
    songmids.push(song.mid)
    songtypes.push(0)
  })

  const urlMid = genUrlMid(songmids, songtypes)

  const data = Object.assign({}, commonParams, {
    g_tk: 1947190613,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    function request () {
      return axios.post(url, {
        comm: data,
        req_0: urlMid
      }).then((response) => {
        const res = response.data
        if (res.code === ERR_OK) {
          // 提取出purl的值，对一些边界情况作出处理
          let urlMid = res.req_0
          if (urlMid && urlMid.code === ERR_OK) {
            // 包含第一首歌曲purl值的数据
            let info = urlMid.data.midurlinfo[0]
            if (info && info.purl) {
              resolve(urlMid.data.midurlinfo)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry () {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('can not get the songs url'))
      }
    }

    request()
  })
}

function genUrlMid (songmids, songtypes) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: songmids,
      songtype: songtypes,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}

export function getLyric (songmid) {
  const url = debug ? '/api/getLyric' : 'http://116.85.12.75/api/getLyric'

  const data = Object.assign({}, commonParams, {
    '-': 'MusicJsonCallBack_lrc',
    pcachetime: +new Date(),
    songmid,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    inCharset: 'utf8'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}