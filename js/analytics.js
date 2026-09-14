// Only the public homepage contributes to its dedicated GA4 property.
if (location.hostname === 'kairunwen.github.io' && ['/', '/index.html'].includes(location.pathname)) {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-DF4WX2Z0XM', {
    page_location: location.origin + location.pathname,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-DF4WX2Z0XM';
  document.head.appendChild(tag);
}

// The server-side export contains only a total and its update time, never credentials.
fetch('data/page-views.json', { cache: 'no-cache' })
  .then(response => {
    if (!response.ok) throw new Error('Views unavailable');
    return response.json();
  })
  .then(data => {
    const counter = document.getElementById('page-views');
    if (counter && Number.isSafeInteger(data.views) && data.views >= 0) {
      counter.textContent = data.views.toLocaleString('en-US');
      counter.title = `Google Analytics · Updated ${data.updated_at}`;
    }
  })
  .catch(() => {}); // Keep the honest unavailable state when the export cannot be read.
