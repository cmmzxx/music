import {getSongUrl, getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
// 将歌曲信息封装成类
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.duration = duration
    this.album = album
    this.image = image
    this.url = url
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}
// 对获取到的原始数据进行处理,传入原始数据中musicDate字段数据，返回一个Song
export function createSong (musicDate) {
  return new Song({
    id: musicDate.songid,
    mid: musicDate.songmid,
    singer: filterSong(musicDate.singer),
    name: musicDate.songname,
    album: musicDate.albumname,
    duration: musicDate.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicDate.albummid}.jpg?max_age=2592000`,
    url: ''
  })
}

export function filterSong (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}

export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || (musicData.pay.payplay !== 1 && musicData.pay.payalbumprice === 0))
}

export function songsUrl (songs) {
  if (!songs) {
    return Promise.resolve(songs)
  }

  return getSongUrl(songs).then((midurlinfo) => {
    midurlinfo.forEach((info, index) => {
      let song = songs[index]
      song.url = info.purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${info.purl}` : info.purl
    })
    return songs
  })
}