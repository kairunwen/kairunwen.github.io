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
