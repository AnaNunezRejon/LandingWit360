/* ============================================
   WIT Creativo — Landing KIT GEO eCongress
   JavaScript: GSAP + Three.js + Lenis
   Chrome / Firefox / Safari compatible
   ============================================ */

// Verificar que todas las librerias esten cargadas
if (typeof gsap === 'undefined') {
  console.error('[WIT] GSAP no se cargo. Verifica la conexion a internet y el CDN.');
}
if (typeof ScrollTrigger === 'undefined') {
  console.error('[WIT] ScrollTrigger no se cargo.');
} else {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof Lenis === 'undefined') {
  console.warn('[WIT] Lenis no se cargo. El smooth scroll no funcionara.');
}
if (typeof THREE === 'undefined') {
  console.warn('[WIT] Three.js no se cargo. Las animaciones 3D no funcionaran.');
}

/* ========== UTILIDAD: Safe Init ========== */
function safeInit(name, fn) {
  try {
    fn();
  } catch (e) {
    console.warn('[WIT] Error en ' + name + ':', e.message);
  }
}

/* ========== LENIS ========== */
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1.2,
    smoothWheel: true
  });
  // Integracion moderna con GSAP (compatible Chrome/Firefox)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(time) {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* ========== SCROLL TO TOP ========== */
function initScrollToTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  ScrollTrigger.create({
    start: 400,
    onUpdate: function(self) {
      btn.classList.toggle('visible', self.scroll() > 400);
    }
  });
  btn.addEventListener('click', function() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========== CUSTOM CURSOR ========== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  var cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', function(e) {
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });
  function updateCursor() {
    cx += (tx - cx) * 0.35;
    cy += (ty - cy) * 0.35;
    cursor.style.transform = 'translate(' + (cx - cursor.offsetWidth / 2) + 'px, ' + (cy - cursor.offsetHeight / 2) + 'px)';
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);
  function addHover() {
    document.querySelectorAll('a, button, .carousel-btn, .carousel-card, .flip-card, .scroll-top, .form-btn, .kit-geo-btn').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        if (!cursor.classList.contains('hero-hover') && !cursor.classList.contains('title-hover'))
          cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', function() {
        cursor.classList.remove('hover');
      });
    });
  }
  addHover();
  new MutationObserver(function() { addHover(); }).observe(document.body, { childList: true, subtree: true });
}

/* ========== TITLE CURSOR ========== */
function initTitleCursor() {
  var cursor = document.getElementById('cursor');
  if (!cursor) return;
  document.querySelectorAll('[data-title], .problem-title, .hero-title, .section-title, .kit-geo-title').forEach(function(title) {
    title.addEventListener('mouseenter', function() {
      cursor.classList.remove('hover');
      cursor.classList.add('title-hover');
    });
    title.addEventListener('mouseleave', function() {
      cursor.classList.remove('title-hover');
    });
  });
}

/* ========== HERO MINT LETTERS ========== */
function initHeroRedLetters() {
  var cursor = document.getElementById('cursor');
  var heroTitle = document.getElementById('heroTitle');
  if (!cursor || !heroTitle) return;
  var R = 300;
  heroTitle.addEventListener('mouseenter', function() {
    cursor.classList.remove('hover');
    cursor.classList.add('hero-hover');
  });
  heroTitle.addEventListener('mouseleave', function() {
    cursor.classList.remove('hero-hover');
    heroTitle.querySelectorAll('.letter').forEach(function(l) { l.classList.remove('in-circle'); });
  });
  heroTitle.addEventListener('mousemove', function(e) {
    heroTitle.querySelectorAll('.letter').forEach(function(letter) {
      var rect = letter.getBoundingClientRect();
      var dist = Math.sqrt(Math.pow(e.clientX - (rect.left + rect.width / 2), 2) + Math.pow(e.clientY - (rect.top + rect.height / 2), 2));
      letter.classList.toggle('in-circle', dist < R);
    });
  }, { passive: true });
}

/* ========== MOBILE NAV ========== */
function initMobileNav() {
  var toggle = document.getElementById('navToggle');
  var mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;
  toggle.addEventListener('click', function() {
    mobile.classList.toggle('active');
    toggle.classList.toggle('active');
  });
  document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta').forEach(function(link) {
    link.addEventListener('click', function() {
      mobile.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}

/* ========== NAVBAR SCROLL ========== */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  ScrollTrigger.create({
    start: 100,
    onUpdate: function(self) {
      navbar.classList.toggle('scrolled', self.scroll() > 100);
    }
  });
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target && lenis) lenis.scrollTo(target);
      else if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ========== THREE.JS BACKGROUND ========== */
function initThreeBackground() {
  if (typeof THREE === 'undefined') return;
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  try {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var count = 120;
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var gray = new THREE.Color(0xCCCCCC);
    var red = new THREE.Color(0xe63946);
    var white = new THREE.Color(0xEEEEEE);

    for (var i = 0; i < count; i++) {
      var i3 = i * 3;
      var r = 20 + Math.random() * 25;
      var t = Math.random() * Math.PI * 2;
      var p = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(p) * Math.cos(t);
      positions[i3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i3 + 2] = r * Math.cos(p);
      var rc = Math.random();
      var c = rc < 0.7 ? gray.clone().lerp(white, Math.random()) : red.clone();
      colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var mat = new THREE.PointsMaterial({
      size: 0.12, vertexColors: true, transparent: true, opacity: 0.5,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    var particles = new THREE.Points(geo, mat);
    scene.add(particles);
    camera.position.z = 35;

    var mx = 0, my = 0;
    document.addEventListener('mousemove', function(e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0004 + mx * 0.0005;
      particles.rotation.x += 0.0002 + my * 0.0003;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (e) {
    console.warn('[WIT] Three.js background error:', e.message);
  }
}

/* ========== THREE.JS CONNECTION NODES ========== */
function initConnectionNodes() {
  if (typeof THREE === 'undefined') return;
  var canvas = document.getElementById('connectionNodesCanvas');
  if (!canvas) return;
  try {
    var section = document.getElementById('problem');
    if (!section) return;
    var w = section.offsetWidth || window.innerWidth;
    var h = section.offsetHeight || window.innerHeight;
    var scene = new THREE.Scene();
    var aspect = w / h;
    var frustum = 6;
    var halfW = frustum * aspect / 2;
    var halfH = frustum / 2;
    var camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 1000);
    camera.position.z = 10;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var nodeCount = 30;
    var nodePositions = [];
    var nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    var nodeMat = new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.4 });

    for (var i = 0; i < nodeCount; i++) {
      var mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      mesh.position.set((Math.random() - 0.5) * halfW * 2, (Math.random() - 0.5) * halfH * 2, 0);
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
        baseOp: 0.2 + Math.random() * 0.35
      };
      scene.add(mesh);
      nodePositions.push(mesh);
    }

    var lineMat = new THREE.LineBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.08 });
    var lines = [];
    var pulseGeo = new THREE.RingGeometry(0.06, 0.08, 16);
    var pulseMat = new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0, side: THREE.DoubleSide });
    var pulses = [];
    for (var i = 0; i < 4; i++) {
      var pulse = new THREE.Mesh(pulseGeo, pulseMat.clone());
      scene.add(pulse);
      pulses.push(pulse);
    }

    function animate() {
      requestAnimationFrame(animate);
      nodePositions.forEach(function(node) {
        node.position.x += node.userData.vx;
        node.position.y += node.userData.vy;
        if (Math.abs(node.position.x) > halfW) node.userData.vx *= -1;
        if (Math.abs(node.position.y) > halfH) node.userData.vy *= -1;
        node.material.opacity = node.userData.baseOp + Math.sin(performance.now() * 0.001 + node.position.x * 3) * 0.08;
      });
      lines.forEach(function(l) { scene.remove(l); });
      lines.length = 0;
      var connectionDist = 2.2;
      for (var i = 0; i < nodePositions.length; i++) {
        for (var j = i + 1; j < nodePositions.length; j++) {
          var dx = nodePositions[i].position.x - nodePositions[j].position.x;
          var dy = nodePositions[i].position.y - nodePositions[j].position.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            var lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i].position, nodePositions[j].position]);
            var lm = lineMat.clone();
            lm.opacity = 0.1 * (1 - dist / connectionDist);
            var line = new THREE.Line(lineGeo, lm);
            scene.add(line);
            lines.push(line);
          }
        }
      }
      var now = performance.now();
      pulses.forEach(function(pulse, i) {
        var elapsed = (now + i * 2500) % 6000;
        if (elapsed < 3000) {
          var progress = elapsed / 3000;
          pulse.scale.setScalar(1 + progress * 15);
          pulse.material.opacity = 0.1 * (1 - progress);
          var anchor = nodePositions[i % nodePositions.length];
          pulse.position.set(anchor.position.x, anchor.position.y, 0.01);
        } else {
          pulse.material.opacity = 0;
        }
      });
      renderer.render(scene, camera);
    }
    animate();
  } catch (e) {
    console.warn('[WIT] Connection nodes error:', e.message);
  }
}

/* ========== TYPEWRITER — Hero ========== */
function initTypewriter() {
  var lines = [
    { el: document.getElementById('typeLine1'), text: 'TU E-COMMERCE' },
    { el: document.getElementById('typeLine2'), text: 'B2B NECESITA UN' },
    { el: document.getElementById('typeLine3'), text: 'SISTEMA DE' },
    { el: document.getElementById('typeLine4'), text: 'VENTAS, NO SOLO' },
    { el: document.getElementById('typeLine5'), text: 'UNA TIENDA.' }
  ];
  var cursor = document.getElementById('typeCursor');
  var scrollInd = document.getElementById('scrollInd');
  var floatingCta = document.getElementById('heroFloatingCta');
  if (!lines[0].el) return;
  var lineIndex = 0;
  var charIndex = 0;
  var speed = 40;
  if (cursor) cursor.style.display = 'inline-block';

  function typeNext() {
    if (lineIndex >= lines.length) {
      if (cursor) {
        cursor.style.animation = 'blink 0.7s ease-in-out 4';
        setTimeout(function() { cursor.style.display = 'none'; }, 2800);
      }
      return;
    }
    var current = lines[lineIndex];
    if (charIndex < current.text.length) {
      var text = current.el.textContent + current.text.charAt(charIndex);
      current.el.innerHTML = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'letter';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        current.el.appendChild(span);
      }
      charIndex++;
      setTimeout(typeNext, speed + Math.random() * 60);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 100);
    }
  }
  setTimeout(typeNext, 300);
  setTimeout(function() {
    if (scrollInd) gsap.fromTo(scrollInd, { opacity: 0 }, { opacity: 1, delay: 0.6, duration: 0.8 });
  }, 1000);
  setTimeout(function() {
    if (floatingCta) floatingCta.classList.add('visible');
  }, 2500);
}

/* ========== TYPEWRITER — Hero Mobile ========== */
function initTypewriterMobile() {
  var lines = [
    { el: document.getElementById('mTypeLine1'), text: 'TU' },
    { el: document.getElementById('mTypeLine2'), text: 'E-COMMERCE' },
    { el: document.getElementById('mTypeLine3'), text: 'B2B NECESITA' },
    { el: document.getElementById('mTypeLine4'), text: 'UN SISTEMA' },
    { el: document.getElementById('mTypeLine5'), text: 'DE VENTAS,' },
    { el: document.getElementById('mTypeLine6'), text: 'NO SOLO' },
    { el: document.getElementById('mTypeLine7'), text: 'UNA TIENDA.' }
  ];
  var cursor = document.getElementById('mTypeCursor');
  if (!lines[0].el) return;
  var lineIndex = 0;
  var charIndex = 0;
  var speed = 45;
  if (cursor) cursor.style.display = 'inline-block';

  function typeNext() {
    if (lineIndex >= lines.length) {
      if (cursor) {
        cursor.style.animation = 'blink 0.7s ease-in-out 4';
        setTimeout(function() { cursor.style.display = 'none'; }, 2800);
      }
      return;
    }
    var current = lines[lineIndex];
    if (charIndex < current.text.length) {
      var text = current.el.textContent + current.text.charAt(charIndex);
      current.el.innerHTML = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'letter';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        current.el.appendChild(span);
      }
      charIndex++;
      setTimeout(typeNext, speed + Math.random() * 50);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 80);
    }
  }
  setTimeout(typeNext, 400);
}

/* ========== KIT GEO TITLE ANIMATION ========== */
function initKitGeoAnimation() {
  var desktop = document.getElementById('kitGeoDesktop');
  var mobile = document.getElementById('kitGeoMobile');

  if (desktop && window.innerWidth > 768) {
    var l1 = document.getElementById('kitLine1');
    var l2 = document.getElementById('kitLine2');
    var l3 = document.getElementById('kitLine3');
    if (l1 && l2 && l3) {
      var tl = gsap.timeline({
        scrollTrigger: { trigger: '#kit-geo', start: 'top 75%', toggleActions: 'play none none none' }
      });
      tl.fromTo(l1, { y: -80, scale: 1.5, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'bounce.out' });
      tl.fromTo(l2, { y: 60, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.4');
      tl.fromTo(l3, { y: 60, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.3');
    }
  }

  if (mobile && window.innerWidth <= 768) {
    var mobileLines = mobile.querySelectorAll('.kit-line');
    gsap.fromTo(mobileLines,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: '#kit-geo', start: 'top 75%', toggleActions: 'play none none none' }
      }
    );
  }
}

/* ========== CONNECTION LINE DRAW ========== */
function initConnectionLineDraw() {
  var bar = document.getElementById('conectaLine');
  if (!bar) return;
  var tl = gsap.timeline({
    scrollTrigger: { trigger: '#problem', start: 'top 60%', toggleActions: 'play none none none' }
  });
  tl.fromTo(bar, { xPercent: -100 }, { xPercent: 0, duration: 1.0, ease: 'power2.inOut' });
  tl.to(bar, { xPercent: 100, duration: 1.5, ease: 'power2.inOut' }, 1.2);
}

/* ========== JUSTIFICACION TECNICA ========== */
function initIsForYou() {
  var j1 = document.getElementById('justifLine1');
  var j2 = document.getElementById('justifLine2');
  var j3 = document.getElementById('justifLine3');
  var checkList = document.getElementById('checkList');
  if (!j1 || !j2 || !j3 || !checkList) return;
  var items = checkList.querySelectorAll('li');
  gsap.set(items, { opacity: 0, y: 20 });
  items.forEach(function(item) {
    var icon = item.querySelector('.check-icon');
    if (icon) gsap.set(icon, { opacity: 0, scale: 0 });
  });
  var tl = gsap.timeline({
    scrollTrigger: { trigger: '#justification', start: 'top 75%', toggleActions: 'play none none none' }
  });
  tl.fromTo(j1, { y: -80, scale: 1.5, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'bounce.out' });
  tl.fromTo(j2, { y: 50, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.4');
  tl.fromTo(j3, { y: 50, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.3');
  items.forEach(function(item, i) {
    tl.to(item, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '-=0.4');
    var icon = item.querySelector('.check-icon');
    if (icon) {
      tl.to(icon, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.3');
    }
  });
}

/* ========== WIT TRESEESENTA TITLE ========== */
function initWIT360Title() {
  var titleWrapper = document.querySelector('.process-title-stacked');
  if (!titleWrapper) return;
  var st = { trigger: '#process', start: 'top 80%', toggleActions: 'play none none none' };
  gsap.fromTo(titleWrapper, { y: 60, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out', scrollTrigger: st });
}

/* ========== SERVICES TITLE ========== */
function initServicesTitleAnimation() {
  var l1 = document.getElementById('methodLine1');
  var l2 = document.getElementById('methodLine2');
  var l3 = document.getElementById('methodLine3');
  var l4 = document.getElementById('methodLine4');
  if (!l1 || !l2 || !l3 || !l4) return;
  var el = document.getElementById('servicesParallax');
  if (el) {
    gsap.to(el, { x: 300, ease: 'none', scrollTrigger: { trigger: '#methodology', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  var tl = gsap.timeline({
    scrollTrigger: { trigger: '#methodology', start: 'top 75%', toggleActions: 'play none none none' }
  });
  tl.fromTo(l1, { y: -80, scale: 1.8, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'bounce.out' });
  tl.fromTo(l2, { y: 60, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.4');
  tl.fromTo(l3, { y: 60, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.3');
  tl.fromTo(l4, { y: 60, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.3');
}

/* ========== INTERACTIVE SHAPES ========== */
function initInteractiveShapes() {
  var container = document.getElementById('interactiveShapes');
  if (!container) return;
  var circles = container.querySelectorAll('.shape-circle');
  var colors = ['#e63946', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2'];
  circles.forEach(function(circle) {
    circle.addEventListener('click', function() {
      var rc = colors[Math.floor(Math.random() * colors.length)];
      circle.style.background = rc;
      circle.style.borderColor = rc;
      circle.style.transform = 'scale(1.2)';
      setTimeout(function() { circle.style.transform = ''; }, 300);
      spawnShapeParticle(circle, rc);
    });
  });
}

function spawnShapeParticle(target, color) {
  var container = document.getElementById('shapeParticles');
  if (!container) return;
  var rect = target.getBoundingClientRect();
  var cr = container.getBoundingClientRect();
  var p = document.createElement('div');
  p.className = 'shape-particle';
  p.style.cssText = 'position:absolute;width:10px;height:10px;background:' + color + ';border-radius:50%;left:' + (rect.left - cr.left + rect.width / 2 - 5) + 'px;top:' + (rect.top - cr.top + rect.height / 2 - 5) + 'px;pointer-events:none;animation:particleFloat 3s ease-out forwards;';
  container.appendChild(p);
  setTimeout(function() { p.remove(); }, 3000);
}

/* ========== HERO 3D SHAPE ========== */
function initHero3DShape() {
  if (typeof THREE === 'undefined') return;
  var container = document.getElementById('hero3d');
  if (!container) return;
  try {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var geo = new THREE.IcosahedronGeometry(1.8, 0);
    var mat = new THREE.MeshBasicMaterial({ color: 0xe63946, wireframe: true, transparent: true, opacity: 0.3 });
    var shape = new THREE.Mesh(geo, mat);
    scene.add(shape);
    var geo2 = new THREE.IcosahedronGeometry(1.2, 0);
    var mat2 = new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.06 });
    scene.add(new THREE.Mesh(geo2, mat2));
    var edges = new THREE.EdgesGeometry(geo);
    var edgeMat = new THREE.LineBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.2 });
    scene.add(new THREE.LineSegments(edges, edgeMat));
    camera.position.z = 5;

    var trx = 0, try_ = 0, crx = 0, cry_ = 0;
    document.addEventListener('mousemove', function(e) {
      trx = (e.clientY / window.innerHeight - 0.5) * 1.5;
      try_ = (e.clientX / window.innerWidth - 0.5) * 1.5;
    }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      crx += (trx - crx) * 0.04;
      cry_ += (try_ - cry_) * 0.04;
      shape.rotation.x = crx + performance.now() * 0.0002;
      shape.rotation.y = cry_ + performance.now() * 0.0003;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
    });
  } catch (e) {
    console.warn('[WIT] Hero 3D error:', e.message);
  }
}

/* ========== RESULTS ========== */
function initResultsAnimation() {
  var visibilidad = document.getElementById('visibilidadLine');
  var conversiones = document.getElementById('conversionesLine');
  var ventas = document.getElementById('ventasLine');
  if (!visibilidad || !conversiones || !ventas) return;
  var st = { trigger: '#results', start: 'top 75%', toggleActions: 'play none none none' };
  gsap.fromTo(visibilidad, { y: -150, rotation: 8, opacity: 0, scale: 1.3 }, { y: 0, rotation: 3, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out', scrollTrigger: st });
  gsap.fromTo(conversiones, { y: -150, rotation: -8, opacity: 0, scale: 1.3 }, { y: 0, rotation: -3, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out', delay: 0.2, scrollTrigger: st });
  gsap.fromTo(ventas, { y: -150, rotation: 5, opacity: 0, scale: 1.2 }, { y: 0, rotation: 1.5, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out', delay: 0.4, scrollTrigger: st });
}

/* ========== SECTION ENTRANCES ========== */
function initSectionAnimations() {
  gsap.utils.toArray('.section-body, .section-label').forEach(function(el) {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });
  var problemContent = document.querySelector('.problem-content');
  if (problemContent) {
    gsap.fromTo(problemContent, { opacity: 0, scale: 0.9 }, {
      opacity: 1, scale: 1, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: problemContent, start: 'top 70%', toggleActions: 'play none none none' }
    });
  }
  var solutionImg = document.querySelector('.solution-image');
  if (solutionImg) {
    ScrollTrigger.create({
      trigger: solutionImg, start: 'top 80%',
      onEnter: function() { solutionImg.classList.add('revealed'); },
      onLeaveBack: function() { solutionImg.classList.remove('revealed'); }
    });
  }
  var flipCards = document.querySelectorAll('.flip-card');
  gsap.fromTo(flipCards, { opacity: 0, y: 30, scale: 0.95 }, {
    opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.services-grid', start: 'top 80%', toggleActions: 'play none none none' }
  });
  var statCards = document.querySelectorAll('.stat-card');
  gsap.fromTo(statCards, { opacity: 0, y: 40 }, {
    opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15,
    scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', toggleActions: 'play none none none' }
  });
  document.querySelectorAll('.stat-number').forEach(function(el) {
    var target = parseInt(el.dataset.count);
    var suffix = el.textContent.indexOf('%') >= 0 ? '%' : 'x';
    var prefix = el.textContent.indexOf('+') >= 0 ? '+' : '';
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      onUpdate: function() { el.textContent = prefix + Math.round(obj.val) + suffix; }
    });
  });
  gsap.utils.toArray('.shape-circle').forEach(function(shape, i) {
    gsap.fromTo(shape, { opacity: 0, scale: 0.5 }, {
      opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out', delay: i * 0.15,
      scrollTrigger: { trigger: '.isforyou-visual', start: 'top 80%', toggleActions: 'play none none none' }
    });
  });
}

/* ========== CAROUSEL ========== */
function initCarousel() {
  var track = document.getElementById('carouselTrack');
  var prev = document.getElementById('carouselPrev');
  var next = document.getElementById('carouselNext');
  if (!track || !prev || !next) return;
  var cards = track.querySelectorAll('.carousel-card');
  if (!cards.length) return;
  var currentIndex = 0;
  function getCardStep() {
    return cards[0].offsetWidth + (parseInt(getComputedStyle(track).gap) || 24);
  }
  function getMaxIndex() {
    var containerWidth = document.getElementById('carouselContainer').offsetWidth;
    var step = getCardStep();
    var totalWidth = cards.length * step - (parseInt(getComputedStyle(track).gap) || 24);
    var maxScroll = Math.max(0, totalWidth - containerWidth);
    return Math.max(0, Math.ceil(maxScroll / step));
  }
  function updateActive() {
    cards.forEach(function(card, i) { card.classList.toggle('active', i === currentIndex); });
  }
  function updatePosition() {
    track.style.transform = 'translateX(' + (-(currentIndex * getCardStep())) + 'px)';
  }
  prev.addEventListener('click', function() {
    currentIndex = Math.max(0, currentIndex - 1);
    updatePosition(); updateActive();
  });
  next.addEventListener('click', function() {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    updatePosition(); updateActive();
  });
  window.addEventListener('resize', function() {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    updatePosition();
  });
  updatePosition(); updateActive();
}

/* ========== PARALLAX CONTINUOUS BG ========== */
function initContinuousParallax() {
  var wrapper = document.getElementById('parallaxWrapper');
  var bgLayer = document.getElementById('parallaxBgLayer');
  if (!wrapper || !bgLayer) return;
  gsap.to(bgLayer, {
    yPercent: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ========== SCROLL-TO-DRAW SVG — CTA ========== */
function initScrollToDraw() {
  var ctaSection = document.getElementById('cta');
  if (!ctaSection) return;
  document.fonts.ready.then(function() {
    var drawStrokes = ctaSection.querySelectorAll('.draw-stroke');
    drawStrokes.forEach(function(path) {
      try {
        var length = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      } catch (e) {
        path.style.strokeDasharray = '1000';
        path.style.strokeDashoffset = '1000';
      }
    });
    gsap.to(drawStrokes, {
      strokeDashoffset: 0, stagger: 0.15, ease: 'none',
      scrollTrigger: { trigger: ctaSection, start: 'top 60%', end: 'bottom 40%', scrub: true }
    });
    var ctaButtons = document.getElementById('ctaButtons');
    if (ctaButtons) {
      ScrollTrigger.create({
        trigger: ctaSection, start: 'center center',
        onEnter: function() { ctaButtons.classList.add('visible'); },
        onLeaveBack: function() { ctaButtons.classList.remove('visible'); }
      });
    }
  });
}

/* ========== CONTACT FORM ========== */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    form.reset();
  });
}

/* ========== INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', function() {
  // Verificar librerias
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('[WIT] ERROR CRITICO: GSAP o ScrollTrigger no cargaron. Las animaciones no funcionaran.');
    console.error('[WIT] Verifica que los scripts CDN sean accesibles:');
    console.error('  - https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
    console.error('  - https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
    return;
  }

  console.log('[WIT] Iniciando animaciones...');

  safeInit('Lenis', initLenis);
  safeInit('Cursor', initCursor);
  safeInit('TitleCursor', initTitleCursor);
  safeInit('ScrollToTop', initScrollToTop);
  safeInit('MobileNav', initMobileNav);
  safeInit('Navbar', initNavbar);
  safeInit('ThreeBackground', initThreeBackground);
  // safeInit('ConnectionNodes', initConnectionNodes); // OCULTO - particulas con conectores
  safeInit('Typewriter', initTypewriter);
  safeInit('TypewriterMobile', initTypewriterMobile);
  safeInit('HeroRedLetters', initHeroRedLetters);
  // safeInit('Hero3DShape', initHero3DShape); // OCULTO - forma geometrica hero
  // safeInit('ConnectionLineDraw', initConnectionLineDraw); // OCULTO - linea aparece/desaparece
  safeInit('ContinuousParallax', initContinuousParallax);
  safeInit('SectionAnimations', initSectionAnimations);
  safeInit('Carousel', initCarousel);
  safeInit('ScrollToDraw', initScrollToDraw);
  safeInit('ServicesTitle', initServicesTitleAnimation);
  safeInit('IsForYou', initIsForYou);
  safeInit('WIT360Title', initWIT360Title);
  safeInit('Results', initResultsAnimation);
  // safeInit('InteractiveShapes', initInteractiveShapes); // OCULTO - circulos concentricos
  safeInit('KitGeo', initKitGeoAnimation);
  safeInit('ContactForm', initContactForm);

  // Refresh ScrollTrigger despues de que todo cargue
  ScrollTrigger.refresh();
  console.log('[WIT] Animaciones inicializadas correctamente.');
});

// Refresh adicional cuando las fuentes e imagenes carguen
window.addEventListener('load', function() {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
    console.log('[WIT] ScrollTrigger refrescado despues de load.');
  }
});
