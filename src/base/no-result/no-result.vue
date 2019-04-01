<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <span class="text">{{text}}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '对不起,没有搜索到结果'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.no-result
  text-align center
  .no-result-icon
    bg-image('no-result')
    background-size cover
    width 60px
    height 60px
    margin 50% auto 20px
    background-repeat no-repeat
  .text
    color $color-text-l
</style>
