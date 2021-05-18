import { createStore } from "vuex";
import Solver from "../utils/solver";

const store = createStore({
  state() {
    return {
      grid: { width: 50, height: 50 },
      path: null,
      isSolving: false,
      notPossible: false,
    };
  },
  mutations: {
    startSolving(state) {
      console.log("hey i started solving");
      state.isSolving = true;
    },
    stopSolving(state) {
      console.log("yo i'm done ended solving");
      state.isSolving = false;
    },
    setGrid(state, payload) {
      state.grid = payload.newGrid;
      this.commit("resetPossibility");
    },
    // setPath(state, payload) {
    //   state.path = payload.path;
    // },
    solve(state, payload) {
      state.grid = payload.newGrid;
    },
    impossibleMaze(state) {
      state.notPossible = true;
    },
    resetPossibility(state) {
      state.notPossible = false;
    },
  },
  actions: {
    startSolvingProcess({ commit }) {
      return new Promise((resolve) => {
        commit("resetPossibility");
        commit("startSolving");
        resolve();
      });
    },
    solveGrid({ dispatch, commit }) {
      return dispatch("startSolvingProcess").then(() => {
        return new Promise((resolve, reject) => {
          let s = new Solver({
            width: this.state.grid.width,
            height: this.state.grid.height,
            cells: this.state.grid.cells,
            start: this.state.grid.startCell,
            end: this.state.grid.endCell,
          });
          s.solveGrid();
          if (s.path.length > 0) {
            commit("solve", { newGrid: s.grid });
            resolve();
          } else {
            commit("impossibleMaze");
            reject("Maze cannot be solved");
          }
        });
      });
    },
    wholeProcess({ dispatch, commit }) {
      return dispatch("solveGrid").finally(() => {
        commit("stopSolving");
      });
    },
  },
});

export default store;
