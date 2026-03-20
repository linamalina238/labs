function memoize(fn, options = {}) {
  let maxSize = options.maxSize || 999999;
  let policy = options.policy || 'lru';
  let ttl = options.ttl;
  let customEvict = options.customEvict;

  let cache = new Map();
  let usageCount = new Map();

  function memoized(...args) {
    let key = args.map(a => JSON.stringify(a)).join('|');

    if (cache.has(key)) {
      let stored = cache.get(key);

      if (policy === 'ttl') {
         if (ttl && Date.now() - stored.savedAt > ttl) {
          cache.delete(key);
          usageCount.delete(key);
        } else {
          return stored.value;
        }
      }

      if (policy === 'lru') {
        cache.delete(key);
        cache.set(key, stored);
        usageCount.set(key, (usageCount.get(key) || 0) + 1);
        return stored;
      }

      if (policy === 'lfu' || policy === 'custom') {
        usageCount.set(key, (usageCount.get(key) || 0) + 1);
        return stored;
      }
    }

    let result = fn(...args);

    if (cache.size >= maxSize) {

      if (policy === 'lru') {
        let oldKey = cache.keys().next().value;
        cache.delete(oldKey);
        usageCount.delete(oldKey);
      }

      if (policy === 'lfu') {
        let minKey = null;
        let minVal = Infinity;
        
        for (let [k, count] of usageCount) {
          if (count < minVal) {
            minVal = count;
            minKey = k;
          }
        }
        cache.delete(minKey);
        usageCount.delete(minKey);
      }

      if (policy === 'ttl') {
       let now = Date.now();
        for (let [k, entry] of cache) {
          if (ttl && now - entry.savedAt > ttl) {
            cache.delete(k);
            usageCount.delete(k);
          }
        }
        if (cache.size >= maxSize) {
          let oldKey = cache.keys().next().value;
          cache.delete(oldKey);
          usageCount.delete(oldKey);
        }
      }

      if (policy === 'custom') {
       
     if (typeof customEvict === 'function') {
          customEvict(cache);
        } else {
          let oldKey = cache.keys().next().value;
          cache.delete(oldKey);
          usageCount.delete(oldKey);
        }
      }
    }

    if (policy === 'ttl') {
      cache.set(key, { value: result, savedAt: Date.now() });
    } else {
      cache.set(key, result);
    }

    usageCount.set(key, 1);
    return result;
  }

  memoized.cache = cache;
  memoized.clear = () => {
    cache.clear();
    usageCount.clear();
  };

  return memoized;
}


let slowSquare = n => n * n;



let cached = memoize(slowSquare, { maxSize: 3, policy: 'lru' });
console.log(cached(4));   
console.log(cached(4));   
console.log(cached(5));
console.log(cached(6));
console.log(cached(7));   



let cached2 = memoize(slowSquare, { maxSize: 3, policy: 'lfu' });
console.log(cached2(1));
console.log(cached2(1)); 
console.log(cached2(2));
console.log(cached2(3));
console.log(cached2(4));  



let cached3 = memoize(slowSquare, { policy: 'ttl', ttl: 2000 });
console.log(cached3(9));  
console.log(cached3(9));  
setTimeout(() => console.log(cached3(9)), 3000); 


let cached3bad = memoize(slowSquare, { policy: 'ttl' });
console.log(cached3bad(5)); 



let cached4 = memoize(slowSquare, {
  maxSize: 2,
  policy: 'custom',
  customEvict: (c) => c.delete(c.keys().next().value)
});
console.log(cached4(10));
console.log(cached4(20));
console.log(cached4(30)); 

let cached4bad = memoize(slowSquare, { maxSize: 2, policy: 'custom', customEvict: 'null' });
console.log(cached4bad(1));
console.log(cached4bad(2));
console.log(cached4bad(3)); 
