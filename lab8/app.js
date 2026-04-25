const { proxyRequest, setAuthType, setRateLimit, setJwtToken } = require("./proxy");

async function run() {
  try {
    await proxyRequest("/posts");
    await proxyRequest("/users");
    await proxyRequest("/todos");
    await proxyRequest("/posts/1");
  } catch (err) {
    console.log("run failed:", err.message);
  }
}

async function runJwt() {
  setAuthType("jwt");
  setJwtToken("my-jwt-token");
  try {
    await proxyRequest("/comments");
  } catch (err) {
    console.log("jwt run failed:", err.message);
  }
}

async function main() {
  setAuthType("apikey");
  setRateLimit(3, 10000);
  await run();
  await runJwt();
}

main();