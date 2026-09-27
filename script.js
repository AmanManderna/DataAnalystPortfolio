/* Shared site script — used by index.html and the case-study pages.
   Every block checks that its elements exist, so it's safe on any page. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- THEME (day paper / night ink) ---------------- */
  const themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const root = document.documentElement;
      const dark = root.getAttribute('data-theme') === 'dark';
      if (dark) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
       try { localStorage.setItem('aman-theme-v2', dark ? 'light' : 'dark'); } catch (e) {}
    });
  }

  /* ---------------- NAV ---------------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks = $('.nav-links');
  const progress = $('#progress');

  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    }));
  }

  // scroll-spy: underline the nav link for the section in view
  const spyLinks = $$('.nav-links a[href^="#"]');
  if (spyLinks.length) {
    const byId = new Map(spyLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        spyLinks.forEach(a => a.classList.remove('active'));
        const link = byId.get(e.target.id);
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------------- HERO: draggable stickers + photo tilt ---------------- */
  const stage = $('#photoStage');
  const polaroid = $('#polaroid');
  let dragging = false;

  $$('[data-drag]').forEach(el => {
    let startX, startY, baseX = 0, baseY = 0;
    el.addEventListener('pointerdown', e => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      startX = e.clientX; startY = e.clientY;
    });
    el.addEventListener('pointermove', e => {
      if (!el.classList.contains('dragging')) return;
      const dx = baseX + e.clientX - startX;
      const dy = baseY + e.clientY - startY;
      el.style.translate = `${dx}px ${dy}px`;
    });
    const end = e => {
      if (!el.classList.contains('dragging')) return;
      baseX += e.clientX - startX; baseY += e.clientY - startY;
      el.classList.remove('dragging');
      dragging = false;
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  });

  if (stage && polaroid && canHover && !reduceMotion) {
    stage.addEventListener('mousemove', e => {
      if (dragging) return;
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      polaroid.style.transform = `rotate(${2.5 - x * 4}deg) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    stage.addEventListener('mouseleave', () => { polaroid.style.transform = ''; });
  }

  /* ---------------- IMPACT METRICS: count-up ---------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = reduceMotion ? 1 : 1400;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  const dashCard = $('#dashCard');
  if (dashCard) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { $$('.stat-num', e.target).forEach(animateCount); io.unobserve(e.target); }
    }), { threshold: 0.4 });
    io.observe(dashCard);
  }

  // chart crosshair: follows the line as you move across it
  const chartBox = $('#chartBox'), chartLine = $('#chartLine');
  if (chartBox && chartLine) {
    const pts = chartLine.getAttribute('points').trim().split(/\s+/).map(p => p.split(',').map(Number));
    const cross = $('#chartCross'), dot = $('#chartDot');
    const move = clientX => {
      const r = chartBox.getBoundingClientRect();
      const fx = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      const vx = fx * 320;
      let i = pts.findIndex(p => p[0] >= vx); if (i <= 0) i = 1;
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const vy = y0 + (y1 - y0) * ((vx - x0) / (x1 - x0 || 1));
      cross.style.left = `${fx * 100}%`;
      dot.style.left = `${fx * 100}%`;
      dot.style.top = `${(vy / 90) * 100}%`;
    };
    chartBox.addEventListener('mousemove', e => move(e.clientX));
    chartBox.addEventListener('touchmove', e => move(e.touches[0].clientX), { passive: true });
  }

  /* ---------------- SKILLS: query console ---------------- */
  const consoleEl = $('#console');
  if (consoleEl) {
    const queries = [
      'SELECT tool, used_for FROM aman.toolkit ORDER BY is_primary DESC;',
      'SELECT concept FROM aman.core_concepts;',
      'SELECT strength FROM aman.strengths;',
      'SELECT skill FROM aman.working_with_others;',
    ];
    const codeEl = $('#queryText');
    const status = $('#queryStatus');
    const tabs = $$('.console-tab', consoleEl);
    const panels = $$('.result-panel', consoleEl);
    let current = 0, token = 0;

    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const highlight = q => esc(q)
      .replace(/\b(aman\.\w+)/g, '<span class="tb">$1</span>')
      .replace(/\b(SELECT|FROM|ORDER BY|WHERE|DESC|ASC)\b/g, '<span class="kw">$1</span>');

    async function run(i) {
      const my = ++token;
      current = i;
      tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
      panels.forEach(p => p.classList.remove('active'));
      status.textContent = 'running…';

      const q = queries[i];
      if (!reduceMotion) {
        codeEl.innerHTML = '<span class="caret"></span>';
        for (let c = 1; c <= q.length; c++) {
          if (my !== token) return;
          codeEl.innerHTML = esc(q.slice(0, c)) + '<span class="caret"></span>';
          await new Promise(r => setTimeout(r, 14));
        }
        await new Promise(r => setTimeout(r, 180));
        if (my !== token) return;
      }
      codeEl.innerHTML = highlight(q);

      const panel = panels[i];
      panel.classList.add('active');
      const rows = $$('tbody tr', panel);
      rows.forEach((row, k) => {
        row.classList.remove('row-in');
        void row.offsetWidth;
        row.style.animationDelay = `${k * 45}ms`;
        row.classList.add('row-in');
      });
      const ms = (Math.random() * 0.03 + 0.01).toFixed(3);
      status.innerHTML = `<span class="ok">✓</span> ${rows.length} rows returned in ${ms}s`;
    }

    tabs.forEach((t, i) => t.addEventListener('click', () => run(i)));
    $('#runQuery').addEventListener('click', () => run(current));
    codeEl.innerHTML = highlight(queries[0]);

    // play the first query once when the console scrolls into view
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { run(0); io.disconnect(); }
    }), { threshold: 0.35 });
    io.observe(consoleEl);
  }

  /* ---------------- CERTIFICATE COUNTS on the folders ---------------- */
  if (window.CERTIFICATES) {
    $$('[data-cert-count]').forEach(el => {
      const set = window.CERTIFICATES[el.dataset.certCount];
      if (set) el.textContent = set.items.length;
    });
  }

  /* ---------------- COPY EMAIL ---------------- */
  const copyBtn = $('#copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        copyBtn.textContent = 'Copied ✓';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.textContent = 'Copy email'; copyBtn.classList.remove('copied'); }, 1800);
      } catch (e) {
        window.location.href = 'mailto:' + copyBtn.dataset.email;
      }
    });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealTargets = $$(
    '.section-head, .section-head-row, .dashboard-card, .console, .timeline-item, .project-card, .folder, .edu-card, .contact-inner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------- PROJECT CARD MINI BAR CHARTS ---------------- */
  function buildBars(selector, values, barWidth, gap) {
    const g = $(selector);
    if (!g) return;
    const max = Math.max(...values);
    const totalWidth = values.length * (barWidth + gap) - gap;
    const offsetX = (300 - totalWidth) / 2;
    const rects = values.map((v, i) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', offsetX + i * (barWidth + gap));
      rect.setAttribute('y', 130);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', 0);
      rect.setAttribute('rx', 2);
      g.appendChild(rect);
      return [rect, (v / max) * 120, i];
    });
    const grow = () => rects.forEach(([rect, h, i]) => {
       const d = (i * 0.2 / rects.length).toFixed(3); // whole chart done in 0.75s
      rect.style.transition = reduceMotion ? 'none' : `height .55s cubic-bezier(.34,1.56,.64,1) ${d}s, y .55s cubic-bezier(.34,1.56,.64,1) ${d}s`;
      rect.setAttribute('height', h);
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { requestAnimationFrame(grow); io.disconnect(); }
    }), { threshold: 0.3 });
    io.observe(g.closest('svg'));
  }
  buildBars('.bars-uber', [20, 24, 30, 38, 55, 70, 62, 48, 40, 45, 58, 78, 95, 88, 60, 42], 12, 3.5);
  buildBars('.bars-ev', [30, 42, 38, 90, 55, 70, 48, 100, 60, 35], 22, 6);
  buildBars('.bars-linkedin', [100, 88, 76, 64, 58, 44, 36], 32, 8);
})();
