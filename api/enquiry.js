// =========================================================
// Vercel serverless function — secure server-side enquiry handler
// POST /api/enquiry   (JSON: { subject, fields, photos:[{filename, content(base64)}] })
//
// To enable: set in Vercel → Project → Settings → Environment Variables
//   RESEND_API_KEY   – API key from https://resend.com
//   ENQUIRY_TO       – business inbox, e.g. nimanjee1@gmail.com
//   ENQUIRY_FROM     – verified sender, e.g. "Snow Property Solutions <enquiries@yourdomain.co.uk>"
// then set SPS_FORMS.provider = 'api' in assets/js/forms.js.
// =========================================================
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;     // after client-side compression
const MAX_BODY_FIELD = 4000;
const hits = new Map();                       // naive per-instance rate limit

function clean(v){ return String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, MAX_BODY_FIELD).trim(); }
function escHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function isJpegOrPng(buf){
  return (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) ||                // JPEG
         (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) || // PNG
         (buf.slice(0,4).toString() === 'RIFF' && buf.slice(8,12).toString() === 'WEBP');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown';
  const now = Date.now(), recent = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return res.status(429).json({ ok:false, error:'Too many requests. Please try again later.' });
  hits.set(ip, [...recent, now]);

  const { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) return res.status(503).json({ ok:false, error:'Enquiry service is not configured.' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const f = body.fields || {};
  const name = clean(f.Name), email = clean(f.Email), phone = clean(f.Phone), postcode = clean(f.Postcode);
  if (name.length < 2) return res.status(400).json({ ok:false, error:'Please enter your name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ ok:false, error:'Please enter a valid email.' });
  if (!/^(\+44|0044|0)\d{9,10}$/.test(phone.replace(/[^\d+]/g,''))) return res.status(400).json({ ok:false, error:'Please enter a valid UK phone number.' });
  if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode)) return res.status(400).json({ ok:false, error:'Please enter a valid UK postcode.' });

  const photos = Array.isArray(body.photos) ? body.photos.slice(0, MAX_PHOTOS) : [];
  const attachments = [];
  for (const [i, p] of photos.entries()){
    const buf = Buffer.from(String(p.content || ''), 'base64');
    if (!buf.length || buf.length > MAX_PHOTO_BYTES || !isJpegOrPng(buf)) return res.status(400).json({ ok:false, error:'One of the photos is not a valid image.' });
    attachments.push({ filename: `project-photo-${i + 1}.jpg`, content: buf.toString('base64') });
  }

  const rows = Object.entries(f).filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => `<tr><th align="left" style="padding:6px 12px;background:#F5F2EC;vertical-align:top">${escHtml(clean(k))}</th><td style="padding:6px 12px;white-space:pre-wrap">${escHtml(clean(v))}</td></tr>`).join('');

  const r = await fetch('https://api.resend.com/emails', {
    method:'POST',
    headers:{ Authorization:`Bearer ${RESEND_API_KEY}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ from: ENQUIRY_FROM, to: [ENQUIRY_TO], reply_to: email,
      subject: clean(body.subject).slice(0, 150) || 'New website enquiry',
      html: `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`, attachments })
  });
  if (!r.ok) return res.status(502).json({ ok:false, error:'The enquiry could not be delivered.' });
  return res.status(200).json({ ok:true });
};
