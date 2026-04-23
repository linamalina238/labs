const LEVELS = ["DEBUG", "INFO", "ERROR"];

function log(options) {
  const level = (options && options.level) || "INFO";

  return function(fn) {
    return async function(...args) {
      const timestamp = new Date().toISOString();
      const start = Date.now();

      console.log(`[${timestamp}] [${level}] calling ${fn.name}, args:`, args);

      try {
        const result = await fn(...args);
        const elapsed = Date.now() - start;

        if (level !== "ERROR") {
          console.log(`[${timestamp}] [${level}] ${fn.name} returned:`, result, `(${elapsed}ms)`);
        }

        return result;
      } catch (e) {
        const timestamp2 = new Date().toISOString();
        console.log(`[${timestamp2}] [ERROR] ${fn.name} threw:`, e.message);
        throw e;
      }
    };
  };
}

module.exports = { log };