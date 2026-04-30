const { BaseClient } = require("./base");

const client = new BaseClient();

(async () => {
  const user = await client.request({ url: "https://api.github.com/users/torvalds" });
  console.log("Login:", user.login);
  console.log("Name:", user.name);
  console.log("Public repos:", user.public_repos);
  console.log("Followers:", user.followers);
})().catch(console.error);