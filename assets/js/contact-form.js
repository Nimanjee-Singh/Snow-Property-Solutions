/* Contact form */
(function(){
  var form = document.getElementById('contact-form'); if (!form) return;
  var up = SPS.Uploader(form.querySelector('[data-upload="cf"]'), form.querySelector('[data-thumbs="cf"]'), form.querySelector('[data-upload-err="cf"]'));
  var status = form.querySelector('.form-status');
  var btn = form.querySelector('button[type=submit]');
  var rules = { 'cf-name':'name', 'cf-email':'email', 'cf-phone':'phone', 'cf-postcode':'postcode', 'cf-service':'required', 'cf-message':'message' };

  function check(id){ var el = document.getElementById(id); return SPS.setErr(el, SPS.V[rules[id]](el.value)); }
  Object.keys(rules).forEach(function(id){
    var el = document.getElementById(id);
    el.addEventListener('blur', function(){ if (el.value) check(id); });
    el.addEventListener('input', function(){ if (el.getAttribute('aria-invalid') === 'true') check(id); });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    status.className = 'form-status full'; status.textContent = '';
    var ok = true, first = null;
    Object.keys(rules).forEach(function(id){ if (!check(id)){ ok = false; first = first || document.getElementById(id); } });
    var consent = document.getElementById('cf-consent');
    var cErr = document.getElementById('cf-consent-err');
    if (!consent.checked){ ok = false; cErr.textContent = 'Please confirm you agree so we can respond to your enquiry.'; first = first || consent; } else cErr.textContent = '';
    if (!ok){ first.focus(); return; }
    if (form._honey.value) return; // bot

    var f = form.elements;
    var fields = {
      'Enquiry type': 'Contact form',
      'Name': f.name.value.trim(), 'Email': f.email.value.trim(), 'Phone': f.phone.value.trim(),
      'Postcode': SPS.normPostcode(f.postcode.value), 'Service': f.service.value,
      'Message': f.message.value.trim(), 'Photos attached': String(up.count()),
      _replyto: f.email.value.trim()
    };
    btn.disabled = true; var label = btn.innerHTML; btn.textContent = 'Sending…';
    SPS.submit(fields, up.files(), 'New website enquiry — ' + fields.Service + ' — ' + fields.Name)
      .then(function(){
        form.hidden = true;
        var s = document.getElementById('contact-success'); s.hidden = false; s.focus();
      })
      .catch(function(err){
        status.className = 'form-status full is-error';
        status.innerHTML = '';
        status.append(document.createTextNode('Sorry, your enquiry was not sent. ' + err.message + ' You can also call 07407 072094 or email nimanjee1@gmail.com.'));
      })
      .finally(function(){ btn.disabled = false; btn.innerHTML = label; });
  });
})();
