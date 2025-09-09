// scripts/reading-time.js
(function() {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  function addReadingTime() {
    // Check if reading time already exists
    if (document.querySelector('.auto-reading-time')) {
      return;
    }
    // Find the main content area
    const contentSelectors = [
      '.theme-doc-markdown',
      '.markdown', 
      '[class*="docItemContainer"] article',
      'main article',
      '.main-wrapper article'
    ];
    
    let contentElement = null;
    for (const selector of contentSelectors) {
      contentElement = document.querySelector(selector);
      if (contentElement) break;
    }
    if (!contentElement) {
      return;
    }
    // Find where to insert reading time (before the first heading)
    const titleSelectors = [
      '.theme-doc-markdown h1',
      '.markdown h1',
      'article h1',
      'h1'
    ];
    let titleElement = null;
    for (const selector of titleSelectors) {
      titleElement = contentElement.querySelector(selector);
      if (titleElement) break;
    }
    if (!titleElement) {
      return;
    }
    // Extract text and count words
    const textContent = contentElement.innerText || contentElement.textContent || '';
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Calculate reading time (180 WPM for technical content)
    const minutes = Math.ceil(wordCount / 180);
    
    if (minutes < 1) {
      return;
    }
    // Create reading time element
    const readingTimeEl = document.createElement('div');
    readingTimeEl.className = 'auto-reading-time';
    readingTimeEl.style.cssText = `
      font-size: 0.875rem;
      color: var(--ifm-color-secondary-darkest, #525860);
      display: flex;
      align-items: center;
      gap: 0.375rem;
      margin-bottom: 1.5rem;
      opacity: 0.8;
    `;
    readingTimeEl.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="opacity: 0.7;">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
      </svg>
      <span>${minutes} min read</span>
    `;
    // Insert after the title
    titleElement.parentNode.insertBefore(readingTimeEl, titleElement.nextSibling);
  }

  // Run when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addReadingTime);
  } else {
    addReadingTime();
  }
  
  // Run when navigating (for SPA routing)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(addReadingTime, 100);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(addReadingTime, 100);
  };
  
  window.addEventListener('popstate', function() {
    setTimeout(addReadingTime, 100);
  });
})();
