import { Logger } from "./logger.js";

const defaultLogger = new Logger();

function log(level = "INFO", logger = defaultLogger) {
  return function (fn) {
    const name = fn.name || "anonymous";

    function wrapped(...args) {
      const start = Date.now();

      let result;
      try {
        result = fn.apply(this, args);
      } catch (error) {
        logger.log("ERROR", { name, args, error, duration: Date.now() - start });
        throw error;
      }

      if (result instanceof Promise) {
        return result
          .then((res) => {
            if (level !== "ERROR") {
              logger.log(level, { name, args, result: res, duration: Date.now() - start });
            }
            return res;
          })
          .catch((error) => {
            logger.log("ERROR", { name, args, error, duration: Date.now() - start });
            throw error;
          });
      }

      if (level !== "ERROR") {
        logger.log(level, { name, args, result, duration: Date.now() - start });
      }
      return result;
    }

    Object.defineProperty(wrapped, "name", { value: name });
    return wrapped;
  };
}

export { log };