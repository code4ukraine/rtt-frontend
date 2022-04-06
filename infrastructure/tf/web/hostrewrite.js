const HOST_MAP = {
  "upload.dev.example.com": "xxxxxxx.execute-api.us-east-2.amazonaws.com",
  "upload.example.com": "xxxxxxx.execute-api.us-east-2.amazonaws.com",
}

async function handle(request) {
  const url = new URL(request.url);
  if (!(url.hostname in HOST_MAP)) {
    return new Response("Unknown host", { status: 404 })
  }

  // this forces the upstream request to have a new Host: header
  url.hostname = HOST_MAP[url.hostname]
  const newRequest = new Request(url.toString(), request);
  const response = await fetch(newRequest);
  return response;
}

addEventListener("fetch", event => {
  event.respondWith(handle(event.request))
})
