import fs from "fs";

const LEVELS = { ERROR: 0, INFO: 1, DEBUG: 2 };

const plainFormatter = ({ timestamp, level, name, args, result, error, duration }) => {
  let msg = `[${timestamp}] [${level}] ${name}`;
  if (args !== undefined) msg += ` args=${JSON.stringify(args)}`;
  if (result !== undefined) msg += ` result=${JSON.stringify(result)}`;
  if (error !== undefined) msg += ` error=${error.message}`;
  if (duration !== undefined) msg += ` (${duration}ms)`;
  return msg;
};

const jsonFormatter = (entry) => JSON.stringify(entry);

const consoleTransport = (msg) => console.log(msg);

const fileTransport = (path) => (msg) => fs.appendFileSync(path, msg + "\n", "utf8");

class Logger {
  constructor({ level = "INFO", transport = consoleTransport, formatter = plainFormatter } = {}) {
    this.level = level;
    this.transport = transport;
    this.formatter = formatter;
  }

  log(level, entry) {
    if (LEVELS[level] > LEVELS[this.level]) return;
    const line = this.formatter({ timestamp: new Date().toISOString(), level, ...entry });
    this.transport(line);
  }
}

export { Logger, plainFormatter, jsonFormatter, consoleTransport, fileTransport, LEVELS };