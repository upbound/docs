// scripts/copymarkdown.js
import { initCopyButton } from '../src/components/CopyMarkdownButton';

initCopyButton();

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', initCopyButton);
  
  const originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(initCopyButton, 100);
  };
}
