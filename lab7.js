const EventEmitter = require("events");

const bus = new EventEmitter();

bus.on("message", (data) => {
  console.log("got message:", data);
});

bus.emit("message", "ᓚᘏᗢ");
bus.emit("message", "☆*: .｡. o(≧▽≦)o .｡.:*☆");
