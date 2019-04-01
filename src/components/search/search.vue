<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="selectHotKey"></search-box>
    </div>
    <scroll class="shortcut-wrapper" ref="shortcutWrapper" :data="shortcut">
      <div>
        <div class="hot-search" v-show="hotkey && !query">
          <h2 class="title">{{title}}</h2>
          <div class="hotkey">
            <span v-for="(item, index) in hotkey" :key="index" class="key" @click="selectHotKey(item.k)">{{item.k}}</span>
          </div>
          <div class="history-wrapper" v-show="history.length && hotkey">
            <div class="clear">
              <h2>历史记录</h2>
              <span class="icon" @click="clearHistory">
                <i class="icon-clear"></i>
              </span>
            </div>
            <div class="history-item" v-for="(item, index) in history" :key="index">
              <h2 @click="searchHistory(item)">{{item}}</h2>
              <span class="icon" @click="deleteHistory(item, index)">
                <i class="icon-delete"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="suggest-wrapper" v-show="query">
          <suggest :query="query" v-show="query" ref="suggest" @historyChange="historyChange"></suggest>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import {getHotSearch} from 'api/search'
import {playlistMixin} from 'common/js/mixin'
import {getHistory} from 'common/js/cache'

export default {
  computed: {
    shortcut () {
      return this.hotkey.concat(this.history)
    }
  },
  mixins: [playlistMixin],
  created () {
    this._getHotSearch()
    this.history = getHistory()
    console.log('created')
    console.log(this.history)
  },
  data () {
    return {
      title: '热门搜索',
      hotkey: [],
      query: '',
      history: []
    }
  },
  methods: {
    searchHistory (item) {
      this.$refs.searchBox.setQuery(item)
    },
    clearHistory () {
      this.history = []
      localStorage.setItem('__search__', JSON.stringify([]))
    },
    deleteHistory (item, index) {
      this.history.splice(index, 1)
      localStorage.setItem('__search__', JSON.stringify(this.history))
    },
    historyChange (val) {
      this.history = val
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.shortcutWrapper.$el.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getHotSearch () {
      getHotSearch().then((list) => {
        let {hotkey} = list.data
        this.hotkey = hotkey.slice(0, 10)
      })
    },
    selectHotKey (query) {
      this.$refs.searchBox.setQuery(query)
      this.query = query.trim()
    }
  },
  components: {
    SearchBox,
    Suggest,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.search
  margin-top 20px
  .shortcut-wrapper
    overflow hidden
    position fixed
    top 178px
    bottom 0
    left 0
    right 0
    .hot-search
      display block
      width 90%
      margin 0 auto
      .history-wrapper
        margin-top 30px
        color $color-text-l
        .clear
          display flex
          h2
            flex 1
            font-size $font-size-medium-x
        .history-item
          display flex
          margin 15px 0 15px 15px
          h2
            flex 1
            height 20px
            font-size $font-size-medium
      .title
        margin 0px 0 20px 0
        font-size $font-size-medium
        height 20px
        line-height 20px
        color $color-text-l
      .hotkey
        display flex
        flex-flow row wrap
        .key
          font-size $font-size-medium
          color $color-text-d
          border-radius 6px
          height 30px
          line-height 30px
          margin 5px 10px
          padding 0 10px
          background-color $color-highlight-background
    .suggest-wrapper
      color $color-text-ll
      height 100%
</style>
