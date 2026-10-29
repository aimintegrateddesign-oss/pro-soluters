// Requests every optimised image URL used by the site's pages once, so the first real visitor gets a cached copy.
// Usage:  npm run warm                          (against http://localhost:3000)
//         SITE_URL=https://your-site npm run warm
const base = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const pages = ['/', '/solutions', '/solutions/improve-and-innovate', '/solutions/align-your-technical-data', '/solutions/solve-and-prove', '/who-we-serve', '/about', '/case-studies', '/sample-reports', '/submit-a-problem']
const urls = new Set()
for (const p of pages) {
  const html = await (await fetch(base + p)).text()
  for (const m of html.matchAll(/\/_next\/image\?url=[^"'\s,]+/g)) urls.add(m[0].replaceAll('&amp;', '&'))
}
// A few at a time: hundreds of parallel requests overload the optimizer and the media host, and some fail.
const queue = [...urls]
let ok = 0
const failed = []
const worker = async () => {
  for (let u = queue.shift(); u; u = queue.shift()) {
    let done = false
    for (let attempt = 0; attempt < 3 && !done; attempt++) {
      try {
        const r = await fetch(base + u, { signal: AbortSignal.timeout(60000) })
        await r.arrayBuffer()
        done = r.ok
      } catch {}
    }
    done ? ok++ : failed.push(u)
  }
}
await Promise.all(Array.from({ length: 4 }, worker))
console.log(`Warmed ${ok} of ${urls.size} image URLs on ${base}`)
if (failed.length) console.log('Failed:', failed.slice(0, 5).map((u) => decodeURIComponent(u).slice(0, 110)))
