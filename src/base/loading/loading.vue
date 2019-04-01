<template>
  <div class="loading">
    <img src="./loading.gif" alt="loading" width="24px" height="24px">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  // 为什么不用date(){},而用props？
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.loading
  width 100%
  // 图片字体居中
  text-align center
  .desc
    line-height 20px
    font-size $font-size-small
    color $color-text-l
</style>
