// =========================================================
// Main pages: Home, About, Services, Projects, Areas
// =========================================================
const PAGES = [];

const HOME_FAQS = [
  ['Do you provide free quotations?', 'Yes. Quotations are free and there is no obligation. You can start with our <a href="get-a-quote.html">instant estimate calculator</a> or simply <a href="contact.html">get in touch</a> and tell us about your project.'],
  ['Do you work on residential and commercial properties?', 'Yes. We decorate homes, rental properties and commercial premises such as offices, retail units and communal areas.'],
  ['Which areas do you cover?', 'We work across London and surrounding areas. See <a href="areas-we-cover.html">Areas We Cover</a> or contact us to check your postcode.'],
  ['Can I send photographs of my project?', 'Yes — you can upload photographs through the quote calculator or contact form, or send them to us on WhatsApp. Photos help us understand the condition of the surfaces before we quote.'],
];

PAGES.push({
  route: '', file: 'index.html',
  title: 'Painters and Decorators in London | Snow Property Solutions',
  desc: 'Professional painters and decorators in London. Interior and exterior painting, wallpapering, plastering repairs and commercial decorating. Request a free quote today.',
  bodyClass: 'header-overlay', preload: 'project-living-room.jpg', lightbox: true,
  faqSchema: HOME_FAQS,
  content: ctx => `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-media"><img src="${img(ctx,'project-living-room.jpg')}" alt="Living room decorated by Snow Property Solutions with soft neutral walls and warm lighting" width="1500" height="1001" fetchpriority="high"></div>
  <div class="wrap hero-inner">
    <span class="eyebrow light">Painting &amp; Decorating · London</span>
    <h1 id="hero-title"><span class="hero-title-desktop"><span class="hero-title-main">Professional Painters &amp; Decorators</span><br><em>in London</em></span><span class="hero-title-mobile">Professional Painters &amp;<br>Decorators <em>in London</em></span></h1>
    <p class="lead">Transforming residential and commercial spaces with professional painting and decorating services. Quality finishes, attention to detail and a commitment to getting every project right.</p>
    <div class="btn-row on-dark">
      <a class="btn btn-gold" href="${link(ctx,'get-a-quote')}">Calculate Your Project Cost ${arrow}</a>
      <a class="btn btn-outline" href="${link(ctx,'services')}">Explore Our Services</a>
    </div>
    <div class="hero-foot">
      <ul class="trust" aria-label="About our service">
        <li>Free, no-obligation quotations</li>
        <li>Residential &amp; commercial</li>
        <li>London &amp; surrounding areas</li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap intro-split">
    <div>
      <span class="eyebrow">Our approach</span>
      <h2>Transforming Properties with Quality and Care</h2>
    </div>
    <div class="reveal">
      <p class="big">Good decorating is mostly the work you don't see — the filling, sanding, masking and protecting that happens before the first coat goes on.</p>
      <p class="muted">That's where we put our attention. Every project starts by understanding the surfaces and what you want from the space. Furniture and floors are protected, defects are repaired, and finishes are chosen to suit how the room will be used. We keep you informed as the work progresses and leave the property clean and tidy when we're done.</p>
      <p class="muted">Whether you're refreshing a single room, preparing a rental property between tenants or decorating a commercial space, you'll get the same careful approach.</p>
      <a class="btn-link" href="${link(ctx,'about-us')}">More about us ${arrow}</a>
    </div>
  </div>
</section>

<section class="section bg-ivory">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">What we do</span><h2>Professional Painting &amp; Decorating Services</h2></div>
      <p class="lead">Five specialist services, each with its own process and finish standards. Choose a service to see what's included.</p>
    </div>
    <div class="svc-grid">${SERVICES.map((s,i)=>serviceCard(ctx,s,i)).join('')}</div>
  </div>
</section>

<section class="section bg-green on-dark">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow light">Why choose us</span><h2>The standards behind every finish</h2></div>
      <p class="lead">What you can expect when you work with Snow Property Solutions, whatever the size of the job.</p>
    </div>
    <div class="benefits">
      <div class="benefit reveal"><span class="k">i.</span><h3>Attention to detail</h3><p>Straight cut-in lines, clean edges and consistent coverage — the details that make a room look properly finished.</p></div>
      <div class="benefit reveal"><span class="k">ii.</span><h3>Careful preparation</h3><p>Cracks filled, surfaces sanded and areas masked and protected before any paint or paper is applied.</p></div>
      <div class="benefit reveal"><span class="k">iii.</span><h3>Quality workmanship</h3><p>Suitable materials applied with care, so the finish looks right on completion and holds up to everyday use.</p></div>
      <div class="benefit reveal"><span class="k">iv.</span><h3>Professional service</h3><p>Punctual, respectful of your property, and tidy throughout — your home or premises is treated with care.</p></div>
      <div class="benefit reveal"><span class="k">v.</span><h3>Reliable communication</h3><p>Clear quotations, agreed timings and updates as the work progresses, so you always know what's happening.</p></div>
      <div class="benefit reveal"><span class="k">vi.</span><h3>Tailored solutions</h3><p>Every property is different. We recommend the approach and finishes that suit your space, use and budget.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">Featured projects</span><h2>Recent work from our team</h2></div>
      <div><p class="lead">A selection of interior projects and room transformations. Select any photo to enlarge it.</p></div>
    </div>
    <div class="proj-grid portfolio home-gallery">${PROJECTS.slice(-9).map(photo=>projectTile(ctx,photo)).join('')}</div>
    <div class="btn-row" style="margin-top:44px"><a class="btn btn-dark" href="${link(ctx,'our-projects')}">View All Projects ${arrow}</a></div>
  </div>
</section>

<section class="section bg-ivory">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">How it works</span><h2>From first message to finished room</h2></div>
      <p class="lead">A straightforward process with no surprises — you'll know what's included before any work begins.</p>
    </div>
    <ol class="steps">
      <li class="step reveal"><h3>Tell us about your project</h3><p>Use the instant estimate calculator or send us a message with a few details and photographs.</p></li>
      <li class="step reveal"><h3>Discuss your requirements</h3><p>We talk through the surfaces, finishes, timings and any repairs, and arrange a visit where needed.</p></li>
      <li class="step reveal"><h3>Receive your personalised quotation</h3><p>A clear written quotation setting out the work included, so you can decide with confidence.</p></li>
      <li class="step reveal"><h3>Get your property transformed</h3><p>We prepare, protect and decorate to the agreed plan, then walk through the finished work with you.</p></li>
    </ol>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">Customer reviews</span><h2>What our customers say</h2></div>
      <p class="lead">Feedback from customers who have used our painting and decorating services.</p>
    </div>
    <div class="quotes">${REVIEWS.map(testimonial).join('')}</div>
  </div>
</section>

${ctaBand(ctx,{primary:'Get a Free Quote'})}

<section class="section">
  <div class="wrap grid-2 top">
    <div>
      <span class="eyebrow">FAQs</span>
      <h2>Common questions</h2>
      <p class="lead" style="margin-top:20px">Quick answers about quotations, coverage and how we work.</p>
      <a class="btn-link" style="margin-top:20px" href="${link(ctx,'faqs')}">See all FAQs ${arrow}</a>
    </div>
    ${faqList(HOME_FAQS,'hf')}
  </div>
</section>`
});

// ---------------- About ----------------
PAGES.push({
  route: 'about-us', file: 'about-us.html',
  title: 'About Us | Snow Property Solutions — London Painters & Decorators',
  desc: 'Meet Snow Property Solutions: painters and decorators in London focused on careful preparation, quality workmanship and a professional customer experience.',
  crumbs: [['Home',''],['About Us','about-us']],
  content: ctx => `
${pageHero(ctx,{crumbs:[['Home',''],['About Us','about-us']],eyebrow:'Who we are',h1:'About Snow Property Solutions',lead:'Painting and decorating for homes, landlords and businesses across London — built on preparation, care and a finish we are proud to put our name to.',img:'owner.jpg',imgClass:'owner-photo',alt:'The owner of Snow Property Solutions in branded workwear with paint tins and colour swatches',real:true})}

<section class="section">
  <div class="wrap intro-split">
    <div><span class="eyebrow">Our story</span><h2>Exceptional decorating starts long before the paint</h2></div>
    <div class="reveal">
      <p class="big">At Snow Property Solutions, we believe that exceptional decorating starts with careful preparation, quality workmanship and attention to every detail.</p>
      <p class="muted">We provide painting and decorating services for residential and commercial properties, helping customers refresh, improve and transform their spaces.</p>
      <p class="muted">From smaller decorating projects to larger property improvements, our focus is on delivering a professional service and a finish that meets the needs of each customer.</p>
    </div>
  </div>
</section>

<section class="section bg-ivory">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Our values</span><h2>What guides our work</h2></div><p class="lead">Four principles shape how we quote, plan and carry out every project.</p></div>
    <div class="feature-list">
      <div class="fi reveal"><span class="n">i.</span><div><h3>Honesty</h3><p>Clear quotations that explain what's included, and straightforward advice about what your surfaces actually need.</p></div></div>
      <div class="fi reveal"><span class="n">ii.</span><div><h3>Care</h3><p>Your property is protected throughout. Floors, furniture and fittings are covered and the work area is left tidy.</p></div></div>
      <div class="fi reveal"><span class="n">iii.</span><div><h3>Craft</h3><p>We take time over the preparation and finishing details that separate a professional job from a quick one.</p></div></div>
      <div class="fi reveal"><span class="n">iv.</span><div><h3>Communication</h3><p>Agreed timings, regular updates and a final walk-through, so you're never left wondering what happens next.</p></div></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap grid-2">
    <figure class="figure frame-offset reveal"><img src="${img(ctx,'project-tv-feature-wall.jpg')}" alt="Decorated room with neat ceiling line, television wall and desk" loading="lazy" width="900" height="675"></figure>
    <div class="prose">
      <span class="eyebrow">Our approach</span>
      <h2>Preparation and finishing</h2>
      <p>Most problems with a painted finish trace back to the surface underneath. Before we decorate, we check for cracks, flaking paint, stains and uneven areas, then fill, sand and prime as needed so the new finish bonds properly and looks even.</p>
      <p>Finishing is where the care shows: crisp lines where walls meet ceilings, clean edges around switches and frames, and consistent sheen across every surface. We check our work in different light before calling a room finished.</p>
      <a class="btn-link" href="${link(ctx,'services/plastering-repairs')}">How we prepare surfaces ${arrow}</a>
    </div>
  </div>
</section>

<section class="section bg-green on-dark">
  <div class="wrap grid-2 top">
    <div>
      <span class="eyebrow light">Customer experience</span>
      <h2>Working with us</h2>
      <p class="lead" style="margin-top:20px">Having decorators in your home or business should feel easy. Here is what you can expect.</p>
    </div>
    <div class="feature-list" style="grid-template-columns:1fr">
      <div class="fi reveal"><span class="n">01</span><div><h3>A clear starting point</h3><p>A free quotation that sets out the work, so you can compare and decide without pressure.</p></div></div>
      <div class="fi reveal"><span class="n">02</span><div><h3>Respect for your space</h3><p>Dust sheets and masking as standard, and a tidy work area at the end of each day.</p></div></div>
      <div class="fi reveal"><span class="n">03</span><div><h3>Easy to reach</h3><p>Call, email or WhatsApp — we keep you updated and respond to questions as the work progresses.</p></div></div>
      <div class="fi reveal"><span class="n">04</span><div><h3>A final walk-through</h3><p>We review the finished work with you before the project is complete.</p></div></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Residential &amp; commercial</span><h2>Who we work with</h2></div><p class="lead">The same careful approach, tailored to the type of property and how it's used.</p></div>
    <div class="grid-2 top">
      <div class="prose reveal">
        <h3>Homeowners</h3>
        <p>Single rooms, whole-house redecoration, feature walls and exterior refreshes — planned around your household.</p>
        <h3>Landlords &amp; property investors</h3>
        <p>Durable, neutral finishes between tenancies and repairs to make good wear and tear, with clear communication if you're not on site.</p>
      </div>
      <div class="prose reveal">
        <h3>Estate agents &amp; property managers</h3>
        <p>Presentation-ready decorating for sales and lettings, and dependable support for communal areas.</p>
        <h3>Commercial businesses</h3>
        <p>Offices, retail premises and commercial interiors decorated in a way that works around your operations. <a href="${link(ctx,'services/commercial-decorating')}">Commercial decorating</a>.</p>
      </div>
    </div>
  </div>
</section>

${ctaBand(ctx,{h2:'Let\u2019s talk about <em class="serif">your project</em>',primary:'Request a Quotation'})}`
});

// ---------------- Services overview ----------------
const SVC_DETAIL = {
  'interior-painting': { benefits:['A refreshed, even finish throughout','Finishes suited to each room\u2019s use','Minimal disruption to daily life'], incl:['Walls and ceilings','Skirting, doors and frames','Filling, sanding and priming','Colour and sheen guidance'],
    desc:'Interior painting for living spaces, bedrooms, hallways and rental properties. We prepare every surface properly, protect your furnishings and apply finishes that suit how each room is used — from washable matt in busy hallways to durable satin on woodwork.' },
  'exterior-painting': { benefits:['Refreshed kerb appeal','Coatings suited to exterior exposure','Protection for exposed surfaces'], incl:['Masonry and rendered walls','Doors and windows','Fascias and soffits','Cleaning and surface preparation'],
    desc:'Exterior painting that improves the look of your property and helps protect exposed surfaces. Walls, masonry, woodwork, fascias and fences are cleaned and prepared, then coated with exterior products suited to the surface.' },
  'wallpapering': { benefits:['Character and texture in any room','Seamless pattern alignment','Clean edges and corners'], incl:['Feature walls and full rooms','Removal of old wallpaper','Wall preparation and lining','Pattern matching'],
    desc:'Wallpaper hanging for feature walls and full rooms, including removal of old paper and preparation of the walls beneath. Patterns are set out and matched carefully so the finished wall looks continuous.' },
  'plastering-repairs': { benefits:['Smooth surfaces ready for decoration','Defects repaired, not painted over','A better final paint finish'], incl:['Crack and hole repairs','Ceiling repairs','Skimming and patching','Filling and smoothing'],
    desc:'Plastering and wall repairs that give your decoration a sound, smooth base. Cracks, dents and damaged areas are repaired, and surfaces are filled, skimmed or smoothed as needed before painting.' },
  'commercial-decorating': { benefits:['A professional environment for staff and customers','Work planned around your operations','Consistent finish across larger areas'], incl:['Offices and retail premises','Communal areas','Rental and managed properties','Refurbishment decorating'],
    desc:'Decorating for offices, retail premises, communal areas and managed properties. We agree working arrangements that suit your business and deliver a consistent, professional finish across larger spaces.' },
};

PAGES.push({
  route: 'services', file: 'services.html',
  title: 'Painting & Decorating Services in London | Snow Property Solutions',
  desc: 'Explore our painting and decorating services in London: interior and exterior painting, wallpapering, plastering and wall repairs, and commercial decorating.',
  crumbs: [['Home',''],['Services','services']],
  content: ctx => `
${pageHero(ctx,{crumbs:[['Home',''],['Services','services']],eyebrow:'Our services',h1:'Professional Painting &amp; Decorating Services',lead:'From a single room to a full commercial refurbishment, each of our services follows a clear process — prepare properly, protect the property and finish with care.',buttons:`<a class="btn btn-gold" href="${link(ctx,'get-a-quote')}">Get an Instant Estimate ${arrow}</a>`})}
<section class="section tight">
  <div class="wrap">
    ${SERVICES.map((s,i)=>{const d=SVC_DETAIL[s.slug];return `<article class="svc-long reveal" id="${s.slug}">
      ${s.real ? `<div class="media"><img src="${img(ctx,s.img)}" alt="${esc(s.alt)}" loading="lazy" width="900" height="700"></div>` : ''}
      <div class="body">
        <span class="eyebrow">0${i+1} · ${s.short}</span>
        <h2 style="font-size:clamp(32px,3.4vw,46px)">${s.name}</h2>
        <p class="muted">${d.desc}</p>
        <div class="cols">
          <div><h4>Main benefits</h4><ul class="ticks">${d.benefits.map(b=>`<li>${b}</li>`).join('')}</ul></div>
          <div><h4>Key work included</h4><ul class="ticks">${d.incl.map(b=>`<li>${b}</li>`).join('')}</ul></div>
        </div>
        <div class="btn-row" style="margin-top:12px">
          <a class="btn btn-dark" href="${link(ctx,'services/'+s.slug)}">Learn More ${arrow}</a>
          <a class="btn btn-outline" href="${link(ctx,'get-a-quote')}?service=${s.key}">Get an Estimate for This Service</a>
        </div>
      </div>
    </article>`}).join('')}
  </div>
</section>
${ctaBand(ctx,{eyebrow:'Not sure which service you need?',h2:'Tell us about <em class="serif">the space</em>',text:'Many projects combine services — repairs before painting, or a wallpapered feature wall alongside a full room repaint. Describe what you have in mind and we will recommend the right approach.',secondary:'WhatsApp Us',secondaryHref:SITE.whatsapp})}`
});

// ---------------- Projects ----------------
PAGES.push({
  route: 'our-projects', file: 'our-projects.html',
  title: 'Our Decorating Projects | Snow Property Solutions London',
  desc: 'See painting, wallpapering and decorating projects completed by Snow Property Solutions. Filter by service and view photographs of our finished work.',
  crumbs: [['Home',''],['Our Projects','our-projects']], lightbox: true, scripts: ['portfolio.js'],
  content: ctx => `
${pageHero(ctx,{crumbs:[['Home',''],['Our Projects','our-projects']],eyebrow:'Portfolio',h1:'Our Decorating Projects',lead:'Photographs of our decorating projects. Filter by service, and select any image to view it larger.'})}
<section class="section">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter projects by service">
      <button type="button" aria-pressed="true" data-filter="all">All projects<sup>${PROJECTS.length}</sup></button>
      ${SERVICES.map(s=>`<button type="button" aria-pressed="false" data-filter="${s.slug}">${s.name}<sup>${PROJECTS.filter(p=>p.cat===s.slug).length}</sup></button>`).join('')}
    </div>
    <div class="proj-grid portfolio" aria-live="polite">
      ${PROJECTS.map(p=>projectTile(ctx,p,{detail:true})).join('')}
      <div class="empty-state" hidden data-empty>
        <h3>Photographs coming soon</h3>
        <p>We're adding photographs of completed projects in this category. In the meantime, ask us about similar work we've carried out.</p>
        <div class="btn-row" style="justify-content:center"><a class="btn btn-dark" href="${link(ctx,'contact')}">Ask About This Service ${arrow}</a></div>
      </div>
    </div>
    <p class="small muted" style="margin-top:48px;max-width:70ch">Locations are not shown to protect our customers' privacy. Before-and-after photographs are included where available.</p>
  </div>
</section>
${ctaBand(ctx,{h2:'Picture your space <em class="serif">finished</em>',primary:'Get an Instant Estimate'})}`
});

// ---------------- Areas ----------------
PAGES.push({
  route: 'areas-we-cover', file: 'areas-we-cover.html',
  title: 'Areas We Cover | Painters & Decorators Across London',
  desc: 'Snow Property Solutions provides painting and decorating across London and surrounding areas. Check coverage for your postcode and request a quote.',
  crumbs: [['Home',''],['Areas We Cover','areas-we-cover']],
  content: ctx => `
${pageHero(ctx,{crumbs:[['Home',''],['Areas We Cover','areas-we-cover']],eyebrow:'Service coverage',h1Class:'areas-title',h1:'<span class="areas-title-desktop"><span class="areas-title-main">Professional Painters &amp; Decorators</span><br><em>Across London</em></span><span class="areas-title-mobile">Professional Painters &amp;<br>Decorators <em>Across London</em></span>',lead:'We provide painting and decorating for homes and businesses across London and the surrounding areas.'})}
<section class="section">
  <div class="wrap grid-2 top">
    <div class="prose">
      <span class="eyebrow">Where we work</span>
      <h2>London and surrounding areas</h2>
      <p>Our team works on residential and commercial properties throughout London, as well as in nearby areas just outside the capital. Whether you're in a flat, a period terrace, an office or a retail unit, we can discuss your project and arrange a visit where needed.</p>
      <p>If you're not sure whether we cover your location, the quickest way to check is to send us your postcode. Include it in the <a href="${link(ctx,'get-a-quote')}">quote calculator</a> or <a href="${link(ctx,'contact')}">contact form</a> and we'll confirm.</p>
    </div>
    <dl class="stat-strip reveal" style="grid-template-columns:1fr">
      <div><dt>Coverage</dt><dd>${SITE.area}</dd></div>
      <div><dt>Property types</dt><dd>Residential, rental and commercial</dd></div>
      <div><dt>Check your postcode</dt><dd><a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a></dd></div>
    </dl>
  </div>
</section>
<section class="section bg-ivory">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Services across London</span><h2>What we can help with</h2></div><p class="lead">All of our services are available throughout our coverage area.</p></div>
    <div class="related">
      ${SERVICES.map(s=>`<a href="${link(ctx,'services/'+s.slug)}"><span>Service</span><b>${s.name}</b></a>`).join('')}
      <a href="${link(ctx,'services')}"><span>Overview</span><b>All services</b></a>
    </div>
  </div>
</section>
${ctaBand(ctx,{eyebrow:'Check your area',h2:'Are we covering <em class="serif">your postcode?</em>',text:'Send us your postcode and a few details about your project. We\u2019ll confirm coverage and the next steps.',primary:'Start My Estimate',secondary:'Contact Us'})}`
});
