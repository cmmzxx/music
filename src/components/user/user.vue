<template>
  <div class="user">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches">
      <div class="switch" @click="ilike" :class="{now: select}">我喜欢的</div>
      <div class="switch" @click="recently" :class="{now: !select}">最近听的</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      select: true
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    ilike () {
      this.select = true
    },
    recently () {
      this.select = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.user
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
  .back
    position absolute
    top: 3px
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .switches
    width 100%
    display flex
    justify-content center
    padding 10px 0 20px 0
    .switch
      width 30%
      font-size $font-size-medium-x
      padding 5px
      text-align center
      border 1px solid $color-highlight-background
      border-radius 6px
      color $color-text-d
    .now
      background-color $color-highlight-background
      color $color-text-ll
</style>
