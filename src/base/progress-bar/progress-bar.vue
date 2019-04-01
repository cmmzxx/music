<template>
  <div class="progress-bar">
    <div class="bar-inner" ref="barInner" @click="barClick">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn"
           ref="progressBtn"
           @click.stop=""
           @touchstart.prevent="btnTouchStart"
           @touchmove.prevent="btnTouchMove"
           @touchend="btnTouchEnd"
           ></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    barClick (e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    btnTouchStart (e) {
      console.log(e)
      this.touch.initated = true
      this.touch.pointStartX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    btnTouchMove (e) {
      if (!this.touch.initated) {
        return
      }
      let delta = e.touches[0].pageX - this.touch.pointStartX
      let progressLeft = Math.max(0, Math.min(delta + this.touch.left, this.$refs.barInner.clientWidth - this.$refs.progressBtn.clientWidth))
      this._offset(progressLeft)
    },
    btnTouchEnd (e) {
      let delta = e.changedTouches[0].pageX - this.touch.pointStartX
      if (delta === 0) {
        return
      }
      this._triggerPercent()
      this.touch.initated = false
    },
    _offset (padLeft) {
      this.$refs.progress.style.width = `${padLeft}px`
      this.$refs.progressBtn.style.transform = `translate3d(${padLeft}px, 0, 0)`
    },
    _triggerPercent () {
      let progressLeft = this.$refs.progress.clientWidth
      let percent = progressLeft / (this.$refs.barInner.clientWidth - this.$refs.progressBtn.clientWidth)
      this.$emit('percentChange', percent)
    }
  },
  created () {
    this.touch = {}
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent (newPer) {
      if (newPer >= 0 && !this.touch.initated) {
        const barWidth = this.$refs.barInner.clientWidth
        let padLeft = (barWidth - this.$refs.progressBtn.clientWidth) * newPer
        this._offset(padLeft)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    width 100%
    background-color $color-background-d
    height 4px
    .progress
      width 0px
      height 4px
      background-color $color-theme-d
    .progress-btn
      position absolute
      top -5px
      left 0
      height 14px
      width 14px
      border-radius 50%
      background-color $color-theme
</style>
