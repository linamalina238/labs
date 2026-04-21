const API_URL = "https://jsonplaceholder.typicode.com";

let token = "token";
let apiKey = "123456";
let authType = "token";

let clientId = "client-id";
let clientSecret = "client-secret";
let accessToken = null;
let tokenExpiry = null;

let jwtToken = null;

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

async function refreshOAuthToken() {
  console.log("refreshing oauth token...");
  const res = await fetch(API_URL + "/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret, grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    console.log("oauth token refresh failed:", res.status);
    throw new Error("oauth refresh failed");
  }

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  console.log("oauth token refreshed");
}

function getHeaders(extra) {
  let h = Object.assign({}, extra || {});
  if (authType === "token") {
    h.Authorization = "Bearer " + token;
  } else if (authType === "oauth") {
    h.Authorization = "Bearer " + accessToken;
  } else if (authType === "jwt") {
    h.Authorization = "Bearer " + jwtToken;
  } else {
    h["x-api-key"] = apiKey;
  }
  return h;
}

async function proxyRequest(url, options) {
  options = options || {};

  checkRateLimit();

  if (authType === "oauth" && (!accessToken || Date.now() >= tokenExpiry)) {
    await refreshOAuthToken();
  }

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

function setJwtToken(t) {
  jwtToken = t;
}

module.exports = { proxyRequest, setAuthType, setRateLimit, setJwtToken };