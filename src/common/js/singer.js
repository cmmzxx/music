export default class Singer {
  constructor (name, mid, id) {
    this.name = name
    this.mid = mid
    this.id = id
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
    this.type = 'singer'
  }
}