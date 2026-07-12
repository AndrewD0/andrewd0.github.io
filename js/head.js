// Cross-browser fade transition between pages (no native View Transitions support needed).
const FADE_MS = 60;

function fadeIn() {
  document.body.style.transition = `opacity ${FADE_MS}ms ease`;
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
}

function navigateWithFade(url) {
  document.body.style.transition = `opacity ${FADE_MS}ms ease`;
  document.body.style.opacity = '0';
  setTimeout(() => {
    window.location.href = url;
  }, FADE_MS);
}
window.navigateWithFade = navigateWithFade;

window.addEventListener('DOMContentLoaded', fadeIn);
window.addEventListener('DOMContentLoaded', () => {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
    });
  }
});
function slugify(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildToc() {
  const headers = document.querySelectorAll('.project-documentation h2, .project-documentation h3');
  if (!headers.length) return;

  const toc = document.createElement('nav');
  toc.className = 'toc';

  let currentSubList = null;

  headers.forEach((header, i) => {
    if (!header.id) {
      header.id = slugify(header.textContent) || `section-${i}`;
    }
    const link = document.createElement('a');
    link.href = `#${header.id}`;
    link.textContent = header.textContent;

    if (header.tagName === 'H2') {
      toc.appendChild(link);
      currentSubList = null;
    } else {
      if (!currentSubList) {
        currentSubList = document.createElement('div');
        currentSubList.className = 'toc-sub';
        toc.appendChild(currentSubList);
      }
      currentSubList.appendChild(link);
    }
  });

  document.body.appendChild(toc);
}
window.addEventListener('DOMContentLoaded', buildToc);

// bfcache restores (browser back/forward) don't refire DOMContentLoaded.
window.addEventListener('pageshow', () => {
  document.body.style.transition = '';
  document.body.style.opacity = '1';
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  if (link.target === '_blank' || link.hasAttribute('download')) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (url.pathname === window.location.pathname && url.hash) return;

  e.preventDefault();
  navigateWithFade(link.href);
});