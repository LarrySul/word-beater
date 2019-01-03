const cacheName = 'word-beater-v3';
const cacheFiles = [
    '../index.html',
    '../css/bootstrap.min.css',
    '../js/bootstrap.min.js',
    '../js/jquery.js',
    '../js/main.js',
    '../js/popper.js',
    'https://api.datamuse.com/words?ml=ringing+in+the+ears&max=500'
]
self.addEventListener('install', ((e) => {
    // Perform install steps
    e.waitUntil(
        caches.open(cacheName).then((cache)=>{
            console.log('service worker waiting');
            return cache.addAll(cacheFiles);
        })
    )
}))

self.addEventListener('activate', ((e)=>{
    // Perform activation step
    e.waitUntil(
        caches.keys().then((cacheNames)=>{
            return Promise.all(cacheNames.map((thisCacheName)=>{
                if(thisCacheName !== cacheName){
                    console.log('Removing cache Files', thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
}))

self.addEventListener('fetch', ((e)=>{
    console.log('sw fetched', e.request.url);
    // perform the fetch operation
    e.respondWith(
        caches.match(e.request).then((response)=>{
            if(response){
                console.log('Found in cache', e.request.url);
                return response;
            }

            var requestClone = e.request.clone();
            
            fetch(requestClone).then((response)=>{
                if(!response){
                    console.log('Service Worker no reponse');
                }

                var requestClone = request.clone();
                caches.open(cacheName).then((cache)=>{
                    cache.put(e.request, responseClone);
                    return response;
                })
            })
            .catch((err)=>{
                console.log('Error fetching and caching')
            })
        })
    )
}))