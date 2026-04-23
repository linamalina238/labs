function asyncMapCallback(array, asyncFn, callback, signal) {
  const results = new Array(array.length);
  let completed = 0;
  let hasError = false;
  const timers = [];

  if (array.length === 0) return callback(null, []);
  if (signal?.aborted) return callback(new Error("Aborted"), null);

  const abort = () => {
    if (!hasError) {
      hasError = true;
      timers.forEach(id => clearTimeout(id));
      signal.removeEventListener("abort", abort);
      callback(new Error("Aborted"), null);
    }
  };
  signal?.addEventListener("abort", abort, { once: true });

  array.forEach((item, index) => {
    const id = asyncFn(item, (err, result) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        timers.forEach(id => clearTimeout(id));
        signal?.removeEventListener("abort", abort);
        return callback(err, null);
      }
      results[index] = result;
      completed++;
      if (completed === array.length) {
        signal?.removeEventListener("abort", abort);
        callback(null, results);
      }
    });
    if (id !== undefined) timers.push(id);
  });
}

function asyncMapPromise(array, asyncFn, signal) {
  if (signal?.aborted) return Promise.reject(new Error("Aborted"));

  let abortListener;
  const abortPromise = new Promise((_, reject) => {
    abortListener = () => reject(new Error("Aborted"));
    signal?.addEventListener("abort", abortListener, { once: true });
  });

  const work = Promise.all(
    array.map(item =>
      signal ? Promise.race([asyncFn(item), abortPromise]) : asyncFn(item)
    )
  );

  return work.finally(() => {
    signal?.removeEventListener("abort", abortListener);
  });
}

async function asyncMapAwait(array, asyncFn, signal) {
  if (signal?.aborted) throw new Error("Aborted");

  let abortListener;
  const abortPromise = signal
    ? new Promise((_, reject) => {
        abortListener = () => reject(new Error("Aborted"));
        signal.addEventListener("abort", abortListener, { once: true });
      })
    : null;

  const results = [];
  try {
    for (const item of array) {
      if (signal?.aborted) throw new Error("Aborted");
      const result = abortPromise
        ? await Promise.race([asyncFn(item), abortPromise])
        : await asyncFn(item);
      results.push(result);
    }
  } finally {
    signal?.removeEventListener("abort", abortListener);
  }

  return results;
}

const input = [1, 2, 3, 4, 5];

const fakeApi = item =>
  new Promise(resolve => setTimeout(() => resolve(item * 2), 100));

const fakeApiCallback = (item, done) => {
  const id = setTimeout(() => done(null, item * 2), 100);
  return id;
};

asyncMapCallback(input, fakeApiCallback, (err, res) =>
  console.log("Callback result:", err ? "Error: " + err.message : res)
);

const ctrl1 = new AbortController();
setTimeout(() => ctrl1.abort(), 50);
asyncMapCallback(input, fakeApiCallback, (err, res) =>
  console.log("Callback aborted:", err ? err.message : res), ctrl1.signal
);

(async () => {
  const res = await asyncMapAwait(input, fakeApi);
  console.log("Await result:", res);
})();

(async () => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 150);
  try {
    const res = await asyncMapAwait(input, fakeApi, controller.signal);
    console.log("Await result:", res);
  } catch (err) {
    console.error("Await aborted:", err.message);
  }
})();

asyncMapPromise(input, fakeApi)
  .then(res => console.log("Promise result:", res))
  .catch(err => console.error("Promise error:", err.message));

const ctrl2 = new AbortController();
setTimeout(() => ctrl2.abort(), 150);
asyncMapPromise(input, fakeApi, ctrl2.signal)
  .then(res => console.log("Promise result:", res))
  .catch(err => console.error("Promise aborted:", err.message));