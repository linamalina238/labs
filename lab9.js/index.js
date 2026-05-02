import { Logger, jsonFormatter, fileTransport } from "./logger.js";
import { log } from "./decorator.js";

const infoLogger = new Logger({ level: "INFO" });
const debugLogger = new Logger({ level: "DEBUG" });
const errorLogger = new Logger({ level: "ERROR" });
const jsonLogger = new Logger({ level: "DEBUG", formatter: jsonFormatter });
const fileLogger = new Logger({
  level: "INFO",
  transport: fileTransport("./app.log"),
});

const add = log("INFO", infoLogger)(function add(a, b) {
  return a + b;
});

const divide = log("ERROR", errorLogger)(function divide(a, b) {
  if (b === 0) throw new Error("division by zero");
  return a / b;
});

const fetchUser = log("DEBUG", debugLogger)(async function fetchUser(id) {
  await new Promise((r) => setTimeout(r, 50));
  return { id, name: "Lina" };
});

const brokenRequest = log("ERROR", errorLogger)(async function brokenRequest(url) {
  await new Promise((r) => setTimeout(r, 20));
  throw new Error("network timeout");
});

const compute = log("INFO", jsonLogger)(function compute(x) {
  return x * x;
});

const save = log("INFO", fileLogger)(function save(data) {
  return `saved: ${data}`;
});

async function main() {
  console.log("=== sync INFO ===");
  add(3, 4);

  console.log("\n=== sync ERROR-only (success — no log) ===");
  divide(10, 2);

  console.log("\n=== sync ERROR-only (throws — logged) ===");
  try { divide(10, 0); } catch (_) {}

  console.log("\n=== async DEBUG ===");
  await fetchUser(42);

  console.log("\n=== async ERROR-only (rejects — logged) ===");
  try { await brokenRequest("https://example.com"); } catch (_) {}

  console.log("\n=== JSON formatter ===");
  compute(7);

  console.log("\n=== file transport (written to app.log) ===");
  save("record-99");
}

main();