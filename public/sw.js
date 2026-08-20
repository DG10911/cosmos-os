/**
 * Minimal service worker — makes COSMOS OS installable (Chrome/Android require a
 * fetch handler) WITHOUT caching anything. Pure network passthrough, so a
 * redeploy is never served stale. Safe for a live demo.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // no-op: let the browser handle every request normally (no cache)
});
