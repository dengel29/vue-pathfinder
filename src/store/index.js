import { createStore } from "vuex";
import Solver from "../utils/solver";

const store = createStore({
  state() {
    return {
      grid: { width: 50, height: 50 },
      isSolving: false,
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
    },
    solve(state, payload) {
      state.grid = payload.newGrid;
    },
  },
  actions: {
    startSolvingProcess({ commit }) {
      return new Promise((resolve) => {
        commit("startSolving");
        resolve();
      });
    },
    solveGrid({ dispatch, commit }) {
      return dispatch("startSolvingProcess").then(() => {
        return new Promise((resolve) => {
          let s = new Solver({
            width: this.state.grid.width,
            height: this.state.grid.height,
            cells: this.state.grid.cells,
            start: this.state.grid.startCell,
            end: this.state.grid.endCell,
          });
          s.solveGrid();
          let grid = s.grid;
          commit("solve", { newGrid: grid });
          resolve();
        });
      });
    },
    wholeProcess({ dispatch, commit }) {
      return dispatch("solveGrid").then(() => {
        commit("stopSolving");
      });
    },
  },
});

export default store;
