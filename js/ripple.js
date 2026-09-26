/* Galina Korshunova — cursor particle trail.
   A simple grey particle system spawns from the cursor as it moves and
   drifts/fades out, rendered on a single overlay canvas. Page content
   (text, images, layout) is never touched.
   Desktop only (fine pointer + hover), and skipped for reduced-motion users. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (!window.CanvasRenderingContext2D) return;

  var MAX_PARTICLES = 800;
  var SPAWN_PER_MOVE = 9;

  var overlay = document.createElement('canvas');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9999;';
  document.body.appendChild(overlay);
  var ctx = overlay.getContext('2d');

  function sizeOverlay() {
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
  }
  sizeOverlay();
  window.addEventListener('resize', sizeOverlay, { passive: true });

  var particles = [];

  function spawn(x, y) {
    for (var i = 0; i < SPAWN_PER_MOVE; i++) {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      var angle = Math.random() * Math.PI * 2;
      var speed = 0.3 + Math.random() * 0.9;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15,
        size: 1 + Math.random() * 2.2,
        life: 1,
        decay: 0.012 + Math.random() * 0.016,
        r: 210 + Math.floor(Math.random() * 40),
        g: 30 + Math.floor(Math.random() * 30),
        b: 40 + Math.floor(Math.random() * 30)
      });
    }
  }

  var prevX = -1, prevY = -1;
  window.addEventListener('mousemove', function (e) {
    var dx = prevX < 0 ? 0 : e.clientX - prevX;
    var dy = prevY < 0 ? 0 : e.clientY - prevY;
    if (prevX < 0 || Math.sqrt(dx * dx + dy * dy) > 3) {
      spawn(e.clientX, e.clientY);
      prevX = e.clientX;
      prevY = e.clientY;
    }
  }, { passive: true });

  function step() {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function render() {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var alpha = Math.max(0, p.life) * 0.55;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + alpha + ')';
      ctx.fill();
    }
  }

  function loop() {
    step();
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
