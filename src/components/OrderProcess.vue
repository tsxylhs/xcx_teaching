<template lang="pug">
  div
    span(v-if="process === 'paying' ")
      span(v-if="status !== 'cancel'") 待付款
      span(v-else) 已取消
    span(v-if="process === 'sending'") 待发货
    span(v-if="process === 'waiting'") 待收货
    span(v-if="process === 'finished'") 已完成
    span(v-if="process === 'timeout'") 交易关闭
    span(v-if="process==='distributing'") 已发货
</template>

<script>
  export default {
    name: 'OrderProcess',
    props: {
      process: {
        type: String
      },
      status: {
        type: String
      },
      deleted: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    }
  }
</script>

<style scoped>

</style>
