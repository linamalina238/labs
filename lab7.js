const EventEmitter = require("events");

const bus = new EventEmitter();

bus.on("message", (data) => {
  console.log("got message:", data);
});

bus.emit("message", "ᓚᘏᗢ");
bus.emit("message", "☆*: .｡. o(≧▽≦)o .｡.:*☆");

bus.on("message", (data) => {
  console.log("listener2 got:", data);
});

const handler = (data) => console.log("temp listener:", data);
bus.on("message", handler);
bus.emit("message", "test");
bus.off("message", handler); 
bus.emit("message", "after unsub"); 