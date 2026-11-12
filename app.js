// Jesus Youth Family Gathering 2026 - Main UI & Carousels

// Always scroll to top on page load / refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  // Double-ensure top after DOM is ready (handles some browser quirks)
  window.scrollTo({ top: 0, behavior: 'instant' });
  initMobileMenu();
  initHeroCarousel();
  initInvitationCarousel();
  initTestimonyCarousel();
  initLightbox();
  initCopyButtons();
});

// Mobile Navigation
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const header = toggleBtn ? toggleBtn.closest('header') : null;
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  // Close when a nav link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });

  // Close when clicking anywhere outside the header
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('hidden') && header && !header.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
}

// 1. Top Hero Carousel (Photos & Videos of previous programs)
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const pauseBtn = document.getElementById('hero-pause-btn');
  const progressBar = document.getElementById('hero-progress-bar');

  if (!slides.length) return;

  let currentIndex = 0;
  let isPlaying = true;
  let slideInterval = null;
  const slideDuration = 4000; // 4s per slide (reduced time with smooth crossfade)

  function showSlide(index) {
    slides.forEach((s, idx) => {
      if (idx === index) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    dots.forEach((d, idx) => {
      if (idx === index) {
        d.classList.add('bg-amber-400', 'w-8');
        d.classList.remove('bg-white/50', 'w-2.5');
      } else {
        d.classList.remove('bg-amber-400', 'w-8');
        d.classList.add('bg-white/50', 'w-2.5');
      }
    });

    resetProgressBar();
    currentIndex = index;
  }

  function resetProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    setTimeout(() => {
      if (isPlaying) {
        progressBar.style.transition = `width ${slideDuration}ms linear`;
        progressBar.style.width = '100%';
      }
    }, 50);
  }

  function nextSlide() {
    let next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
    resetProgressBar();
    slideInterval = setInterval(() => {
      if (isPlaying) {
        nextSlide();
      }
    }, slideDuration);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      startAutoplay();
    });
  });

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        pauseBtn.innerHTML = `
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        `;
        resetProgressBar();
      } else {
        pauseBtn.innerHTML = `
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        `;
        if (progressBar) progressBar.style.width = '0%';
      }
    });
  }

  showSlide(0);
  startAutoplay();
}

// 2. Invitation Carousel (English & Malayalam 33rd gathering invite)
function initInvitationCarousel() {
  const slides = document.querySelectorAll('.invitation-slide');
  const dots = document.querySelectorAll('.invite-dot');
  const prevBtn = document.getElementById('invite-prev-btn');
  const nextBtn = document.getElementById('invite-next-btn');
  const langToggleEn = document.getElementById('lang-toggle-en');
  const langToggleMl = document.getElementById('lang-toggle-ml');

  if (!slides.length) return;

  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((s, idx) => {
      if (idx === index) {
        s.classList.add('active');
        s.classList.remove('hidden');
      } else {
        s.classList.remove('active');
        s.classList.add('hidden');
      }
    });

    dots.forEach((d, idx) => {
      if (idx === index) {
        d.classList.add('bg-amber-500', 'w-8');
        d.classList.remove('bg-slate-300', 'w-2.5');
      } else {
        d.classList.remove('bg-amber-500', 'w-8');
        d.classList.add('bg-slate-300', 'w-2.5');
      }
    });

    if (langToggleEn && langToggleMl) {
      if (index === 0) {
        langToggleEn.classList.add('bg-amber-500', 'text-white');
        langToggleEn.classList.remove('bg-slate-100', 'text-slate-700');
        langToggleMl.classList.remove('bg-amber-500', 'text-white');
        langToggleMl.classList.add('bg-slate-100', 'text-slate-700');
      } else if (index === 1) {
        langToggleMl.classList.add('bg-amber-500', 'text-white');
        langToggleMl.classList.remove('bg-slate-100', 'text-slate-700');
        langToggleEn.classList.remove('bg-amber-500', 'text-white');
        langToggleEn.classList.add('bg-slate-100', 'text-slate-700');
      }
    }

    currentIndex = index;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let next = (currentIndex + 1) % slides.length;
      showSlide(next);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let prev = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prev);
    });
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const idx = parseInt(d.getAttribute('data-index'), 10);
      showSlide(idx);
    });
  });

  if (langToggleEn) {
    langToggleEn.addEventListener('click', () => showSlide(0));
  }
  if (langToggleMl) {
    langToggleMl.addEventListener('click', () => showSlide(1));
  }

  showSlide(0);
}

// 3. Testimonies Carousel (3 people, 3 sentences each)
function initTestimonyCarousel() {
      var frame = document.getElementById('g-frame');
      var slides = [].slice.call(frame.querySelectorAll('.gslide'));
      var dots = [].slice.call(document.querySelectorAll('#g-dots button'));
      var cap = document.getElementById('g-cap'), tag = document.getElementById('g-tag'),
          title = document.getElementById('g-title'), desc = document.getElementById('g-desc');
      var i = -1, timer, first = true;

      function show(n) {
        i = (n + slides.length) % slides.length;
        var s = slides[i];
        slides.forEach(function (el, k) { el.classList.toggle('active', k === i); });
        dots.forEach(function (d, k) {
          d.className = 'h-2 rounded-full transition-all ' + (k === i ? 'w-6 bg-amber-400' : 'w-2 bg-white/50');
        });
        // keep the lightbox in sync with the visible photo
        frame.dataset.fullImg = s.dataset.fullImg;
        frame.dataset.title = s.dataset.title;
        frame.dataset.caption = s.dataset.caption;
        function setText() {
          tag.textContent = s.dataset.tag; title.textContent = s.dataset.title; desc.textContent = s.dataset.short;
          cap.style.opacity = 1;
        }
        if (first) { first = false; setText(); } else { cap.style.opacity = 0; setTimeout(setText, 350); }
      }
      function start() { stop(); timer = setInterval(function () { show(i + 1); }, 5500); }
      function stop() { clearInterval(timer); }

      dots.forEach(function (d, k) {
        d.addEventListener('click', function (e) { e.stopPropagation(); show(k); if (!reduce) start(); });
      });
      var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      show(0);
      if (!reduce) {
        start();
        frame.addEventListener('mouseenter', stop);
        frame.addEventListener('mouseleave', start);
      }
    }



// 4. Lightbox for Photo Gallery
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalTitle = document.getElementById('lightbox-title');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (!modal) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-full-img') || trigger.querySelector('img')?.src;
      const title = trigger.getAttribute('data-title') || '';
      const caption = trigger.getAttribute('data-caption') || '';

      if (modalImg) modalImg.src = src;
      if (modalTitle) modalTitle.textContent = title;
      if (modalCaption) modalCaption.textContent = caption;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// 5. Copy to Clipboard for Bank / UPI Credentials
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-clipboard');
      if (!text) return;

      const originalHtml = btn.innerHTML;

      const setCopiedUI = () => {
        btn.innerHTML = `<span class="text-emerald-700 font-bold inline-flex items-center gap-1 text-[11px] animate-pulse"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!</span>`;
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          setCopiedUI();
          return;
        } catch (err) {
          // Fall through to fallback
        }
      }

      // Fallback for older browsers / webviews
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedUI();
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    });
  });
}

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("ended");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    }
});


// Gallery Category Filtering logic
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-navy-950');
        b.classList.add('bg-white/10', 'text-slate-200');
      });
      btn.classList.remove('bg-white/10', 'text-slate-200');
      btn.classList.add('bg-amber-500', 'text-navy-950');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});


  (function () {
    var UPI = { pa: 'sanjochirammel@oksbi', pn: 'SANJO JOHN C' };
    var root = document.getElementById('family-offering');
    var $ = function (s) { return root.querySelector(s); };
    var modal = $('#ssModal'), pay = $('#ssPay');
    var stepGive = $('#ssStepGive'), stepThanks = $('#ssStepThanks');
    var lastFocus = null;
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    /* Santa peeks in once, when the section scrolls into view */
    var peek = $('#ssPeek');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, ob) {
        if (es[0].isIntersecting) { peek.classList.add('in'); ob.disconnect(); }
      }, { threshold: 0.6 }).observe(peek);
    } else { peek.classList.add('in'); }

    /* Open / close pop-up */
    function openModal() {
      lastFocus = document.activeElement;
      stepGive.hidden = false;
      stepThanks.hidden = true;
      /* Reset any previous QR highlight */
      var qr = root.querySelector('.ss-modal-qr-wrap');
      if (qr) { qr.style.outline = ''; qr.style.borderRadius = ''; }
      var hint = root.querySelector('.ss-qr-hint');
      if (hint) hint.style.display = 'none';
      modal.classList.add('open');
      if (pay) pay.focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      if (lastFocus) lastFocus.focus();
    }

    /* UPI link click — on desktop highlight QR since upi:// won't work */
    if (pay) {
      pay.addEventListener('click', function () {
        if (!isMobile) {
          var qr = root.querySelector('.ss-modal-qr-wrap');
          if (qr) { qr.style.outline = '3px solid #a3191f'; qr.style.borderRadius = '10px'; }
          var hint = root.querySelector('.ss-qr-hint');
          if (hint) hint.style.display = 'block';
        }
      });
    }

    $('#ssGive').addEventListener('click', openModal);
    $('#ssClose').addEventListener('click', closeModal);
    $('#ssDone').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    /* Copy buttons */
    function copyText(text, btn, label) {
      function ok() {
        var old = btn.textContent;
        btn.textContent = 'Copied ✓';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = label || old; btn.classList.remove('done'); }, 1500);
      }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); ok(); } catch (e) {}
        document.body.removeChild(t);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(ok, fallback);
      } else { fallback(); }
    }

    root.querySelectorAll('.ss-copy').forEach(function (b) {
      b.addEventListener('click', function () { copyText(b.dataset.copy, b); });
    });
    root.querySelectorAll('.ss-mcopy').forEach(function (b) {
      b.addEventListener('click', function () { copyText(b.dataset.copy, b); });
    });
  })();

