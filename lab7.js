const EventEmitter = require("events");

const bus = new EventEmitter();

class User {
  constructor(name) {
    this.name = name;
    this.handler = (data) => {
      console.log(`${this.name} got message:`, data);
    };
    bus.on("message", this.handler);
  }

  leave() {
    bus.off("message", this.handler);
    console.log(`${this.name} unsubscribed`);
  }

  send(text) {
    bus.emit("message", text);
  }
}

const a = new User("a");
const b = new User("b");
const c = new User("c");

a.send("ᓚᘏᗢ");
c.leave();
b.send("𓆉");
