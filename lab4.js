class QueueItem {
  constructor(value, priority, sequence) {
    this.value = value;
    this.priority = priority;
    this.sequence = sequence;
  }
}

class BiDirectionalPriorityQueue {
  constructor() {
    this.elements = [];
    this.insertionCounter = 0;
  }

  enqueue(value, priority) {
    this.elements.push(new QueueItem(value, priority, this.insertionCounter));
    this.insertionCounter++;
  }

  #findByPriority(mode) {
    if (this.elements.length === 0) {
      throw new Error("Черга порожня");
    }

    if (mode === "highest") {
      return this.elements.reduce((best, current) => {
        if (current.priority > best.priority) return current;
        if (current.priority === best.priority && current.sequence < best.sequence) return current;
        return best;
      });
    }

    if (mode === "lowest") {
      return this.elements.reduce((best, current) => {
        if (current.priority < best.priority) return current;
        if (current.priority === best.priority && current.sequence < best.sequence) return current;
        return best;
      });
    }

    if (mode === "oldest") {
      return this.elements.reduce((best, current) =>
        current.sequence < best.sequence ? current : best
      );
    }

    if (mode === "newest") {
      return this.elements.reduce((best, current) =>
        current.sequence > best.sequence ? current : best
      );
    }
  }

  peek(mode) {
    return this.#findByPriority(mode).value;
  }

  dequeue(mode) {
    const target = this.#findByPriority(mode);
    this.elements.splice(this.elements.indexOf(target), 1);
    return target.value;
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

const queue2 = new BiDirectionalPriorityQueue();

queue2.enqueue("first", 1);
queue2.enqueue("second", 2);
queue2.enqueue("third", 3);

console.log("\n------");
console.log("FIFO (oldest):", queue2.dequeue("oldest")); 
console.log("LIFO (newest):", queue2.dequeue("newest")); 
console.log("Left (oldest):", queue2.dequeue("oldest")); 