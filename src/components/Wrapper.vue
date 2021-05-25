<template>
  <div class="bg" ref="bg">
      <Navbar/>
    <Grid/>
  </div>
</template>

<script>
import gsap from 'gsap'
import Grid from './Grid.vue'
import Navbar from './NavBar.vue'

export default {
  name: 'Wrapper',
  components: {
    Grid,
    Navbar
  },
  props: ['solved', 'notPossible'],
  watch: {
    solved() {
       if (this.$store.state.solved) {
        gsap.to(this.$refs.bg, { 
          duration: 1.2,
          background: '-webkit-linear-gradient(top, hsl(225, 30%, 40%), hsl(225, 60%, 60%))'
        })
      } else {
        gsap.to(this.$refs.bg, { 
          duration: 1.2,
          background: '-webkit-linear-gradient(bottom, rgb(17, 24, 39), rgb(84, 80, 76))'
        })
      }
    },
    notPossible() {
      if (this.$store.state.notPossible) {
        gsap.to(this.$refs.bg, { 
          duration: 1.2,
          background: '-webkit-linear-gradient(top right, hsl(340, 50%, 30%), hsl(340, 20%, 10%))'
        }) 
      } else {
        gsap.to(this.$refs.bg, { 
          duration: 1.2,
          background: '-webkit-linear-gradient(left, rgb(17, 24, 39), rgb(84, 80, 76))'
        }) 
      }
    }
  }

  
}
</script>

<style scoped>
  p {
    color: white;
    font-weight:bolder;
    font-size:1.2em;
    cursor: pointer;
    width:fit-content;
  }
  nav {
    display:flex;
    justify-content: right;
    padding-right:1em;
  }
</style>