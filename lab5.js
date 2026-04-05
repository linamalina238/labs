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
const input = [1, 2, 3, 4, 5];
const fakeApi = (item) => new Promise(resolve => setTimeout(() => resolve(item * 2), 100));


asyncMapCallback(input, (item, done) => setTimeout(() => done(null, item * 2), 100), (err, res) => console.log(res));