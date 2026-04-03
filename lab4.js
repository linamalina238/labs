class BiDirectionalPriorityQueue {
  constructor() {
    this.elements = [];
    this.insertionCounter = 0;
  }

  enqueue(item, priority) {
    this.elements.push({ priority, item, index: this.insertionCounter });
    this.insertionCounter++;
  }

  #findByPriority(mode) {
    if (this.elements.length === 0) {
      throw new Error("Черга порожня");
    }

    if (mode === "highest") {
      return this.elements.reduce((best, current) =>
        current.priority > best.priority ? current : best
      );
    }

    if (mode === "lowest") {
      return this.elements.reduce((best, current) =>
        current.priority < best.priority ? current : best
      );
    }

    if (mode === "oldest") {
      return this.elements.reduce((best, current) =>
        current.index < best.index ? current : best
      );
    }

    if (mode === "newest") {
      return this.elements.reduce((best, current) =>
        current.index > best.index ? current : best
      );
    }
  }

  peek(mode) {
    return this.#findByPriority(mode).item;
  }

  dequeue(mode) {
    const target = this.#findByPriority(mode);
    this.elements.splice(this.elements.indexOf(target), 1);
    return target.item;
  }
}

const pq = new BiDirectionalPriorityQueue();

pq.enqueue("задача A", 7);
pq.enqueue("задача B", 1);
pq.enqueue("задача C", 3);
pq.enqueue("задача D", 4);

console.log("--- peek ---");
console.log("Найвищий:", pq.peek("highest"));
console.log("Найнижчий:", pq.peek("lowest"));
console.log("Найстаріший:", pq.peek("oldest"));
console.log("Найновіший:", pq.peek("newest"));

console.log("\n--- dequeue ---");
console.log("Витягуємо найвищий:", pq.dequeue("highest"));
console.log("Витягуємо найнижчий:", pq.dequeue("lowest"));
console.log("Витягуємо найстаріший:", pq.dequeue("oldest"));
console.log("Витягуємо найновіший:", pq.dequeue("newest"));