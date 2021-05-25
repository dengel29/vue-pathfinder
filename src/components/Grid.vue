<template>
  <transition 
  @before-enter="aboutBeforeEnter"
  @enter="aboutEnter" 
  @leave="aboutLeave" mode="out-in">
  <div v-if="navigatedToAbout" style="color: white; max-width: 55ch; margin: 0 auto; height:20vh" :key="1">
    <p> This is an exploration of a simple depth-first pathfinding algorithm by me, Dan Engel. I initially wrote the algorithim in plain javascript then ported it over to Vue 3 to get it running in the browser. Animations are done with the help of Green Sock and state is managed with the help of Vuex. Is that overkill? Probably. But it was a nice way to learn the tools.</p> 
    <br>
    <p>The code is available <a target="_blank" href="https://github.com/dengel29/">here</a> and my personal website is <a target="_blank" href="https://dan-engel.fyi">here</a> .</p>
  </div>
  <div v-else-if="!navigatedToAbout" :key="2" style="height: 20vh">
      <label for="">
        <input type="number" :min="minDimensions" :max="maxDimensions" v-model="dimensionsInput">
      </label>
      <button @click="setMazeDimensions" :disabled="!validMazeDimensions">
        <p :style="!validMazeDimensions ? 'color: red; font-weight:bold' : ''"> {{buttonMessage}}</p>
       </button>  
      <br>
      <p>or</p>
      <button @click="createRandomGrid"> Create a Grid with Random Dimensions </button>
      <br>
      <hr>
      <p >Click <button style="color: black" @click="solveMaze">solve</button> to see a breadth-first search algorithm solve the maze</p>
      <span style="color: springgreen; display: inline-block">
      The maze start is <p style="display: inherit; color:lightseagreen"> lightseagreen </p> 
      and the maze end is <p style="display: inherit;color: deepskyblue">deepskyblue</p> 
    </span>
    <hr>
      <p style="color: orangered; font-weight: bolder" :class="loading ? solvingStyle : notSolvingStyle">
        solving for x
      </p>
      <p v-if="notPossible" style="color: orange; font-weight: bolder">
        some generated grids are not solvable :(
      </p>
      <p v-if="grid.path" style="color: springgreen; font-weight: bolder">
        solved in {{grid.path.length}} moves
      </p>
    </div>
  </transition>
    <transition-group
      appear
      name="grid"
      :key="mazeUpdater" 
      :style="gridStyles"
      @beforeEnter="beforeEnter"
      @enter="enter"
      class="grid-container"
      tag="div"
      >
    <CellComp
      ref="cells"
      @mouseenter.ctrl="gimmeCell($event, cell)"
      v-for="cell in cells"
      :key="cell"
      :id="cell.id"
      :path-id="cell.pathId"
      :cell="cell"
      :type="cell.type"
      :data-x="cell.x"
      :data-y="cell.y"
      :data-type="cell.type"
    />
  </transition-group>
</template>

<script>
import Cell from '../utils/Cell'
import gsap from 'gsap'
import CellComp from './Cell'

export default {
  name: 'Grid',
  components: {
    CellComp
  },
  data: function() {
    return {
      mazeUpdater: 0,
      messageUpdater:0,
      dimensionsInput:4,
      hasObstacle: 'obstacle',
      solvingStyle: 'solving',
      notSolvingStyle: 'not-solving',
      maxDimensions: 60,
      minDimensions: 3
    }
  },
  props: {},  
  computed: {
    gridStyles() {
      return {
        '--grid-width': `repeat(${this.grid.width}, minmax(0, 1fr))`,
        '--grid-height': `repeat(${this.grid.height}, minmax(0, 1fr))`,
      }
    },
    notPossible() {
      return this.$store.state.notPossible
    },
    loading() {
      return this.$store.state.isSolving
    },
    grid() {
      return this.$store.state.grid
    },
    cells() {
      return this.$store.state.grid.cells
    },
    navigatedToAbout() {
      return this.$store.state.onAbout
    },
    buttonMessage() {
      if (this.dimensionsInput > this.maxDimensions) {
        return `Enter a number lower than ${this.maxDimensions}`
      }
      if (this.dimensionsInput < this.minDimensions) {
        return `Enter a number greater than ${this.minDimensions}`
      } 
      return `Create a ${this.dimensionsInput} x ${this.dimensionsInput} maze`
    },
    validMazeDimensions() {
      return this.dimensionsInput && this.dimensionsInput <= this.maxDimensions && this.dimensionsInput >= this.minDimensions
    }
  },
  setup: () => {
    const width = 25
    const height = 25;
    var count = 0
    let setCells = (w, h) => {
      console.log('what')
      let cells=[];
      for(let i=0;i<h;i++) {
        for(let j=0;j<w;j++) {
          let hasObstacle=Math.floor(Math.random()*3)===1? true:false;
          let cell= new Cell(j, i, hasObstacle, count);
          cell.hasObstacle ? cell.type = "obstacle" : cell.type = "normal"
          cells.push(cell);
          count++
        }
      }
      count = 0
      return cells
    };
    let leave = (el, done) => {
      gsap.to(el, {
        background: 'green',
        transform: 'translateX(1000)',
        delay: el.dataset.id * 0.95,
        onComplete: done
      })
    };

    let findStartAndEnd = (cells) => {
      let edgeCells = cells.filter(
        (cell) =>
          cell.x === 0 ||
          cell.y === 0 ||
          cell.y === height - 1 ||
          cell.x === width - 1
      );
      let [startCell] = edgeCells.splice(
        Math.floor(Math.random() * edgeCells.length),
        1
      );
       let [endCell] = edgeCells.splice(
        Math.floor(Math.random() * edgeCells.length),
        1
      );
      // let endCell = cells[Math.abs(startCell.id - cells.length)]
      startCell.isStart = true;
      startCell.type = "start"
      startCell.hasObstacle = false;
      endCell.isEnd = true;
      endCell.type = "end"
      endCell.hasObstacle = false;
      return [startCell, endCell];
    };
    return {  findStartAndEnd, setCells,leave }
  },
  mounted: function() {
  },
  updated: function() {
  },
  methods: {
    solveMaze: function() {
      this.$store.commit('startSolving')
      this.$nextTick(function() {
        setTimeout(() => {
          this.$store.dispatch('wholeProcess')
        }, 0)
      })
    },
    gimmeCell(event, cell) {
      cell.hasObstacle = true
      event.target.style = `background: hsl(${Number(cell.x) *   50} ${Number(cell.y)*   50}% 05%)`
    },
    createRandomGrid: function() {
      let n = Math.floor(Math.random() * 20) + 4
      const width = n
      const height = n;
      let cells = this.setCells(height, width)
      
      let [startCell, endCell] = this.findStartAndEnd(cells)
      let grid = {cells: cells, startCell: startCell, endCell: endCell, height: height, width: width}
      this.$store.commit('setGrid', {newGrid: grid})
      this.mazeUpdater++
    },
    setMazeDimensions: function() {
      let height = Number(this.dimensionsInput);
      let width = Number(this.dimensionsInput);

      let cells = this.setCells(height, width)
      
      let [startCell, endCell] = this.findStartAndEnd(cells)
      let grid = {cells: cells, startCell: startCell, endCell: endCell, height: height, width: width}
      this.$store.commit('setGrid', {newGrid: grid})
      this.mazeUpdater++
    },
    beforeEnter: function(el) {
      el.style.background = `hsl(${Number(el.dataset.x) *   50} ${Number(el.dataset.y)*   50}% 15%)`
      el.style.transform = 'scale(0.5, 0) rotateZ(120deg)'
      el.style.borderRadius = "30%"
      el.style.opacity = '0'
    },
    aboutBeforeEnter: function(el) {
      el.style.transform = 'translateX(-100px)'
      el.style.opacity = 0
    },
    aboutEnter: function(el) {
      gsap.to(el, {
        transform: 'translateX(0px)',
        duration:0.5,
        opacity: 1,
      })
    },
    beforeAboutLeave(el) {
     gsap.to(el, {
        transform: 'translateX(20px)',
        duration: 2,
      })
    },
    aboutLeave: function(el) {
      gsap.to(el, {
        transform: 'translateX(100px)',
        duration: 0.4,
      })
    },
    enter: function(el, done) {
      const type = el.dataset.type
      let numX = Number(el.dataset.x)
      let numY = Number(el.dataset.y)
      switch (type) {
        case 'obstacle':
          gsap.to(el, {
          border: '0.5px solid black',
          transform: "scale(1) rotateZ(0deg)",
          delay: (numX + numY) * .03,
          borderRadius: '0%',
          opacity: '1',
          onComplete: done
        });
        break;
        case 'normal':
          gsap.to(el, {
          background: 'white',
          transform: " scale(1) rotateZ(0deg)",
          opacity: '1',
          borderRadius: '0%',
          delay: (numX + numY) * .03,
          onComplete: done
        });
        break;
         case 'start':
          //  Array.from(el.children).forEach(child => child.style.opacity = '0')
          gsap.to(el, {
          transform: "scale(1) rotateZ(0deg)",
          background: 'deepskyblue',
          opacity: '1',
          borderRadius: '0%',
          delay: (numX + numY) * .03,
          onComplete: done
        });
        break;
          case 'end':
            // Array.from(el.children).forEach(child => child.style.opacity = '0')
          gsap.to(el, {
          background: 'lightseagreen',
          transform: "scale(1, 1) rotateZ(0deg)",
          opacity: '1',
          borderRadius: '0%',
          delay: (numX + numY)  * .03,
          onComplete: done
        });
        break;      
      }
    }
  }
}
</script>

<style scoped>
  .grid-container {
    display:grid;
    position: relative;
    transform: rotateX(47deg) rotateZ(210deg) rotateY(10deg) translate(-40px, -4px);
    -webkit-transform: rotateX(47deg) rotateZ(210deg) rotateY(10deg) translate(-40px, -4px);
    -moz-transform: rotateX(47deg) rotateZ(210deg) rotateY(10deg) translate(-40px, -4px);
    /* grid-gap: 5px; */
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    grid-template-columns: var(--grid-width);
    grid-template-rows: var(--grid-height);
    width:70%;
    height:80vh;
    margin: 0 auto;
    max-width: 600px
  }
  .cell {
    will-change: transform, transform-origin;
    display:inline-block;
    /* width:auto;
    height:auto; */
    border:1px solid black;
    /* display:grid; */
    font-size: 5px;
    margin: 0;
  }

  p {
    margin: 0;
  }
  .message {
    border: 1px dotted darkslateblue;
    height:18px;
  }

  .solving {
    display: block
  }
  .not-solving {
    display:none
  } 
  a {
    color: white;
  }
  p, span {
    color: springgreen
  }
  button p{
    color:black
  }
</style>
