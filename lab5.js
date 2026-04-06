function asyncMapCallback(array, asyncFn, callback) {
  const results = new Array(array.length);
  let completed = 0;
  let hasError = false;

  if (array.length === 0) return callback(null, []);

  array.forEach((item, index) => {
    asyncFn(item, (err, result) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return callback(err);
      }
      results[index] = result;
      completed++;
      if (completed === array.length) callback(null, results);
    });
  });
}

function asyncMapPromise(array, asyncFn) {
  return Promise.all(array.map((item) => asyncFn(item)));
}

async function asyncMapAwait(array, asyncFn) {
  const results = await Promise.all(array.map((item) => asyncFn(item)));
  return results;
}


const input = [1, 2, 3, 4, 5];
const fakeApi = (item) => new Promise(resolve => setTimeout(() => resolve(item * 2), 100));


asyncMapCallback(input, (item, done) => setTimeout(() => done(null, item * 2), 100), (err, res) => console.log(res));


asyncMapPromise(input, fakeApi).then(res => console.log(res));


const res = await asyncMapAwait(input, fakeApi);
console.log(res);