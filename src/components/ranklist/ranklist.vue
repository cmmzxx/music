<template>
  <transition name="slide">
    <music-list :bgImage="bgImage" :songs="songs" :title="topTitle" :rank="rank"></music-list>
  </transition>
</template>

<script>
import {getRankDetail} from 'api/rank'
import {createSong, isValidMusic, songsUrl} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      bgImage: '',
      topTitle: '',
      rank: true
    }
  },
  created () {
    this._getRankDetail()
  },
  methods: {
    _getRankDetail () {
      let id = this.$route.params.id
      if (typeof id === 'string') {
        this.$router.push({
          path: '/rank'
        })
        return
      }
      this.topTitle = this.$route.params.title
      getRankDetail(id).then((res) => {
        let songs = this._normalizeSong(res.songlist)
        songsUrl(songs).then((songs) => {
          console.log(songs)
          this.songs = songs
          this.bgImage = songs[0].image
        })
      })
      console.log(this.songs)
    },
    _normalizeSong (list) {
      let ret = []
      console.log(list)
      list.forEach((item) => {
        let {data} = item
        if (isValidMusic(data)) {
          ret.push(createSong(data))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.slide-enter-active,.slide-leave-active
  transition all 0.5s
.slide-enter,.slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
