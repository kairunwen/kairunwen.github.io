const navigationLinks = document.querySelectorAll('.topbar nav a');

function syncNavigation() {
  const target = location.hash || '#top';
  for (const link of navigationLinks) {
    if (link.getAttribute('href') === target) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

window.addEventListener('hashchange', syncNavigation);
window.addEventListener('pageshow', syncNavigation);
syncNavigation();

// Keep native anchor navigation clear of the sticky header, including wrapped mobile menus.
const navigationHeader = document.querySelector('.site-header');
function updateNavigationOffset() {
  document.documentElement.style.scrollPaddingTop = `${navigationHeader.getBoundingClientRect().height + 20}px`;
}
new ResizeObserver(updateNavigationOffset).observe(navigationHeader);
updateNavigationOffset();
