/* Portfolio filtering */
(function(){
  var btns = document.querySelectorAll('[data-filter]');
  var tiles = document.querySelectorAll('.portfolio .proj');
  var empty = document.querySelector('[data-empty]');
  function apply(f){
    var n = 0;
    tiles.forEach(function(t){ var show = f === 'all' || t.dataset.cat === f; t.hidden = !show; if (show){ n++; t.classList.add('in'); } });
    if (empty) empty.hidden = n > 0;
    btns.forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.filter === f)); });
    try { history.replaceState(null, '', f === 'all' ? location.pathname : location.pathname + '#' + f); } catch(e){}
  }
  btns.forEach(function(b){ b.addEventListener('click', function(){ apply(b.dataset.filter); }); });
  var h = location.hash.slice(1);
  if (h && document.querySelector('[data-filter="'+h+'"]')) apply(h);
})();
