export default class Queue {
  constructor(node) {
    this.head = { node, next: null };
    this.length = 1;
  }

  // pushes a new node to the end of the queue
  enqueue = (node) => {
    if (!this.head) {
      this.head = { node, next: null };
      this.length++;
      return;
    }
    let tail = this.head;

    while (tail.next != null) {
      tail = tail.next;
    }

    tail.next = { node, next: null };
    this.length++;
  };

  // remove the head, replace it with next, and return the head
  dequeue = () => {
    if (this.length > 0) {
      const headNode = this.head.node;
      this.head = this.head.next;
      this.length--;

      return headNode;
    } else {
      throw new Error("there are no more items left in the queue");
    }
  };

  listNodes = () => {
    let nodes = [];
    if (this.length === 0) {
      return nodes;
    }
    nodes.push(this.head.node);
    let currentNode = this.head;
    while (currentNode.next) {
      currentNode = currentNode.next;
      nodes.push(currentNode.node);
    }
    return nodes;
  };
}
