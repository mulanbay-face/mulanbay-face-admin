<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'MulanbayGit',
  data() {
    return {
      url: 'https://gitee.com/mulanbay'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>