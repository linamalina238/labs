const EventEmitter = require("events");

class SafeBus extends EventEmitter {
  emit(event, ...args) {
    const listeners = this.rawListeners(event);
    for (const listener of listeners) {
      try {
        listener(...args);
      } catch (err) {
        this.emit("error", err);
      }
    }
  }
}

const bus = new SafeBus();

bus.on("error", (err) => {
  console.error("error channel:", err.message);
});

bus.on("message", (data) => {
  console.log("listener1:", data);
});

bus.on("message", (data) => {
  console.log("listener2:", data);
  throw new Error("no");
});

const temp = (data) => console.log("temp listener:", data);
bus.on("message", temp);

bus.emit("message", "ᓚᘏᗢ");
bus.emit("message", "☆*: .｡. o(≧▽≦)o .｡.:*☆");

bus.off("message", temp);
bus.emit("message", "after unsub");