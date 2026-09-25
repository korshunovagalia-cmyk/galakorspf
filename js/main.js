/* Galina Korshunova — scroll reveal + mobile navigation. No dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- reveal on scroll ------------------------------------------------ */
  var targets = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add('is-in');
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
  }

  /* --- scroll-linked marquee -------------------------------------------- */
  var tracks = document.querySelectorAll('[data-marquee-track]');

  if (tracks.length && !reduced) {
    var state = Array.prototype.map.call(tracks, function (track) {
      return { track: track, section: track.closest('.marquee-section'), max: 0 };
    });

    var measure = function () {
      state.forEach(function (s) {
        s.max = Math.max(0, s.track.scrollWidth - s.section.clientWidth);
      });
    };

    var apply = function () {
      var vh = window.innerHeight;
      state.forEach(function (s) {
        var rect = s.section.getBoundingClientRect();
        var progress = (vh - rect.top) / (vh + rect.height);
        progress = Math.min(1, Math.max(0, progress));
        s.track.style.transform = 'translateX(-' + (progress * s.max) + 'px)';
      });
      ticking = false;
    };

    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    };

    measure();
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); apply(); });
  }

  /* --- mobile navigation ----------------------------------------------- */
  var toggle = document.querySelector('.nav__toggle');
  var overlay = document.querySelector('.nav__overlay');
  if (!toggle || !overlay) return;

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });

  overlay.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setOpen(false);
  });
})();
