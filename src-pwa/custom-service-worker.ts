/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope &
    typeof globalThis & { skipWaiting: () => void }

import { NavigationRoute, registerRoute } from 'workbox-routing'
import {
    cleanupOutdatedCaches,
    createHandlerBoundToURL,
    precacheAndRoute,
} from 'workbox-precaching'

import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
    registerRoute(
        new NavigationRoute(
            createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
            { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
        )
    )
}

console.log('Hello from service worker')
