<template>
  <div class="rank" ref="rank">
    <scroll ref="rankWrapper" :data="toplist" class="rankWrapper">
      <div>
        <li v-for="(item, index) in toplist" :key="index" class="topitem" @click="selectRank(item, index)">
          <div class="itemWrapper">
            <img :src="item.picUrl" width="100" height="100">
            <div class="item-detail">
              <h3 class="item-title">{{item.topTitle}}</h3>
              <p v-for="(val, key) in item.songList" :key="key" class="item">
                {{key + 1}}
                <span>{{val.songname}}</span>
                -{{val.singername}}
              </p>
            </div>
          </div>
        </li>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getRank} from 'api/rank'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  methods: {
    selectRank (item, index) {
      this.$router.push({
        path: `/rank/${item.id}`,
        name: 'ranklist',
        params: {
          id: item.id,
          title: item.topTitle
        }
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.rankWrapper.refresh()
    }
  },
  data () {
    return {
      toplist: []
    }
  },
  created () {
    // 得到排行榜单并去掉mv排行
    getRank().then((res) => {
      let toplist = res.data.topList
      toplist.forEach((item, index) => {
        if (item.id === 201) {
          toplist.splice(index, 1)
          this.toplist = toplist
        }
      })
    })
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .rankWrapper
    height 100%
    overflow hidden
    .topitem
      padding 10px
      height 100px
      .itemWrapper
        display flex
        flex-wrap nowrap
        background-color $color-highlight-background
        color $color-text-d
        .item-detail
          display flex
          flex 1
          padding 10px 15px
          flex-flow column nowrap
          justify-content space-around
          overflow hidden
          .item-title
            padding-bottom 3px
          .item
            font-size $font-size-medium
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
</style>
