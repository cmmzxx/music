<template>
  <transition name="list-fade">
    <div class="playlist-wrapper" @click.stop="hide" v-show="flag">
      <div class="playlist" @click.stop="test">
        <div class="top">
          <i class="icon" :class="pmode" @click.stop="changeMode"></i>
          <h1 class="playmode">{{modeText}}</h1>
          <i class="icon-clear" @click="clear"></i>
        </div>
        <div class="songlist" v-if="songlist.length">
          <scroll :data="songlist" class="scroll" ref="scroll">
            <transition-group name="list" tag="div">
              <div class="songitem"
                  v-for="(item, index) in songlist"
                  :key="item.id"
                  ref="list">
                <span class="play">
                  <i :class="songplay(item)"></i>
                </span>
                <p class="text" @click="selectS(item, index)">{{item.name}}</p>
                <span class="heart">
                  <i class="icon-not-favorite"></i>
                </span>
                <span class="delete" @click="deleteS(item, index)">
                  <i class="icon-delete"></i>
                </span>
              </div>
            </transition-group>
          </scroll>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import {playMode} from 'common/js/config'

export default {
  components: {
    Scroll
  },
  props: {
    songlist: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      flag: false
    }
  },
  methods: {
    changeMode () {
      this.$emit('changeMode')
    },
    show () {
      this.flag = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
        this.scrollToCurrent(this.currentSong)
      })
    },
    hide () {
      this.flag = false
    },
    clear () {
      this.setPlaylist([])
      this.setSequenceList([])
      this.setCurrentIndex(-1)
      this.setPlaying(false)
    },
    selectS (item, index) {
      this.selectSong({item, index})
    },
    deleteS (item, index) {
      this.deleteSong({item, index})
    },
    ...mapActions([
      'deleteSong',
      'selectSong'
    ]),
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaying: 'SET_PLAYING',
      setSequenceList: 'SET_SEQUENCE_LIST',
      setPlayMode: 'SET_PLAY_MODE'
    }),
    test () {
      console.log('have clicked')
    },
    songplay (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      } else {
        return ''
      }
    },
    scrollToCurrent (song) {
      const index = this.sequenceList.findIndex((item) => {
        return song.id === item.id
      })
      console.log(this.$refs.scroll)
      this.$refs.scroll.scrollToElement(this.$refs.list[index], 200)
    }
  },
  computed: {
    ...mapGetters([
      'currentIndex',
      'mode',
      'currentSong',
      'sequenceList'
    ]),
    pmode () {
      return playMode.random === this.mode ? 'icon-random' : playMode.sequence === this.mode ? 'icon-sequence' : 'icon-loop'
    },
    modeText () {
      return playMode.random === this.mode ? '随机播放' : playMode.sequence === this.mode ? '顺序播放' : '单曲循环'
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.flag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.playlist-wrapper
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color $color-background-d
  &.list-fade-enter-active, &.list-fade-leave-active
    transition: opacity .5s
    .playlist
      transition: all .5s
  &.list-fade-enter, &.list-fade-leave-to
    opacity: 0
    .playlist
      transform: translate3d(0, 100%, 0)
  .playlist
    z-index 100
    position absolute
    width 100%
    bottom 0
    background-color $color-highlight-background
    .top
      align-items center
      display flex
      height 60px
      padding 0 20px
      .icon
        font-size 30px
        margin-right 10px
        color $color-theme-d
      .playmode
        color $color-text-l
        font-size $font-size-medium
        flex 1
        height 16px
        line-height 16px
      .icon-clear
        font-size $font-size-small
        color $color-text-d
    .songlist
      bottom 100px
      max-height 280px
      .scroll
        overflow hidden
        max-height 280px
        .songitem
          display flex
          height 40px
          align-items center
          padding 0 20px
          &.list-enter-active,&.list-leave-active
            transition all .1s linear
          &.list-enter,&.list-leave-to
            height 0
          .play
            color $color-theme-d
            font-size $font-size-small
            height 40px
            line-height 40px
            width 20px
          .text
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            color $color-text-d
            font-size $font-size-medium
            flex 1
          .heart
            color $color-theme
            font-size $font-size-small
            margin-right 10px
            margin-left 10px
          .delete
            color $color-theme
            font-size $font-size-small
    // .bottom
    //   height 110px
    //   padding-top 20px
    //   .list-opearate
    //     width 100px
    //     margin 0 auto
    //     margin-bottom 30px
    //     .add
    //       text-align center
    //       line-height 30px
    //       height 30px
    //       border 1px $color-text-l solid
    //       border-radius 20px
    //       font-size $font-size-small-s
    //       color $color-text-l
    //   .close
    //     height 50px
    //     line-height 50px
    //     text-align center
    //     background-color $color-background
    //     color $color-text-l
    //     font-size $font-size-medium-x
</style>
