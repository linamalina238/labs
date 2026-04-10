function asyncMapCallback(array, asyncFn, callback, signal) {
  const results = new Array(array.length);
  let completed = 0;
  let hasError = false;

  if (array.length === 0) return callback(null, []);
  if (signal?.aborted) return callback(new Error("Aborted"), null);

  const onAbort = () => {
    if (!hasError) {
      hasError = true;
      callback(new Error("Aborted"), null);
    }
  };
  signal?.addEventListener("abort", onAbort, { once: true });

  array.forEach((item, index) => {
    asyncFn(item, (err, result) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        signal?.removeEventListener("abort", onAbort);
        return callback(err, null);
      }
      results[index] = result;
      completed++;
      if (completed === array.length) {
        signal?.removeEventListener("abort", onAbort);
        callback(null, results);
      }
    });
  });
}

function asyncMapPromise(array, asyncFn, signal) {
  if (signal?.aborted) return Promise.reject(new Error("Aborted"));
  const abortPromise = new Promise((_, reject) => {
    signal?.addEventListener("abort", () => reject(new Error("Aborted")), { once: true });
  });
  return Promise.all(array.map(item => signal ? Promise.race([asyncFn(item), abortPromise]) : asyncFn(item)));
}

async function asyncMapAwait(array, asyncFn, signal) {
  if (signal?.aborted) throw new Error("Aborted");
  const results = [];
  for (const item of array) {
    if (signal?.aborted) throw new Error("Aborted");
    results.push(await asyncFn(item));
  }
  return results;
}

const input = [1, 2, 3, 4, 5];
const fakeApi = item => new Promise(resolve => setTimeout(() => resolve(item * 2), 100));
const fakeApiCallback = (item, done) => setTimeout(() => done(null, item * 2), 100);

asyncMapCallback(input, fakeApiCallback, (err, res) => console.log(err ? "Error:" + err.message : "Result:", res));

(async () => {
  const res = await asyncMapAwait(input, fakeApi);
  console.log("Result:", res);
})();

(async () => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 250);
  try {
    const res = await asyncMapAwait(input, fakeApi, controller.signal);
    console.log("Result:", res);
  } catch(err) {
    console.error("Aborted:", err.message);
  }
})();