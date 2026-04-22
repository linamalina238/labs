const fs = require("fs");
const LEVELS = ["DEBUG", "INFO", "ERROR"];

let output = "console";
let logFile = "app.log";
let formatter = null;
let minLevel = "DEBUG";

function shouldLog(level) {
  return LEVELS.indexOf(level) >= LEVELS.indexOf(minLevel);
}

function defaultFormat(level, fnName, type, data, elapsed) {
  const timestamp = new Date().toISOString();
  if (type === "call") return `[${timestamp}] [${level}] calling ${fnName}, args: ${JSON.stringify(data)}`;
  if (type === "return") return `[${timestamp}] [${level}] ${fnName} returned: ${JSON.stringify(data)} (${elapsed}ms)`;
  if (type === "error") return `[${timestamp}] [ERROR] ${fnName} threw: ${data}`;
}

function writeLog(msg) {
  if (output === "console") {
    console.log(msg);
  } else if (output === "file") {
    fs.appendFileSync(logFile, msg + "\n");
  } else if (output === "both") {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
  }
}

function log(options) {
  const level = (options && options.level) || "INFO";
  if (!LEVELS.includes(level)) throw new Error("unknown level: " + level);

  return function(fn) {
    return async function(...args) {
      const start = Date.now();
      const fmt = formatter || defaultFormat;

      if (shouldLog(level)) writeLog(fmt(level, fn.name, "call", args, null));

      try {
        const result = await fn(...args);
        const elapsed = Date.now() - start;

        if (level !== "ERROR" && shouldLog(level)) {
          writeLog(fmt(level, fn.name, "return", result, elapsed));
        }

        return result;
      } catch (e) {
        if (shouldLog("ERROR")) writeLog(fmt(level, fn.name, "error", e.message, null));
        throw e;
      }
    };
  };
}

function setOutput(type, file) {
  output = type;
  if (file) logFile = file;
}

function setFormatter(fn) {
  formatter = fn;
}

function setMinLevel(level) {
  minLevel = level;
}

module.exports = { log, setOutput, setFormatter, setMinLevel };