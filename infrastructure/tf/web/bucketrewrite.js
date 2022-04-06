const BUCKETS = {
  "dev.example.com": "",
  "www.dev.example.com": "",
  "upload-img.dev.example.com": "",
  "example.com": "",
  "www.example.com": "",
  "upload-img.example.com": "",
};

const API_GATEWAYS = {
  "dev.example.com": "https://upload.dev.example.com.org/",
  "www.dev.example.com": "https://upload.dev.example.com.org/",
  "example.com": "https://upload.example.com.org/",
  "www.example.com": "https://upload.example.com.org/",
};

// AWS account ID
const BUCKET_OWNER = "";

const CSP = `
  default-src 'none';
  script-src 'self' https://maps.googleapis.com/ https://www.googletagmanager.com/ 'sha256-vpXqhTupQNM5c4IaMmPPLu6doaWM7/Eeg26opnkT9o4=' 'sha256-ph13qs3dIS0Q0b2omt6zb987sRQvEgy4vW5lRl87To0=';
  connect-src https://maps.googleapis.com/ https://www.google-analytics.com/ API_GATEWAY 'self';
  img-src 'self' https://maps.googleapis.com/ https://maps.gstatic.com/ data:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/;
  base-uri 'self';
  form-action 'self' API_GATEWAY;
  font-src https://fonts.gstatic.com/;
`.replaceAll("\n", " ");

async function handle(request) {
  const url = new URL(request.url);
  if (!(url.hostname in BUCKETS)) {
    return new Response("Unknown host", { status: 404 })
  }

  const apigateway = API_GATEWAYS[url.hostname] || "";
  const bucket = BUCKETS[url.hostname];
  let pathname = url.pathname;
  if (pathname[pathname.length - 1] == '/') {
    pathname += 'index.html'
  } else if (pathname == '/submission') {
    pathname = '/submission.html'
  }
  url.hostname = "s3.us-east-2.amazonaws.com";
  url.pathname = "/" + bucket + pathname;

  const s3request = new Request(url.toString(), request);
  // Ensure we get the right bucket by specifying our owner account (prevents bucket-sniping)
  s3request.headers.set('X-AMZ-Expected-Bucket-Owner', BUCKET_OWNER);
  // Never send an Authorization header to S3
  s3request.headers.delete('Authorization');
  const s3response = await fetch(s3request);
  // Clone the response so that it's no longer immutable
  const response = new Response(s3response.body, s3response);
  response.headers.set('Content-Security-Policy', CSP.replaceAll("API_GATEWAY", apigateway));
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  // Ideally we would also set COEP to block spectre, but we can't because google maps still doesn't have CORP headers.
  return response;
}

addEventListener("fetch", event => {
  event.respondWith(handle(event.request))
})
