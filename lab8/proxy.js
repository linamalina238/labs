const API_URL = "https://jsonplaceholder.typicode.com";

let token = "token";
let apiKey = "123456";
let authType = "token";

const rateLimit = {
  maxRequests: 5,
  windowMs: 10000,
  timestamps: [],
};

function checkRateLimit() {
  const now = Date.now();
  rateLimit.timestamps = rateLimit.timestamps.filter(t => now - t < rateLimit.windowMs);

  if (rateLimit.timestamps.length >= rateLimit.maxRequests) {
    const wait = rateLimit.windowMs - (now - rateLimit.timestamps[0]);
    console.log(`rate limit reached, retry in ${wait}ms`);
    throw new Error("rate limit exceeded");
  }

  rateLimit.timestamps.push(now);
}

function getHeaders(extra) {
  let h = Object.assign({}, extra || {});
  if (authType === "token") {
    h.Authorization = "Bearer " + token;
  } else {
    h["x-api-key"] = apiKey;
  }
  return h;
}

async function proxyRequest(url, options) {
  options = options || {};

  checkRateLimit();

  console.log("sending request...", url);

  let headers = getHeaders(options.headers);

  let finalOptions = {
    method: options.method || "GET",
    headers: headers,
  };

  let res;

  try {
    res = await fetch(API_URL + url, finalOptions);
  } catch (e) {
    console.log("error");
    throw e;
  }

  if (!res.ok) {
    console.log("bad response:", res.status);

    if (res.status === 401) {
      token = "new-token-" + Date.now();
      console.log("token refreshed");
    }

    throw new Error("request failed");
  }

  let data;

  try {
    data = await res.json();
  } catch (e) {
    console.log("error2");
    return null;
  }
  return data;
}

function setAuthType(type) {
  authType = type;
}

function setRateLimit(maxRequests, windowMs) {
  rateLimit.maxRequests = maxRequests;
  rateLimit.windowMs = windowMs;
}

module.exports = { proxyRequest, setAuthType, setRateLimit };