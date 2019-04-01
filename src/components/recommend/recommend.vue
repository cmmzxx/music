<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl"  @load="loadImg" class="needsclcik">
              </a>
            </div>
          </slider>
        </div>
        <div class="disclist">
          <h1 class="list-title">歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" :key="index" class="disc-item" @click="selectDisc(item, index)">
              <div class="disc-img">
                <img width="60px" height="60px" v-lazy="item.imgurl">
              </div>
              <div class="disc-detail">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: [],
      checkLoaded: false
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    selectDisc (item, index) {
      console.log(item)
      let id = item.dissid + index
      this.$router.push({
        path: `recommend/${id}`
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImg () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .disclist
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .disc-item
        display flex
        align-items center
        padding 0 20px 20px 20px
        .disc-img
          width 60px
          padding-right 20px
        .disc-detail
          display flex
          flex-direction column
          justify-content center
          // flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-theme
          .desc
            color $color-text-d
  .loading-container
    position absolute
    top 50%
    width 100%
    transform translateY(-50%)
</style>
