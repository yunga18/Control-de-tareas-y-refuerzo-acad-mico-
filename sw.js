const CACHE='yunga-school-focus-v3';
const ASSETS=["./", "./index.html", "./app.js", "./styles.css", "./icon.svg", "./manifest.webmanifest", "assets/bio.svg", "assets/isla.svg", "juegos/aula.css", "juegos/bioexploradores/animal.svg", "juegos/bioexploradores/ecosystems.js", "juegos/bioexploradores/game.js", "juegos/bioexploradores/hero.svg", "juegos/bioexploradores/index.html", "juegos/bioexploradores/plant.svg", "juegos/bioexploradores/scope.svg", "juegos/bioexploradores/style.css", "juegos/endocrino/index.html", "juegos/common.css", "juegos/common.js", "juegos/fracciones/game.js", "juegos/fracciones/index.html", "juegos/fracciones/style.css", "juegos/jerarquia/data.js", "juegos/jerarquia/game.js", "juegos/jerarquia/index.html", "juegos/mcm/game.js", "juegos/mcm/index.html", "juegos/mcm/style.css", "juegos/operaciones/data.js", "juegos/operaciones/game.js", "juegos/operaciones/index.html", "juegos/operaciones/style.css", "juegos/oraciones/data.js", "juegos/oraciones/game.js", "juegos/oraciones/index.html"];
const paths=new Set(ASSETS.map(p=>new URL(p,self.location.href).pathname));
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('yunga-school-')||k.startsWith('aula-semilla-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin||!paths.has(u.pathname))return;
 const key=u.origin+u.pathname;
 e.respondWith(caches.match(key).then(cached=>{
  if(cached)return cached;
  return fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(key,copy)));}return response;});
 }));
});
