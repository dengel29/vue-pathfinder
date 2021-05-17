<template>
  <button @click="createRandomGrid"> Create Random Grid </button>  
  <!-- <div :key="messageUpdater">{{solving}}</div>  -->
  <div :style="gridStyles" :key="mazeUpdater" v-if="mazeUpdater > 0" class="grid-container">
    <!-- <transition-group
      name="staggered-update"
      @before-enter="beforeEnter"
      @enter="enter"
      > -->
    <div
        class="cell"
        v-for="cell in grid.cells"
        @mouseenter.ctrl="gimmeCell($event, cell)"
        :key="cell"
        :data-id="cell.id"
        :class="[cell.hasObstacle ? hasObstacle : '']"
        >
      <p v-if="!cell.isStart && !cell.isEnd && !cell.isPath"></p>
      <p v-if="cell.isPath" style="background: green"> • </p>
      <p v-if="cell.isEnd" style="background: purple"> E </p>
      <p v-if="cell.isStart" style="background: darkblue"> S </p>
    </div>
  <!-- </transition-group> -->
  </div>
  <br>
  <!-- <div class="message" > -->
  <h1 :class="loadingStates.solving ? solvingStyle : notSolvingStyle" :key="messageUpdater">
    solving...
  </h1>
  <p v-if="notPossible">
    not solvable :(
  </p>
  <!-- </div> -->
  <hr>
  <br>

  <button @click="solveMaze">solve</button>
  <button @click="notPossible = !notPossible">possible?</button>
  <button @click="loadingStates.solving = !loadingStates.solving">sloving?</button>
    <!-- <label for="width" >
      enter a maze width
      <input type="number" name="width" ref="heightinput">

    </label>
    <label for="height" >
      enter a maze height
      <input type="number" name="height" ref="heightinput">
    </label> -->
    <!-- <button @click="submitMazeDimensions"></button> -->
    <button @click="width++">increase width: {{ grid.width }}</button>
    <button @click="height++">increase height: {{ grid.height }}</button>
    <!-- <button @click="width--">decrease width: {{ width }}</button> -->
</template>

<script>
import {  reactive, toRef } from 'vue'
import Cell from '../utils/Cell'
import Solver from '../utils/solver'

export default {
  name: 'Grid',
  data: function() {
    return {
      mazeUpdater: 0,
      messageUpdater:0,
      notPossible: false,
      hasObstacle: 'obstacle',
      solvingStyle: 'solving',
      notSolvingStyle: 'not-solving'
      // solving: false
      
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
    loading() {
      return this.solving
    },
    cells() {
      return this.grid.cells
    }
  },
  setup: () => {
    const width = 50
    const height = 50;
    var count = 0
    const loadingStates = reactive({solving: false})
    let setCells = () => {
      let cells=[];
      for(let i=0;i<height;i++) {
        for(let j=0;j<width;j++) {
          let hasObstacle=Math.floor(Math.random()*4)===-1? true:false;
          let cell= new Cell(j, i, hasObstacle, count);
          cells.push(cell);
          count++
        }
      }
      return cells
    }

    let cells = setCells()

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
      startCell.isStart = true;
      startCell.hasObstacle = false;
      endCell.hasObstacle = false;
      endCell.isEnd = true;
      return [startCell, endCell];
    };

    let [startCell, endCell] = findStartAndEnd(cells)
    let grid = reactive({width: width, height: height, startCell: startCell, endCell: endCell, cells: cells })
    return { grid, findStartAndEnd, setCells, loadingStates }
  },
  mounted: function() {
    let gsapScript = document.createElement('script');
    gsapScript.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js")
    document.head.appendChild(gsapScript)
    },
    
  updated: function() {
    console.log('updated')
  },
  methods: {
    callSolver: async function() {
      let solving = toRef(this.loadingStates, 'solving')
      solving.value = true
      console.log(this.loadingStates.solving)
      this.messageUpdater++
      this.$forceUpdate()
      // insert here
      let grid = await this.solveMaze()
      if (grid == "Not possible") {
        this.notPossible = true
        this.messageUpdater++
      }

      solving.value = false
      console.log(this.loadingStates.solving)
    },
    solveMaze: async function() {
      this.loadingStates.solving = true
      let s = new Solver({
        width: this.grid.width,
        height: this.grid.height, 
        cells: this.grid.cells, 
        start: this.grid.startCell, 
        end: this.grid.endCell
      })
      s.solveGrid()
      this.loadingStates.solving = false
      // for (let i = s.path.length - 1; i >= 0;  i--) {
      //   s.path[i].isPath = true;
      //   console.log(s.path[i].id.toString())
      //   document.querySelector(`div[data-id="${s.path[i].id}"]`).style.background = 'green' 
      // }
    },
    gimmeCell(event, cell) {
      cell.hasObstacle = true
      // @ts-ignore
      event.target.style = "background:black"
      
    },
    // beforeEnter: function (el) {
    //   el.style.background = 'black'
    // },
    // //@ts-ignore
    // enter: function (el, done) {
    //   console.log(el)
    //   //@ts-ignore
    //     gsap.to(el, {
    //     background: 'green',
    //     delay: el.dataset.id * 0.55,
    //     onComplete: done
    //   })
    // },
    createRandomGrid: function() {
      const width = 50
      const height = 50;
      let cells = this.setCells()
      
      let [startCell, endCell] = this.findStartAndEnd(cells)
      let grid = reactive({cells: cells, startCell: startCell, endCell: endCell, height: height, width: width})
      this.grid = grid
      this.mazeUpdater++

    },
    setMazeDimensions: function() {
      //@ts-ignore
      let height = this.$refs.heightinput.value;
      //@ts-ignore
      let width = this.$refs.heightinput.value;

      this.setCells(width, height)
    }
  }
}
</script>

<style scoped>
  .grid-container {
    display:grid;
    grid-template-columns: var(--grid-width);
    grid-template-rows: var(--grid-height);
    width:80%;
    height:80vh;
    margin: 0 auto;
  }
  .cell {
    display:inline-block;
    width:auto;
    height:auto;
    border:1px solid black;
    /* border-radius:50%; */
    display:grid;
    font-size: 5px;
    /* place-self: center; */
    margin: 0;
  }

  p {
    margin: 0;
  }

  .obstacle {
    /* border:1px solid black; */
    background-color:red
  }
  .message {
    border: 1px solid red
  }

  .solving {
    display: block
  }
  .not-solving {
    display:none
  }
</style>
