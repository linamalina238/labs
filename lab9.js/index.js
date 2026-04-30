import { Logger, jsonFormatter, fileTransport } from "./logger.js";

const logger = new Logger({ level: "INFO" });

logger.log("INFO", { name: "test", args: [1, 2], result: 3 });
logger.log("DEBUG", { name: "test", args: [] });
logger.log("ERROR", { name: "test", error: new Error("-") });