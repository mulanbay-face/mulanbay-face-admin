<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'MulanbayDoc',
  data() {
    return {
      url: 'http://doc.mulanbay.cn/mulanbay'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>