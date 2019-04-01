<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @afterEnter="afterEnter"
                @leave="leave"
                @afterLeave="leaveEnter">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @click="changeLyric">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd"  :class="cdCls">
                <img alt="" class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r"
                  ref="lyricWrapper"
                  v-if="currentLyric"
                  :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="lyric-line"
                  v-for="(item, index) in currentLyric.lines"
                  :key="index"
                  :class="{'current': currentLineNum === index}"
                  ref="lyricLine"
                >
                  {{item.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom" ref="bottom">
          <div class="progress-timer">
            <p class="current-time">{{resolveTime(currentTime)}}</p>
            <div class="bar-wrapper">
              <progress-bar class="bar" :percent="percent" @percentChange="changePercent"></progress-bar>
            </div>
            <p class="song-time">{{resolveTime(currentSong.duration)}}</p>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changePlayMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="prev">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlaying" ref="iCenter">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- <div class="attention" v-html="attentionText" ref="attention"></div> -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="mini-cd" :class="cdCls">
          <img :src="currentSong.image" alt="" width="40" height="40" class="mini-img">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control-icon" @click.stop="togglePlaying">
          <progress-circle :percent="percent">
            <i :class="miniIcon" class="mini-icon"></i>
          </progress-circle>
        </div>
        <div class="playlist-icon">
          <i class="icon-playlist" @click.stop="openPlaylist"></i>
        </div>
        <playlist ref="playlist" :songlist="sequenceList" @changeMode="changePlayMode"></playlist>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'base/playlist/playlist'

export default {
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  },
  created () {
    this.screenHeight = screen.height
  },
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: '',
      lyricFlag: false
    }
  },
  computed: {
    attentionText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'playlist',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    }
  },
  methods: {
    openPlaylist () {
      this.$refs.playlist.show()
    },
    changeLyric () {
      this.lyricFlag = !this.lyricFlag
      let w = -screen.width
      let t = 300
      if (this.lyricFlag) {
        this.$refs.middleL.style.opacity = 0
        this.$refs.lyricWrapper.$el.style.transform = `translate3d(${w}px, 0, 0)`
        this.$refs.lyricWrapper.$el.style.transitionDuration = `${t}ms`
      } else {
        this.$refs.middleL.style.opacity = 1
        this.$refs.lyricWrapper.$el.style.transform = `translate3d(0, 0, 0)`
        this.$refs.lyricWrapper.$el.style.transitionDuration = `${t}ms`
      }
    },
    changePlayMode () {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList).res
      } else {
        list = this.sequenceList
      }
      this.resetCurrentSong(list)
      this.setPlaylist(list)
    },
    resetCurrentSong (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    changePercent (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    resolveTime (time) {
      time = time | 0
      let minute = time / 60 | 0
      let second = this._pad(time % 60)
      return minute + ':' + second
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index > this.playlist.length - 1) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready () {
      if (this.playing && this.songReady) {
        this.$refs.audio.play()
      }
      this.songReady = true
    },
    error () {
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      let audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    togglePlaying () {
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      this.setPlaying(!this.playing)
    },
    back () {
      this.setFullScreen(false)
    },
    open (e) {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setSequenceList: 'SET_SEQUENCE_LIST'
    }),
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1.0)`
        }
      }
      animations.registerAnimation({
        name: 'enter',
        animation,
        presets: {
          duration: 400,
          easing: 'linear',
          delay: 100
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'enter', done)
    },
    afterEnter () {
      animations.unregisterAnimation('enter')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(0, 0, 0) scale(1.0)`
        },
        40: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        }
      }
      animations.registerAnimation({
        name: 'leave',
        animation,
        presets: {
          duration: 400,
          easing: 'linear',
          delay: 100
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'leave', done)
    },
    leaveEnter () {
      animations.unregisterAnimation('leave')
      this.$refs.cdWrapper.style.animation = ''
    },
    // 得到偏移距离以及缩放比例
    _getPosAndScale () {
      // 由mini向normal
      const miniImageWidth = 40
      const miniImageLeft = 40
      const miniImageBottom = 30
      const miniImageTop = window.innerHeight - miniImageBottom
      const normalImageWidth = window.innerWidth * 0.8
      const normalImageLeft = window.innerWidth / 2
      const normalImageTop = normalImageWidth / 2 + 85
      const scale = miniImageWidth / normalImageWidth
      const x = miniImageLeft - normalImageLeft
      const y = miniImageTop - normalImageTop
      return {
        x,
        y,
        scale
      }
    },
    // lyric-parser库中handler函数接收的参数是一个对象,所以使用解构赋值
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      this.playingLyric = this.currentLyric.lines[this.currentLineNum].txt
      const _num = (this.screenHeight - 260) / 60 | 0
      if (lineNum > _num) {
        let lineEl = this.$refs.lyricLine[this.currentLineNum - _num]
        this.$refs.lyricWrapper.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricWrapper.scrollToElement(this.$refs.lyricLine[0], 1000)
      }
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return
      }
      this.songReady = false
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
        this.playingLyric = 'no lyric'
      }
      this.currentSong.getLyric().then((data) => {
        // new Lyric(data[, callback])data:为歌词字符串,回调函数对每行歌词操作
        this.currentLyric = new Lyric(data, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
      setTimeout(() => {
        this.$refs.audio.play()
      }, 1000)
    },
    playing (newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.player
  background-color white
  position absolute
  width 100%
  // height 100%
  top 0
  left 0
  font-size 22px
  background-color $color-background
  .normal-player
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    width 100%
    // height 100%
    background $color-background
    .background
      position absolute
      top 0
      left 0
      opacity 0.6
      filter blur(20px)
      width 100%
      height 100%
      z-index -1
    .top
      width 100%
      position absolute
      top 0
      left 0
      height 60px
      margin-bottom 25px
      .back
        color $color-theme
        transform rotate(-90deg)
        position absolute
        padding 9px
        font-weight 400
        left 6px
      .title
        text-align center
        width 70%
        margin 0 auto
        height 40px
        line-height 40px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        color $color-text-ll
        font-size $font-size-large
      .subtitle
        height 20px
        color $color-text-ll
        text-align center
        width 70%
        margin 0 auto
        font-size $font-size-small
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
    .middle
      width 100%
      position absolute
      top 85px
      bottom 175px
      overflow hidden
      white-space nowrap
      text-align center
      .middle-l
        transition opacity 300ms
        opacity 1
        width 100%
        display inline-block
        height 0
        padding-top 80%
        vertical-align top
        .playing-lyric-wrapper
          position absolute
          height 30px
          line-height 30px
          bottom 40px
          overflow hidden
          width 100%
          .playing-lyric
            width 80%
            margin 0 auto
            font-size $font-size-medium
            text-align center
            color $color-text-l
            overflow hidden
        .cd-wrapper
          position absolute
          top 0
          left 10%
          width 80%
          .cd
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              border-radius 50%
              width 100%
              vertical-align bottom
      .middle-r
        display inline-block
        width 100%
        vertical-align top
        height 100%
        text-align center
        color $color-text-l
        font-size $font-size-medium-x
        .lyric-wrapper
          // margin 0 auto
          overflow hidden
          .lyric-line
            line-height 30px
            text-align center
          .current
            color $color-theme
    .bottom
      position fixed
      bottom 50px
      left 0
      width 100%
      .progress-timer
        width 80%
        height 50px
        display flex
        align-items center
        margin 0 auto
        .song-time,.current-time
          font-size $font-size-medium
          color $color-text-ll
          font-weight 400
        .bar-wrapper
          flex 1
          margin 0 6px 0 6px
      .operators
        width 80%
        margin 0 auto
        display flex
        height 40px
        line-height 40px
        color $color-theme
        align-items center
        .icon
          flex 1
          text-align center
          font-size 30px
        .i-center
          font-size 40px
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
  .mini-player
      display flex
      position fixed
      width 100%
      bottom 0px
      left 0
      z-index 100
      height 60px
      background $color-highlight-background
      align-items center
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .mini-cd
        height 40px
        width 40px
        margin 0 10px 0 20px
        &.play
          animation rotate 20s linear infinite
        &.pause
          animation-play-state paused
        .mini-img
          border-radius 50%
      .text
        flex 1
        line-height 20px
        overflow hidden
        .name
          font-size $font-size-medium
          color $color-text-ll
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        .desc
          font-size $font-size-small
          color $color-text-l
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
      .playlist-icon
        margin-right 15px
        margin-left 15px
        color $color-theme
        font-size 26px
      .control-icon
        width 26px
        height 26px
        font-size 26px
        .mini-icon
          color $color-theme-d
          position: absolute
          left: 0
          top: 0
  .attention
    position fixed
    bottom 90px
    left 50%
    height 35px
    line-height 35px
    font-size $font-size-small
    border-radius 15%
    padding 0 10px
    background-color $color-theme-d
  @keyframes rotate {
    0% {
      transform rotate(0)
    }
    100% {
      transform rotate(360deg)
    }
  }
</style>
