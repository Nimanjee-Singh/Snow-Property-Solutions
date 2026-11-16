// Build entry (run by the site build step): concatenates _src/01..05, renders
// every PAGE to static HTML, and writes sitemap.xml + robots.txt.
// Output files are written to the project root.
function buildSite(){
  const out = {};
  PAGES.forEach(p => { out[p.file] = render(p); });
  const today = new Date().toISOString().slice(0,10);
  out['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.filter(p=>!p.noindex).map(p=>`  <url><loc>${canonical(p.route)}</loc><lastmod>${today}</lastmod><priority>${p.route===''?'1.0':p.route.startsWith('services')||p.route==='get-a-quote'?'0.9':p.route.includes('policy')||p.route.includes('terms')?'0.3':'0.7'}</priority></url>`).join('\n')}
</urlset>
`;
  out['robots.txt'] = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_src/

Sitemap: ${SITE.url}/sitemap.xml
`;
  return out;
}
