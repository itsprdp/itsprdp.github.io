document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('like-btn');
  const icon = document.getElementById('like-icon');
  const countEl = document.getElementById('like-count');
  if (!btn) return;

  const slug = window.location.pathname;
  const WORKER = 'https://likes.itsprdp.workers.dev';
  const storageKey = 'liked:' + slug;

  if (localStorage.getItem(storageKey)) {
    btn.classList.add('liked');
    icon.className = 'bi bi-heart-fill';
  }

  fetch(`${WORKER}?slug=${encodeURIComponent(slug)}`)
    .then(r => r.json())
    .then(({ count }) => { countEl.textContent = count; })
    .catch(() => {});

  btn.addEventListener('click', () => {
    if (localStorage.getItem(storageKey)) return;
    fetch(`${WORKER}?slug=${encodeURIComponent(slug)}`, { method: 'POST' })
      .then(r => r.json())
      .then(({ count }) => {
        countEl.textContent = count;
        btn.classList.add('liked');
        icon.className = 'bi bi-heart-fill';
        localStorage.setItem(storageKey, '1');
      })
      .catch(() => {});
  });
});
