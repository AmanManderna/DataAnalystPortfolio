(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REVEAL_DELAY = reduceMotion ? 0 : 2000;

  /* ---------------- NAV ---------------- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  /* ---------------- SCROLL REVEAL (generic) ---------------- */
  const revealTargets = document.querySelectorAll('.viz-card, .insight-item, .dataset-card, .proj-stats-strip');
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

  /* ---------------- shared: reveal a chart container after scroll + delay ---------------- */
  function onScrollReveal(container, callback) {
    if (reduceMotion) { callback(); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(callback, REVEAL_DELAY);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    obs.observe(container);
  }

  /* ---------------- 3D BAR CHART ---------------- */
  window.buildChart3D = function (container, data, opts = {}) {
    const max = Math.max(...data.map(d => d.value));
    const maxHeightPx = opts.compact ? 118 : 148;
    data.forEach(d => {
      const col = document.createElement('div');
      col.className = 'bar3d-col' + (opts.cyan ? ' cyan' : '');

      const bar = document.createElement('div');
      bar.className = 'bar3d';
      const h = Math.max(6, Math.round((d.value / max) * maxHeightPx));
      bar.style.height = h + 'px';

      const val = document.createElement('div');
      val.className = 'bar3d-val';
      val.textContent = d.display !== undefined ? d.display : d.value;

      bar.innerHTML = '<div class="b-front"></div><div class="b-side"></div><div class="b-top"></div>';
      bar.appendChild(val);

      const labelEl = document.createElement('div');
      labelEl.className = 'bar3d-label';
      labelEl.textContent = d.label;

      col.appendChild(bar);
      col.appendChild(labelEl);
      container.appendChild(col);
    });
    onScrollReveal(container, () => container.classList.add('in'));
  };

  /* ---------------- LINE / AREA CHART ---------------- */
  window.buildLineChart = function (container, data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 100');
    svg.classList.add('linechart-svg');

    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(0, Math.min(...data.map(d => d.value)));
    const pad = 10;
    const w = 300, topPad = 10, bottomY = 85;
    const stepX = (w - pad * 2) / (data.length - 1);

    const pts = data.map((d, i) => {
      const x = pad + i * stepX;
      const y = topPad + (1 - (d.value - min) / (max - min || 1)) * (bottomY - topPad);
      return { x, y, d };
    });

    const linePath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');
    const areaPath = linePath + ` L${pts[pts.length - 1].x},${bottomY} L${pts[0].x},${bottomY} Z`;

    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', areaPath);
    area.classList.add('linechart-area');

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', linePath);
    line.classList.add('linechart-line');

    svg.appendChild(area);
    svg.appendChild(line);

    pts.forEach(p => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); dot.setAttribute('r', 3.5);
      dot.classList.add('linechart-dot');
      svg.appendChild(dot);
    });

    container.appendChild(svg);

    const labels = document.createElement('div');
    labels.className = 'linechart-labels';
    data.forEach(d => {
      const s = document.createElement('span');
      s.textContent = d.label;
      labels.appendChild(s);
    });
    container.appendChild(labels);

    if (!reduceMotion) {
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      line.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.16,.84,.44,1)';
    }

    onScrollReveal(container, () => {
      container.classList.add('in');
      if (!reduceMotion) line.style.strokeDashoffset = '0';
    });
  };

  /* ---------------- DONUT CHART ---------------- */
  window.buildDonut = function (container, segments) {
    const r = 50, cx = 60, cy = 60, circumference = 2 * Math.PI * r;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.classList.add('donut-svg');

    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('cx', cx); track.setAttribute('cy', cy); track.setAttribute('r', r);
    track.classList.add('donut-track');
    svg.appendChild(track);

    const total = segments.reduce((s, x) => s + x.value, 0);
    let cumulative = 0;
    const segEls = [];
    segments.forEach(seg => {
      const frac = seg.value / total;
      const segLen = frac * circumference;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx); circle.setAttribute('cy', cy); circle.setAttribute('r', r);
      circle.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
      circle.classList.add('donut-seg');
      circle.style.stroke = seg.color;
      circle.style.strokeDasharray = `${segLen} ${circumference - segLen}`;
      circle.dataset.targetOffset = -cumulative;
      circle.style.strokeDashoffset = circumference;
      cumulative += segLen;
      svg.appendChild(circle);
      segEls.push(circle);
    });

    const topSeg = segments.reduce((a, b) => (a.value > b.value ? a : b));
    const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valText.setAttribute('x', 60); valText.setAttribute('y', 56); valText.setAttribute('text-anchor', 'middle');
    valText.classList.add('donut-center-val');
    valText.textContent = Math.round((topSeg.value / total) * 100) + '%';
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', 60); labelText.setAttribute('y', 70); labelText.setAttribute('text-anchor', 'middle');
    labelText.classList.add('donut-center-label');
    labelText.textContent = topSeg.label;
    svg.appendChild(valText);
    svg.appendChild(labelText);

    container.appendChild(svg);

    const legend = document.createElement('div');
    legend.className = 'donut-legend';
    segments.forEach(seg => {
      const row = document.createElement('div');
      row.className = 'donut-legend-item';
      const dot = document.createElement('span');
      dot.className = 'donut-dot';
      dot.style.background = seg.color;
      const label = document.createElement('span');
      label.textContent = seg.label;
      const val = document.createElement('span');
      val.className = 'donut-legend-val';
      val.textContent = Math.round((seg.value / total) * 100) + '%';
      row.appendChild(dot); row.appendChild(label); row.appendChild(val);
      legend.appendChild(row);
    });
    container.appendChild(legend);

    onScrollReveal(container, () => {
      segEls.forEach(c => { c.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.16,.84,.44,1)'; c.style.strokeDashoffset = c.dataset.targetOffset; });
    });
  };

  /* ---------------- SCATTER CHART ---------------- */
  window.buildScatter = function (container, points, opts = {}) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 130');
    svg.classList.add('scatter-svg');

    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = 0, yMax = Math.max(...ys);
    const pad = 20, top = 10, bottom = 105;
    const toX = x => pad + ((x - xMin) / (xMax - xMin || 1)) * (300 - pad * 2);
    const toY = y => top + (1 - (y - yMin) / (yMax - yMin || 1)) * (bottom - top);

    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    grid.classList.add('scatter-grid');
    [0.25, 0.5, 0.75, 1].forEach(f => {
      const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const y = top + (bottom - top) * (1 - f);
      ln.setAttribute('x1', pad); ln.setAttribute('x2', 300 - pad + 10);
      ln.setAttribute('y1', y); ln.setAttribute('y2', y);
      grid.appendChild(ln);
    });
    svg.appendChild(grid);

    if (opts.trend) {
      const sorted = [...points].sort((a, b) => a.x - b.x);
      const trend = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = 'M' + toX(sorted[0].x) + ',' + toY(sorted[0].y) + ' L' + toX(sorted[sorted.length - 1].x) + ',' + toY(sorted[sorted.length - 1].y);
      trend.setAttribute('d', d);
      trend.classList.add('scatter-trend');
      svg.appendChild(trend);
    }

    points.forEach((p, i) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', toX(p.x)); dot.setAttribute('cy', toY(p.y)); dot.setAttribute('r', 6);
      dot.classList.add('scatter-dot');
      dot.style.transitionDelay = (i * 0.05) + 's';
      svg.appendChild(dot);
    });

    container.appendChild(svg);

    if (opts.labels) {
      const labelRow = document.createElement('div');
      labelRow.className = 'scatter-labels';
      opts.labels.forEach(l => {
        const s = document.createElement('span');
        s.textContent = l;
        labelRow.appendChild(s);
      });
      container.appendChild(labelRow);
    }

    onScrollReveal(container, () => container.classList.add('in'));
  };

  /* ---------------- HEATMAP ---------------- */
  window.buildHeatmap = function (container, rows, cols, matrix) {
    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.gridTemplateColumns = `56px repeat(${cols.length}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows.length}, 1fr)`;

    const max = Math.max(...matrix.flat());
    rows.forEach((rowLabel, r) => {
      const rl = document.createElement('div');
      rl.className = 'heatmap-rowlabel';
      rl.textContent = rowLabel;
      grid.appendChild(rl);
      cols.forEach((c, ci) => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        const intensity = matrix[r][ci] / max;
        cell.style.setProperty('--cell-op', (0.18 + intensity * 0.82).toFixed(2));
        cell.style.transitionDelay = ((r * cols.length + ci) * 0.03) + 's';
        grid.appendChild(cell);
      });
    });
    container.appendChild(grid);

    const collabels = document.createElement('div');
    collabels.className = 'heatmap-collabels';
    collabels.style.gridTemplateColumns = `56px repeat(${cols.length}, 1fr)`;
    const spacer = document.createElement('div');
    collabels.appendChild(spacer);
    cols.forEach(c => {
      const cl = document.createElement('div');
      cl.className = 'heatmap-collabel';
      cl.textContent = c;
      collabels.appendChild(cl);
    });
    container.appendChild(collabels);

    onScrollReveal(container, () => container.classList.add('in'));
  };
})();
