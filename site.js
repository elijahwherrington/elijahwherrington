(function () {
  // mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // crossfade carousels
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.carousel').forEach(function (c, ci) {
    var imgs = c.querySelectorAll('img');
    var dots = c.parentElement.querySelectorAll('.carousel-dots i');
    if (imgs.length < 2) return;
    var i = 0;
    function show(n) {
      imgs[i].classList.remove('on'); if (dots[i]) dots[i].classList.remove('on');
      i = n % imgs.length;
      imgs[i].classList.add('on'); if (dots[i]) dots[i].classList.add('on');
    }
    if (!reduce) setTimeout(function () { setInterval(function () { show(i + 1); }, 3600); }, ci * 900);
  });

  // lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (items.length) {
    var box = document.createElement('div');
    box.className = 'lightbox'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML = '<button class="mini x" type="button" id="lb-close">Close ✕</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);
    var bImg = box.querySelector('img'), bCap = box.querySelector('figcaption'), cur = 0, lastFocus = null;
    function open(n) {
      cur = (n + items.length) % items.length;
      var fig = items[cur], img = fig.querySelector('img'), cap = fig.querySelector('figcaption');
      bImg.src = img.src; bImg.alt = img.alt; bCap.textContent = cap ? cap.textContent : '';
      if (box.hidden) { lastFocus = document.activeElement; box.hidden = false; box.querySelector('.x').focus(); }
    }
    function close() { box.hidden = true; if (lastFocus) lastFocus.focus(); }
    items.forEach(function (fig, n) {
      var b = fig.querySelector('button');
      if (b) b.addEventListener('click', function () { open(n); });
    });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.x')) close(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') open(cur + 1);
      if (e.key === 'ArrowLeft') open(cur - 1);
    });
  }

  // copy email
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () { var t = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = t; }, 1600); };
      var fallback = function () {
        var el = document.getElementById(b.getAttribute('data-target'));
        if (!el) return;
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        b.textContent = 'Selected — press copy';
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
      } catch (e) { fallback(); }
    });
  });

  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();
})();
