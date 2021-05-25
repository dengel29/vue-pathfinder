<template>
  <div class="cell-container" :class="classObject">
    </div>
</template>

<script>
import gsap from 'gsap'
export default {
  name: 'Cell',
  data: function() {
    return {

    }
  },
  props: ['cell', 'type', 'id', 'pathId'],
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
          delay: Number(this.pathId) * .05,
          duration: 1.5,
          borderRadius: '3%',
          border: 'none',
          backgroundColor: `hsl(${Number(this.pathId) * 15}, 90%, %69 )`,
          repeat: -1
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
            // background: 'red',
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
              
              repeat: -1
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
     overflow:hidden;
     box-sizing: border-box;
     /* transform: translate3d(0, 0, 40px); */
    width:auto;
    height:auto;
    /* border:1px solid black; */
    display:grid;
    font-size: 5px;
    margin: 0;
    border: solid 1px rgba(0,0,0,.5);
    /* position: absolute; */
    z-index: 1;
    /* width: 47px; */
    /* height: 47px; */
    /* border-radius: 3px; */
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    background: rgba(255, 255, 255, 0.5);
  }

  .obstacle {
    border:1px solid black
  }
  .start {
    background-color: lightseagreen;
    border: lightseagreen
  }
  .end {
    background-color: darkgoldenrod;
    border: darkgoldenrod
  }
  /* .path {
    background-color: green
  } */
  .front {
    transform: translateX(-3%) translateY(-64%) rotateZ(0deg) rotateX(257deg);
    transform-origin: 47px -55%;
    background-color: inherit;
    -webkit-transform-origin: 47px -55%;
    -moz-transform-origin: 50% 100%;
    width: 100%;
    height: 129%;
    transform-origin: 57% -2%;
    -moz-transform-origin: 47px -55%;
    -webkit-transform: translateX(-3%) translateY(-64%) rotateZ(0deg) rotateX(257deg);
    -moz-transform: translateX(-3%) translateY(-64%) rotateZ(0deg) rotateX(257deg);
    border: 1px solid black;
}
.top {
    transform-origin: -50% 0%;
    background-color: inherit;
    transform: rotateX(-251deg);
    -webkit-transform-origin: -50% 0%;
    -webkit-transform: rotateX(-251deg);
    -moz-transform-origin: -50% 0%;
    -moz-transform: rotateX(-251deg);
}
.right {
   transform-origin: -2%;
    transform: rotateY(86deg) rotateX(0deg) rotateZ(-2deg) translateY(0%) translateX(0%);;
    background-color: inherit;
    -webkit-transform-origin: -2%;
    height: 198%;
    width: 81%;
    border: 1px solid black;
    -webkit-transform: rotateY(86deg) rotateX(0deg) rotateZ(-2deg) translateY(0%) translateX(0%);
    -moz-transform-origin: -2%;
    -moz-transform: rotateY(86deg) rotateX(0deg) rotateZ(-2deg) translateY(0%) translateX(0%);
}
</style>