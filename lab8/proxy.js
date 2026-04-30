class ApiKeyProxy {
  constructor(client, apiKey) {
    this.client = client;
    this.apiKey = apiKey;
  }
  async request(req) {
    return this.client.request({
      ...req,
      headers: { ...req.headers, "X-API-Key": this.apiKey },
    });
  }
}

class JwtProxy {
  constructor(client, getToken) {
    this.client = client;
    this.getToken = getToken;
  }
  async request(req) {
    const token = await this.getToken();
    return this.client.request({
      ...req,
      headers: { ...req.headers, Authorization: `Bearer ${token}` },
    });
  }
}

class OAuthProxy {
  constructor(client, { accessToken, refreshToken, refreshFn }) {
    this.client = client;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.refreshFn = refreshFn;
  }
  async request(req) {
    try {
      return await this.client.request({
        ...req,
        headers: { ...req.headers, Authorization: `Bearer ${this.accessToken}` },
      });
    } catch (err) {
      if (err.status === 401) {
        this.accessToken = await this.refreshFn(this.refreshToken);
        return this.client.request({
          ...req,
          headers: { ...req.headers, Authorization: `Bearer ${this.accessToken}` },
        });
      }
      throw err;
    }
  }
}

class LoggingProxy {
  constructor(client) {
    this.client = client;
  }
  async request(req) {
    console.log(`[LOG] ${req.method ?? "GET"} ${req.url}`);
    const start = Date.now();
    const res = await this.client.request(req);
    console.log(`[LOG] done in ${Date.now() - start}ms`);
    return res;
  }
}

class RateLimitProxy {
  constructor(client, { limit, windowMs }) {
    this.client = client;
    this.limit = limit;
    this.windowMs = windowMs;
    this.calls = [];
  }
  async request(req) {
    const now = Date.now();
    this.calls = this.calls.filter(t => now - t < this.windowMs);
    if (this.calls.length >= this.limit) throw new Error("Rate limit exceeded");
    this.calls.push(now);
    return this.client.request(req);
  }
}
module.exports = { ApiKeyProxy, JwtProxy, OAuthProxy, LoggingProxy, RateLimitProxy };