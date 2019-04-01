<template>
  <scroll class="list-view"
          :data="singers"
          :listenScroll="listenScroll"
          :probeType="probeType"
          ref="listview"
          @scroll="scroll"
  >
    <ul>
      <li v-for="(group, index) in singers"
          :key="index"
          class="list-group"
          ref="listGroup"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items"
              :key="index"
              class="list-group-item"
              @click="selectItem(item)"
            >
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut"
        @touchstart.stop.prevent="shortCutTouchStart"
        @touchmove="shortCutTouchMove"
    >
      <li v-for="(item, index) in shortCutList"
          :key="index"
          class="item"
          :class="{'current': currentIndex === index}"
          :data-index="index"
      >
        {{item}}
      </li>
    </ul>
    <div class="list-fixed-title"
         v-show="fixedTitle"
         ref="listFixedTitle"
    >
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container">
      <loading v-show="!this.singers"></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getDate} from 'common/js/dom'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 18

export default {
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: 0
    }
  },
  props: {
    singers: {
      type: Array,
      default: null
    }
  },
  methods: {
    refresh () {
      this.$refs.listview.refresh()
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    shortCutTouchStart (e) {
      let anchorIndex = getDate(e.target, 'data-index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex, 100)
    },
    shortCutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // | 0 向下取整
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = this.touch.anchorIndex * 1 + delta
      this._scrollTo(anchorIndex, 800)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _calcHeight () {
      let height = 0
      const list = this.$refs.listGroup
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },
    _scrollTo (index, time) {
      // 当动画时间为0时，会出现高亮不跟随的情况，不为0时则正常，原因为scrollToElement函数可以触发BScroll的scroll事件
      // 动画为0解决方法
      // this.scrollY = -this.listHeight[index]
      // 使用委托事件时，父级元素有不需要点击的地方,只是本人没有出现视频中点击空白Z高亮的情况
      // console.log(index)
      if (index === null) {
        return
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], time)
    }
  },
  watch: {
    singers () {
      setTimeout(() => {
        this._calcHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // newY值为负值，diff值表示下一个title的上边缘到fixed-title上边缘的距离
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限(listHeight最后一项是最后一个元素的下限，所以不再需要这一句)
      // this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.listFixedTitle.style.transform = `translate3d(0, ${this.fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    shortCutList () {
      // this._initSinger()，自定义测试数据所用
      return this.singers.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      let item = this.singers[this.currentIndex]
      return item ? item.title : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.list-view
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      color $color-text-l
      padding-left 20px
      font-size $font-size-small
      background $color-highlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-l
        font-size $font-size-medium
  .list-shortcut
    position absolute
    top 50%
    right 0
    transform translateY(-50%)
    text-align center
    width 20px
    padding 20px 0
    border-radius 10px
    z-index 1
    font-family Helvetica
    background $color-background-d
    .item
      color $color-text-l
      font-size $font-size-small
      line-height 1
      padding 3px
    .current
      color $color-theme
  .list-fixed-title
    position absolute
    width 100%
    top 0
    z-index 10
    color $color-text-l
    height 30px
    line-height 30px
    .fixed-title
      font-size $font-size-small
      background $color-highlight-background
      padding-left 20px
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
