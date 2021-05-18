import Queue from "./queue";

export default class Solver {
  constructor(grid) {
    this.grid = grid;
    this.queue = new Queue(this.grid.start);
    this.count = 0;
    this.path = [];
  }

  solveGrid = () => {
    // get the neighbors of the head
    let neighborCoordinates = this.queue.head.node.getNeighorCoordinates(
      this.grid.width,
      this.grid.height
    );
    // dequeue and save the head node for
    let previousNode = this.queue.dequeue();
    if (
      previousNode.x == this.grid.end.x &&
      previousNode.y == this.grid.end.y
    ) {
      return this.printSolution(previousNode);
    } else {
      for (let i = 0; i < neighborCoordinates.length; i++) {
        let n = neighborCoordinates[i];
        let nextCell = this.grid.cells.find(
          (c) => c.x === n[0] && c.y === n[1]
        );
        if (nextCell.hasObstacle || nextCell.visited) {
          continue;
        }
        nextCell.previous = previousNode;
        nextCell.visited = true;
        this.queue.enqueue(nextCell);
      }
      if (this.queue.length === 0) {
        return "Not possible";
      }
      this.solveGrid();
    }
  };

  printSolution = (endNode) => {
    if (endNode.isStart) {
      endNode.isPath = true;
      // endNode.type = "path";
      this.path.unshift(endNode);
      this.grid.path = this.path;
      return;
    }
    if (endNode.previous) {
      endNode.isPath = true;
      endNode.type = "path";
      this.path.unshift(endNode);
      this.count++;
      this.printSolution(endNode.previous);
    }
  };
}
