export default class Cell {
  constructor(xCoordinate, yCoordinate, hasObstacle, id) {
    this.id = id;
    this.x = xCoordinate;
    this.y = yCoordinate;
    this.hasObstacle = hasObstacle;
    this.previous = null;
    this.isStart = false;
    this.isEnd = false;
    this.isPath = false;
    this.visited = false;
    this.type = "normal";
  }

  static findByCoordinates(cells, x, y) {
    return cells.find((c) => c.x === x && c.y === y);
  }

  /**
   * given the grid height and width, returns a cell's neighbors
   * @param {number} gridWidth
   * @param {number} gridHeight
   * @returns {array} [newXCoordinate, newYCoordinate]
   */
  getNeighorCoordinates = (gridWidth, gridHeight) => {
    // yMoves -1 is north, 1 is south
    // xMoves 1 is east, -1 is west
    let yMoves = [-1, 1, 0, 0];
    let xMoves = [0, 0, 1, -1];

    let neighbors = [];
    // this loops looks north, south, east, then west
    for (let i = 0; i < 4; i++) {
      let newXPosition = this.x + xMoves[i];
      let newYPosition = this.y + yMoves[i];

      if (
        newXPosition < 0 ||
        newYPosition < 0 ||
        newXPosition === gridWidth ||
        newYPosition === gridHeight
      ) {
        continue;
      }

      neighbors.push([newXPosition, newYPosition]);
    }
    return neighbors;
  };
}
