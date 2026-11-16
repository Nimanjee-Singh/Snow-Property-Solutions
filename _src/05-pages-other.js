// =========================================================
// Quote, Contact, FAQs, Legal, 404
// =========================================================
PAGES.push({
  route:'get-a-quote', file:'get-a-quote.html',
  title:'Instant Painting & Decorating Estimate | Snow Property Solutions',
  desc:'Get an instant painting and decorating estimate. Enter your measurements in square metres, add ceilings, woodwork and extras, upload photos and request your final quote.',
  crumbs:[['Home',''],['Get a Quote','get-a-quote']], noFloat:true, styles:['quote.css'],
  scripts:['pricing-config.js','forms.js','quote-calculator.js'],
  content: ctx => `
<section class="page-hero">
  <div class="wrap">
    ${crumbs(ctx,[['Home',''],['Get a Quote','get-a-quote']])}
    <span class="eyebrow light">Instant estimate</span>
    <h1>Get Your Instant Estimate</h1>
    <p class="lead">Tell us about your project, enter the area in square metres and receive an initial estimated price range.</p>
  </div>
</section>
<section class="section tight bg-ivory">
  <div class="wrap">
    <div id="quote-app" class="qc" data-home="${link(ctx,'')}" data-contact="${link(ctx,'contact')}" data-services="${link(ctx,'services')}">
      <noscript><div class="notice"><b>JavaScript is needed for the estimate calculator.</b> You can still <a href="${link(ctx,'contact')}">send us an enquiry</a>, call <a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a> or email <a href="mailto:${SITE.email}">${SITE.email}</a>.</div></noscript>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="wrap grid-2 top">
    <div><span class="eyebrow">Prefer to talk?</span><h2 style="font-size:clamp(30px,3vw,42px)">Speak to us directly</h2></div>
    <dl class="stat-strip" style="grid-template-columns:1fr 1fr">
      <div><dt>Call</dt><dd><a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a></dd></div>
      <div><dt>WhatsApp</dt><dd><a href="${SITE.whatsapp}" target="_blank" rel="noopener">Message us</a></dd></div>
    </dl>
  </div>
</section>`
});

PAGES.push({
  route:'contact', file:'contact.html',
  title:'Contact Snow Property Solutions | Painters & Decorators London',
  desc:'Contact Snow Property Solutions for painting and decorating in London. Call 07407 072094, email, WhatsApp us or send an enquiry with photos of your project.',
  crumbs:[['Home',''],['Contact','contact']], noFloat:true,
  scripts:['forms.js','contact-form.js'],
  content: ctx => `
${pageHero(ctx,{crumbs:[['Home',''],['Contact','contact']],eyebrow:'Get in touch',h1:'Contact Snow Property Solutions',lead:'Have a decorating project in mind? Get in touch and tell us how we can help.',
  buttons:`<a class="btn btn-gold" href="${link(ctx,'get-a-quote')}">Get an Instant Estimate ${arrow}</a><a class="btn btn-outline" href="${SITE.whatsapp}" target="_blank" rel="noopener">Contact Us on WhatsApp</a>`})}
<section class="section">
  <div class="wrap contact-layout">
    <div>
      <span class="eyebrow">Contact details</span>
      <dl class="contact-card">
        <div><dt>Telephone</dt><dd><a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd></div>
        <div><dt>WhatsApp</dt><dd><a href="${SITE.whatsapp}" target="_blank" rel="noopener">Message ${SITE.phoneDisplay}</a></dd></div>
        <div><dt>Service area</dt><dd>${SITE.area}</dd></div>
        <div><dt>Opening hours</dt><dd>${SITE.hours}</dd></div>
      </dl>
    </div>
    <div class="form-card">
      <h2 style="font-size:clamp(30px,3vw,42px);margin-bottom:8px">Send an enquiry</h2>
      <p class="muted" style="margin-bottom:28px">Fields marked * are required.</p>
      <form id="contact-form" novalidate data-success-target="contact-success">
        <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="form-grid">
          <div class="field"><label for="cf-name">Name *</label><input class="input" id="cf-name" name="name" autocomplete="name" required maxlength="100"><span class="err" id="cf-name-err"></span></div>
          <div class="field"><label for="cf-email">Email *</label><input class="input" id="cf-email" name="email" type="email" autocomplete="email" required maxlength="150"><span class="err" id="cf-email-err"></span></div>
          <div class="field"><label for="cf-phone">Phone *</label><input class="input" id="cf-phone" name="phone" type="tel" autocomplete="tel" required maxlength="30"><span class="err" id="cf-phone-err"></span></div>
          <div class="field"><label for="cf-postcode">Postcode *</label><input class="input" id="cf-postcode" name="postcode" autocomplete="postal-code" required maxlength="10" style="text-transform:uppercase"><span class="err" id="cf-postcode-err"></span></div>
          <div class="field full"><label for="cf-service">Service *</label>
            <select class="input" id="cf-service" name="service" required>
              <option value="">Select a service</option>
              ${SERVICES.map(s=>`<option>${s.name}</option>`).join('')}
              <option>Other / not sure</option>
            </select><span class="err" id="cf-service-err"></span></div>
          <div class="field full"><label for="cf-message">Message *</label><textarea class="input" id="cf-message" name="message" required maxlength="3000" placeholder="Tell us about the rooms or areas, the work needed and any timings."></textarea><span class="err" id="cf-message-err"></span></div>
          <div class="field full"><span class="lbl">Photos <span class="opt">(optional — up to 5 images, JPG, PNG or WebP)</span></span>
            <div class="upload" data-upload="cf"><input type="file" accept="image/jpeg,image/png,image/webp" multiple aria-label="Upload project photos"><b>Add photographs</b><p>Drag images here or tap to browse</p></div>
            <div class="thumbs" data-thumbs="cf"></div><span class="err" data-upload-err="cf"></span></div>
          <div class="field full" style="flex-direction:row;gap:12px;align-items:flex-start"><input type="checkbox" id="cf-consent" name="consent" required style="width:20px;height:20px;margin-top:3px;accent-color:#183139"><label for="cf-consent" style="text-transform:none;letter-spacing:0;font-weight:400;font-size:14px;color:var(--muted)">I agree to Snow Property Solutions using these details to respond to my enquiry, as described in the <a href="${link(ctx,'privacy-policy')}">Privacy Policy</a>. *</label></div>
          <span class="err full" id="cf-consent-err"></span>
          <div class="form-status full" role="alert" aria-live="assertive"></div>
          <div class="full btn-row"><button class="btn btn-dark" type="submit">Send Enquiry ${arrow}</button></div>
        </div>
      </form>
      <div id="contact-success" class="success-panel" hidden tabindex="-1">
        <div class="mark" aria-hidden="true"></div>
        <h2>Thank you — your enquiry has been sent.</h2>
        <p class="muted">We've received your message and will be in touch about your project. If it's urgent, call us on <a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a>.</p>
        <div class="btn-row" style="margin-top:24px"><a class="btn btn-dark" href="${link(ctx,'our-projects')}">View Our Projects ${arrow}</a></div>
      </div>
    </div>
  </div>
</section>`
});

const FAQ_CATS = [
  ['General','general',[
    ['What services do you provide?','We provide <a href="services/interior-painting.html">interior painting</a>, <a href="services/exterior-painting.html">exterior painting</a>, <a href="services/wallpapering.html">wallpapering</a>, <a href="services/plastering-repairs.html">plastering and repairs</a> and <a href="services/commercial-decorating.html">commercial decorating</a>.'],
    ['Which areas do you cover?','We work across London and surrounding areas. If you\u2019re unsure whether we cover your location, send us your postcode and we\u2019ll confirm. See <a href="areas-we-cover.html">Areas We Cover</a>.'],
    ['Do you work on residential and commercial properties?','Yes. We decorate homes and rental properties as well as offices, retail premises, communal areas and other commercial spaces.'],
  ]],
  ['Pricing and quotations','pricing',[
    ['How much does painting cost per square metre?','The cost depends on the type of work, the condition of the surfaces, how much preparation is needed, access, and the finishes chosen. Our <a href="get-a-quote.html">instant estimate calculator</a> uses our current rates to give an initial price range, and we confirm the final price in a personalised quotation.'],
    ['Do you provide free quotations?','Yes. Quotations are free and there is no obligation to go ahead.'],
    ['How does the instant estimate calculator work?','You choose a service, enter the surface area in square metres (or room dimensions, and we calculate the wall area), select the surface condition and any additional work, and upload photos if you have them. The calculator then shows an initial estimated range. Where an item can\u2019t be estimated online, we\u2019ll price it in your personalised quotation.'],
    ['Are materials included?','Whether materials are included will be set out clearly in your quotation, so you know exactly what you\u2019re paying for. If you\u2019re supplying your own wallpaper or paint, let us know.'],
    ['Can I receive a personalised quotation?','Yes. Every estimate is followed by a personalised quotation based on your requirements and, where needed, a visit to see the property.'],
  ]],
  ['Services','services',[
    ['Do you paint ceilings and woodwork?','Yes. We paint ceilings, skirting boards, architraves, doors and frames, either on their own or as part of a full room.'],
    ['Do you remove old wallpaper?','Yes. We strip old wallpaper and prepare the walls for new paper or paint.'],
    ['Do you offer plastering and wall repairs?','Yes. We repair cracks, holes and damaged areas, and can skim surfaces to prepare them for decorating.'],
    ['Do you provide exterior painting?','Yes. We paint exterior walls and masonry, doors, windows, fascias, soffits and fences, with work planned around suitable weather.'],
  ]],
  ['Projects','projects',[
    ['How long does a project take?','It depends on the size of the area, the amount of preparation and repairs, drying times and, for exterior work, the weather. We\u2019ll give you an expected timeframe with your quotation.'],
    ['How should I prepare my property?','It helps to remove small items, ornaments and valuables, and to let us know about access, parking and any areas we should avoid. We\u2019ll cover and protect floors and larger furniture.'],
    ['Can I upload photographs of my project?','Yes. You can upload photos in the <a href="get-a-quote.html">quote calculator</a> or the <a href="contact.html">contact form</a>, or send them by WhatsApp. Photos help us understand the surfaces before we quote.'],
  ]],
];

PAGES.push({
  route:'faqs', file:'faqs.html',
  title:'Painting & Decorating FAQs | Snow Property Solutions London',
  desc:'Answers to common questions about our painting and decorating services in London, including pricing, quotations, materials, project timings and coverage.',
  crumbs:[['Home',''],['FAQs','faqs']],
  faqSchema: FAQ_CATS.flatMap(c=>c[2]),
  content: ctx => `
${pageHero(ctx,{crumbs:[['Home',''],['FAQs','faqs']],eyebrow:'Help &amp; answers',h1:'Frequently Asked Questions',lead:'Everything you might want to know before booking your painting or decorating project.'})}
<section class="section">
  <div class="wrap faq-layout">
    <nav class="faq-toc" aria-label="FAQ categories">${FAQ_CATS.map(c=>`<a href="#${c[1]}">${c[0]}<span class="muted">${c[2].length}</span></a>`).join('')}</nav>
    <div>${FAQ_CATS.map((c,ci)=>`<div class="faq-cat" id="${c[1]}"><h2><span>0${ci+1}</span>${c[0]}</h2>${faqList(c[2],'faq-'+c[1])}</div>`).join('')}</div>
  </div>
</section>
${ctaBand(ctx,{eyebrow:'Still have a question?',h2:'We\u2019re happy <em class="serif">to help</em>',text:'Get in touch by phone, email or WhatsApp, or start with an instant estimate.',primary:'Get an Instant Estimate'})}`
});

function legalPage(route, title, h1, desc, body){
  PAGES.push({route,file:route+'.html',title,desc,crumbs:[['Home',''],[h1,route]],
    content: ctx => `
${pageHero(ctx,{crumbs:[['Home',''],[h1,route]],h1,lead:'Last updated: <span data-legal-date>November 2026</span>'})}
<section class="section"><div class="wrap"><div class="prose" style="max-width:760px">
<div class="notice" style="margin-bottom:40px"><b>Draft for review.</b> This document is a starting template. Please have it reviewed and confirmed by the business owner (and, where appropriate, a legal adviser) before relying on it.</div>
${body(ctx)}
</div></div></section>`});
}

legalPage('privacy-policy','Privacy Policy | Snow Property Solutions','Privacy Policy','How Snow Property Solutions collects, uses and protects personal information submitted through our website, quote calculator and contact forms.', ctx=>`
<h2>Who we are</h2><p>${SITE.name} provides painting and decorating services in ${SITE.area}. For any privacy questions, contact us at <a href="mailto:${SITE.email}">${SITE.email}</a> or on ${SITE.phoneDisplay}.</p>
<h2>Information we collect</h2><p>When you use our quote calculator or contact form we collect the information you choose to give us, which may include your name, email address, phone number, property postcode, preferred contact method, project details, measurements and any photographs you upload.</p>
<h2>How we use your information</h2><ul><li>To respond to your enquiry and prepare an estimate or quotation.</li><li>To contact you about your project using your preferred method.</li><li>To carry out and manage work you ask us to do.</li></ul><p>We do not sell your personal information or use it for unrelated marketing.</p>
<h2>Lawful basis</h2><p>We process your information to take steps at your request before entering into a contract, and where necessary for our legitimate interests in responding to enquiries and running our business.</p>
<h2>Photographs</h2><p>Photos you upload are used only to understand your project. Images are resized and location data embedded in the file is removed in your browser before upload.</p>
<h2>How your information is sent and stored</h2><p>Enquiries submitted through this website are delivered to our business email through a third-party form-processing service. We keep enquiry information only for as long as needed to deal with your enquiry and any resulting work, and to meet legal and accounting requirements.</p>
<h2>Your rights</h2><p>You can ask to access, correct or delete the personal information we hold about you, or object to how we use it. Contact us using the details above. You also have the right to complain to the Information Commissioner\u2019s Office (ico.org.uk).</p>
<h2>Cookies</h2><p>This website does not use advertising or analytics cookies. Fonts are loaded from Google Fonts, which may record your IP address as part of delivering the files.</p>`);

legalPage('terms-and-conditions','Terms and Conditions | Snow Property Solutions','Terms and Conditions','Terms for using the Snow Property Solutions website, instant estimate calculator and quotation process.', ctx=>`
<h2>About these terms</h2><p>These terms apply to your use of this website and our online estimate calculator. Separate terms will apply to any work we carry out, and will be set out in your quotation.</p>
<h2>Online estimates</h2><p>This is an initial estimate based on the details provided. The final quotation may vary depending on the condition of the surfaces, preparation requirements, materials and project inspection.</p><p>An online estimate is not an offer or a contract. A price is only agreed when we issue a written quotation and you accept it.</p>
<h2>Quotations</h2><p>Quotations set out the work included, any exclusions and how long the price is valid for. If we find conditions that could not reasonably be seen before the work started, we will discuss any changes with you before proceeding.</p>
<h2>Website content</h2><p>We take care to keep the information on this website accurate, but it is provided for general guidance. Some images on this website are illustrative and are labelled as such; they do not represent our completed projects.</p>
<h2>Uploads</h2><p>By uploading photographs you confirm you have the right to share them and that they relate to your project.</p>
<h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>`);

PAGES.push({
  route:'404', file:'404.html', noindex:true,
  title:'Page Not Found | Snow Property Solutions', desc:'The page you were looking for could not be found.',
  content: ctx => `
<section class="page-hero" style="min-height:60vh;display:flex;align-items:center"><div class="wrap">
  <span class="eyebrow light">Error 404</span>
  <h1>This page has been painted over</h1>
  <p class="lead">The page you were looking for doesn\u2019t exist or has moved.</p>
  <div class="btn-row on-dark"><a class="btn btn-gold" href="/">Back to Home ${arrow}</a><a class="btn btn-outline" href="/services">View Services</a></div>
</div></section>`
});
