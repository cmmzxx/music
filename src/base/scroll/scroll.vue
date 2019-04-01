<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    pullUpload: {
      type: Object,
      default: null
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: null,
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let vm = this
        vm.scroll.on('scroll', (pos) => {
          vm.$emit('scroll', pos)
        })
      }
      if (this.pullUpload) {
        let vm = this
        vm.scroll.on('scrollEnd', (pos) => {
          if (pos.y <= vm.scroll.maxScrollY + 50) {
            vm.$emit('scrollToEnd')
          }
        })
      }
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      // (x, y, time, easing)
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      // (el, time, offsetX, offsetY, easing)
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data (oldVal, newVal) {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
