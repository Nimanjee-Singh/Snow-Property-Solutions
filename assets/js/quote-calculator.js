/* =========================================================
   Instant Quote Calculator — Snow Property Solutions
   7 steps: service → measure → condition → extras → photos →
   estimate → details. Prices come ONLY from SPS_PRICING.
   ========================================================= */
(function(){
  'use strict';
  var root = document.getElementById('quote-app'); if (!root) return;

  // ---------- Pricing (with optional clearly-labelled demo mode for the owner to test) ----------
  var params = new URLSearchParams(location.search);
  var DEMO = params.get('pricing-demo') === '1';
  var PR = DEMO ? {
    currency:'GBP', vatNote:'TEST VALUES ONLY', roundTo:10,
    rates:{ interior:10, exterior:12, wallpapering:14, plastering:16, commercial:11 },
    preparation:{ good:0, average:10, poor:20, repairs:30 },
    extras:{ ceilingPerM2:8, woodworkPerMetre:5, doorPerItem:50, wallpaperRemovalPerM2:4, surfaceRepairsPerM2:20, additionalPrepPerM2:2 },
    materials:{ policy:'percentage', percentage:15 }, minimumCharge:200, rangeAllowance:{ low:10, high:15 }
  } : (window.SPS_PRICING || {});

  var SVC = {
    interior:     { name:'Interior Painting',     desc:'Walls, ceilings and woodwork', item:'Room',            modes:['room','wall','area'], ceiling:true,  wood:true,  maxH:10, href:'services/interior-painting' },
    exterior:     { name:'Exterior Painting',     desc:'Walls, masonry and woodwork',  item:'Elevation',       modes:['wall','area'],        ceiling:false, wood:true,  maxH:30, href:'services/exterior-painting' },
    wallpapering: { name:'Wallpapering',          desc:'Feature walls and full rooms', item:'Wall or room',    modes:['wall','room','area'], ceiling:false, wood:false, maxH:10, href:'services/wallpapering' },
    plastering:   { name:'Plastering & Repairs',  desc:'Walls and ceilings to repair', item:'Surface',         modes:['area','wall','room'], ceiling:true,  wood:false, maxH:10, href:'services/plastering-repairs' },
    commercial:   { name:'Commercial Decorating', desc:'Offices, retail and communal', item:'Area',            modes:['room','wall','area'], ceiling:true,  wood:true,  maxH:12, href:'services/commercial-decorating' }
  };
  var MODE_LABEL = { room:'Room dimensions', wall:'Wall width × height', area:'I know the m²' };
  var CONDITIONS = [
    ['good','Good condition','Sound surfaces with only minor marks — little preparation needed.'],
    ['average','Average condition','Some small cracks, holes or scuffs that need filling and sanding.'],
    ['poor','Poor condition','Flaking paint, many cracks or stains, uneven surfaces.'],
    ['repairs','Additional repairs required','Damaged plaster, larger cracks or areas that need patching or skimming.']
  ];
  var EXTRAS = [
    { id:'ceiling',  name:'Ceiling painting',      desc:'Ceilings painted in addition to the walls.', unit:'m²', key:'ceilingPerM2',  svcs:['interior','commercial'] },
    { id:'woodwork', name:'Woodwork',              desc:'Skirting boards, architraves, rails or exterior woodwork.', unit:'linear m', key:'woodworkPerMetre', svcs:['interior','commercial','exterior'] },
    { id:'doors',    name:'Doors and frames',      desc:'Each door including its frame.', unit:'doors', key:'doorPerItem', svcs:['interior','commercial','exterior'], integer:true },
    { id:'removal',  name:'Wallpaper removal',     desc:'Stripping existing wallpaper before decorating.', unit:'m²', key:'wallpaperRemovalPerM2', svcs:['interior','wallpapering','commercial','plastering'] },
    { id:'repairs',  name:'Surface repairs',       desc:'Patching damaged areas beyond normal filling.', unit:'m² affected', key:'surfaceRepairsPerM2', svcs:['interior','exterior','wallpapering','commercial'] },
    { id:'prep',     name:'Additional preparation',desc:'Extra sanding, sealing, stain-blocking or lining across the measured area.', unit:null, key:'additionalPrepPerM2', svcs:['interior','exterior','wallpapering','plastering','commercial'] },
    { id:'other',    name:'Other requirements',    desc:'Anything else — we\u2019ll include it in your personalised quotation.', unit:null, key:null, svcs:['interior','exterior','wallpapering','plastering','commercial'] }
  ];
  var STEPS = ['Service','Measure','Condition','Additional work','Photos','Estimate','Your details'];

  // ---------- State ----------
  var KEY = 'sps-quote-v1';
  var uid = 0;
  function newItem(svcKey, n){ var s = SVC[svcKey] || SVC.interior; return { id: ++uid, name: s.item + ' ' + n, mode: s.modes[0], area:'', w:'', l:'', h:'', open:'', ceilOn:false, ceilArea:'', woodOn:false, woodLen:'' }; }
  var state;
  try { state = JSON.parse(sessionStorage.getItem(KEY)); } catch(e){}
  if (!state || !state.v){ state = { v:1, step:0, maxStep:0, service:null, items:[], condition:null, extras:{}, qty:{}, other:'', contact:{ name:'', email:'', phone:'', postcode:'', method:'', desc:'' } }; }
  state.items.forEach(function(i){ uid = Math.max(uid, i.id); });
  var preset = params.get('service');
  if (preset && SVC[preset] && !state.service){ state.service = preset; state.items = [newItem(preset,1)]; }
  if (state.step >= 6 && state.submitted) state.step = 0;
  function save(){ try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} }

  var uploader = null; // created lazily; photos aren't persisted across refresh (privacy)
  var photoHost = document.createElement('div');
  photoHost.innerHTML = '<div class="upload" data-upload="qc"><input type="file" accept="image/jpeg,image/png,image/webp" multiple aria-label="Upload project photos"><b>Add photographs</b><p>Drag images here or tap to browse · JPG, PNG or WebP · up to 5 photos, 15 MB each</p></div><div class="thumbs" data-thumbs="qc"></div><p class="err" data-upload-err="qc" role="alert"></p>';

  // ---------- Helpers ----------
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function num(v){ if (v === '' || v == null) return NaN; var n = Number(String(v).replace(',', '.')); return isFinite(n) ? n : NaN; }
  function r2(n){ return Math.round(n * 100) / 100; }
  function fmtA(n){ return (Math.round(n * 10) / 10).toLocaleString('en-GB', { maximumFractionDigits:1 }); }
  var gbp = new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP', maximumFractionDigits:0 });
  function money(n){ var r = PR.roundTo || 1; return gbp.format(Math.round(n / r) * r); }
  function isSet(v){ return typeof v === 'number' && isFinite(v) && v >= 0; }
  function base(){ return root.dataset.home.replace('index.html',''); }

  // ---------- Measurement maths ----------
  // Wall area is NEVER taken from floor area: room mode uses perimeter × height.
  function calcItem(it){
    var s = SVC[state.service], e = {}, walls = 0, ceil = 0, wood = 0, perim = 0;
    var W = num(it.w), L = num(it.l), H = num(it.h), A = num(it.area), O = it.open === '' ? 0 : num(it.open);
    function dim(k, v, label, min, max){ if (isNaN(v)) e[k] = 'Enter the ' + label + '.'; else if (v < min || v > max) e[k] = label.charAt(0).toUpperCase() + label.slice(1) + ' must be between ' + min + ' and ' + max + ' m.'; }
    if (it.mode === 'area'){
      if (isNaN(A)) e.area = 'Enter the surface area in m².';
      else if (A < 0.5 || A > 10000) e.area = 'Area must be between 0.5 and 10,000 m².';
      else walls = A;
    } else {
      if (it.mode === 'room'){ dim('l', L, 'room length', 0.5, 100); dim('w', W, 'room width', 0.5, 100); }
      else dim('w', W, 'wall width', 0.2, 200);
      dim('h', H, 'height', 0.5, s.maxH);
      if (isNaN(O) || O < 0) e.open = 'Enter 0 or a positive number.';
      if (!e.l && !e.w && !e.h && !e.open){
        perim = it.mode === 'room' ? 2 * (L + W) : W;
        var gross = perim * H;
        if (O >= gross) e.open = 'Deductions must be smaller than the wall area (' + fmtA(gross) + ' m²).';
        else walls = gross - O;
      }
    }
    if (s.ceiling && it.ceilOn){
      if (it.mode === 'room'){ if (!e.l && !e.w) ceil = L * W; }
      else { var C = num(it.ceilArea); if (isNaN(C) || C < 0.5 || C > 10000) e.ceilArea = 'Enter the ceiling area (0.5–10,000 m²).'; else ceil = C; }
    }
    if (s.wood && it.woodOn){
      var Wd = num(it.woodLen); if (isNaN(Wd) || Wd <= 0 || Wd > 2000) e.woodLen = 'Enter the woodwork length in metres (up to 2,000).'; else wood = Wd;
    }
    return { walls: r2(walls), ceil: r2(ceil), wood: r2(wood), perim: r2(perim), errors: e };
  }
  function totals(){
    var t = { walls:0, ceil:0, wood:0 };
    state.items.forEach(function(it){ var c = calcItem(it); t.walls += c.walls; t.ceil += c.ceil; t.wood += c.wood; });
    t.walls = r2(t.walls); t.ceil = r2(t.ceil); t.wood = r2(t.wood);
    // plastering ceilings count as measured surface area for the base rate
    if (state.service === 'plastering'){ t.walls = r2(t.walls + t.ceil); t.ceil = 0; }
    return t;
  }
  function extraQty(id){
    var t = totals();
    if (id === 'ceiling' && t.ceil > 0) return { qty:t.ceil, locked:true };
    if (id === 'woodwork' && t.wood > 0) return { qty:t.wood, locked:true };
    if (id === 'prep') return { qty:t.walls, locked:true };
    return { qty: num(state.qty[id]), locked:false };
  }
  function activeExtras(){ return EXTRAS.filter(function(x){ return x.svcs.indexOf(state.service) > -1; }); }

  // ---------- Estimate ----------
  function estimate(){
    var t = totals(), s = state.service, lines = [], missing = [];
    var rate = PR.rates && PR.rates[s];
    if (!isSet(rate)) missing.push(SVC[s].name + ' rate');
    var basePrice = isSet(rate) ? t.walls * rate : 0;
    lines.push({ label: SVC[s].name, q: fmtA(t.walls) + ' m² measured surface', v: isSet(rate) ? basePrice : null });
    var pp = PR.preparation && PR.preparation[state.condition];
    if (!isSet(pp)) missing.push('preparation charge');
    var prep = isSet(pp) ? basePrice * pp / 100 : 0;
    lines.push({ label:'Preparation', q: (CONDITIONS.find(function(c){ return c[0] === state.condition; }) || [,'—'])[1], v: isSet(pp) && isSet(rate) ? prep : null });
    var extrasTotal = 0, hasOther = false;
    activeExtras().forEach(function(x){
      if (!state.extras[x.id]) return;
      if (x.id === 'other'){ hasOther = true; return; }
      var q = extraQty(x.id).qty, r = PR.extras && PR.extras[x.key];
      if (!isSet(r)) missing.push(x.name.toLowerCase() + ' rate');
      var v = isSet(r) ? q * r : null; if (v != null) extrasTotal += v;
      lines.push({ label:x.name, q: x.unit ? fmtA(q) + ' ' + x.unit : 'Across ' + fmtA(q) + ' m²', v:v });
    });
    var labour = basePrice + prep + extrasTotal, mat = 0, matNote = '';
    var pol = PR.materials && PR.materials.policy;
    if (pol === 'included') matNote = 'Materials included in rates';
    else if (pol === 'separate') matNote = 'Materials quoted separately';
    else if (pol === 'percentage'){ if (isSet(PR.materials.percentage)){ mat = labour * PR.materials.percentage / 100; lines.push({ label:'Materials', q: PR.materials.percentage + '% allowance', v:mat }); } else missing.push('materials percentage'); }
    else missing.push('materials policy');
    if (!isSet(PR.minimumCharge)) missing.push('minimum project charge');
    var ra = PR.rangeAllowance || {};
    if (!isSet(ra.low) || !isSet(ra.high)) missing.push('estimate range allowance');
    if (missing.length) return { ok:false, missing:missing, lines:lines, hasOther:hasOther };
    var total = labour + mat, minApplied = false;
    if (total < PR.minimumCharge){ total = PR.minimumCharge; minApplied = true; }
    var low = Math.max(PR.minimumCharge, total * (1 - ra.low / 100)), high = total * (1 + ra.high / 100);
    return { ok:true, low:low, high:high, total:total, lines:lines, matNote:matNote, minApplied:minApplied, hasOther:hasOther };
  }

  // ---------- Validation per step ----------
  function validate(step){
    if (step === 0) return state.service ? '' : 'Please choose a service to continue.';
    if (step === 1){
      if (!state.items.length) return 'Please add at least one ' + SVC[state.service].item.toLowerCase() + '.';
      var bad = state.items.some(function(it){ return Object.keys(calcItem(it).errors).length; });
      if (bad) return 'Please correct the highlighted measurements.';
      if (totals().walls <= 0) return 'Your measured area must be greater than zero.';
      return '';
    }
    if (step === 2) return state.condition ? '' : 'Please select the condition of the surfaces.';
    if (step === 3){
      var msg = '';
      activeExtras().forEach(function(x){
        if (msg || !state.extras[x.id]) return;
        if (x.id === 'other'){ if (!state.other.trim()) msg = 'Please describe your other requirements.'; return; }
        var q = extraQty(x.id);
        if (!q.locked){
          if (isNaN(q.qty) || q.qty <= 0 || q.qty > 10000) msg = 'Please enter a valid quantity for ' + x.name.toLowerCase() + '.';
          else if (x.integer && Math.floor(q.qty) !== q.qty) msg = 'Please enter a whole number of doors.';
        }
      });
      return msg;
    }
    return '';
  }

  // ---------- Rendering ----------
  root.innerHTML = '<aside class="qc-progress" aria-label="Progress"><p class="qc-mobile-progress"></p><ol></ol><div class="qc-bar"><span></span></div></aside><div class="qc-panel" tabindex="-1"></div>';
  if (DEMO) root.insertAdjacentHTML('afterbegin', '<div class="demo-banner" role="status"><b>Pricing demo mode.</b> Test values only — not real prices. Submissions are disabled. Remove <code>?pricing-demo=1</code> from the address to exit.</div>');
  var prog = root.querySelector('.qc-progress ol'), panel = root.querySelector('.qc-panel');

  function renderProgress(){
    prog.innerHTML = STEPS.map(function(n, i){
      var cls = i === state.step ? 'current' : (i <= state.maxStep ? 'done' : '');
      return '<li class="' + cls + '"><button type="button" data-goto="' + i + '"' + (i === state.step ? ' aria-current="step"' : '') + (cls === 'done' ? '' : ' tabindex="-1" aria-disabled="true"') + '><span class="dot">' + (i+1) + '</span><span>' + n + '</span></button></li>';
    }).join('');
    root.querySelector('.qc-bar span').style.width = (state.step / (STEPS.length - 1) * 100) + '%';
    root.querySelector('.qc-mobile-progress').textContent = 'Step ' + (state.step + 1) + ' of ' + STEPS.length + ' · ' + STEPS[state.step];
  }
  prog.addEventListener('click', function(e){
    var b = e.target.closest('[data-goto]'); if (!b) return;
    var i = +b.dataset.goto; if (i <= state.maxStep && i !== state.step){ go(i); }
  });

  function head(k, h, p){ return '<header><span class="step-k">Step ' + (k+1) + ' of 7</span><h2>' + h + '</h2>' + (p ? '<p>' + p + '</p>' : '') + '</header>'; }
  function nav(nextLabel){
    return '<div class="form-status is-error qc-error" role="alert" aria-live="assertive"></div><div class="qc-nav">' +
      (state.step > 0 ? '<button type="button" class="btn-back" data-back>← Back</button>' : '<span></span>') +
      '<button type="button" class="btn btn-dark" data-next>' + (nextLabel || 'Continue') + ' <span class="arr" aria-hidden="true"></span></button></div>';
  }

  var R = [];
  // Step 1 — service
  R[0] = function(){
    return head(0, 'Choose your service', 'Select the main type of work. You can add ceilings, woodwork and other extras later.') +
      '<fieldset style="border:0;padding:0;margin:0"><legend class="sr-only">Service</legend><div class="svc-opts">' +
      Object.keys(SVC).map(function(k, i){ return '<label class="svc-opt"><input type="radio" name="svc" value="' + k + '"' + (state.service === k ? ' checked' : '') + '><span class="box"><i>0' + (i+1) + '</i><b>' + SVC[k].name + '</b><small>' + SVC[k].desc + '</small></span></label>'; }).join('') +
      '</div></fieldset>' + nav();
  };
  // Step 2 — measure
  function itemHTML(it, idx){
    var s = SVC[state.service], c = calcItem(it), e = c.errors;
    function f(key, label, unit, val, extra){
      var id = 'm' + it.id + '-' + key;
      return '<div class="field"><label for="' + id + '">' + label + '</label><div class="unit"><input class="input" id="' + id + '" inputmode="decimal" data-k="' + key + '" value="' + esc(val) + '"' + (e[key] ? ' aria-invalid="true" aria-describedby="' + id + '-err"' : '') + (extra || '') + '><span>' + unit + '</span></div><span class="err" id="' + id + '-err">' + (e[key] && it._touched ? e[key] : '') + '</span></div>';
    }
    var html = '<div class="m-item" data-item="' + it.id + '"><div class="m-item-head"><input class="input" aria-label="Name for this ' + s.item.toLowerCase() + '" data-k="name" value="' + esc(it.name) + '" maxlength="40">' +
      (state.items.length > 1 ? '<button type="button" class="m-remove" data-remove="' + it.id + '">Remove</button>' : '') + '</div>';
    if (s.modes.length > 1) html += '<div class="seg" role="group" aria-label="How do you want to measure?">' + s.modes.map(function(m){ return '<button type="button" data-mode="' + m + '" aria-pressed="' + (it.mode === m) + '">' + (m === 'wall' && state.service === 'exterior' ? 'Width × height' : MODE_LABEL[m]) + '</button>'; }).join('') + '</div>';
    html += '<div class="m-fields">';
    if (it.mode === 'area') html += f('area', state.service === 'plastering' ? 'Area to plaster / repair' : 'Wall surface area', 'm²', it.area);
    else {
      if (it.mode === 'room'){ html += f('l', 'Room length', 'm', it.l) + f('w', 'Room width', 'm', it.w); }
      else html += f('w', state.service === 'exterior' ? 'Elevation width' : 'Wall width', 'm', it.w);
      html += f('h', it.mode === 'room' ? 'Wall height' : 'Height', 'm', it.h);
      html += f('open', 'Doors & windows to deduct', 'm²', it.open, ' placeholder="0"');
    }
    html += '</div>';
    html += '<div class="m-result" aria-live="polite"><span>' + (state.service === 'plastering' ? 'Surface area' : 'Wall area') + ':<b>' + (c.walls ? fmtA(c.walls) + ' m²' : '—') + '</b></span>' +
      (it.mode === 'room' && c.perim ? '<span>Room perimeter:<b>' + fmtA(c.perim) + ' m</b></span>' : '') + '</div>';
    if (s.ceiling){
      html += '<div class="m-extra"><label class="tog"><input type="checkbox" data-k="ceilOn"' + (it.ceilOn ? ' checked' : '') + '> ' + (state.service === 'plastering' ? 'Include the ceiling' : 'Add the ceiling (measured separately)') + '</label>';
      if (it.ceilOn) html += it.mode === 'room' ? '<p class="small muted" style="margin:8px 0 0">Ceiling area from room length × width: <b style="color:var(--green)">' + (c.ceil ? fmtA(c.ceil) + ' m²' : '—') + '</b></p>' : '<div class="m-fields">' + f('ceilArea', 'Ceiling area', 'm²', it.ceilArea) + '</div>';
      html += '</div>';
    }
    if (s.wood){
      html += '<div class="m-extra"><label class="tog"><input type="checkbox" data-k="woodOn"' + (it.woodOn ? ' checked' : '') + '> Add woodwork (measured separately)</label>';
      if (it.woodOn) html += '<div class="m-fields">' + f('woodLen', state.service === 'exterior' ? 'Fascias, soffits, trims' : 'Skirting & architraves', 'm', it.woodLen) + '</div>' + (it.mode === 'room' && c.perim ? '<p class="small muted" style="margin:8px 0 0">Tip: skirting length is roughly the room perimeter (' + fmtA(c.perim) + ' m) minus door openings.</p>' : '');
      html += '</div>';
    }
    return html + '</div>';
  }
  R[1] = function(){
    var s = SVC[state.service], t = totals();
    return head(1, 'Measure your project', 'Add each ' + s.item.toLowerCase() + ' separately. Use metres; decimals are fine (e.g. 2.4).') +
      '<details class="guide"' + (state.items.every(function(i){ return !i.w && !i.area; }) ? ' open' : '') + '><summary>How to measure correctly</summary><ul>' +
      '<li><b>Walls are not floor area.</b> A 4 × 3 m room has 12 m² of floor, but its walls are much larger.</li>' +
      '<li><b>Room dimensions:</b> measure the room\u2019s length, width and wall height. We calculate walls as perimeter × height.</li>' +
      '<span class="formula">Wall area = 2 × (length + width) × height − doors &amp; windows</span>' +
      '<li><b>Single wall:</b> width × height — ideal for feature walls and exterior elevations.</li>' +
      '<li><b>Deductions:</b> measure each door and window (width × height) and add them together. Leave at 0 if unsure.</li>' +
      (s.ceiling ? '<li><b>Ceilings</b> are measured separately — length × width of the room.</li>' : '') +
      (s.wood ? '<li><b>Woodwork</b> is measured in linear metres (the length of skirting, architrave or trim).</li>' : '') +
      '</ul></details>' +
      '<div data-items>' + state.items.map(itemHTML).join('') + '</div>' +
      '<button type="button" class="add-item" data-add>+ Add another ' + s.item.toLowerCase() + '</button>' +
      '<div class="m-total" aria-live="polite"><span>Total measured</span><b data-total>' + fmtA(t.walls) + ' m²' + (t.ceil ? ' <small style="font-size:16px;color:var(--gold)">+ ' + fmtA(t.ceil) + ' m² ceiling</small>' : '') + (t.wood ? ' <small style="font-size:16px;color:var(--gold)">+ ' + fmtA(t.wood) + ' m woodwork</small>' : '') + '</b></div>' + nav();
  };
  // Step 3 — condition
  R[2] = function(){
    return head(2, 'Surface condition', 'Choose the option that best describes most of the surfaces. Photos in step 5 help us confirm this.') +
      '<fieldset style="border:0;padding:0;margin:0"><legend class="sr-only">Surface condition</legend><div class="opt-list">' + CONDITIONS.map(function(c){
        return '<label class="opt"><input type="radio" name="cond" value="' + c[0] + '"' + (state.condition === c[0] ? ' checked' : '') + '><span class="box"><span class="tick"></span><span><b>' + c[1] + '</b><small>' + c[2] + '</small></span></span></label>';
      }).join('') + '</div></fieldset>' + nav();
  };
  // Step 4 — extras
  R[3] = function(){
    return head(3, 'Additional work', 'Select anything else you\u2019d like included. All optional.') +
      '<div class="opt-list">' + activeExtras().map(function(x){
        var q = extraQty(x.id), on = !!state.extras[x.id];
        if (q.locked && (x.id === 'ceiling' || x.id === 'woodwork')) on = state.extras[x.id] = true;
        var lockedMsg = q.locked && (x.id === 'ceiling' || x.id === 'woodwork');
        var h = '<label class="opt"><input type="checkbox" data-extra="' + x.id + '"' + (on ? ' checked' : '') + (lockedMsg ? ' disabled' : '') + '><span class="box"><span class="tick"></span><span><b>' + x.name + '</b><small>' + (lockedMsg ? 'Included from your measurements — ' + fmtA(q.qty) + ' ' + x.unit + '. Edit in step 2.' : x.desc) + '</small></span></span></label>';
        if (!lockedMsg && x.id !== 'prep'){
          h += '<div class="opt-qty"' + (on ? '' : ' hidden') + ' data-qty-for="' + x.id + '">';
          if (x.id === 'other') h += '<div class="field" style="grid-column:1/-1"><label for="q-other">Describe your other requirements</label><textarea class="input" id="q-other" data-other maxlength="1000" style="min-height:100px">' + esc(state.other) + '</textarea></div>';
          else {
            var pre = x.id === 'removal' && isNaN(num(state.qty.removal)) ? '' : (state.qty[x.id] || '');
            h += '<div class="field"><label for="q-' + x.id + '">Quantity</label><div class="unit"><input class="input" id="q-' + x.id + '" inputmode="' + (x.integer ? 'numeric' : 'decimal') + '" data-qty="' + x.id + '" value="' + esc(pre) + '"><span>' + x.unit + '</span></div></div>';
            if (x.id === 'removal') h += '<p class="hint">Your measured wall area is ' + fmtA(totals().walls) + ' m². Enter the area that currently has wallpaper.</p>';
            if (x.id === 'repairs') h += '<p class="hint">Estimate the total size of the damaged areas. Photos help us check this.</p>';
            if (x.id === 'doors') h += '<p class="hint">Count each door once — we include both faces and the frame.</p>';
          }
          h += '</div>';
        }
        return h;
      }).join('') + '</div>' + nav();
  };
  // Step 5 — photos
  R[4] = function(){
    return head(4, 'Upload photographs', 'Optional, but very helpful. Photos of the walls, any damage and the general space help us give an accurate quotation.') +
      '<div data-photo-slot></div><p class="small muted" style="margin-top:16px">Photos are resized and their location data removed on your device before upload, and are only used to assess your project.</p>' + nav();
  };
  // Step 6 — estimate
  R[5] = function(){
    var est = estimate(), t = totals();
    var h = head(5, 'Your estimated price', 'Based on the measurements and options you\u2019ve selected.');
    if (est.ok){
      h += '<div class="est"><span class="k">Initial estimate</span><p class="range">' + money(est.low) + '<span>to</span>' + money(est.high) + '</p><p>' + (est.matNote ? est.matNote + '. ' : '') + (PR.vatNote ? PR.vatNote + '. ' : '') + (est.minApplied ? 'Our minimum project charge applies. ' : '') + (est.hasOther ? 'Your other requirements will be priced in your quotation.' : '') + '</p></div>';
      h += '<table class="breakdown"><thead><tr><th scope="col">Included</th><th scope="col">Estimate</th></tr></thead><tbody>' + est.lines.map(function(l){ return '<tr><td>' + l.label + '<span class="q">' + esc(l.q) + '</span></td><td>' + money(l.v) + '</td></tr>'; }).join('') + '</tbody><tfoot><tr><td>Estimated total (before range allowance)</td><td>' + money(est.total) + '</td></tr></tfoot></table>';
    } else {
      h += '<div class="est pending"><span class="k">Personalised quotation</span><p class="range">We\u2019ll price this for you</p><p>Online pricing for this combination isn\u2019t available yet, so rather than show you an inaccurate figure, we\u2019ll prepare a personalised quotation from your measurements and photos.</p></div>';
      h += '<table class="breakdown"><thead><tr><th scope="col">Your project</th><th scope="col">Quantity</th></tr></thead><tbody>' + est.lines.map(function(l){ return '<tr><td>' + l.label + '</td><td>' + esc(l.q) + '</td></tr>'; }).join('') + (est.hasOther ? '<tr><td>Other requirements</td><td>Described</td></tr>' : '') + '</tbody></table>';
    }
    h += '<p class="disclaimer">This is an initial estimate based on the details provided. The final quotation may vary depending on the condition of the surfaces, preparation requirements, materials and project inspection.</p>';
    return h + nav('Request My Final Quote');
  };
  // Step 7 — details
  R[6] = function(){
    var c = state.contact, est = estimate(), n = uploader ? uploader.count() : 0;
    function fld(id, label, type, val, ac, extra){ return '<div class="field"><label for="qc-' + id + '">' + label + ' *</label><input class="input" id="qc-' + id + '" data-c="' + id + '" type="' + type + '" autocomplete="' + ac + '" value="' + esc(val) + '"' + (extra || '') + '><span class="err" id="qc-' + id + '-err"></span></div>'; }
    return head(6, 'Your details', 'So we can review your project and send your personalised quotation.') +
      '<dl class="summary-list"><dt>Service</dt><dd>' + SVC[state.service].name + '</dd><dt>Measured area</dt><dd>' + fmtA(totals().walls) + ' m²</dd><dt>Estimate</dt><dd>' + (est.ok ? money(est.low) + ' – ' + money(est.high) : 'Personalised quotation') + '</dd><dt>Photos</dt><dd>' + n + ' attached <button type="button" class="btn-link" style="font-size:11px;padding:0;margin-left:8px;border:0;background:none;cursor:pointer" data-goto-step="4">' + (n ? 'Edit' : 'Add photos') + '</button></dd></dl>' +
      '<form novalidate data-details><input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="form-grid">' +
      fld('name', 'Full name', 'text', c.name, 'name', ' maxlength="100"') + fld('email', 'Email address', 'email', c.email, 'email', ' maxlength="150"') +
      fld('phone', 'Phone number', 'tel', c.phone, 'tel', ' maxlength="30"') + fld('postcode', 'Property postcode', 'text', c.postcode, 'postal-code', ' maxlength="10" style="text-transform:uppercase"') +
      '<div class="field full"><span class="lbl" id="qc-method-l">Preferred contact method *</span><div class="choice-row" role="radiogroup" aria-labelledby="qc-method-l">' + ['Phone call','Email','WhatsApp'].map(function(m){ return '<label class="chip"><input type="radio" name="method" value="' + m + '"' + (c.method === m ? ' checked' : '') + '><span>' + m + '</span></label>'; }).join('') + '</div><span class="err" id="qc-method-err"></span></div>' +
      '<div class="field full"><label for="qc-desc">Project description *</label><textarea class="input" id="qc-desc" data-c="desc" maxlength="3000" placeholder="E.g. colours you have in mind, timings, access or parking, anything we should know.">' + esc(c.desc) + '</textarea><span class="err" id="qc-desc-err"></span></div>' +
      '<div class="field full" style="flex-direction:row;gap:12px;align-items:flex-start"><input type="checkbox" id="qc-consent" style="width:20px;height:20px;margin-top:3px;accent-color:#183139"' + (c.consent ? ' checked' : '') + '><label for="qc-consent" style="text-transform:none;letter-spacing:0;font-weight:400;font-size:14px;color:var(--muted)">I agree to Snow Property Solutions using these details to respond to my enquiry, as described in the <a href="' + base() + 'privacy-policy.html">Privacy Policy</a>. *</label></div><span class="err full" id="qc-consent-err"></span>' +
      '</div></form>' + nav('Request My Final Quote');
  };

  function render(focus){
    renderProgress();
    panel.innerHTML = R[state.step]();
    if (state.step === 4){
      panel.querySelector('[data-photo-slot]').appendChild(photoHost);
      if (!uploader) uploader = SPS.Uploader(photoHost.querySelector('.upload'), photoHost.querySelector('.thumbs'), photoHost.querySelector('[data-upload-err]'));
    }
    if (focus){
      var top = root.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior:'smooth' });
      var h2 = panel.querySelector('h2'); if (h2){ h2.setAttribute('tabindex','-1'); h2.focus({ preventScroll:true }); }
    }
  }
  function go(i){ state.step = i; state.maxStep = Math.max(state.maxStep, i); save(); render(true); }
  function showErr(msg){ var el = panel.querySelector('.qc-error'); if (el){ el.textContent = msg; } }

  // ---------- Events ----------
  panel.addEventListener('change', function(e){
    var t = e.target;
    if (t.name === 'svc'){
      if (state.service !== t.value){ state.service = t.value; state.items = [newItem(t.value, 1)]; state.extras = {}; state.qty = {}; state.maxStep = 0; }
      save(); showErr('');
    }
    if (t.name === 'cond'){ state.condition = t.value; save(); showErr(''); }
    if (t.dataset.extra){
      state.extras[t.dataset.extra] = t.checked; save();
      var q = panel.querySelector('[data-qty-for="' + t.dataset.extra + '"]'); if (q){ q.hidden = !t.checked; if (t.checked){ var inp = q.querySelector('input,textarea'); if (inp) inp.focus(); } }
    }
    if (t.name === 'method'){ state.contact.method = t.value; save(); }
    if (t.id === 'qc-consent'){ state.contact.consent = t.checked; save(); }
    var itEl = t.closest('[data-item]');
    if (itEl && (t.dataset.k === 'ceilOn' || t.dataset.k === 'woodOn')){
      var it = state.items.find(function(x){ return x.id === +itEl.dataset.item; });
      it[t.dataset.k] = t.checked; save(); rerenderItem(it);
    }
  });
  panel.addEventListener('input', function(e){
    var t = e.target, itEl = t.closest('[data-item]');
    if (itEl && t.dataset.k && t.type !== 'checkbox'){
      var it = state.items.find(function(x){ return x.id === +itEl.dataset.item; });
      it[t.dataset.k] = t.value; save();
      if (t.dataset.k !== 'name') updateItemReadout(it, itEl);
    }
    if (t.dataset.qty){ state.qty[t.dataset.qty] = t.value; save(); }
    if (t.hasAttribute('data-other')){ state.other = t.value; save(); }
    if (t.dataset.c){ state.contact[t.dataset.c] = t.value; save(); if (t.getAttribute('aria-invalid') === 'true') validateField(t.dataset.c); }
  });
  panel.addEventListener('focusout', function(e){
    var t = e.target, itEl = t.closest('[data-item]');
    if (itEl && t.dataset.k && t.dataset.k !== 'name'){ var it = state.items.find(function(x){ return x.id === +itEl.dataset.item; }); it._touched = true; updateItemReadout(it, itEl, true); }
  });
  function updateItemReadout(it, el, showErrors){
    var c = calcItem(it);
    el.querySelectorAll('[data-k]').forEach(function(inp){
      var k = inp.dataset.k, err = document.getElementById(inp.id + '-err');
      if (!err) return;
      var msg = c.errors[k] || '';
      if (showErrors || it._touched){ err.textContent = (inp.value !== '' || showErrors) ? msg : ''; }
      if (!msg){ err.textContent = ''; inp.removeAttribute('aria-invalid'); } else if (err.textContent){ inp.setAttribute('aria-invalid','true'); inp.setAttribute('aria-describedby', err.id); }
    });
    var res = el.querySelector('.m-result');
    res.innerHTML = '<span>' + (state.service === 'plastering' ? 'Surface area' : 'Wall area') + ':<b>' + (c.walls ? fmtA(c.walls) + ' m²' : '—') + '</b></span>' + (it.mode === 'room' && c.perim ? '<span>Room perimeter:<b>' + fmtA(c.perim) + ' m</b></span>' : '');
    var cp = el.querySelector('.m-extra p.small b'); if (cp && it.mode === 'room' && it.ceilOn) cp.textContent = c.ceil ? fmtA(c.ceil) + ' m²' : '—';
    var t = totals(), tot = panel.querySelector('[data-total]');
    if (tot) tot.innerHTML = fmtA(t.walls) + ' m²' + (t.ceil ? ' <small style="font-size:16px;color:var(--gold)">+ ' + fmtA(t.ceil) + ' m² ceiling</small>' : '') + (t.wood ? ' <small style="font-size:16px;color:var(--gold)">+ ' + fmtA(t.wood) + ' m woodwork</small>' : '');
  }
  function rerenderItem(it){
    var el = panel.querySelector('[data-item="' + it.id + '"]'); var idx = state.items.indexOf(it);
    var tmp = document.createElement('div'); tmp.innerHTML = itemHTML(it, idx); el.replaceWith(tmp.firstChild);
    updateItemReadout(it, panel.querySelector('[data-item="' + it.id + '"]'));
  }
  panel.addEventListener('click', function(e){
    var t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-next')) return next();
    if (t.hasAttribute('data-back')) return go(state.step - 1);
    if (t.dataset.gotoStep) return go(+t.dataset.gotoStep);
    if (t.hasAttribute('data-add')){
      var it = newItem(state.service, state.items.length + 1); state.items.push(it); save();
      var tmp = document.createElement('div'); tmp.innerHTML = itemHTML(it, state.items.length - 1);
      panel.querySelector('[data-items]').appendChild(tmp.firstChild);
      panel.querySelectorAll('[data-item]').forEach(function(el){ var i = state.items.find(function(x){ return x.id === +el.dataset.item; }); if (state.items.length === 2) rerenderItem(i); });
      var last = panel.querySelector('[data-item="' + it.id + '"] .m-fields input'); if (last) last.focus();
      return;
    }
    if (t.dataset.remove){
      state.items = state.items.filter(function(x){ return x.id !== +t.dataset.remove; }); save(); render(); return;
    }
    if (t.dataset.mode){
      var el = t.closest('[data-item]'); var item = state.items.find(function(x){ return x.id === +el.dataset.item; });
      item.mode = t.dataset.mode; item._touched = false; save(); rerenderItem(item);
      var f = panel.querySelector('[data-item="' + item.id + '"] [data-mode="' + item.mode + '"]'); if (f) f.focus();
    }
  });

  var CRULES = { name:'name', email:'email', phone:'phone', postcode:'postcode', desc:'message' };
  function validateField(k){ var el = document.getElementById('qc-' + k); return SPS.setErr(el, SPS.V[CRULES[k]](el.value)); }

  function next(){
    if (state.step === 1) state.items.forEach(function(it){ it._touched = true; });
    var msg = validate(state.step);
    if (msg){
      showErr(msg);
      if (state.step === 1){ panel.querySelectorAll('[data-item]').forEach(function(el){ var it = state.items.find(function(x){ return x.id === +el.dataset.item; }); updateItemReadout(it, el, true); }); var bad = panel.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); }
      return;
    }
    if (state.step < 6) return go(state.step + 1);
    submitQuote();
  }

  function submitQuote(){
    var ok = true, first = null;
    Object.keys(CRULES).forEach(function(k){ if (!validateField(k)){ ok = false; first = first || document.getElementById('qc-' + k); } });
    var mErr = document.getElementById('qc-method-err');
    if (!state.contact.method){ ok = false; mErr.textContent = 'Please choose how you\u2019d like us to contact you.'; first = first || panel.querySelector('[name=method]'); } else mErr.textContent = '';
    var cErr = document.getElementById('qc-consent-err');
    if (!document.getElementById('qc-consent').checked){ ok = false; cErr.textContent = 'Please confirm you agree so we can respond to your enquiry.'; first = first || document.getElementById('qc-consent'); } else cErr.textContent = '';
    for (var s = 0; s < 4; s++){ var m = validate(s); if (m){ showErr('Step ' + (s+1) + ': ' + m); return; } }
    if (!ok){ showErr('Please complete the highlighted fields.'); first.focus(); return; }
    var hp = panel.querySelector('[name=_honey]'); if (hp && hp.value) return;
    if (DEMO){ showErr('Submissions are disabled in pricing demo mode.'); return; }

    var est = estimate(), t = totals(), c = state.contact;
    var measure = state.items.map(function(it){
      var r = calcItem(it), d = it.mode === 'area' ? it.area + ' m² (entered)' : it.mode === 'room' ? it.l + ' × ' + it.w + ' m room, ' + it.h + ' m high, −' + (it.open || 0) + ' m²' : it.w + ' m wide × ' + it.h + ' m high, −' + (it.open || 0) + ' m²';
      return it.name + ': ' + fmtA(r.walls) + ' m² [' + d + ']' + (r.ceil ? '; ceiling ' + fmtA(r.ceil) + ' m²' : '') + (r.wood ? '; woodwork ' + fmtA(r.wood) + ' m' : '');
    }).join('\n');
    var extras = activeExtras().filter(function(x){ return state.extras[x.id]; }).map(function(x){ if (x.id === 'other') return 'Other: ' + state.other.trim(); var q = extraQty(x.id).qty; return x.name + (x.unit ? ': ' + fmtA(q) + ' ' + x.unit : ''); }).join('\n') || 'None';
    var fields = {
      'Enquiry type': 'Instant quote calculator',
      'Name': c.name.trim(), 'Email': c.email.trim(), 'Phone': c.phone.trim(), 'Postcode': SPS.normPostcode(c.postcode),
      'Preferred contact': c.method, 'Service': SVC[state.service].name,
      'Total measured area': fmtA(t.walls) + ' m²' + (t.ceil ? ' + ' + fmtA(t.ceil) + ' m² ceiling' : '') + (t.wood ? ' + ' + fmtA(t.wood) + ' m woodwork' : ''),
      'Measurements': measure,
      'Surface condition': (CONDITIONS.find(function(x){ return x[0] === state.condition; }) || [])[1],
      'Additional work': extras,
      'Online estimate': est.ok ? money(est.low) + ' – ' + money(est.high) : 'Not shown — pricing not configured; personalised quotation requested',
      'Project description': c.desc.trim(),
      'Photos attached': String(uploader ? uploader.count() : 0),
      _replyto: c.email.trim()
    };
    var btn = panel.querySelector('[data-next]'); btn.disabled = true; var label = btn.innerHTML; btn.textContent = 'Sending your enquiry…';
    showErr('');
    SPS.submit(fields, uploader ? uploader.files() : [], 'New quote request — ' + fields.Service + ' — ' + fields.Name)
      .then(function(){
        try { sessionStorage.removeItem(KEY); } catch(e){}
        root.querySelector('.qc-progress').remove();
        root.style.gridTemplateColumns = '1fr';
        panel.innerHTML = '<div class="success-panel" style="border:0;padding:0"><div class="mark" aria-hidden="true"></div><h2 tabindex="-1">Enquiry received</h2><p class="lead" style="color:var(--charcoal)">Thank you for choosing Snow Property Solutions. Your project enquiry has been received. We will review your requirements and contact you about the next steps.</p><div class="btn-row" style="margin-top:28px"><a class="btn btn-dark" href="' + base() + 'our-projects.html">View Our Projects <span class="arr" aria-hidden="true"></span></a><a class="btn btn-outline" href="' + base() + 'index.html">Back to Home</a></div></div>';
        panel.querySelector('h2').focus();
      })
      .catch(function(err){
        btn.disabled = false; btn.innerHTML = label;
        showErr('Sorry, your enquiry was not sent. ' + err.message + ' Your answers are saved — please try again, or call 07407 072094.');
      });
  }

  if (!state.service) state.step = 0;
  render(false);
})();
