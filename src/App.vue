<template>
  <Wrapper :solved="this.$store.state.solved" :not-possible="this.$store.state.notPossible"/>
</template>

<script>
import Wrapper from './components/Wrapper.vue'
export default {
  name: 'App',
  components: {
    Wrapper 
  }, mounted: function() {
    document.title = 'Vue Pathfinder Algorithm'
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  margin:0;
  padding: 0;
  background: -webkit-linear-gradient(bottom, rgb(17, 24, 39), rgb(84, 80, 76));
}
</style>
