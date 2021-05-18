<template>
  <div class="cell-container" :class="classObject"></div>
</template>

<script>
import gsap from 'gsap'
export default {
  name: 'Cell',
  data: function() {
    return {

    }
  },
  props: ['cell', 'type', 'id'],
  computed: {
    classObject() {
      return {
        'obstacle': this.cell.hasObstacle,
        'path': this.cell.isPath,
        'start': this.cell.isStart,
        'end': this.cell.isEnd
      }
    }
  },
  watch: {
    type() {
      gsap.to(this.$el, 
        { 
          delay: this.id * .005,
          backgroundColor: 'green'
        })
    }
  },
  updated: function() {
  },
  setup: () => {
    let beforeEnter = (el) => {    
        el.style.backgroundColor = `rgba(${Number(el.dataset.x) * 4.5}, ${Number(el.dataset.y)* 2.5}, ${Math.floor(Number(el.dataset.id)/10)})`
        el.style.height = '0px'
      };
      let enter = (el, done) => {
        const type = el.dataset.type
        switch (type) {
          case 'obstacle':
            gsap.to(el, {
            background: 'red',
            height: "100%",
            delay: el.dataset.id * Math.random() / 1000,
            onComplete: done
          });
          break;
          case 'normal':
            gsap.to(el, {
              background: 'white',
            height: "100%",
            delay: el.dataset.id * Math.random() / 1000,
            onComplete: done
          });
          break;
          case 'start':
            gsap.to(el, {
            background: 'lightgreen',
            height: "100%",
            delay: el.dataset.id * Math.random() / 1000,
            onComplete: done
          });
          break;
            case 'end':
            gsap.to(el, {
              background: 'darkslateblue',
            height: "100%",
            delay: el.dataset.id * Math.random() / 1000,
            onComplete: done
          });
          break;
            case 'path':
              gsap.to(el, {
              background: 'green',
              height: "100%",
              delay: el.dataset.id * Math.random() / 1000,
              onComplete: done
            });
            
        }
      };
      let afterEnter = (el, done) => {
          console.log('after entered')
          const type = el.dataset.type
          if (type ==='path') {
            gsap.to(el, {
              background: 'green',
              height: "100%",
              delay: el.dataset.id * Math.random() / 1000,
              onComplete: done
            });
          }
      };
      let leave = (el, done) => {
        gsap.to(el, {
          background: 'green',
          delay: el.dataset.id * 0.95,
          onComplete: done
        })
      };
      return {beforeEnter, enter, afterEnter, leave}
  },
  mounted: function() {

  },
  methods: {

  }
}
</script>

<style scoped>
  .cell-container {
     display:inline-block;
    width:auto;
    height:auto;
    border:1px solid black;
    display:grid;
    font-size: 5px;
    margin: 0;
  }

  .obstacle {
    background-color:red
  }
  .start {
    background-color: lightseagreen
  }
  .end {
    background-color: darkblue
  }
  /* .path {
    background-color: green
  } */
</style>