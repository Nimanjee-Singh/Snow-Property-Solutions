/* Snow Property Solutions — global behaviour (header, nav, accordion, reveal, lightbox) */
(function(){
  'use strict';
  var body = document.body;

  // Year
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  // Header scroll state
  function onScroll(){
    var y = window.scrollY;
    body.classList.toggle('scrolled', y > 40);
    var f = document.querySelector('.float-cta');
    if (f){
      var show = y > 700;
      f.classList.toggle('show', show);
      f.setAttribute('aria-hidden', String(!show));
      f.querySelectorAll('a').forEach(function(a){ a.tabIndex = show ? 0 : -1; });
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  function setMenu(open){
    body.classList.toggle('menu-open', open);
    if (toggle){ toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  }
  if (toggle) toggle.addEventListener('click', function(){ setMenu(!body.classList.contains('menu-open')); });
  document.querySelectorAll('.m-sub-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var li = btn.closest('li'); var open = !li.classList.contains('m-open');
      li.classList.toggle('m-open', open); btn.setAttribute('aria-expanded', String(open));
    });
  });
  window.addEventListener('resize', function(){ if (window.innerWidth > 1180) setMenu(false); });

  // Desktop dropdown (click + keyboard support; hover handled by CSS)
  document.querySelectorAll('.dd').forEach(function(dd){
    var btn = dd.querySelector('button');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      dd.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open));
    });
    dd.addEventListener('mouseenter', function(){ btn.setAttribute('aria-expanded','true'); });
    dd.addEventListener('mouseleave', function(){ if (!dd.classList.contains('open')) btn.setAttribute('aria-expanded','false'); });
  });
  document.addEventListener('click', function(){ document.querySelectorAll('.dd.open').forEach(function(dd){ dd.classList.remove('open'); dd.querySelector('button').setAttribute('aria-expanded','false'); }); });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){
      setMenu(false);
      document.querySelectorAll('.dd.open').forEach(function(dd){ dd.classList.remove('open'); dd.querySelector('button').setAttribute('aria-expanded','false'); dd.querySelector('button').focus(); });
      closeLightbox();
    }
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.closest('.faq-item'); var open = !item.classList.contains('open');
      item.classList.toggle('open', open); q.setAttribute('aria-expanded', String(open));
    });
  });

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else revealEls.forEach(function(el){ el.classList.add('in'); });

  // Lightbox
  var lb = document.querySelector('.lightbox'), items = [], idx = 0, lastFocus = null;
  function visibleItems(){ return Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]')).filter(function(b){ return !b.closest('[hidden]'); }); }
  function show(i){
    items = visibleItems(); if (!items.length) return;
    idx = (i + items.length) % items.length;
    var b = items[idx], im = lb.querySelector('img');
    im.src = b.dataset.src; im.alt = b.querySelector('img').alt;
    lb.querySelector('figcaption').innerHTML = '';
    var t = document.createElement('span'); t.textContent = b.dataset.title;
    var s = document.createElement('small'); s.textContent = b.dataset.catName;
    lb.querySelector('figcaption').append(t, s);
  }
  function openLightbox(btn){
    if (!lb) return; lastFocus = btn;
    items = visibleItems(); show(items.indexOf(btn));
    lb.hidden = false; lb.classList.add('open'); body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function closeLightbox(){
    if (!lb || lb.hidden) return;
    lb.classList.remove('open'); lb.hidden = true; body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (lb){
    document.addEventListener('click', function(e){ var b = e.target.closest('[data-lightbox]'); if (b){ e.preventDefault(); openLightbox(b); } });
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', function(){ show(idx-1); });
    lb.querySelector('.lb-next').addEventListener('click', function(){ show(idx+1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function(e){
      if (lb.hidden) return;
      if (e.key === 'ArrowLeft') show(idx-1);
      if (e.key === 'ArrowRight') show(idx+1);
      if (e.key === 'Tab'){ // focus trap
        var f = lb.querySelectorAll('button'); var first = f[0], last = f[f.length-1];
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    });
  }
})();
