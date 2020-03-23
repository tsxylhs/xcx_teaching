<template lang="pug">
  div
    span.text-red(v-if="process === 'waiting'") 排队中
    span(v-if="process === 'cancel'") 已取消
    span(v-if="process === 'failed'") 排队失败
    span(v-if="process === 'finished'") 已叫号
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
