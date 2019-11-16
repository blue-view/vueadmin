<template>
  <div class="notFound"></div>
</template>

<script>
export default {
  name: "notFound"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.notFound {
  width: 100%;
  height: 100%;
  background: url(../assets/404.jpg) no-repeat;
  background-size: 100% 100%;
  position: fixed;
}
</style>
