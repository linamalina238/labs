const { proxyRequest, setAuthType, setRateLimit, setJwtToken } = require("./proxy");

async function run() {
  setRateLimit(3, 10000);
  try {
    await proxyRequest("/posts");
    await proxyRequest("/users");
    await proxyRequest("/todos");
    await proxyRequest("/posts/1");
  } catch (err) {
    console.log("run failed:", err.message);
  }
}

setAuthType("apikey");
setRateLimit(3, 10000);
run();

async function runJwt() {
  setAuthType("jwt");
  setJwtToken("my-jwt-token");
  try {
    await proxyRequest("/comments");
  } catch (err) {
    console.log("jwt run failed:", err.message);
  }
}

runJwt();