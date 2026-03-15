document.addEventListener('DOMContentLoaded', () => {
  const headings = document.querySelectorAll('article h2, article h3');
  const nav = document.getElementById('toc-nav');
  if (!nav || headings.length === 0) return;

  const ul = document.createElement('ul');
  ul.className = 'toc-list list-unstyled';

  headings.forEach(h => {
    if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^\w]+/g, '-');
    const li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.className = 'toc-link text-decoration-none';
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = nav.querySelector(`a[href="#${entry.target.id}"]`);
      if (link) link.classList.toggle('toc-active', entry.isIntersecting);
    });
  }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
});
