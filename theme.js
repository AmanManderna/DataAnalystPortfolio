/* Day / night mode for every page — the only place the mode is handled.
   Loaded at the top of <head> on each page so it never flashes the wrong mode. */
(() => {
  const KEY = 'aman-theme-v2', root = document.documentElement;
  const apply = () => {
    let t = null;
    try { t = localStorage.getItem(KEY); } catch (e) {}
    t === 'dark' ? root.setAttribute('data-theme', 'dark') : root.removeAttribute('data-theme');
  };
  apply();                                                         // day mode unless night was chosen
  addEventListener('pageshow', apply);                             // Back / Forward buttons
  addEventListener('storage', e => e.key === KEY && apply());      // other open tabs
  document.addEventListener('click', e => {                        // the sun / moon button
    if (!e.target.closest('#themeToggle')) return;
    const dark = root.getAttribute('data-theme') !== 'dark';
    dark ? root.setAttribute('data-theme', 'dark') : root.removeAttribute('data-theme');
    try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
  });
})();
