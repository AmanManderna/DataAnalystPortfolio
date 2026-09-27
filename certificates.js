/* Renders a certificate page from certificates-data.js.
   The page's <body data-set="analytics|corporate"> picks which list to show. */
(() => {
  const setKey = document.body.dataset.set;
  const data = (window.CERTIFICATES || {})[setKey];
  const grid = document.getElementById('certGrid');
  if (!data || !grid) return;

  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const items = data.items.map((c, i) => ({ ...c, i }));
  const categories = [...new Set(items.map(c => c.category).filter(Boolean))];

  // header stats
  document.getElementById('certCount').textContent = items.length;
  document.getElementById('catCount').textContent = categories.length;

  // placeholder drawn when there is no image (or it fails to load)
  const placeholder = c => `
    <div class="cert-ph">
      <span class="cert-ph-kicker">Certificate</span>
      <span class="cert-ph-title">${esc(c.title)}</span>
      <span class="cert-ph-issuer">${esc(c.issuer)}</span>
      <span class="cert-ph-seal"></span>
    </div>`;
  window.__certImgFail = img => { img.insertAdjacentHTML('afterend', placeholder(items[+img.dataset.i])); img.remove(); };
  const media = c => c.image
    ? `<img src="${esc(c.image)}" alt="${esc(c.title)} certificate" loading="lazy" data-i="${c.i}" onerror="__certImgFail(this)">`
    : placeholder(c);

  // filter chips
  const chipsEl = document.getElementById('certChips');
  const chipDefs = [['All', items.length], ...categories.map(cat => [cat, items.filter(c => c.category === cat).length])];
  chipsEl.innerHTML = chipDefs.map(([name, n], k) =>
    `<button class="chip" aria-pressed="${k === 0}" data-cat="${k === 0 ? '' : esc(name)}">${esc(name)}<span class="n">${n}</span></button>`
  ).join('');
  if (categories.length < 2) chipsEl.hidden = true;

  let activeCat = '', query = '';

  function render() {
    const q = query.trim().toLowerCase();
    const shown = items.filter(c =>
      (!activeCat || c.category === activeCat) &&
      (!q || [c.title, c.issuer, c.desc, c.category].join(' ').toLowerCase().includes(q))
    );
    if (!shown.length) {
      grid.innerHTML = `<p class="cert-empty">nothing here matches “${esc(query)}” — try another word?</p>`;
      return;
    }
    grid.innerHTML = shown.map((c, k) => {
      const tilt = ((c.i * 37) % 7 - 3) * 0.3; // stable, slightly different tilt per card
      return `
      <article class="cert-card" role="button" tabindex="0" style="--tilt:${tilt}deg; animation-delay:${Math.min(k, 12) * 45}ms" data-i="${c.i}" aria-label="View ${esc(c.title)}">
        <span class="pin" aria-hidden="true"></span>
        <div class="cert-thumb">${media(c)}</div>
        <div class="cert-body">
          ${c.category ? `<span class="cert-cat">${esc(c.category)}</span>` : ''}
          <h3>${esc(c.title)}</h3>
          <p class="cert-desc">${esc(c.desc)}</p>
          <div class="cert-meta"><span>${esc(c.issuer)}</span><span>${esc(c.date)}</span></div>
        </div>
      </article>`;
    }).join('');
  }

  chipsEl.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeCat = chip.dataset.cat;
    chipsEl.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    render();
  });
  document.getElementById('certSearch').addEventListener('input', e => { query = e.target.value; render(); });

  // lightbox
  const lb = document.getElementById('lightbox');
  const lbMedia = document.getElementById('lbMedia');
  grid.addEventListener('click', e => {
    const card = e.target.closest('.cert-card');
    if (!card) return;
    const c = items[+card.dataset.i];
    lbMedia.innerHTML = media(c).replace(' loading="lazy"', '');
    document.getElementById('lbTitle').textContent = c.title;
    document.getElementById('lbMeta').textContent = [c.issuer, c.date, c.category].filter(Boolean).join(' · ');
    document.getElementById('lbDesc').textContent = c.desc || '';
    const link = document.getElementById('lbLink');
    link.hidden = !c.link;
    if (c.link) link.href = c.link;
    const open = document.getElementById('lbOpen');
    open.hidden = !c.image;
    if (c.image) open.href = c.image;
    const lbImg = lbMedia.querySelector('img');
    if (lbImg) lbImg.addEventListener('error', () => { open.hidden = true; });
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  });
  grid.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('cert-card')) { e.preventDefault(); e.target.click(); }
  });
  document.getElementById('lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  render();
})();
