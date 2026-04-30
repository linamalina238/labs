class BaseClient {
  async request({ url, method = "GET", headers = {}, body }) {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw Object.assign(new Error("HTTP Error"), { status: res.status });
    return res.json();
  }
}

module.exports = { BaseClient };