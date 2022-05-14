importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

const navigationRoute = new workbox.routing.NavigationRoute(
    new workbox.strategies.NetworkFirst({
        cacheName: 'apexie-navigations'
    })
);
  
const imageAssetRoute = new workbox.routing.Route(({request}) => {
    return request.destination === 'image';
    }, new workbox.strategies.CacheFirst({
        cacheName: 'apexie-image-assets'
    })
);
  
workbox.routing.registerRoute(navigationRoute);
workbox.routing.registerRoute(imageAssetRoute);