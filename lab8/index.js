const { BaseClient } = require("./base");
const { ApiKeyProxy, LoggingProxy, RateLimitProxy } = require("./proxy");
const { GitHubService } = require("./service");

const base = new BaseClient();
const withApiKey = new ApiKeyProxy(base, process.env.GITHUB_TOKEN ?? "demo_key");
const withLogging = new LoggingProxy(withApiKey);
const withRateLimit = new RateLimitProxy(withLogging, { limit: 5, windowMs: 10000 });

const github = new GitHubService(withRateLimit);

(async () => {
  const user = await github.getUser("torvalds");
  console.log("Login:", user.login);
  console.log("Name:", user.name);
  console.log("Public repos:", user.public_repos);

  const repos = await github.getRepos("torvalds");
  console.log("Repos:", repos.slice(0, 5).map(r => r.name));
})().catch(console.error);