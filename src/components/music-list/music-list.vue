<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length > 0" ref="playWrapper">
        <div class="play" ref="playBtn" @click="playRandom">
          <div class="icon-play"></div>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="fliter"></div>
    </div>
    <div class="bg-layer" ref="bglayer"></div>
    <scroll :data="songs"
            class="list"
            ref="list"
            :listenScroll="listenScroll"
            :probeType="probeType"
            @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectSong" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  components: {
    Scroll,
    SongList,
    Loading
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + 40
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  data () {
    return {
      scrollY: 0
    }
  },
  props: {
    rank: {
      type: Boolean,
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    probeType: {
      type: Number,
      default: 3
    },
    listenScroll: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    playRandom () {
      this.randomPlay({
        list: this.songs
      })
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    selectSong (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(newY, this.minTranslateY)
      this.$refs.bglayer.style.transform = `translate3d(0, ${translateY}px, 0)`
      let zIndex = 0
      let scale = 1
      // 图片高斯模糊未做
      // 设置css时前缀可以封装为函数
      let percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        // 图片放大后由于后面的元素和前面元素处于同一index所以会被后面元素挡住，需要将前面元素index调高
        zIndex = 10
        scale = 1 + percent
      }
      if (translateY > newY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = `40px`
        this.$refs.playWrapper.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.playWrapper.style.display = 'block'
      }
      this.$refs.bgImage.style['z-index'] = zIndex
      this.$refs.bgImage.style.transform = `scale(${scale})`
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 200
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .fliter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>