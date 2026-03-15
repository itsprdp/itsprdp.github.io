document.addEventListener('DOMContentLoaded', () => {
  const WORKER = 'https://likes.itsprdp.workers.dev';
  const slug = window.location.pathname;

  // ── View counter ─────────────────────────────────────────────
  const viewEl = document.getElementById('post-views');
  if (viewEl) {
    // Show count
    fetch(`${WORKER}?slug=${encodeURIComponent(slug)}&type=view`)
      .then(r => r.json())
      .then(({ count }) => { viewEl.textContent = count.toLocaleString() + ' views'; })
      .catch(() => {});

    // Increment once per session
    if (!sessionStorage.getItem('viewed:' + slug)) {
      fetch(`${WORKER}?slug=${encodeURIComponent(slug)}&type=view`, { method: 'POST' })
        .then(() => sessionStorage.setItem('viewed:' + slug, '1'))
        .catch(() => {});
    }
  }

  // ── Reading depth tracker ─────────────────────────────────────
  const article = document.querySelector('article');
  if (!article) return;

  const milestones = [25, 50, 75, 100];
  const fired = new Set(
    milestones.filter(p => sessionStorage.getItem(`depth:${p}:${slug}`))
  );

  const sendDepth = (pct) => {
    if (fired.has(pct)) return;
    fired.add(pct);
    sessionStorage.setItem(`depth:${pct}:${slug}`, '1');
    fetch(`${WORKER}?slug=${encodeURIComponent(slug)}&type=depth&pct=${pct}`, { method: 'POST' })
      .catch(() => {});
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = article.getBoundingClientRect();
      const articleHeight = article.offsetHeight;
      const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.5);
      const pct = Math.min(100, Math.round((scrolled / articleHeight) * 100));
      milestones.filter(m => pct >= m).forEach(sendDepth);
      ticking = false;
    });
  }, { passive: true });
});
