const API_URL = "https://jsonplaceholder.typicode.com";

let token = "token";
let apiKey = "123456";
let authType = "token";

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
  return data;}
function setAuthType(type) {
  authType = type;
}


module.exports = { proxyRequest, setAuthType };