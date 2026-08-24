(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- NAV ---------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------------- COUNTER ANIMATION ---------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = reduceMotion ? 1 : 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(animateCount);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const dashCard = document.getElementById('dashCard');
  if (dashCard) statObserver.observe(dashCard);

  /* ---------------- DASHBOARD TILT ---------------- */
  if (dashCard && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const heroRight = document.querySelector('.hero-right');
    heroRight.addEventListener('mousemove', (e) => {
      const rect = dashCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      dashCard.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    heroRight.addEventListener('mouseleave', () => {
      dashCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ---------------- TERMINAL TYPING ---------------- */
  const terminalBody = document.getElementById('terminalBody');
  const lines = [
    { prompt: '> whoami', out: 'Aman Manderna — Data Analyst' },
    { prompt: '> focus', out: 'SQL · Python · Power BI · Excel · Tableau' },
    { prompt: '> current_role', out: 'Associate Analyst @ GlobalLogic' },
    { prompt: '> recognition', out: '4x Key Contributor (KC)' },
    { prompt: '> status', out: 'Open to new opportunities ●' },
  ];

  function renderTerminalStatic() {
    terminalBody.innerHTML = lines.map(l =>
      `<div><span style="color:var(--accent)">${l.prompt}</span><br><span style="color:var(--text-muted)">${l.out}</span></div>`
    ).join('<br>');
  }

  async function typeTerminal() {
    for (const line of lines) {
      const promptEl = document.createElement('div');
      const promptSpan = document.createElement('span');
      promptSpan.style.color = 'var(--accent)';
      promptEl.appendChild(promptSpan);
      terminalBody.appendChild(promptEl);

      for (const ch of line.prompt) {
        promptSpan.textContent += ch;
        await new Promise(r => setTimeout(r, 18));
      }

      const outEl = document.createElement('div');
      outEl.style.color = 'var(--text-muted)';
      outEl.style.marginBottom = '14px';
      outEl.textContent = line.out;
      terminalBody.appendChild(outEl);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (reduceMotion) renderTerminalStatic();
        else typeTerminal();
        terminalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (terminalBody) terminalObserver.observe(terminalBody);

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .skill-card, .timeline-item, .project-card, .edu-card, .cert-list, .contact-inner, .terminal'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 40);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------- PARTICLES (hero only, sparse) ---------------- */
  const canvas = document.getElementById('particles');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      const hero = document.querySelector('.hero');
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function initParticles() {
      const count = Math.min(38, Math.floor((w * h) / 32000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.4 + 0.4,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 185, 66, 0.35)';
        ctx.fill();
      });
      // faint connecting lines for nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(79, 209, 197, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ---------------- PROJECT BAR CHARTS (generated SVG bars) ---------------- */
  function buildBars(selector, values, barWidth, gap) {
    const g = document.querySelector(selector);
    if (!g) return;
    const max = Math.max(...values);
    const totalWidth = values.length * (barWidth + gap) - gap;
    const offsetX = (300 - totalWidth) / 2;
    values.forEach((v, i) => {
      const h = (v / max) * 110;
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', offsetX + i * (barWidth + gap));
      rect.setAttribute('y', 130 - h);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', 0);
      rect.setAttribute('rx', 2);
      g.appendChild(rect);
      requestAnimationFrame(() => {
        rect.style.transition = `height ${reduceMotion ? '0s' : '0.8s'} cubic-bezier(.16,.84,.44,1) ${i * 0.05}s, y ${reduceMotion ? '0s' : '0.8s'} cubic-bezier(.16,.84,.44,1) ${i * 0.05}s`;
        rect.setAttribute('y', 130 - h);
        rect.setAttribute('height', h);
      });
    });
  }

  // Uber: ride volume by hour block (24 -> compressed to 16 bars), peak around morning/evening
  buildBars('.bars-uber',
    [20, 24, 30, 38, 55, 70, 62, 48, 40, 45, 58, 78, 95, 88, 60, 42],
    12, 3.5);

  // EV: state-wise adoption, a few states clearly higher
  buildBars('.bars-ev',
    [30, 42, 38, 90, 55, 70, 48, 100, 60, 35],
    22, 6);

  // LinkedIn: skill demand frequency
  buildBars('.bars-linkedin',
    [100, 88, 76, 64, 58, 44, 36],
    32, 8);

})();
