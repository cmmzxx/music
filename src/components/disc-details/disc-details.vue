<template>
  <div class="disc-detail">
    <music-list :bgImage="logo" :title="title" :songs="songs"></music-list>
  </div>
</template>

<script>
import {getDiscDetail} from 'api/disc'
import {createSong, isValidMusic, songsUrl} from 'common/js/song'

import MusicList from 'components/music-list/music-list'
export default {
  components: {
    MusicList
  },
  created () {
    this.resolveId()
    this._getDiscDetail()
  },
  data () {
    return {
      logo: '',
      title: '',
      songs: []
    }
  },
  methods: {
    _getDiscDetail () {
      getDiscDetail(this.dissid).then((cdlist) => {
        this.cdlist = cdlist
        this.logo = cdlist.logo
        this.title = cdlist.dissname
        this.songs = this._normalizeSong(cdlist.songlist)
        songsUrl(this.songs).then((songs) => {
          this.songs = songs
        })
      })
    },
    resolveId () {
      let id = this.$route.params.id
      this.dissid = id.split('').slice(0, 10).join('')
      this.index = id.split('').slice(10).join('')
    },
    _normalizeSong (list) {
      let ret = []
      list.forEach((musicData) => {
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
@import '~common/stylus/variable'

.disc-detail
  position fixed
  top 0
  left 0
</style>
