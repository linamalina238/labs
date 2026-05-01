import { Logger, jsonFormatter, fileTransport } from "./logger.js";

const logger = new Logger({ level: "INFO" });

logger.log("INFO", { name: "test", args: [1, 2], result: 3 });
logger.log("DEBUG", { name: "test", args: [] });
logger.log("ERROR", { name: "test", error: new Error("-") });

import { log } from "./decorator.js";

const add = log("INFO")(function add(a, b) {
  return a + b;
});

const fetchUser = log("DEBUG")(async function fetchUser(id) {
  await new Promise((r) => setTimeout(r, 50));
  return { id, name: "Lina" };
});

add(3, 4);

fetchUser(42).then(() => {});