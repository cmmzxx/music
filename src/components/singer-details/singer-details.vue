<template>
  <transition name="slide">
    <music-list :songs='songs' :bgImage='bgImage' :title="title"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {createSong, isValidMusic, songsUrl} from 'common/js/song'
import {ERR_OK} from 'api/config'
import MusicList from 'components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.mid) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.mid).then((res) => {
        if (res.code === ERR_OK) {
          let songs = this._normalizeSong(res.data.list)
          songsUrl(songs).then((songs) => {
            console.log(songs)
            this.songs = songs
          })
        }
      })
    },
    _normalizeSong (list) {
      let ret = []
      console.log(list)
      list.forEach((item) => {
        let {musicData} = item
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>

.slide-enter-active,.slide-leave-active
  transition all 1s
.slide-enter,.slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
