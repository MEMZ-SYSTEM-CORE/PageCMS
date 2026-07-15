// Minimal Cloudflare Worker for Next.js static export
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Serve from ASSETS binding (auto-handles index.html for directories)
    let response = await env.ASSETS.fetch(request);

    // Fallback: try index.html for 404 paths
    if (response.status === 404 && !pathname.endsWith('/index.html')) {
      const indexUrl = pathname.endsWith('/')
        ? `${pathname}index.html`
        : `${pathname}/index.html`;
      response = await env.ASSETS.fetch(new Request(new URL(indexUrl, request.url)));
    }

    // Last resort: 404 page
    if (response.status === 404) {
      response = await env.ASSETS.fetch(new Request(new URL('/404/index.html', request.url)));
    }

    return response;
  }
};
