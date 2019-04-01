<template>
  <div class="search-box">
      <i class="icon-search"></i>
      <input type="text" class="input" ref="search" @click="search" placeholder="搜索歌手、歌曲" v-model="query">
      <i class="icon-dismiss" @click="deleteText" v-show="query"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'

export default {
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    setQuery (query) {
      this.query = query
    },
    deleteText () {
      this.query = ''
      console.log('click')
    },
    search () {
      this.$refs.search.focus()
    }
  }
  // watch: {
  //   query (newVal) {
  //     this.$emit('query', newVal)
  //   }
  // }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.search-box
  display flex
  background-color $color-highlight-background
  height 40px
  line-height 40px
  width 90%
  margin 0 auto
  border-radius 8px
  align-items center
  box-sizing border-box
  font-family Arial, Helvetica, sans-serif
  .icon-search
    font-size $font-size-large-x
    width 32px
    text-align center
  .icon-dismiss
    font-size $font-size-large
    color $color-background
    width 32px
    height 40px
    line-height 40px
    text-align center
  .input
    flex 1
    border-radius 5px
    font-size $font-size-medium
    font-weight 500
    background-color $color-highlight-background
    color $color-text-l
    text-direction none
    outline none
</style>
