const { BaseClient } = require("./base");
const { ApiKeyProxy, LoggingProxy, RateLimitProxy } = require("./proxy");

const base = new BaseClient();
const withApiKey = new ApiKeyProxy(base, process.env.GITHUB_TOKEN ?? "demo_key");
const withLogging = new LoggingProxy(withApiKey);
const withRateLimit = new RateLimitProxy(withLogging, { limit: 3, windowMs: 10000 });

(async () => {
  const users = ["torvalds", "gaearon", "tj"];

  for (const username of users) {
    try {
      const user = await withRateLimit.request({ url: `https://api.github.com/users/${username}` });
      console.log(`${user.login} — ${user.public_repos} repos`);
    } catch (err) {
      console.error(`[${username}] Error:`, err.message);
    }
  }

  console.log("\n--- testing rate limit ---");
  for (let i = 1; i <= 3; i++) {
    try {
      await withRateLimit.request({ url: "https://api.github.com/users/torvalds" });
      console.log(`Request ${i}: ok`);
    } catch (err) {
      console.error(`Request ${i}:`, err.message);
    }
  }
})().catch(console.error);