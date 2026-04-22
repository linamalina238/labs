const proxyRequest = require("./proxy");

async function run() {
  try {
    let posts = await proxyRequest("/posts");
    console.log("first post:", posts[5]);

   
    let users = await proxyRequest("/users");
    console.log("users count:", users.length);

    if (users && users[0]) {
      console.log("first user name:", users[0].name);
    }

  } catch (err) {
    console.log("run failed:", err.message);
  }
}

run();