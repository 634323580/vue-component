import Notification from './notification.vue'

export default {
  extends: Notification,
  data() {
    return {
      visible: false,
      verticalOffset: 0,
      autoClose: 3000,
      height: 0
    }
  },
  mounted() {
    this.createTimer()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    createTimer() {
      if(this.autoClose) {
        this.timer = setTimeout(() => {
          this.visible = false
        }, this.autoClose)
      }
    },
    clearTimer() {
      if(this.timer) {
        clearTimeout(this.timer)
      }
    },
    afterEnter () {
      this.height = this.$el.offsetHeight
    }
  },
  computed: {
    style() {
      return {
        position: 'fixed',
        right: '20px',
        top: `${this.verticalOffset}px`
      }
    }
  }
}