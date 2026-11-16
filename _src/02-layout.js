// =========================================================
// Reusable layout components (Header, Footer, MobileNavigation,
// Breadcrumbs, CTASection, ServiceCard, ProjectGallery,
// TestimonialCard, FAQAccordion, SEO head)
// =========================================================
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// ctx = { depth, route }  depth: 0 for root pages, 1 for /services/*
function P(ctx){ return ctx.depth ? '../'.repeat(ctx.depth) : ''; }
function link(ctx, route){ // route: '' | 'about-us' | 'services/wallpapering'
  return P(ctx) + (route === '' ? 'index.html' : route + '.html');
}
function img(ctx, file){ return P(ctx) + 'assets/images/' + file; }
function canonical(route){ return SITE.url + (route ? '/' + route : '/'); }
const arrow = '<span class="arr" aria-hidden="true"></span>';

function head(ctx, page){
  const url = canonical(page.route);
  const og = SITE.url + (page.og || SITE.ogImage);
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#183139">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${esc(page.desc)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" type="image/png" href="${img(ctx,'favicon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${P(ctx)}assets/css/site.css">
${(page.styles||[]).map(s=>`<link rel="stylesheet" href="${P(ctx)}assets/css/${s}">`).join('')}
${page.preload ? `<link rel="preload" as="image" href="${img(ctx,page.preload)}">` : ''}
${schema(page)}
</head>`;
}

function schema(page){
  const blocks = [];
  if (page.route === '' || page.route === 'contact' || page.route === 'areas-we-cover'){
    blocks.push({
      '@context':'https://schema.org','@type':'HousePainter','@id':SITE.url+'/#business',
      name:SITE.name,url:SITE.url+'/',image:SITE.url+'/assets/images/og-image.jpg',
      logo:SITE.url+'/assets/images/logo.png',
      telephone:SITE.phoneIntl,email:SITE.email,
      areaServed:[{'@type':'City',name:'London'}],
      openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'08:00',closes:'18:00'}],
      priceRange:'Quotation on request',
      makesOffer:SERVICES.map(s=>({'@type':'Offer',itemOffered:{'@type':'Service',name:s.name,url:SITE.url+'/services/'+s.slug}}))
    });
  }
  if (page.service){
    blocks.push({'@context':'https://schema.org','@type':'Service',name:page.service.name,serviceType:page.service.name,
      url:canonical(page.route),areaServed:{'@type':'City',name:'London'},provider:{'@id':SITE.url+'/#business'}});
  }
  if (page.faqSchema && page.faqSchema.length){
    blocks.push({'@context':'https://schema.org','@type':'FAQPage',mainEntity:page.faqSchema.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a.replace(/<[^>]+>/g,'')}}))});
  }
  if (page.crumbs){
    blocks.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:page.crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c[0],item:canonical(c[1])}))});
  }
  return blocks.map(b=>`<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

function header(ctx, page){
  const cur = r => page.route === r ? ' aria-current="page"' : '';
  const svcActive = page.route.startsWith('services');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="${link(ctx,'')}" aria-label="${SITE.name} — home">
      <img class="brand-logo" src="${img(ctx,'logo.png')}" alt="Snow Property Solutions" width="600" height="300">
    </a>
    <nav class="nav" aria-label="Main">
      <a href="${link(ctx,'')}"${cur('')}>Home</a>
      <a href="${link(ctx,'about-us')}"${cur('about-us')}>About Us</a>
      <div class="dd${svcActive?' is-active':''}">
        <button type="button" aria-expanded="false" aria-haspopup="true" aria-controls="dd-services">Services <span class="chev" aria-hidden="true"></span></button>
        <div class="dd-menu" id="dd-services">
          ${SERVICES.map((s,i)=>`<a href="${link(ctx,'services/'+s.slug)}"${cur('services/'+s.slug)}>${s.name}<small>0${i+1}</small></a>`).join('')}
          <a class="dd-all" href="${link(ctx,'services')}"${cur('services')}>All services</a>
        </div>
      </div>
      <a href="${link(ctx,'our-projects')}"${cur('our-projects')}>Our Projects</a>
      <a href="${link(ctx,'areas-we-cover')}"${cur('areas-we-cover')}>Areas We Cover</a>
      <a href="${link(ctx,'faqs')}"${cur('faqs')}>FAQs</a>
      <a href="${link(ctx,'contact')}"${cur('contact')}>Contact</a>
    </nav>
    <div class="header-cta">
      <a class="header-phone" href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a>
      <a class="btn btn-gold" href="${link(ctx,'get-a-quote')}">Get a Free Estimate</a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">
  <ul>
    <li><a href="${link(ctx,'')}"${cur('')}>Home</a></li>
    <li><a href="${link(ctx,'about-us')}"${cur('about-us')}>About Us</a></li>
    <li class="m-has-sub"><button class="m-sub-toggle" type="button" aria-expanded="false">Services <span class="chev" aria-hidden="true"></span></button>
      <div class="m-sub"><ul>
        <li><a href="${link(ctx,'services')}"${cur('services')}>All Services</a></li>
        ${SERVICES.map(s=>`<li><a href="${link(ctx,'services/'+s.slug)}"${cur('services/'+s.slug)}>${s.name}</a></li>`).join('')}
      </ul></div>
    </li>
    <li><a href="${link(ctx,'our-projects')}"${cur('our-projects')}>Our Projects</a></li>
    <li><a href="${link(ctx,'areas-we-cover')}"${cur('areas-we-cover')}>Areas We Cover</a></li>
    <li><a href="${link(ctx,'faqs')}"${cur('faqs')}>FAQs</a></li>
    <li><a href="${link(ctx,'contact')}"${cur('contact')}>Contact</a></li>
  </ul>
  <div class="m-actions">
    <a class="btn btn-dark" href="${link(ctx,'get-a-quote')}">Get a Free Estimate ${arrow}</a>
    <a class="btn btn-outline" href="${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp Us</a>
  </div>
  <p class="m-meta">Call <a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a> · ${SITE.hoursShort}</p>
</nav>`;
}

function footer(ctx){
  return `<footer class="site-footer">
  <div class="footer-cta"><div class="wrap">
    <h2>Ready to Transform <em class="serif">Your Property?</em></h2>
    <div class="btn-row on-dark">
      <a class="btn btn-gold" href="${link(ctx,'get-a-quote')}">Get a Free Quote ${arrow}</a>
      <a class="btn btn-outline" href="${link(ctx,'contact')}">Contact Us</a>
    </div>
  </div></div>
  <div class="wrap footer-main">
    <div class="about">
      <a class="brand" href="${link(ctx,'')}" aria-label="${SITE.name} — home"><img class="brand-logo" src="${img(ctx,'logo.png')}" alt="Snow Property Solutions" width="600" height="300"></a>
      <p>Professional painting and decorating for homes, landlords and commercial properties across ${SITE.area}.</p>
    </div>
    <div>
      <h3>Quick Links</h3>
      <ul>
        <li><a href="${link(ctx,'')}">Home</a></li>
        <li><a href="${link(ctx,'about-us')}">About Us</a></li>
        <li><a href="${link(ctx,'services')}">Services</a></li>
        <li><a href="${link(ctx,'our-projects')}">Our Projects</a></li>
        <li><a href="${link(ctx,'areas-we-cover')}">Areas We Cover</a></li>
        <li><a href="${link(ctx,'faqs')}">FAQs</a></li>
        <li><a href="${link(ctx,'contact')}">Contact</a></li>
      </ul>
    </div>
    <div>
      <h3>Our Services</h3>
      <ul>${SERVICES.map(s=>`<li><a href="${link(ctx,'services/'+s.slug)}">${s.name}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Contact</h3>
      <ul>
        <li><a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a></li>
        <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li><a href="${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
        <li>${SITE.area}</li>
        <li>${SITE.hoursShort}</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom"><div class="wrap">
    <span>© <span data-year>2026</span> ${SITE.name}. All rights reserved.</span>
    <span><a href="${link(ctx,'privacy-policy')}">Privacy Policy</a><a href="${link(ctx,'terms-and-conditions')}">Terms and Conditions</a></span>
    <span><a href="https://metricera.co.uk/" target="_blank" rel="noopener">Website designed by Metric Era</a></span>
  </div></div>
</footer>`;
}

function crumbs(ctx, list){
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${list.map((c,i)=> i===list.length-1
    ? `<li><span aria-current="page">${c[0]}</span></li>`
    : `<li><a href="${link(ctx,c[1])}">${c[0]}</a></li>`).join('')}</ol></nav>`;
}

function pageHero(ctx, o){
  const showImage = o.img && o.real !== false;
  return `<section class="page-hero${showImage?' has-media':''}">
  <div class="wrap">
    <div>
      ${o.crumbs ? crumbs(ctx,o.crumbs) : ''}
      ${o.eyebrow ? `<span class="eyebrow light">${o.eyebrow}</span>` : ''}
      <h1${o.h1Class ? ` class="${esc(o.h1Class)}"` : ''}>${o.h1}</h1>
      ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
      ${o.buttons ? `<div class="btn-row on-dark">${o.buttons}</div>` : ''}
    </div>
    ${showImage ? `<figure class="reveal"><img${o.imgClass ? ` class="${esc(o.imgClass)}"` : ''} src="${img(ctx,o.img)}" alt="${esc(o.alt)}" width="900" height="1125" fetchpriority="high"></figure>` : ''}
  </div>
</section>`;
}

function ctaBand(ctx, o={}){
  return `<section class="cta-band on-dark">
  <div class="wrap">
    <div>
      <span class="eyebrow light">${o.eyebrow || 'Start your project'}</span>
      <h2>${o.h2 || 'Ready to Transform <em class="serif">Your Property?</em>'}</h2>
    </div>
    <div class="side">
      <p>${o.text || 'Tell us about your project and we will come back to you to discuss your requirements and arrange your personalised quotation.'}</p>
      <div class="btn-row">
        <a class="btn btn-gold" href="${link(ctx,'get-a-quote')}">${o.primary || 'Get a Free Quote'} ${arrow}</a>
        <a class="btn btn-outline" href="${o.secondaryHref ? o.secondaryHref : link(ctx,'contact')}"${o.secondaryHref&&o.secondaryHref.startsWith('http')?' target="_blank" rel="noopener"':''}>${o.secondary || 'Contact Us'}</a>
      </div>
    </div>
  </div>
</section>`;
}

function serviceCard(ctx, s, i){
  return `<a class="svc-card reveal" href="${link(ctx,'services/'+s.slug)}">
    ${s.img ? `<div class="media"><img src="${img(ctx,s.img)}" alt="${esc(s.alt)}" loading="lazy" width="800" height="600"></div>` : ''}
    <div class="body">
      <span class="num">0${i+1}</span>
      <h3>${s.name}</h3>
      <p>${s.card}</p>
      <span class="btn-link">Explore ${s.name} ${arrow}</span>
    </div>
  </a>`;
}

let LB_ID = 0;
function projectTile(ctx, p, o={}){
  const svc = SERVICES.find(s=>s.slug===p.cat);
  return `<figure class="proj reveal${p.beforeAfter?' before-after':''}" data-cat="${p.cat}">
    <button type="button" data-lightbox data-src="${img(ctx,p.img)}" data-title="${esc(p.title)}" data-cat-name="${esc(svc.name)}" aria-label="Enlarge photo: ${esc(p.title)}">
      <img src="${img(ctx,p.img)}" alt="${esc(p.alt)}" loading="lazy" width="900" height="${p.beforeAfter ? 600 : 675}">
      ${o.detail ? '' : `<span class="cap"><span><b>${p.title}</b></span><span>${svc.name}</span></span>`}
    </button>
    ${o.detail ? `<figcaption class="detail"><span class="cat">${svc.name}</span><h3>${p.title}</h3><p>${p.desc}</p></figcaption>` : ''}
  </figure>`;
}

function lightbox(){
  return `<div class="lightbox" role="dialog" aria-modal="true" aria-label="Project photo" hidden>
  <button class="lb-btn lb-close" type="button" aria-label="Close">×</button>
  <button class="lb-btn lb-prev" type="button" aria-label="Previous photo">‹</button>
  <figure><img src="" alt=""><figcaption></figcaption></figure>
  <button class="lb-btn lb-next" type="button" aria-label="Next photo">›</button>
</div>`;
}

function testimonial(r){
  return `<figure class="quote reveal"><blockquote><p>${esc(r.text)}</p></blockquote><figcaption>${esc(r.name)}</figcaption></figure>`;
}

function faqList(items, idPrefix){
  return `<div class="faq">${items.map(([q,a],i)=>`<div class="faq-item">
    <h3><button class="faq-q" type="button" aria-expanded="false" aria-controls="${idPrefix}-${i}" id="${idPrefix}-q-${i}">${q}<span class="pm" aria-hidden="true"></span></button></h3>
    <div class="faq-a" id="${idPrefix}-${i}" role="region" aria-labelledby="${idPrefix}-q-${i}"><div><div class="inner">${a}</div></div></div>
  </div>`).join('')}</div>`;
}

function floatCta(ctx){
  return `<div class="float-cta" aria-hidden="true">
  <a class="btn btn-outline" style="background:#fff;color:var(--green);border-color:#fff" href="${SITE.whatsapp}" target="_blank" rel="noopener" tabindex="-1">WhatsApp</a>
  <a class="btn btn-dark" href="${link(ctx,'get-a-quote')}" tabindex="-1">Free Quote</a>
</div>`;
}

function render(page){
  const ctx = { depth: page.route.split('/').length - 1, route: page.route };
  if (page.route === '') ctx.depth = 0;
  const body = page.content(ctx);
  return `${head(ctx,page)}
<body class="${page.bodyClass||''}">
${header(ctx,page)}
<main id="main">
${body}
</main>
${footer(ctx)}
${page.noFloat ? '' : floatCta(ctx)}
${page.lightbox ? lightbox() : ''}
<script src="${P(ctx)}assets/js/site.js" defer></script>
${(page.scripts||[]).map(s=>`<script src="${P(ctx)}assets/js/${s}" defer></script>`).join('\n')}
</body>
</html>`;
}
