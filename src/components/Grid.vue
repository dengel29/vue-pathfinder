<template>
  <button @click="createRandomGrid"> Create Random Grid </button>  
  <!-- <div :style="gridStyles" :key="mazeUpdater" v-if="mazeUpdater > 0" class="grid-container"> -->
    <transition-group
      appear
      name="grid"
      :style="gridStyles"
      
      class="grid-container"
      tag="div"
      >
    <!-- <div
        class="cell"
        v-for="cell in grid.cells"
        @mouseenter.ctrl="gimmeCell($event, cell)"
        :key="cell"
        :data-id="cell.id"
        :data-x="cell.x"
        :data-y="cell.y"
        :data-type="cell.type"
        :class="[cell.hasObstacle ? hasObstacle : '']"
        >
    </div> -->
    <CellComp
      ref="cells"
      v-for="cell in cells"
      :key="cell"
      :id="cell.id"
      :cell="cell"
      :type="cell.type"
    />
  </transition-group>
  <!-- </div> -->
  <br>
  <div class="message" >
    <h1 :class="loading ? solvingStyle : notSolvingStyle">
      solving for x
    </h1>
    <p v-if="notPossible">
      not solvable :(
    </p>
    <h1 v-if="grid.path">
      solved in {{grid.path.length}} moves
    </h1>
  </div>
  <hr>
  <br>

  <button @click="solveMaze">solve</button>
  <button @click="setNotPossible">possible?</button>
  <button @click="toggleLoading">sloving?</button>
</template>

<script>
import Cell from '../utils/Cell'
// import gsap from 'gsap'
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
      hasObstacle: 'obstacle',
      solvingStyle: 'solving',
      notSolvingStyle: 'not-solving'
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
  },
  setup: () => {
    const width = 20
    const height = 20;
    var count = 200
    let setCells = () => {
      let cells=[];
      for(let i=0;i<height;i++) {
        for(let j=0;j<width;j++) {
          let hasObstacle=Math.floor(Math.random()*4)===2? true:false;
          let cell= new Cell(j, i, hasObstacle, count);
          cell.hasObstacle ? cell.type = "obstacle" : cell.type = "normal"
          cells.push(cell);
          count++
        }
      }
      count = 200
      return cells
    };
    // let beforeEnter = (el) => {
      
    //   el.style.backgroundColor = `rgba(${Number(el.dataset.x) * 4.5}, ${Number(el.dataset.y)* 2.5}, ${Math.floor(Number(el.dataset.id)/10)})`
      // el.style.height = '0px'
    // };
    // let enter = (el, done) => {
    //   const type = el.dataset.type
    //   console.log(el)
    //   switch (type) {
    //     case 'obstacle':
    //       gsap.to(el, {
    //       background: 'red',
    //       height: "5px",
    //       delay: el.dataset.id * Math.random() / 1000,
    //       onComplete: done
    //     });
    //     break;
    //     case 'normal':
    //       gsap.to(el, {
    //         background: 'white',
    //       height: "5px",
    //       delay: el.dataset.id * Math.random() / 1000,
    //       onComplete: done
    //     });
    //     break;
    //      case 'start':
    //       gsap.to(el, {
    //       background: 'lightgreen',
    //       height: "5px",
    //       delay: el.dataset.id * Math.random() / 1000,
    //       onComplete: done
    //     });
    //     break;
    //       case 'end':
    //       gsap.to(el, {
    //         background: 'darkslateblue',
    //       height: "5px",
    //       delay: el.dataset.id * Math.random() / 1000,
    //       onComplete: done
    //     });
    //     break;
    //       case 'path':
    //         gsap.to(el, {
    //         background: 'green',
    //         height: "5px",
    //         delay: el.dataset.id * Math.random() / 1000,
    //         onComplete: done
    //       });
          
    //   }
    // };
    // let afterEnter = (el, done) => {
    //     const type = el.dataset.type
    //     if (type ==='path') {
    //       gsap.to(el, {
    //         background: 'green',
    //         height: "100%",
    //         delay: el.dataset.id * Math.random() / 1000,
    //         onComplete: done
    //       });
    //     }
    // };
    // let leave = (el, done) => {
    //   gsap.to(el, {
    //     background: 'green',
    //     delay: el.dataset.id * 0.95,
    //     onComplete: done
    //   })
    // };

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
      startCell.type = "start"
      startCell.hasObstacle = false;
      endCell.isEnd = true;
      endCell.type = "end"
      endCell.hasObstacle = false;
      return [startCell, endCell];
    };
    return {  findStartAndEnd, setCells }
  },
  mounted: function() {
  },  
  methods: {
    setNotPossible: function() {
      this.$store.state.notPossible ? this.$store.commit('resetPossibility') : this.$store.commit('impossibleMaze')
    },
    toggleLoading: function() {
      this.$store.state.isSolving ? this.$store.commit('stopSolving') : this.$store.commit('startSolving')
    },
    setCellType: function() {

    },
    solveMaze: function() {
      this.$store.commit('startSolving')
      this.$nextTick(function() {
        setTimeout(() => {
          this.$store.dispatch('wholeProcess')
          this.mazeUpdater++
        }, 0)
      })
    },
    gimmeCell(event, cell) {
      cell.hasObstacle = true
      
      event.target.style = "background:black"
      
    },
    createRandomGrid: function() {
      const width = 20
      const height = 20;
      let cells = this.setCells()
      
      let [startCell, endCell] = this.findStartAndEnd(cells)
      let grid = {cells: cells, startCell: startCell, endCell: endCell, height: height, width: width}
      this.$store.commit('setGrid', {newGrid: grid})
      console.log(this.cells)

    },
    setMazeDimensions: function() {
      let height = this.$refs.heightinput.value;
      let width = this.$refs.heightinput.value;

      this.setCells(width, height)
    }
  }
}
</script>

<style scoped>
  .grid-container {
    display:grid;
    /* grid-gap: 5px; */
    grid-template-columns: var(--grid-width);
    grid-template-rows: var(--grid-height);
    width:70%;
    height:70vh;
    margin: 0 auto;
  }
  .cell {
    display:inline-block;
    width:auto;
    height:auto;
    /* border:1px solid black; */
    /* display:grid; */
    font-size: 5px;
    margin: 0;
  }

  p {
    margin: 0;
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
