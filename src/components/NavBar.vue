<template>
  <nav>
    <a @click="toggleAbout">
    <transition  
    >
    <p ref="banner" >{{aboutMessage}}</p>
    </transition>
    </a>
  </nav>
</template>

<script>
import gsap from 'gsap'
export default {
  name: 'Navbar',
  props: ['solved'],
  methods: {
    toggleAbout: function() {
      this.$store.commit('toggleAbout')
    }
  }, computed: {
    aboutMessage() {
      return this.$store.state.onAbout ? '_back_to_maze' : '_about'
    }
  }, watch: {
    solved() {
      
      if (this.$store.state.notPossible) {
        
        gsap.to(this.$refs.banner, { 
          duration: 1.5,
          backgroundPosition: '0px 100%'
        })
      }
       if (this.$store.state.solved) {
        gsap.to(this.$refs.banner, { 
          duration: 1.5,
          backgroundPosition: '100% 0px'
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
    /* background: -webkit-linear-gradient(left, rgb(17, 24, 39), rgb(84, 80, 76)); */
    /* background-size: 200% 100%; */
    /* background-position:left; */
    width:fit-content;
  }
  nav {
    display:flex;
    justify-content: right;
    padding-right:1em;
     padding-left:1em;
  }
</style>