class BiDirectionalPriorityQueue {
  constructor() {
    this.elements = []; 
  }

 
  enqueue(item, priority) {
    this.elements.push({ priority, item });
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

    throw new Error(`Невідомий режим: "${mode}". Використовуйте: highest | lowest`);
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

pq.enqueue("задача A", 3);
pq.enqueue("задача B", 1);
pq.enqueue("задача C", 5);
pq.enqueue("задача D", 2);

console.log("--- peek ---");
console.log("Найвищий:", pq.peek("highest")); 
console.log("Найнижчий:", pq.peek("lowest"));  

console.log("\n--- dequeue ---");
console.log("Витягуємо найвищий:", pq.dequeue("highest")); 
console.log("Витягуємо найнижчий:", pq.dequeue("lowest")); 