<template>
  <div class="suggest" v-show="result" >
    <scroll :data="result" class="suggestWrapper" :pullUpload="pullUpload" @scrollToEnd="searchMore" ref="suggest">
      <div class="search-list">
        <div class="search-item"
             v-for="(item, index) in result"
             :key="index"
             @click="selectItem(item, index)">
          <i :class="getItemCls(item)"></i>
          <span class="text">{{getItemText(item)}}</span>
        </div>
        <loading v-if="hasMore"></loading>
      </div>
      <div class="no-result">
        <no-result v-show="!result.length && !hasMore"></no-result>
      </div>
    </scroll>
  </div>
</template>

<script>
import {searchQuery} from 'api/search'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import {createSong, isValidMusic, songsUrl} from 'common/js/song'
import {mapMutations, mapActions} from 'vuex'
import Singer from 'common/js/singer'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import {addHistory, getHistory} from 'common/js/cache'

const TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    perpage: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullUpload: {
        threshold: 0
      },
      hasMore: true,
      show_singer: true
    }
  },
  methods: {
    refresh () {
      this.$refs.suggest.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    searchMore () {
      this.page = this.page + 1
      this.show_singer = false
      console.log('search more')
      this.search()
    },
    selectItem (item, index) {
      if (item.type === TYPE_SINGER) {
        this.$router.push({
          path: `/search/${item.id}`
        })
        this.setSinger(item)
      } else {
        this.insertSong(item)
        console.log('tt')
      }
      addHistory(this.query)
      this.history = getHistory()
      this.$emit('historyChange', this.history)
    },
    getItemText (item) {
      if (item.type === TYPE_SINGER) {
        return item.name
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    getItemCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    genResult (list) {
      let res = []
      let song = []
      if (list.zhida && list.zhida.singerid) {
        res.push(new Singer(list.zhida.singername, list.zhida.singermid, list.zhida.singerid))
      }
      if (list.song && list.song.list) {
        song = song.concat(this._normalizeSong(list.song))
        songsUrl(song).then((songs) => {
          song = songs
        })
      }
      res.push(...song)
      console.log(res)
      return res
    },
    _normalizeSong ({list}) {
      let ret = []
      list.forEach((item) => {
        if (isValidMusic(item)) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    isHasMore (list) {
      return list.list.length && (list.curnum + list.curpage * this.perpage <= list.totalnum)
    },
    search () {
      if (!this.hasMore) {
        return
      }
      searchQuery(this.query, this.page, this.show_singer, this.perpage).then((list) => {
        if (list.code === ERR_OK) {
          this.result.push(...this.genResult(list.data))
          if (!this.isHasMore(list.data.song)) {
            this.hasMore = false
          }
        }
      })
    }
  },
  watch: {
    query (newVal) {
      if (newVal === '') {
        return
      }
      this.hasMore = true
      this.show_singer = true
      this.result = []
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.suggest
  width 90%
  height 100%
  margin 0 auto
  .suggestWrapper
    height 100%
    overflow hidden
    .search-list
      margin-left 10px
      .search-item
        font-size $font-size-medium
        color $color-text-d
        height 40px
        line-height 40px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
</style>
