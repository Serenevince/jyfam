/* CHRISTMAS PARALLAX AND SCENES */
/* ================================================================
   christmas.js  –  Jesus Youth Family Gathering 2026
   Remove this file and its <script> tag after Christmas to revert.
   Covers:
     Phase 1 — CSS snowflake injection for hero section
     Phase 2 — Falling stars (parallax) + Guiding star
     Phase 3 — Illustrated SVG scenes (snowman, children, family, nativity)
   ================================================================ */

(function () {
  'use strict';

  /* ---- Utilities ---- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;

  /* ================================================================
     PHASE 1 — HERO SNOWFALL (CSS flakes, injected here)
     ================================================================ */
  function initHeroSnow() {
    var container = document.getElementById('xmas-hero-snow');
    if (!container) return;

    // Flake count: fewer on mobile
    var count = isMobile ? 18 : 36;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var flake = document.createElement('div');
      flake.className = 'xmas-flake';

      var size   = (Math.random() * 5 + 3).toFixed(1);    // 3–8 px
      var left   = (Math.random() * 100).toFixed(2);      // 0–100%
      var dur    = (Math.random() * 7 + 6).toFixed(1);    // 6–13 s
      var delay  = (Math.random() * -12).toFixed(1);      // stagger
      var drift  = ((Math.random() - 0.5) * 60).toFixed(0); // ±30 px
      var op     = (Math.random() * 0.4 + 0.5).toFixed(2); // 0.5–0.9

      flake.style.cssText = [
        '--sz:' + size + 'px',
        '--dur:' + dur + 's',
        '--delay:' + delay + 's',
        '--drift:' + drift + 'px',
        '--op:' + op,
        'left:' + left + '%'
      ].join(';');

      fragment.appendChild(flake);
    }
    container.appendChild(fragment);
  }

  /* ================================================================
     PHASE 2a — FALLING STARS PARALLAX
     ================================================================ */

  /* Create the fixed parallax star layer */
  function initParallaxStars() {
    if (prefersReducedMotion) return;

    var layer = document.createElement('div');
    layer.id = 'xmas-star-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    // 3 depth layers: far (slow/faint), mid, near (fast/bright)
    var layers = [
      { count: isMobile ? 6  : 12, size: [2, 3],   op: [0.15, 0.25], speedFactor: 0.04 },
      { count: isMobile ? 5  : 10, size: [3, 4.5], op: [0.22, 0.38], speedFactor: 0.09 },
      { count: isMobile ? 3  : 6,  size: [4, 6],   op: [0.30, 0.50], speedFactor: 0.15 }
    ];

    var stars = [];

    layers.forEach(function (layerDef, li) {
      for (var i = 0; i < layerDef.count; i++) {
        var el = document.createElement('div');
        el.className = 'xmas-para-star';

        var sz  = (Math.random() * (layerDef.size[1] - layerDef.size[0]) + layerDef.size[0]).toFixed(1);
        var op  = (Math.random() * (layerDef.op[1] - layerDef.op[0]) + layerDef.op[0]).toFixed(2);
        var lft = (Math.random() * 100).toFixed(2);
        var top = (Math.random() * 300).toFixed(0); // distribute over 3x viewport height

        el.style.cssText = '--ps-sz:' + sz + 'px;--ps-op:' + op + ';left:' + lft + '%;top:' + top + 'px';
        layer.appendChild(el);
        stars.push({ el: el, factor: layerDef.speedFactor });
      }
    });

    /* One rAF loop — passive scroll, throttled */
    var lastScrollY = 0;
    var ticking = false;

    function updateStars() {
      stars.forEach(function (s) {
        var shift = lastScrollY * s.factor;
        s.el.style.transform = 'translateY(' + shift + 'px)';
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateStars);
        ticking = true;
      }
    }, { passive: true });

    /* ---- Occasional shooting star ---- */
    function shootingStar() {
      if (prefersReducedMotion) return;
      var streak = document.createElement('div');
      streak.style.cssText = [
        'position:fixed',
        'pointer-events:none',
        'z-index:1',
        'top:' + (Math.random() * 50 + 5) + '%',
        'left:-80px',
        'width:80px',
        'height:2px',
        'border-radius:999px',
        'background:linear-gradient(90deg,transparent,rgba(240,208,128,0.9))',
        'opacity:0',
        'transform:rotate(-20deg)',
        'will-change:transform,opacity'
      ].join(';');
      layer.appendChild(streak);

      // Animate with rAF
      var start = null;
      var totalDuration = 700; // ms
      var targetX = window.innerWidth + 200;

      function animate(ts) {
        if (!start) start = ts;
        var prog = Math.min((ts - start) / totalDuration, 1);
        // ease-in
        var eased = prog * prog;
        streak.style.transform = 'translateX(' + (eased * targetX) + 'px) rotate(-20deg)';
        streak.style.opacity = prog < 0.15 ? (prog / 0.15).toFixed(2) : prog > 0.75 ? (1 - (prog - 0.75) / 0.25).toFixed(2) : '0.9';
        if (prog < 1) {
          requestAnimationFrame(animate);
        } else {
          streak.remove();
        }
      }
      requestAnimationFrame(animate);
    }

    // Trigger a shooting star every 12–22 seconds
    function scheduleShoot() {
      var delay = 12000 + Math.random() * 10000;
      setTimeout(function () {
        shootingStar();
        scheduleShoot();
      }, delay);
    }
    scheduleShoot();
  }

  /* ================================================================
     PHASE 2b — GUIDING STAR (Star of Bethlehem)
     ================================================================ */
  function initGuidingStar() {
    // Build the star element
    var starWrap = document.createElement('div');
    starWrap.id = 'xmas-guiding-star';

    var btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Follow the star to the next section');
    btn.setAttribute('type', 'button');
    btn.innerHTML = '<svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f0d080"/><stop offset="60%" stop-color="#c9933a"/><stop offset="100%" stop-color="#c9933a" stop-opacity="0"/></radialGradient></defs><polygon points="14,2 16.8,10.2 25.5,10.2 18.8,15.5 21.6,23.7 14,18.5 6.4,23.7 9.2,15.5 2.5,10.2 11.2,10.2" fill="url(#sg)" stroke="#c9933a" stroke-width="0.5"/></svg>';

    var tooltip = document.createElement('div');
    tooltip.className = 'xmas-star-tooltip';
    tooltip.textContent = 'Follow the star';
    tooltip.setAttribute('aria-hidden', 'true');

    starWrap.appendChild(btn);
    starWrap.appendChild(tooltip);
    document.body.appendChild(starWrap);

    /* Gather sections in order */
    function getSections() {
      return Array.from(document.querySelectorAll(
        '#slideshow, #intercession, #invitation, #testimonies, #gallery, #route-map, #family-offering, #xmas-nativity'
      )).filter(function (s) { return s.offsetParent !== null; });
    }

    /* Scroll-driven position update (rAF, passive) */
    var lastSY = 0;
    var ticking = false;

    function updateStarPosition() {
      var scrollY = window.scrollY;
      var viewH   = window.innerHeight;
      var docH    = document.documentElement.scrollHeight;
      var prog    = docH > viewH ? scrollY / (docH - viewH) : 0;

      // Travel from 10% to 90% of viewport height
      var topPct = 10 + prog * 80;
      starWrap.style.top = topPct + '%';
      starWrap.style.transform = 'translateY(0)';

      // Check if near nativity section
      var nativity = document.getElementById('xmas-nativity');
      if (nativity) {
        var rect = nativity.getBoundingClientRect();
        if (rect.top < viewH * 0.6 && rect.bottom > 0) {
          btn.style.filter = 'drop-shadow(0 0 10px #f0d080) drop-shadow(0 0 20px #c9933a)';
          btn.style.transform = 'scale(1.25)';
        } else {
          btn.style.filter = 'drop-shadow(0 0 5px #c9933a)';
          btn.style.transform = '';
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      lastSY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateStarPosition);
        ticking = true;
      }
    }, { passive: true });
    updateStarPosition();

    /* Click / tap — scroll to next section */
    btn.addEventListener('click', function () {
      var sections = getSections();
      var viewMid  = window.scrollY + window.innerHeight * 0.5;
      var next     = null;

      for (var i = 0; i < sections.length; i++) {
        var sTop = sections[i].getBoundingClientRect().top + window.scrollY;
        if (sTop > viewMid + 10) {
          next = sections[i];
          break;
        }
      }
      // Wrap to top if past last section
      if (!next) next = sections[0];

      if (prefersReducedMotion) {
        next.scrollIntoView();
      } else {
        next.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ================================================================
     PHASE 3 — ILLUSTRATED SVG SCENES
     ================================================================ */

  /* ---- Scene reveal via IntersectionObserver ---- */
  function observeScenes() {
    var scenes = document.querySelectorAll('.xmas-scene');
    if (!scenes.length) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('xmas-scene--visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      scenes.forEach(function (s) { io.observe(s); });
    } else {
      scenes.forEach(function (s) { s.classList.add('xmas-scene--visible'); });
    }
  }

  /* ---- Scene: Snowman (end of hero section) ---- */
  function buildSnowmanScene() {
    var target = document.getElementById('xmas-snowman-scene');
    if (!target) return;

    target.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180" width="160" height="180" role="img" aria-label="Snowman waving" aria-hidden="true">' +
        '<g id="xmas-snowman-g">' +
        /* ground snow mound */
        '<ellipse cx="80" cy="168" rx="60" ry="12" fill="#e8e4f0" opacity=".5"/>' +
        /* body — bottom ball */
        '<circle cx="80" cy="140" r="34" fill="#fbf8f3" stroke="#e0dcd8" stroke-width="1.5"/>' +
        /* body — middle ball */
        '<circle cx="80" cy="97" r="24" fill="#fbf8f3" stroke="#e0dcd8" stroke-width="1.5"/>' +
        /* head */
        '<circle cx="80" cy="62" r="18" fill="#fbf8f3" stroke="#e0dcd8" stroke-width="1.5"/>' +
        /* scarf — holly green */
        '<path d="M60 82 Q80 88 100 82 Q96 94 80 90 Q64 94 60 82Z" fill="#7b1117"/>' +
        /* hat brim */
        '<rect x="58" y="43" width="44" height="5" rx="2" fill="#2b1b1a"/>' +
        /* hat top */
        '<rect x="64" y="20" width="32" height="25" rx="4" fill="#2b1b1a"/>' +
        /* hat band — red */
        '<rect x="64" y="38" width="32" height="6" rx="1" fill="#a3191f"/>' +
        /* buttons */
        '<circle cx="80" cy="102" r="2.5" fill="#2b1b1a"/>' +
        '<circle cx="80" cy="112" r="2.5" fill="#2b1b1a"/>' +
        '<circle cx="80" cy="122" r="2.5" fill="#2b1b1a"/>' +
        /* tummy buttons */
        '<circle cx="80" cy="132" r="2" fill="#2b1b1a"/>' +
        '<circle cx="80" cy="142" r="2" fill="#2b1b1a"/>' +
        '<circle cx="80" cy="152" r="2" fill="#2b1b1a"/>' +
        /* eyes */
        '<circle cx="74" cy="58" r="2.5" fill="#2b1b1a"/>' +
        '<circle cx="86" cy="58" r="2.5" fill="#2b1b1a"/>' +
        /* carrot nose */
        '<polygon points="80,62 80,68 85,65" fill="#c9933a"/>' +
        /* smile */
        '<path d="M74 69 Q80 74 86 69" stroke="#2b1b1a" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        /* LEFT arm (static) */
        '<line x1="56" y1="96" x2="30" y2="80" stroke="#2b1b1a" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="30" y1="80" x2="22" y2="72" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="30" y1="80" x2="20" y2="82" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
        /* RIGHT arm — waving (animated) */
        '<g id="xmas-wave-arm" style="transform-origin:104px 97px">' +
          '<line x1="104" y1="97" x2="128" y2="82" stroke="#2b1b1a" stroke-width="4" stroke-linecap="round"/>' +
          '<line x1="128" y1="82" x2="136" y2="73" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
          '<line x1="128" y1="82" x2="138" y2="84" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
        '</g>' +
        /* holly on hat */
        '<ellipse cx="68" cy="40" rx="5" ry="2.5" fill="#7b1117" transform="rotate(-25 68 40)"/>' +
        '<ellipse cx="76" cy="40" rx="5" ry="2.5" fill="#7b1117" transform="rotate(25 76 40)"/>' +
        '<circle cx="72" cy="40" r="2" fill="#a3191f"/>' +
        '</g>' +
      '</svg>';
  }

  /* Inject arm wave CSS animation */
  function injectSnowmanAnimation() {
    var style = document.createElement('style');
    style.textContent =
      '@keyframes xmas-arm-wave{' +
        '0%,100%{transform:rotate(0deg)}' +
        '30%{transform:rotate(22deg)}' +
        '60%{transform:rotate(-10deg)}' +
      '}' +
      '#xmas-wave-arm{animation:xmas-arm-wave 2.4s ease-in-out 1.5s infinite;}' +
      '@media(prefers-reduced-motion:reduce){#xmas-wave-arm{animation:none!important;}}';
    document.head.appendChild(style);
  }

  /* ---- Scene: Children playing ---- */
  function buildChildrenScene() {
    var target = document.getElementById('xmas-children-scene');
    if (!target) return;

    target.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160" role="img" aria-label="Children playing in the snow" aria-hidden="true">' +
        /* ground */
        '<ellipse cx="100" cy="150" rx="90" ry="12" fill="#e8e4f0" opacity=".6"/>' +
        /* small snowman they are building */
        '<circle cx="100" cy="134" r="14" fill="#fbf8f3" stroke="#e0dcd8" stroke-width="1"/>' +
        '<circle cx="100" cy="112" r="10" fill="#fbf8f3" stroke="#e0dcd8" stroke-width="1"/>' +
        '<circle cx="100" cy="97" r="7" fill="#fbf8f3" stroke="#e0dcd8" stroke-width="1"/>' +
        '<circle cx="98" cy="95" r="1.5" fill="#2b1b1a"/>' +
        '<circle cx="103" cy="95" r="1.5" fill="#2b1b1a"/>' +
        '<line x1="100" y1="97" x2="103" y2="100" stroke="#c9933a" stroke-width="1.5" stroke-linecap="round"/>' +
        /* Child 1 — left, green scarf */
        '<circle cx="52" cy="68" r="11" fill="#f7d4b0"/>' +
        '<rect x="41" y="78" width="22" height="28" rx="8" fill="#7b1117"/>' +
        '<rect x="41" y="76" width="22" height="8" rx="4" fill="#a3191f"/>' + /* scarf */
        /* hat */
        '<rect x="43" y="55" width="18" height="16" rx="4" fill="#2b1b1a"/>' +
        '<rect x="40" y="68" width="24" height="4" rx="2" fill="#2b1b1a"/>' +
        /* arms raised holding snowball */
        '<line x1="42" y1="88" x2="28" y2="78" stroke="#f7d4b0" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="24" cy="75" r="6" fill="#fbf8f3" stroke="#e0dcd8" stroke-width="1"/>' + /* snowball */
        '<line x1="63" y1="88" x2="75" y2="80" stroke="#f7d4b0" stroke-width="4" stroke-linecap="round"/>' +
        /* legs */
        '<line x1="50" y1="106" x2="46" y2="128" stroke="#7b1117" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="54" y1="106" x2="58" y2="128" stroke="#7b1117" stroke-width="5" stroke-linecap="round"/>' +
        /* boots */
        '<ellipse cx="45" cy="130" rx="6" ry="4" fill="#2b1b1a"/>' +
        '<ellipse cx="59" cy="130" rx="6" ry="4" fill="#2b1b1a"/>' +
        /* Child 2 — right, red jacket */
        '<circle cx="152" cy="68" r="11" fill="#f7c8a0"/>' +
        '<rect x="141" y="78" width="22" height="28" rx="8" fill="#a3191f"/>' +
        '<rect x="141" y="76" width="22" height="8" rx="4" fill="#7b1117"/>' + /* scarf */
        /* hat */
        '<rect x="143" y="55" width="18" height="16" rx="4" fill="#7b1117"/>' +
        '<rect x="140" y="68" width="24" height="4" rx="2" fill="#7b1117"/>' +
        /* arms up — placing head on snowman */
        '<line x1="141" y1="88" x2="122" y2="78" stroke="#f7c8a0" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="163" y1="88" x2="175" y2="80" stroke="#f7c8a0" stroke-width="4" stroke-linecap="round"/>' +
        /* legs */
        '<line x1="150" y1="106" x2="146" y2="128" stroke="#a3191f" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="154" y1="106" x2="158" y2="128" stroke="#a3191f" stroke-width="5" stroke-linecap="round"/>' +
        /* boots */
        '<ellipse cx="145" cy="130" rx="6" ry="4" fill="#2b1b1a"/>' +
        '<ellipse cx="159" cy="130" rx="6" ry="4" fill="#2b1b1a"/>' +
        /* snowflakes */
        '<circle cx="30" cy="40" r="2" fill="white" opacity=".7"/>' +
        '<circle cx="170" cy="30" r="2.5" fill="white" opacity=".6"/>' +
        '<circle cx="140" cy="50" r="1.5" fill="white" opacity=".5"/>' +
        '<circle cx="60" cy="25" r="2" fill="white" opacity=".55"/>' +
      '</svg>';
  }

  /* ---- Scene: Happy family ---- */
  function buildFamilyScene() {
    var target = document.getElementById('xmas-family-scene');
    if (!target) return;

    target.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180" role="img" aria-label="Happy family in winter clothes" aria-hidden="true">' +
        /* ground snow */
        '<ellipse cx="120" cy="168" rx="105" ry="14" fill="#e8e4f0" opacity=".5"/>' +
        /* ---- Dad (left) ---- */
        '<circle cx="52" cy="62" r="14" fill="#f0caa0"/>' +
        /* hat */
        '<rect x="38" y="44" width="28" height="20" rx="5" fill="#5c0a0f"/>' +
        '<rect x="35" y="62" width="34" height="5" rx="2" fill="#5c0a0f"/>' +
        /* scarf */
        '<rect x="39" y="74" width="26" height="9" rx="4" fill="#a3191f"/>' +
        /* coat */
        '<rect x="36" y="82" width="32" height="40" rx="10" fill="#7b1117"/>' +
        '<line x1="52" y1="82" x2="52" y2="122" stroke="#5c0a0f" stroke-width="2"/>' +
        /* arms */
        '<line x1="36" y1="90" x2="18" y2="102" stroke="#7b1117" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="68" y1="90" x2="84" y2="96" stroke="#7b1117" stroke-width="7" stroke-linecap="round"/>' +
        /* legs / boots */
        '<line x1="46" y1="122" x2="42" y2="152" stroke="#2b1b1a" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="58" y1="122" x2="62" y2="152" stroke="#2b1b1a" stroke-width="6" stroke-linecap="round"/>' +
        '<ellipse cx="41" cy="156" rx="8" ry="5" fill="#2b1b1a"/>' +
        '<ellipse cx="63" cy="156" rx="8" ry="5" fill="#2b1b1a"/>' +
        /* ---- Mum (right) ---- */
        '<circle cx="188" cy="62" r="14" fill="#f0caa0"/>' +
        /* earmuffs */
        '<circle cx="174" cy="58" r="6" fill="#a3191f"/>' +
        '<circle cx="202" cy="58" r="6" fill="#a3191f"/>' +
        '<line x1="174" y1="58" x2="202" y2="58" stroke="#a3191f" stroke-width="3"/>' +
        /* scarf */
        '<rect x="175" y="74" width="26" height="9" rx="4" fill="#7b1117"/>' +
        /* coat */
        '<rect x="174" y="82" width="28" height="40" rx="10" fill="#a3191f"/>' +
        '<line x1="188" y1="82" x2="188" y2="122" stroke="#7b1117" stroke-width="2"/>' +
        /* arms */
        '<line x1="174" y1="90" x2="156" y2="96" stroke="#a3191f" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="202" y1="90" x2="220" y2="102" stroke="#a3191f" stroke-width="7" stroke-linecap="round"/>' +
        /* legs */
        '<line x1="182" y1="122" x2="178" y2="152" stroke="#7b1117" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="194" y1="122" x2="198" y2="152" stroke="#7b1117" stroke-width="6" stroke-linecap="round"/>' +
        '<ellipse cx="177" cy="156" rx="8" ry="5" fill="#2b1b1a"/>' +
        '<ellipse cx="199" cy="156" rx="8" ry="5" fill="#2b1b1a"/>' +
        /* ---- Child (centre, small) ---- */
        '<circle cx="120" cy="78" r="10" fill="#f7c8a0"/>' +
        /* woolly hat */
        '<rect x="111" y="64" width="18" height="16" rx="5" fill="#c9933a"/>' +
        '<circle cx="120" cy="62" r="4" fill="#f0d080"/>' + /* pompom */
        /* coat */
        '<rect x="110" y="88" width="20" height="30" rx="7" fill="#7b1117"/>' +
        /* arms held by parents */
        '<line x1="110" y1="95" x2="84" y2="96" stroke="#7b1117" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="130" y1="95" x2="156" y2="96" stroke="#7b1117" stroke-width="6" stroke-linecap="round"/>' +
        /* legs */
        '<line x1="116" y1="118" x2="113" y2="142" stroke="#2b1b1a" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="124" y1="118" x2="127" y2="142" stroke="#2b1b1a" stroke-width="5" stroke-linecap="round"/>' +
        '<ellipse cx="112" cy="145" rx="6" ry="4" fill="#2b1b1a"/>' +
        '<ellipse cx="128" cy="145" rx="6" ry="4" fill="#2b1b1a"/>' +
        /* snowflakes */
        '<circle cx="20" cy="30" r="2" fill="white" opacity=".6"/>' +
        '<circle cx="210" cy="40" r="2.5" fill="white" opacity=".5"/>' +
        '<circle cx="140" cy="20" r="2" fill="white" opacity=".55"/>' +
      '</svg>';
  }

  /* ---- Scene: Nativity ---- */
  function buildNativityScene() {
    var target = document.getElementById('xmas-nativity-scene');
    if (!target) return;

    target.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260" width="100%" height="auto" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Nativity scene with Mary, Joseph, baby Jesus, shepherds and wise men" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="skyGrad" cx="50%" cy="0%" r="80%">' +
            '<stop offset="0%" stop-color="#1a0507"/>' +
            '<stop offset="100%" stop-color="#1a0507"/>' +
          '</radialGradient>' +
          '<radialGradient id="starGlow" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#f0d080" stop-opacity="1"/>' +
            '<stop offset="60%" stop-color="#c9933a" stop-opacity="0.6"/>' +
            '<stop offset="100%" stop-color="#c9933a" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        /* sky */
        '<rect width="760" height="260" fill="url(#skyGrad)"/>' +
        /* hill silhouette */
        '<ellipse cx="380" cy="280" rx="420" ry="120" fill="#5c0a0f"/>' +
        '<ellipse cx="100" cy="280" rx="200" ry="80" fill="#3a0407"/>' +
        '<ellipse cx="680" cy="280" rx="200" ry="80" fill="#3a0407"/>' +
        /* stars in sky */
        '<circle cx="60" cy="30" r="1.5" fill="#f0d080" opacity=".7"/>' +
        '<circle cx="120" cy="20" r="1" fill="#f0d080" opacity=".5"/>' +
        '<circle cx="200" cy="40" r="1.5" fill="#f0d080" opacity=".6"/>' +
        '<circle cx="560" cy="25" r="1.5" fill="#f0d080" opacity=".7"/>' +
        '<circle cx="640" cy="40" r="1" fill="#f0d080" opacity=".5"/>' +
        '<circle cx="700" cy="20" r="1.5" fill="#f0d080" opacity=".6"/>' +
        '<circle cx="430" cy="15" r="1" fill="#f0d080" opacity=".5"/>' +
        /* Bethlehem star with glow */
        '<circle cx="380" cy="40" r="30" fill="url(#starGlow)" id="xmas-beth-star-glow"/>' +
        '<polygon points="380,8 383.5,20 395,20 385.5,27 389,38 380,31 371,38 374.5,27 365,20 376.5,20" fill="#f0d080" id="xmas-beth-star"/>' +
        /* ---- STABLE / MANGER ---- */
        /* roof */
        '<polygon points="300,80 460,80 490,140 270,140" fill="#2b1b1a"/>' +
        '<polygon points="295,78 465,78 380,50" fill="#3d2a20"/>' +
        /* back wall */
        '<rect x="295" y="118" width="170" height="90" rx="2" fill="#3d2a20"/>' +
        /* hay / manger */
        '<rect x="358" y="162" width="45" height="25" rx="6" fill="#8b6914"/>' +
        '<line x1="358" y1="168" x2="402" y2="168" stroke="#c9933a" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 3"/>' +
        /* manger glow */
        '<ellipse cx="380" cy="175" rx="30" ry="10" fill="#f0d080" opacity=".25"/>' +
        /* ---- Baby Jesus ---- */
        '<circle cx="380" cy="156" r="7" fill="#f7c8a0"/>' +   /* head */
        '<rect x="368" y="162" width="24" height="12" rx="6" fill="#fbf8f3"/>' + /* swaddle */
        /* ---- Mary (left of manger) ---- */
        /* head */
        '<circle cx="338" cy="134" r="10" fill="#f7c8a0"/>' +
        /* veil — blue */
        '<path d="M326 128 Q338 120 350 128 L355 185 Q338 190 322 185Z" fill="#7b1117" opacity=".9"/>' +
        /* face suggestion */
        /* robe */
        '<path d="M324 148 Q338 144 352 148 L356 210 Q338 215 320 210Z" fill="#5c0a0f"/>' +
        /* hands in prayer */
        '<ellipse cx="338" cy="168" rx="5" ry="3" fill="#f7c8a0" transform="rotate(-10 338 168)"/>' +
        /* ---- Joseph (right of manger) ---- */
        '<circle cx="422" cy="130" r="10" fill="#f0caa0"/>' +
        /* head covering */
        '<path d="M410 124 Q422 115 434 124 L438 165 Q422 170 406 165Z" fill="#8b6914" opacity=".9"/>' +
        /* robe */
        '<path d="M408 144 Q422 140 436 144 L440 210 Q422 215 404 210Z" fill="#2b1b1a" opacity=".85"/>' +
        /* staff */
        '<line x1="444" y1="118" x2="444" y2="210" stroke="#8b6914" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M444 118 Q452 110 450 100 Q444 108 444 118Z" fill="#8b6914"/>' +
        /* ---- Shepherd 1 (far left) ---- */
        '<circle cx="264" cy="140" r="9" fill="#f0caa0"/>' +
        '<path d="M254 148 Q264 143 274 148 L277 200 Q264 205 251 200Z" fill="#8b6914" opacity=".8"/>' +
        '<line x1="278" y1="130" x2="278" y2="202" stroke="#8b6914" stroke-width="3" stroke-linecap="round"/>' +
        /* shepherd staff hook */
        '<path d="M278 130 Q285 122 283 115 Q276 122 278 130Z" fill="#8b6914"/>' +
        /* ---- Shepherd 2 ---- */
        '<circle cx="224" cy="148" r="8" fill="#f7c8a0"/>' +
        '<path d="M216 155 Q224 151 232 155 L234 200 Q224 204 214 200Z" fill="#5c0a0f" opacity=".8"/>' +
        /* sheep */
        '<ellipse cx="195" cy="195" rx="22" ry="12" fill="#fbf8f3"/>' +
        '<circle cx="181" cy="193" r="10" fill="#fbf8f3"/>' +
        '<circle cx="178" cy="186" r="7" fill="#fbf8f3"/>' + /* head */
        '<circle cx="175" cy="183" r="2" fill="#2b1b1a"/>' + /* eye */
        '<line x1="184" y1="206" x2="181" y2="218" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="190" y1="208" x2="190" y2="218" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="197" y1="208" x2="197" y2="218" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="204" y1="207" x2="207" y2="218" stroke="#2b1b1a" stroke-width="2.5" stroke-linecap="round"/>' +
        /* ---- Wise Man 1 (right side) ---- */
        '<circle cx="494" cy="136" r="9" fill="#f0caa0"/>' +
        /* crown / turban */
        '<rect x="486" y="122" width="16" height="16" rx="8" fill="#c9933a"/>' +
        '<line x1="486" y1="130" x2="502" y2="130" stroke="#f0d080" stroke-width="2"/>' +
        '<circle cx="494" cy="122" r="3" fill="#f0d080"/>' +
        /* robe */
        '<path d="M483 148 Q494 143 505 148 L508 205 Q494 210 480 205Z" fill="#7b1117" opacity=".9"/>' +
        /* gift */
        '<rect x="502" y="175" width="14" height="10" rx="2" fill="#c9933a"/>' +
        '<rect x="508" y="171" width="2" height="18" fill="#f0d080"/>' +
        '<rect x="502" y="178" width="14" height="2" fill="#f0d080"/>' +
        /* ---- Wise Man 2 ---- */
        '<circle cx="528" cy="140" r="9" fill="#f7c8a0"/>' +
        '<path d="M516 128 Q528 120 540 128" stroke="#2b1b1a" stroke-width="3" fill="none"/>' +
        '<path d="M518 128 Q528 118 538 128 L540 148 Q528 150 516 148Z" fill="#7b1117" opacity=".9"/>' +
        '<path d="M516 150 Q528 145 540 150 L543 205 Q528 210 513 205Z" fill="#7b1117" opacity=".8"/>' +
        /* ---- Wise Man 3 ---- */
        '<circle cx="560" cy="144" r="8" fill="#f0caa0"/>' +
        '<path d="M548 132 Q560 124 572 132 L575 155 Q560 158 545 155Z" fill="#5c0a0f" opacity=".9"/>' +
        '<path d="M548 156 Q560 152 572 156 L574 205 Q560 210 546 205Z" fill="#5c0a0f" opacity=".8"/>' +
        /* camel silhouette — will be animated in CSS */
        '<g id="xmas-camel-group">' +
          '<g id="xmas-camel1" style="transform-origin:center">' +
            '<path d="M-60,218 C-50,205 -40,200 -20,200 C0,200 10,205 20,205 C30,205 35,195 50,190 C65,185 80,190 90,205 C100,220 90,230 80,230 C60,230 55,222 50,222 C45,222 30,228 20,228 C10,228 0,222 -20,222 C-40,222 -50,218 -60,218Z" fill="#2b1b1a" opacity=".7"/>' +
            /* hump */
            '<ellipse cx="30" cy="183" rx="22" ry="14" fill="#2b1b1a" opacity=".7"/>' +
            /* head */
            '<circle cx="90" cy="197" r="10" fill="#2b1b1a" opacity=".7"/>' +
            '<line x1="90" y1="207" x2="88" y2="225" stroke="#2b1b1a" stroke-width="6" opacity=".7" stroke-linecap="round"/>' +
            /* legs */
            '<line x1="10" y1="228" x2="8" y2="250" stroke="#2b1b1a" stroke-width="5" opacity=".7" stroke-linecap="round"/>' +
            '<line x1="30" y1="230" x2="30" y2="252" stroke="#2b1b1a" stroke-width="5" opacity=".7" stroke-linecap="round"/>' +
            '<line x1="60" y1="228" x2="58" y2="250" stroke="#2b1b1a" stroke-width="5" opacity=".7" stroke-linecap="round"/>' +
            '<line x1="78" y1="225" x2="80" y2="248" stroke="#2b1b1a" stroke-width="5" opacity=".7" stroke-linecap="round"/>' +
          '</g>' +
        '</g>' +
      '</svg>';
  }

  /* Inject camel walk animation */
  function injectNativityAnimations() {
    var style = document.createElement('style');
    style.textContent =
      /* Bethlehem star pulse */
      '@keyframes xmas-star-pulse{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}' +
      '#xmas-beth-star{animation:xmas-star-pulse 2.8s ease-in-out infinite;transform-origin:380px 23px;}' +
      '#xmas-beth-star-glow{animation:xmas-star-pulse 2.8s ease-in-out infinite;}' +
      /* Camel walk across hill — continuous left-to-right */
      '@keyframes xmas-camel-walk{0%{transform:translateX(0)}100%{transform:translateX(900px)}}' +
      '#xmas-camel-group{animation:xmas-camel-walk 28s linear infinite;}' +
      /* Camel fade in/out at edges */
      '@keyframes xmas-camel-fade{0%,100%{opacity:0}10%,80%{opacity:0.7}90%{opacity:0.5}}' +
      '#xmas-camel-group{animation:xmas-camel-walk 28s linear infinite,xmas-camel-fade 28s linear infinite;}' +
      /* Reduced motion */
      '@media(prefers-reduced-motion:reduce){' +
        '#xmas-beth-star,#xmas-beth-star-glow{animation:none!important;}' +
        '#xmas-camel-group{animation:none!important;}' +
      '}';
    document.head.appendChild(style);
  }

  /* ---- Build the nativity section wrapper (injected before footer) ---- */
  function buildNativitySection() {
    // Don't insert if already exists
    if (document.getElementById('xmas-nativity')) return;

    var footer = document.querySelector('footer');
    if (!footer) return;

    var section = document.createElement('section');
    section.id = 'xmas-nativity';
    section.setAttribute('aria-label', 'Christmas Nativity Scene');

    section.innerHTML =
      '<div style="text-align:center;padding-bottom:1rem;">' +
        '<p style="font-family:\'Cinzel\',serif;font-weight:600;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--xmas-muted);margin-bottom:.4rem;">Unto Us a Child is Born</p>' +
      '</div>' +
      '<div class="xmas-scene" id="xmas-nativity-scene" style="--scene-w:100%;--scene-h:260px;width:100%;max-width:760px;margin:0 auto;" aria-hidden="true"></div>';

    footer.parentNode.insertBefore(section, footer);
  }

  /* ---- Inject snowman scene after the hero section ---- */
  function buildSnowmanSection() {
    if (document.getElementById('xmas-snowman-scene')) return;

    var hero = document.getElementById('slideshow');
    if (!hero) return;

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;justify-content:center;align-items:flex-end;background:linear-gradient(to bottom,var(--xmas-crimson),var(--xmas-snow));padding:1rem 1rem 0;overflow:hidden;';

    var scene = document.createElement('div');
    scene.className = 'xmas-scene';
    scene.id = 'xmas-snowman-scene';
    scene.style.cssText = '--scene-w:160px;--scene-h:180px;';
    scene.setAttribute('aria-hidden', 'true');

    wrap.appendChild(scene);
    hero.parentNode.insertBefore(wrap, hero.nextSibling);
  }

  /* ---- Inject children scene into testimonies section ---- */
  function buildChildrenSection() {
    if (document.getElementById('xmas-children-scene')) return;

    var section = document.getElementById('testimonies');
    if (!section) return;

    var container = section.querySelector('.max-w-5xl');
    if (!container) return;

    var wrap = document.createElement('div');
    wrap.className = 'xmas-scene xmas-scene--hide-mobile';
    wrap.id = 'xmas-children-scene';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = '--scene-w:200px;--scene-h:160px;float:right;margin:0 0 1rem 1.5rem;shape-outside:inset(0);';

    container.prepend(wrap);
  }

  /* ---- Inject family scene into route-map section ---- */
  function buildFamilySection() {
    if (document.getElementById('xmas-family-scene')) return;

    var section = document.getElementById('route-map');
    if (!section) return;

    var container = section.querySelector('.max-w-7xl');
    if (!container) return;

    var wrap = document.createElement('div');
    wrap.className = 'xmas-scene xmas-scene--hide-mobile';
    wrap.id = 'xmas-family-scene';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = '--scene-w:240px;--scene-h:180px;float:left;margin:0 1.5rem 1rem 0;shape-outside:inset(0);';

    container.prepend(wrap);
  }

  /* ================================================================
     BOOT — DOMContentLoaded
     ================================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroSnow();

    if (!prefersReducedMotion) {
      initParallaxStars();
    }

    initGuidingStar();

    // Phase 3 — build scenes
    buildSnowmanSection();
    buildChildrenSection();
    buildFamilySection();
    buildNativitySection();

    // Populate SVG content
    buildSnowmanScene();
    buildChildrenScene();
    buildFamilyScene();
    buildNativityScene();

    // Inject CSS animations
    injectSnowmanAnimation();
    injectNativityAnimations();

    // Wire up IntersectionObserver for all scenes
    observeScenes();
  });

})();
