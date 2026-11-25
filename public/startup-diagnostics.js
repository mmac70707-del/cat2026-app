(() => {
  let shown = false;

  function show(kind, message) {
    if (shown) return;
    shown = true;
    const status = document.getElementById('native-boot-status');
    if (status) status.textContent = kind + ': ' + String(message).slice(0, 240);
  }

  window.addEventListener('error', (event) => {
    show('JavaScript error', event.message || event.error || 'Unknown error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    show('Startup error', event.reason || 'Unhandled promise rejection');
  });

  window.setTimeout(() => {
    const root = document.getElementById('root');
    if (root && root.querySelector('#native-boot')) {
      show('Startup timeout', 'CAT dashboard did not render');
    }
  }, 8000);
})();
