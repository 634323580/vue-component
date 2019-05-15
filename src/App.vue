<template>
  <div id="app">
    <button @click="showNotification">显示</button>
  </div>
</template>
<script>
import notification from '_c/notification/notification';
export default {
  methods: {
    showNotification() {
    this.$notify({
        content: '测试内容'
      })
    },
  },
  components: {
    notification
  }
}
</script>
<style lang="scss">
  @import './common/scss/reset.scss';
</style>
