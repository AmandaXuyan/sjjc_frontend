
<template>
  <div v-if="show">
    <button @click="closeShow"></button>
  </div>
</template>
<script>

  export default {
    data(){
      return{
      }
    },
    props: ["show"],
    methods: {
      closeShow() {
        this.$emit("update:show",false);
      }
    },
  }
</script>
<style lang="scss" scoped>
</style>
