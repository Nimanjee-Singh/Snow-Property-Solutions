/* =========================================================
   Shared form utilities: validation, secure photo handling,
   enquiry submission.
   ---------------------------------------------------------
   ENQUIRY DELIVERY
   provider 'formsubmit' – posts to FormSubmit.co, which emails the
     business inbox (the service the original site already used).
     The FIRST submission triggers a one-time activation email to
     the inbox; the owner must click it before enquiries arrive.
   provider 'api' – posts JSON to the Vercel serverless function
     /api/enquiry (server-side validation + Resend email). Requires
     RESEND_API_KEY and ENQUIRY_TO environment variables in Vercel.
   ========================================================= */
window.SPS_FORMS = window.SPS_FORMS || {
  provider: 'formsubmit',
  formsubmitEmail: 'nimanjee1@gmail.com',
  apiEndpoint: '/api/enquiry',
  timeoutMs: 30000
};

window.SPS = (function(){
  'use strict';
  var ALLOWED = ['image/jpeg','image/png','image/webp'];
  var MAX_INPUT_BYTES = 15 * 1024 * 1024; // per original file
  var MAX_FILES = 5;
  var OUT_MAX_DIM = 1600;

  var V = {
    name: function(v){ v = v.trim(); return v.length < 2 ? 'Please enter your full name.' : (v.length > 100 ? 'Name is too long.' : ''); },
    email: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
    phone: function(v){ var d = v.replace(/[^\d+]/g,''); return /^(\+44|0044|0)\d{9,10}$/.test(d) ? '' : 'Please enter a valid UK phone number.'; },
    postcode: function(v){ return /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i.test(v.trim()) ? '' : 'Please enter a valid UK postcode, e.g. SW1A 1AA.'; },
    required: function(v){ return v.trim() ? '' : 'This field is required.'; },
    message: function(v){ v = v.trim(); return v.length < 10 ? 'Please tell us a little more (at least 10 characters).' : (v.length > 3000 ? 'Please keep your message under 3,000 characters.' : ''); }
  };
  function normPostcode(v){ var m = v.trim().toUpperCase().replace(/\s+/g,'').match(/^(.+)(\d[A-Z]{2})$/); return m ? m[1] + ' ' + m[2] : v.trim().toUpperCase(); }

  function setErr(input, msg){
    var errEl = document.getElementById(input.id + '-err');
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errEl){ errEl.textContent = msg; if (msg) input.setAttribute('aria-describedby', errEl.id); }
    return !msg;
  }

  // ---------- Secure photo uploader ----------
  // Validates type & size, decodes the image (rejecting anything that isn't a real image),
  // re-encodes to JPEG on a canvas (which strips EXIF / GPS metadata) and limits dimensions.
  function Uploader(root, thumbs, errEl){
    var files = []; var input = root.querySelector('input[type=file]');
    function err(m){ if (errEl) errEl.textContent = m || ''; }
    function render(){
      thumbs.innerHTML = '';
      files.forEach(function(f, i){
        var d = document.createElement('div'); d.className = 'thumb';
        var im = document.createElement('img'); im.src = f.url; im.alt = 'Uploaded photo ' + (i+1);
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label','Remove photo ' + (i+1)); b.textContent = '×';
        b.addEventListener('click', function(){ URL.revokeObjectURL(f.url); files.splice(i,1); render(); });
        var s = document.createElement('small'); s.textContent = f.name;
        d.append(im, b, s); thumbs.appendChild(d);
      });
    }
    function process(file){
      return new Promise(function(resolve, reject){
        var ext = (file.name.split('.').pop() || '').toLowerCase();
        if (ALLOWED.indexOf(file.type) === -1 || ['jpg','jpeg','png','webp'].indexOf(ext) === -1) return reject(file.name + ': only JPG, PNG or WebP images are accepted.');
        if (file.size > MAX_INPUT_BYTES) return reject(file.name + ': file is larger than 15 MB.');
        var url = URL.createObjectURL(file); var im = new Image();
        im.onload = function(){
          var s = Math.min(1, OUT_MAX_DIM / Math.max(im.naturalWidth, im.naturalHeight));
          var c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth*s); c.height = Math.round(im.naturalHeight*s);
          var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height); ctx.drawImage(im,0,0,c.width,c.height);
          URL.revokeObjectURL(url);
          c.toBlob(function(blob){
            if (!blob) return reject(file.name + ': could not be processed.');
            var safe = file.name.replace(/\.[^.]+$/,'').replace(/[^\w\- ]+/g,'').slice(0,40) || 'photo';
            resolve({ blob: blob, name: safe + '.jpg', url: URL.createObjectURL(blob) });
          }, 'image/jpeg', 0.82);
        };
        im.onerror = function(){ URL.revokeObjectURL(url); reject(file.name + ': this file is not a readable image.'); };
        im.src = url;
      });
    }
    function add(list){
      err('');
      var arr = Array.prototype.slice.call(list);
      if (files.length + arr.length > MAX_FILES){ err('You can upload up to ' + MAX_FILES + ' photos.'); arr = arr.slice(0, Math.max(0, MAX_FILES - files.length)); }
      var errors = [];
      return Promise.all(arr.map(function(f){ return process(f).then(function(r){ files.push(r); }, function(m){ errors.push(m); }); }))
        .then(function(){ if (errors.length) err(errors.join(' ')); render(); });
    }
    input.addEventListener('change', function(){ add(input.files); input.value = ''; });
    ['dragenter','dragover'].forEach(function(t){ root.addEventListener(t, function(e){ e.preventDefault(); root.classList.add('drag'); }); });
    ['dragleave','drop'].forEach(function(t){ root.addEventListener(t, function(){ root.classList.remove('drag'); }); });
    root.addEventListener('drop', function(e){ e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files) add(e.dataTransfer.files); });
    return { files: function(){ return files; }, count: function(){ return files.length; } };
  }

  function blobToBase64(blob){
    return new Promise(function(res, rej){ var r = new FileReader(); r.onload = function(){ res(String(r.result).split(',')[1]); }; r.onerror = rej; r.readAsDataURL(blob); });
  }

  // ---------- Submission ----------
  // Resolves ONLY when the delivery service confirms success.
  function submit(fields, photos, subject){
    var cfg = window.SPS_FORMS;
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function(){ ctrl.abort(); }, cfg.timeoutMs) : null;
    var done = function(){ if (timer) clearTimeout(timer); };

    if (cfg.provider === 'api'){
      return Promise.all((photos||[]).map(function(p){ return blobToBase64(p.blob).then(function(b){ return { filename: p.name, content: b }; }); }))
        .then(function(att){
          return fetch(cfg.apiEndpoint, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
            body: JSON.stringify({ subject: subject, fields: fields, photos: att }), signal: ctrl && ctrl.signal });
        })
        .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ done(); if (!r.ok || !j.ok) throw new Error(j.error || 'The enquiry could not be sent.'); return j; }); })
        .catch(function(e){ done(); throw normalise(e); });
    }

    var fd = new FormData();
    fd.append('_subject', subject);
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');
    Object.keys(fields).forEach(function(k){ fd.append(k, fields[k]); });
    (photos||[]).forEach(function(p, i){ fd.append(i === 0 ? 'attachment' : 'attachment' + (i+1), p.blob, p.name); });
    return fetch('https://formsubmit.co/ajax/' + encodeURIComponent(cfg.formsubmitEmail), { method:'POST', headers:{ 'Accept':'application/json' }, body: fd, signal: ctrl && ctrl.signal })
      .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){
        done();
        var ok = r.ok && (j.success === true || j.success === 'true');
        if (!ok) throw new Error(j.message || 'The enquiry could not be sent.');
        return j;
      }); })
      .catch(function(e){ done(); throw normalise(e); });
  }
  function normalise(e){
    if (e && e.name === 'AbortError') return new Error('The request timed out. Please check your connection and try again.');
    if (e && /Failed to fetch|NetworkError|Load failed/i.test(e.message)) return new Error('We couldn\u2019t reach our enquiry service. Please check your connection and try again.');
    return e instanceof Error ? e : new Error('Something went wrong.');
  }

  return { V: V, setErr: setErr, Uploader: Uploader, submit: submit, normPostcode: normPostcode };
})();
