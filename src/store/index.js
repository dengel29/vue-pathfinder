import { createStore } from "vuex";
import Solver from "../utils/solver";

const store = createStore({
  state() {
    return {
      grid: { width: 50, height: 50 },
      path: null,
      isSolving: false,
      solved: false,
      notPossible: false,
      onAbout: false,
    };
  },
  mutations: {
    startSolving(state) {
      state.isSolving = true;
    },
    stopSolving(state) {
      state.isSolving = false;
    },
    setGrid(state, payload) {
      state.grid = payload.newGrid;
      this.commit("resetPossibility");
      this.commit("resetSolved");
    },
    toggleAbout(state) {
      state.onAbout = !state.onAbout;
    },
    isSolved(state) {
      state.solved = true;
    },
    solve(state, payload) {
      state.grid = payload.newGrid;
    },
    impossibleMaze(state) {
      state.notPossible = true;
    },
    resetSolved(state) {
      state.solved = false;
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
            commit("isSolved");
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
