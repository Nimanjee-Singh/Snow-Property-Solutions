// =========================================================
// Individual service pages — unique content per service
// =========================================================
function svcPage(o){
  const s = SERVICES.find(x=>x.slug===o.slug);
  const route = 'services/' + s.slug;
  const cr = [['Home',''],['Services','services'],[s.name,route]];
  PAGES.push({
    route, file: route + '.html', title: o.title, desc: o.desc, crumbs: cr, service: s, faqSchema: o.faqs, lightbox: !!(o.gallery&&o.gallery.length),
    content: ctx => `
${pageHero(ctx,{crumbs:cr,eyebrow:o.eyebrow,h1:o.h1,lead:o.lead,img:o.heroImg||s.img,alt:o.heroAlt||s.alt,real:o.heroReal!==undefined?o.heroReal:s.real,
  buttons:`<a class="btn btn-gold" href="${link(ctx,'get-a-quote')}?service=${s.key}">${o.cta} ${arrow}</a><a class="btn btn-outline" href="${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp Us</a>`})}

<section class="section">
  <div class="wrap intro-split">
    <div><span class="eyebrow">${o.introEyebrow}</span><h2>${o.introH2}</h2></div>
    <div class="reveal">${o.intro}</div>
  </div>
</section>

<section class="section bg-ivory">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">What's included</span><h2>${o.scopeH2}</h2></div><p class="lead">${o.scopeLead}</p></div>
    <div class="feature-list">${o.scope.map(([h,p],i)=>`<div class="fi reveal"><span class="n">${String(i+1).padStart(2,'0')}</span><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
  </div>
</section>

${o.feature ? `<section class="section">
  <div class="wrap${o.feature.img ? ' grid-2' : ''}">
    ${o.feature.img ? `<figure class="figure frame-offset reveal"><img src="${img(ctx,o.feature.img)}" alt="${esc(o.feature.alt)}" loading="lazy" width="900" height="675"></figure>` : ''}
    <div class="prose"><span class="eyebrow">${o.feature.eyebrow}</span><h2>${o.feature.h2}</h2>${o.feature.body}</div>
  </div>
</section>` : ''}

${o.gallery && o.gallery.length ? `<section class="section ${o.feature?'bg-ivory':''}">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Project gallery</span><h2>${o.galleryH2}</h2></div><p class="lead">Photographs of work completed by Snow Property Solutions. Select an image to enlarge.</p></div>
    <div class="proj-grid">${o.gallery.map(i=>projectTile(ctx,PROJECTS[i])).join('')}</div>
    <div class="btn-row" style="margin-top:40px"><a class="btn-link" href="${link(ctx,'our-projects')}">See all projects ${arrow}</a></div>
  </div>
</section>` : ''}

<section class="section bg-green on-dark">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow light">Our process</span><h2>${o.processH2}</h2></div><p class="lead">${o.processLead}</p></div>
    <ol class="steps">${o.process.map(([h,p])=>`<li class="step reveal"><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="section">
  <div class="wrap grid-2 top">
    <div>
      <span class="eyebrow">${s.name} FAQs</span>
      <h2>Questions about ${s.name.toLowerCase()}</h2>
      <p class="lead" style="margin-top:20px">Can't see your question? <a href="${link(ctx,'contact')}" style="color:var(--green)">Ask us directly</a> or browse the <a href="${link(ctx,'faqs')}" style="color:var(--green)">full FAQ page</a>.</p>
    </div>
    ${faqList(o.faqs, s.key)}
  </div>
</section>

<section class="section tight bg-ivory">
  <div class="wrap">
    <span class="eyebrow">Related services</span>
    <div class="related" style="margin-top:12px">${SERVICES.filter(x=>x.slug!==s.slug).map(x=>`<a href="${link(ctx,'services/'+x.slug)}"><span>Service</span><b>${x.name}</b></a>`).join('')}</div>
  </div>
</section>

${ctaBand(ctx,{eyebrow:o.ctaEyebrow||'Start with an estimate',h2:o.ctaH2,text:o.ctaText,primary:o.cta})}`
  });
}

// ---------- Interior ----------
svcPage({
  slug:'interior-painting',
  title:'Interior Painters London | Interior Painting & Decorating',
  desc:'Professional interior painters in London. Walls, ceilings, woodwork, doors and frames, with careful filling, sanding and preparation. Get an interior painting estimate.',
  eyebrow:'Interior painting', h1:'Professional Interior Painters in London',
  lead:'Walls, ceilings, woodwork and doors prepared properly and finished cleanly — for homes, rental properties and every room in between.',
  cta:'Get an Estimate for This Service',
  introEyebrow:'Interior painting', introH2:'A finish that makes the whole room feel new',
  intro:`<p class="big">A well-painted room is calm to look at: even colour, crisp edges, and no shadows of old marks showing through.</p>
  <p class="muted">We achieve that by spending the right amount of time on preparation. Walls and ceilings are inspected, holes and cracks filled, surfaces sanded and dusted, and stains or bare plaster primed before any topcoat is applied. Woodwork is keyed and cleaned so new paint adheres properly.</p>
  <p class="muted">We work in occupied homes and empty properties alike, protecting floors and furniture and keeping disruption to a minimum.</p>`,
  scopeH2:'Interior painting services', scopeLead:'Every surface in the room, prepared and finished to the same standard.',
  scope:[
    ['Wall painting','Even coverage in your chosen colour and sheen, with clean cutting-in at ceilings, corners and around fittings.'],
    ['Ceiling painting','Ceilings painted without streaks or patchiness, including coving and cornice where required.'],
    ['Woodwork & skirting boards','Skirting, architraves, dado and picture rails prepared and painted in a durable finish.'],
    ['Doors & frames','Panel and flush doors, frames and linings — sanded, primed where needed and finished smoothly.'],
    ['Filling & sanding','Holes, dents and hairline cracks filled and sanded flush so they disappear under the new finish.'],
    ['Colour & finish options','Guidance on matt, eggshell, satin and gloss, and on finishes that suit kitchens, bathrooms and busy hallways.'],
    ['Residential painting','Single rooms through to whole-house redecoration, planned around your household.'],
    ['Rental property decorating','Durable, neutral refreshes between tenancies, with repairs to make good everyday wear.'],
  ],
  feature:{img:'project-living-room.jpg',real:true,alt:'Living room with smooth neutral walls and clean ceiling line',eyebrow:'Surface preparation',h2:'Why preparation matters indoors',
    body:`<p>Paint highlights whatever is underneath it. Without filling and sanding, small dents, old nail holes and uneven patches become more visible under a fresh coat — especially in side light from windows.</p>
    <p>We prepare each surface according to its condition: washing down where there's grease or marks, scraping back loose paint, filling and sanding defects, and spot-priming repairs and stains so the final coats dry evenly.</p>
    <p>Where walls need more than filling, our <a href="../services/plastering-repairs.html">plastering and repairs</a> service gives them a sound base first.</p>`},
  gallery:[0,1,2], galleryH2:'Interior painting projects',
  processH2:'Four stages, every room', processLead:'A consistent method so every surface gets the attention it needs.',
  process:[['Assess the surfaces','We look at the condition of walls, ceilings and woodwork and agree the finishes you want.'],['Prepare and protect','Furniture and floors are covered, surfaces filled, sanded and primed, and edges masked.'],['Apply the selected finishes','Coats applied evenly in the agreed colours and sheens, with time allowed for proper drying.'],['Final inspection','We check every surface in good light, touch up anything needed and walk through the room with you.']],
  faqs:[
    ['How many coats of paint will my walls need?','It depends on the existing colour, the new colour and the condition of the surface. Most redecoration needs two coats; bare plaster or strong colour changes may need a mist coat or primer first. We confirm this in your quotation.'],
    ['Do I need to move my furniture?','It helps if you can clear small items and valuables. We can move and cover larger furniture as part of the job and protect floors with dust sheets.'],
    ['Can you paint a property while tenants are living there?','Yes, by arrangement. We can plan the work room by room to reduce disruption — let us know the access arrangements when you request a quote.'],
    ['Which paint finish should I choose?','Matt gives a soft, modern look; washable or durable matt suits hallways and family rooms; satin or eggshell is common on woodwork. We\u2019ll recommend options for each space.'],
  ],
  ctaH2:'Ready to refresh <em class="serif">your interiors?</em>', ctaText:'Enter your wall, ceiling and woodwork measurements for an initial estimate, then we\u2019ll follow up to confirm your personalised quotation.',
});

// ---------- Exterior ----------
svcPage({
  slug:'exterior-painting',
  title:'Exterior Painters London | Masonry, Windows & Fascias',
  desc:'Exterior painting services in London: masonry and rendered walls, doors, windows, fascias, soffits and fences, with thorough cleaning and preparation. Request a quote.',
  eyebrow:'Exterior painting', h1:'Professional Exterior Painting Services in London',
  lead:'Refresh the outside of your property and help protect exposed surfaces, with careful preparation and coatings chosen for exterior use.',
  cta:'Get an Estimate for This Service',
  introEyebrow:'Exterior painting', introH2:'First impressions, built to last',
  intro:`<p class="big">The outside of a property takes the weather every day. A good exterior finish needs to look smart and stand up to it.</p>
  <p class="muted">That starts with what's beneath the paint. We clean down surfaces, remove loose and flaking coatings, treat or fill defects and make sure the substrate is sound and dry before applying exterior products suited to masonry, render, timber or metal.</p>
  <p class="muted">Whether it's a front door and windows or a full facade, we plan the work around the forecast and keep the site tidy throughout.</p>`,
  scopeH2:'Exterior painting services', scopeLead:'Coatings matched to each surface, applied in suitable conditions.',
  scope:[
    ['Exterior walls','Rendered and painted walls refreshed with an even, uniform finish.'],
    ['Masonry painting','Masonry surfaces prepared and coated with breathable exterior masonry paint where appropriate.'],
    ['Doors & windows','Timber and metal doors and window frames prepared, primed where bare, and finished for durability.'],
    ['Fascias & soffits','Rooflines cleaned, sanded and repainted to tidy the look of the whole property.'],
    ['Fences & exterior surfaces','Fences, gates and other suitable exterior surfaces treated or painted.'],
    ['Cleaning & preparation','Dirt, algae and loose material removed, with filling and spot-priming before painting.'],
  ],
  feature:{eyebrow:'Weather & durability',h2:'Preparation and the right coating',
    body:`<p>Exterior paint fails when it's applied over dirt, damp or loose material, or when the product isn't right for the surface. Peeling and blistering are almost always a preparation problem.</p>
    <p>We assess each surface and choose an exterior coating to suit it — breathable masonry finishes for walls, and appropriate primers and topcoats for timber and metal. Painting is scheduled for dry conditions and suitable temperatures so coatings can cure properly.</p>
    <h3>Things we consider</h3>
    <ul><li>Surface type and existing coating</li><li>Signs of damp, cracking or blown render</li><li>Exposure to sun and rain</li><li>Weather window and drying times</li></ul>`},
  gallery:[], galleryH2:'',
  processH2:'How we approach exterior work', processLead:'Methodical preparation comes first — the paint is the final stage.',
  process:[['Survey the exterior','We check surfaces, access needs and any repairs, and talk through colours and finishes.'],['Clean and prepare','Surfaces are washed down, scraped, filled and primed; surroundings are protected.'],['Apply exterior coatings','Suitable products applied in the right conditions, allowing proper drying between coats.'],['Inspect and tidy','We review the finished work with you and leave the site clean.']],
  faqs:[
    ['When is the best time of year for exterior painting?','Exterior painting needs dry weather and suitable temperatures, so late spring to early autumn is usually best. We plan work around the forecast and will reschedule if conditions aren\u2019t right.'],
    ['Do you paint rendered and masonry walls?','Yes. We prepare and paint rendered and masonry walls using exterior coatings suitable for the surface.'],
    ['Will you need scaffolding?','It depends on the height and the areas being painted. We\u2019ll discuss access requirements when assessing the project, and any access costs will be made clear in your quotation.'],
    ['Can you repaint my front door and windows only?','Yes — smaller exterior jobs such as front doors, window frames, fascias or fences are welcome.'],
  ],
  ctaH2:'Give your property <em class="serif">a fresh face</em>', ctaText:'Share the areas you\u2019d like painted and a few photographs. We\u2019ll come back with next steps and a personalised quotation.',
});

// ---------- Wallpapering ----------
svcPage({
  slug:'wallpapering',
  title:'Wallpapering Services London | Feature Walls & Wallpaper Hanging',
  desc:'Professional wallpaper hanging in London. Feature walls, full rooms, wallpaper removal, wall preparation and precise pattern matching. Get a wallpapering quote.',
  eyebrow:'Wallpapering', h1:'Professional Wallpapering Services in London',
  lead:'Feature walls and full rooms hung with careful pattern matching, straight drops and clean edges — from subtle textures to bold statement designs.',
  cta:'Get an Estimate for This Service',
  introEyebrow:'Wallpaper hanging', introH2:'Pattern, texture and character',
  intro:`<p class="big">Wallpaper brings something paint can't — pattern, texture and depth. But it's unforgiving: every seam, bubble and misaligned repeat is on show.</p>
  <p class="muted">We plan each wall before the first drop is hung: where the pattern will centre, how it will meet corners and openings, and which way the joins will fall in the light. Walls are prepared so the paper sits flat and adheres properly.</p>
  <p class="muted">You choose the paper; we make sure it looks the way it did in the showroom.</p>`,
  scopeH2:'Wallpapering services', scopeLead:'From removing the old to finishing the last edge.',
  scope:[
    ['Wallpaper installation','Standard, paste-the-wall and heavier decorative papers hung to the manufacturer\u2019s guidance.'],
    ['Feature walls','A single statement wall to add focus behind a bed, sofa or dining table.'],
    ['Full-room wallpapering','Whole rooms papered with consistent alignment across every wall.'],
    ['Wallpaper removal','Old paper stripped carefully to limit damage to the plaster beneath.'],
    ['Wall preparation','Filling, sanding, sizing and lining paper where needed for a smooth base.'],
    ['Pattern matching','Repeats set out and matched precisely so the design flows across joins.'],
    ['Decorative wallpaper','Bold prints, murals and textured papers handled with extra care.'],
    ['Corners & edges','Neat trimming around corners, ceilings, skirting, switches and sockets.'],
  ],
  feature:{img:'project-striped-feature-wall.jpg',alt:'Navy and white striped wallpaper feature wall completed by Snow Property Solutions',eyebrow:'Preparation & setting out',h2:'The details that make wallpaper look right',
    body:`<p>Most wallpaper problems — lifting seams, visible joins, bubbles — come from poor preparation or rushed setting out. Walls need to be sound, smooth and suitably sized so the paper adheres evenly.</p>
    <p>Before hanging, we measure and plan where the pattern will start and end, so the design is centred on the focal point and the least visible join falls in a discreet corner.</p>
    <p>If your walls need more work first, we can carry out <a href="../services/plastering-repairs.html">plaster repairs</a> or hang lining paper as part of the job.</p>`},
  gallery:[3,4], galleryH2:'Feature wall projects',
  processH2:'From bare wall to finished paper', processLead:'Each step is planned to protect the paper and the result.',
  process:[['Assess walls & paper','We check wall condition and review your chosen paper\u2019s type, repeat and hanging instructions.'],['Strip and prepare','Old paper removed, walls filled, sanded and sized, with lining paper where needed.'],['Set out and hang','The pattern is centred and each drop hung, matched and smoothed carefully.'],['Trim and inspect','Edges trimmed cleanly at ceilings, skirting and fittings; seams checked before sign-off.']],
  faqs:[
    ['Do you supply the wallpaper?','Most customers choose and supply their own wallpaper. We can advise on quantities based on your room size and the pattern repeat before you order.'],
    ['Can you remove old wallpaper?','Yes. We strip old wallpaper and make good the walls underneath so they are ready for new paper or paint.'],
    ['How much wallpaper do I need?','It depends on wall size, roll dimensions and the pattern repeat. Send us your measurements and paper details and we\u2019ll help you calculate it, including a sensible allowance for matching.'],
    ['Can you hang murals and heavy decorative papers?','Yes. Murals, textured and heavier papers need careful handling and preparation, and we\u2019ll follow the manufacturer\u2019s instructions for each product.'],
  ],
  ctaH2:'Ready for a <em class="serif">statement wall?</em>', ctaText:'Tell us about the walls and the paper you have in mind. We\u2019ll confirm what preparation is needed and send your personalised quotation.',
});

// ---------- Plastering ----------
svcPage({
  slug:'plastering-repairs',
  title:'Plastering & Wall Repairs London | Crack Repairs & Skimming',
  desc:'Plastering and wall repair services in London: cracks, damaged walls and ceilings, skimming, filling and smoothing to prepare surfaces for a high-quality decorating finish.',
  eyebrow:'Plastering & repairs', h1:'Professional Plastering &amp; Wall Repair Services in London',
  lead:'Cracks, holes and damaged plaster repaired properly, so the decoration that follows has a smooth, sound surface to sit on.',
  cta:'Get an Estimate for This Service',
  introEyebrow:'Surface repair', introH2:'The foundation of every good finish',
  intro:`<p class="big">Even the best paint can't hide a cracked ceiling or a patchy wall. Repairing the surface first is what makes the finish look professional.</p>
  <p class="muted">We repair damaged walls and ceilings as a standalone service or as part of a wider decorating project. That ranges from filling hairline cracks and patching holes to skimming areas where the surface has become rough or uneven.</p>
  <p class="muted">The goal is simple: a smooth, stable surface that's ready to take paint or paper.</p>`,
  scopeH2:'Plastering and repair services', scopeLead:'Repairs sized to the problem — from minor filling to skimming.',
  scope:[
    ['Wall repairs','Holes, dents and damaged sections of wall made good and blended with the surrounding surface.'],
    ['Ceiling repairs','Cracks and damaged areas on ceilings repaired ready for redecoration.'],
    ['Cracks & damaged surfaces','Cracks raked out, filled and reinforced where appropriate to reduce the chance of them returning.'],
    ['Skimming','A fresh skim coat to restore a smooth surface on rough or uneven areas.'],
    ['Filling & smoothing','Minor defects filled, sanded and feathered so they disappear under paint.'],
    ['Preparation before painting','Repaired areas primed or mist-coated so the topcoat dries evenly.'],
  ],
  feature:{eyebrow:'Why it matters',h2:'How good preparation supports the finish',
    body:`<p>Paint and wallpaper follow the shape of the surface underneath. Unrepaired cracks show as lines, patched areas show as rough spots, and fresh plaster that isn't sealed can absorb paint unevenly and leave a blotchy finish.</p>
    <p>By repairing and preparing surfaces properly, we give the decoration the best chance of looking even and lasting well. New plaster is left to dry before decorating and then sealed with a suitable mist coat or primer.</p>
    <p>Repairs pair naturally with <a href="../services/interior-painting.html">interior painting</a> and <a href="../services/wallpapering.html">wallpapering</a>.</p>`},
  gallery:[], galleryH2:'',
  processH2:'Repair, refine, ready', processLead:'Repairs are planned around drying times so decorating can follow on smoothly.',
  process:[['Inspect the damage','We assess the cracks or damaged areas and explain the repair approach.'],['Protect and prepare','Floors and furniture are covered, and loose or failed material is removed.'],['Repair and smooth','Areas are filled, patched or skimmed, then sanded smooth once dry.'],['Seal and check','Repairs are sealed ready for decoration and checked for a flush, even surface.']],
  faqs:[
    ['How long does new plaster take to dry before painting?','Drying time depends on the thickness of the plaster, the room temperature and ventilation. Fresh skim usually needs several days or more before decorating. We\u2019ll advise on timings for your project.'],
    ['Will cracks come back after repair?','Cracks caused by minor movement or shrinkage can often be repaired so they don\u2019t reappear, but structural movement needs to be investigated by a suitable specialist. We\u2019ll tell you if we see signs that need further advice.'],
    ['Do you only do repairs as part of a decorating job?','No — we can carry out repairs on their own, though many customers combine them with painting so the whole job is handled together.'],
    ['Can you repair ceilings?','Yes. We repair cracks and damaged areas on ceilings and prepare them for painting.'],
  ],
  ctaH2:'Smooth walls start <em class="serif">here</em>', ctaText:'Upload photos of the cracks or damaged areas with your estimate request so we can understand the repairs needed.',
});

// ---------- Commercial ----------
svcPage({
  slug:'commercial-decorating',
  title:'Commercial Painters London | Office & Retail Decorating',
  desc:'Commercial painters and decorators in London for offices, retail premises, communal areas, rental and managed properties. Work tailored to your operations. Request a quote.',
  eyebrow:'Commercial decorating', h1:'Professional Commercial Painters &amp; Decorators in London',
  lead:'Decorating for offices, shops, communal areas and managed properties — planned around the way your building operates.',
  cta:'Get an Estimate for This Service',
  introEyebrow:'For businesses & landlords', introH2:'A professional finish for professional spaces',
  intro:`<p class="big">Your premises say a lot about your business. Tired walls and scuffed woodwork send the wrong message to customers, tenants and staff.</p>
  <p class="muted">We decorate commercial and managed properties with the same attention to preparation and detail as our residential work, while planning carefully around access, occupancy and day-to-day operations.</p>
  <p class="muted">We'll agree working arrangements that suit your property — including phased work, so areas can stay in use while others are decorated.</p>`,
  scopeH2:'Commercial decorating services', scopeLead:'Durable, consistent finishes across larger and busier spaces.',
  scope:[
    ['Office decorating','Workspaces, meeting rooms and reception areas refreshed with hard-wearing finishes.'],
    ['Retail premises','Shop floors and customer-facing areas decorated to present your brand well.'],
    ['Commercial interiors','Walls, ceilings, doors and woodwork across commercial interiors.'],
    ['Landlord & property management work','Reliable decorating for portfolios and managed buildings, with clear communication.'],
    ['Rental properties','Turnaround decorating between tenancies to keep properties lettable.'],
    ['Communal areas','Hallways, stairwells and shared spaces finished to withstand heavy footfall.'],
    ['Refurbishment decorating','Decorating as part of wider refurbishment projects.'],
    ['Larger decorating projects','Multi-room and multi-floor projects planned and phased sensibly.'],
  ],
  feature:{img:'project-hallway.jpg',alt:'Decorated corridor with framed artwork completed by Snow Property Solutions',eyebrow:'Tailored to your property',h2:'Working around your business',
    body:`<p>Every commercial property operates differently. A retail unit may need work completed before opening; an occupied office may need noisy or disruptive tasks scheduled carefully; a block of flats needs communal areas kept safe and accessible.</p>
    <p>We discuss these requirements at the start and plan the project accordingly — agreeing phasing, access, working hours and how areas will be protected and kept tidy.</p>
    <h3>We'll discuss</h3>
    <ul><li>Access arrangements and working hours</li><li>Phasing to keep areas in use</li><li>Durable finishes for high-traffic areas</li><li>Site contacts and communication</li></ul>`},
  gallery:[5,1], galleryH2:'Commercial and hospitality projects',
  processH2:'Planned for minimal disruption', processLead:'Clear planning up front means fewer surprises once work begins.',
  process:[['Site assessment','We review the areas, surfaces, access and any operational constraints.'],['Plan and agree','A schedule and working arrangements agreed with you, with a clear quotation.'],['Prepare and decorate','Areas protected and decorated in agreed phases, kept tidy and safe throughout.'],['Handover','A walk-through of completed areas and touch-ups before sign-off.']],
  faqs:[
    ['Can you work around our opening hours?','We\u2019ll discuss your operating hours and agree working arrangements that suit your property as part of the quotation.'],
    ['Do you decorate communal areas in residential blocks?','Yes. We decorate hallways, stairwells and other shared areas, planning the work to keep access safe for residents.'],
    ['Can you handle decorating between tenancies?','Yes. We work with landlords and property managers to refresh rental properties between tenants.'],
    ['Can you provide a quote for multiple properties?','Yes — get in touch with details of the properties and the work required and we\u2019ll discuss the best approach.'],
  ],
  ctaEyebrow:'Commercial enquiries', ctaH2:'Let\u2019s plan <em class="serif">your project</em>', ctaText:'Tell us about the property, the areas involved and any access requirements. We\u2019ll arrange a conversation and a tailored quotation.',
});
