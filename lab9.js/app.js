const { log } = require("./logger");

const add = log({ level: "INFO" })(function add(a, b) {
  return a + b;
});

const fetchData = log({ level: "DEBUG" })(async function fetchData(id) {
  return { id, data: "data" };
});

const fail = log({ level: "ERROR" })(function fail(x) {
  throw new Error("error");
});

async function run() {
  await add(2, 3);
  await fetchData(42);

  try {
    await fail(1);
  } catch (e) {}
}
run() 