// src/components/CopyMarkdownButton.js
import React, { useState, useEffect } from 'react';

const styles = `
.copy-markdown-button-container {
  margin: 1.5rem 0;
  display: flex;
  justify-content: flex-start;
}

/* Adjust for different screen sizes */
@media (max-width: 768px) {
  .copy-markdown-button-container {
    margin: 1rem 0;
    justify-content: flex-start;
  }
}

.copy-page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--ifm-background-color);
  border: 1px solid var(--upbound-border-color);
  border-radius: 0.5rem;
  color: var(--ifm-font-color-base);
  font-family: var(--ifm-font-family-base);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--upbound-card-shadow);
  backdrop-filter: blur(8px);
  white-space: nowrap;
}

.copy-page-btn:hover:not(:disabled) {
  background-color: var(--upbound-light-bg);
  border-color: var(--grape);
  color: var(--grape);
  transform: translateY(-2px);
  box-shadow: var(--upbound-card-shadow-hover);
}

.copy-page-btn:active:not(:disabled) {
  transform: translateY(0);
}

.copy-page-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.copy-page-btn.loading {
  opacity: 0.8;
}

.copy-page-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.copy-page-btn:hover:not(:disabled) svg {
  transform: scale(1.1);
}

.copy-btn-text {
  transition: opacity 0.2s ease;
}

.copy-page-btn.loading .copy-btn-text {
  opacity: 0.7;
}

.copy-tooltip {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--up-grey-800);
  color: white;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.copy-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 1rem;
  border: 4px solid transparent;
  border-top-color: var(--up-grey-800);
}

.copy-tooltip.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

html[data-theme='dark'] .copy-page-btn {
  background-color: var(--up-grey-800);
  border-color: var(--up-grey-700);
  color: var(--up-grey-200);
}

html[data-theme='dark'] .copy-page-btn:hover:not(:disabled) {
  background-color: var(--up-grey-700);
  border-color: var(--up-purple-300);
  color: var(--up-purple-200);
}

html[data-theme='dark'] .copy-tooltip {
  background-color: var(--up-grey-700);
  color: var(--up-grey-100);
}

html[data-theme='dark'] .copy-tooltip::after {
  border-top-color: var(--up-grey-700);
}

@media (max-width: 768px) {
  .copy-markdown-button-container {
    margin: 1rem 0;
    justify-content: flex-start;
  }
  
  .copy-page-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .copy-tooltip {
    left: 0;
    right: auto;
    transform: translateY(4px);
  }
  
  .copy-tooltip.show {
    transform: translateY(0);
  }
  
  .copy-tooltip::after {
    left: 1rem;
    right: auto;
    transform: none;
  }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.copy-page-btn.loading svg {
  animation: pulse 1.5s ease-in-out infinite;
}

.copy-markdown-button-container {
  pointer-events: all;
}

.copy-page-btn {
  pointer-events: all;
}

@media print {
  .copy-markdown-button-container {
    display: none;
  }
}
`;

const CopyMarkdownButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stylesInjected, setStylesInjected] = useState(false);

  // Inject styles on component mount
  useEffect(() => {
    if (!stylesInjected) {
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
      setStylesInjected(true);
    }
  }, [stylesInjected]);

  // Function to extract markdown content from the current page
  const extractPageContent = () => {
    const mainContent = document.querySelector('main[role="main"]') || 
                       document.querySelector('.main-wrapper') ||
                       document.querySelector('article') ||
                       document.querySelector('.markdown');
    
    if (!mainContent) {
      return 'Unable to extract page content.';
    }

    let markdown = '';
    
    // Get page title
    const title = document.querySelector('h1')?.textContent || 
                  document.querySelector('title')?.textContent || 
                  'Untitled Page';
    
    markdown += `# ${title}\n\n`;
    
    // Extract content while preserving structure
    const walker = document.createTreeWalker(
      mainContent,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip navigation, sidebar, and other non-content elements
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (element.closest('.navbar') ||
                element.closest('.menu') ||
                element.closest('.table-of-contents') ||
                element.closest('.pagination-nav') ||
                element.closest('.breadcrumbs') ||
                element.closest('.copy-markdown-button') ||
                element.closest('[class*="sidebar"]') ||
                element.closest('nav') ||
                element.matches('script, style, noscript')) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode;
    const processedElements = new Set();
    
    while (currentNode = walker.nextNode()) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode;
        
        // Skip if we've already processed this element or its parent
        if (processedElements.has(element) || 
            Array.from(processedElements).some(processed => processed.contains(element))) {
          continue;
        }
        
        processedElements.add(element);
        
        const tagName = element.tagName.toLowerCase();
        const text = element.textContent?.trim();
        
        if (!text) continue;
        
        switch (tagName) {
          case 'h1':
            // Skip main title as we already added it
            if (element === document.querySelector('h1')) continue;
            markdown += `\n# ${text}\n\n`;
            break;
          case 'h2':
            markdown += `\n## ${text}\n\n`;
            break;
          case 'h3':
            markdown += `\n### ${text}\n\n`;
            break;
          case 'h4':
            markdown += `\n#### ${text}\n\n`;
            break;
          case 'h5':
            markdown += `\n##### ${text}\n\n`;
            break;
          case 'h6':
            markdown += `\n###### ${text}\n\n`;
            break;
          case 'p':
            if (!element.closest('pre, code')) {
              markdown += `${text}\n\n`;
            }
            break;
          case 'pre':
            const codeElement = element.querySelector('code');
            const codeText = codeElement ? codeElement.textContent : text;
            const language = codeElement?.className?.match(/language-(\w+)/)?.[1] || '';
            markdown += `\`\`\`${language}\n${codeText}\n\`\`\`\n\n`;
            break;
          case 'code':
            if (!element.closest('pre')) {
              markdown += `\`${text}\``;
            }
            break;
          case 'ul':
          case 'ol':
            if (!element.closest('ul, ol')) {
              const listItems = Array.from(element.querySelectorAll('li'))
                .map((li, index) => {
                  const itemText = li.textContent?.trim();
                  return tagName === 'ul' ? `- ${itemText}` : `${index + 1}. ${itemText}`;
                })
                .join('\n');
              markdown += `${listItems}\n\n`;
            }
            break;
          case 'blockquote':
            const quoteText = text.split('\n').map(line => `> ${line}`).join('\n');
            markdown += `${quoteText}\n\n`;
            break;
          case 'table':
            // Simple table extraction
            const rows = Array.from(element.querySelectorAll('tr'));
            if (rows.length > 0) {
              const tableMarkdown = rows.map((row, rowIndex) => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                const rowText = cells.map(cell => cell.textContent?.trim() || '').join(' | ');
                if (rowIndex === 0 && row.closest('thead')) {
                  const separator = cells.map(() => '---').join(' | ');
                  return `| ${rowText} |\n| ${separator} |`;
                }
                return `| ${rowText} |`;
              }).join('\n');
              markdown += `${tableMarkdown}\n\n`;
            }
            break;
          case 'a':
            if (element.href && !element.closest('nav, .menu')) {
              const linkText = text;
              const href = element.href;
              markdown += `[${linkText}](${href})`;
            }
            break;
        }
      }
    }
    
    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
    
    // Add metadata
    const metadata = `---
URL: ${window.location.href}
Title: ${title}
Generated: ${new Date().toISOString()}
---

`;
    
    return metadata + markdown;
  };

  const handleCopyClick = async () => {
    setIsLoading(true);
    
    try {
      const markdown = extractPageContent();
      await navigator.clipboard.writeText(markdown);
      
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (error) {
      console.error('Failed to copy page content:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = extractPageContent();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="copy-markdown-button-container">
      <button
        className={`copy-page-btn ${isLoading ? 'loading' : ''}`}
        title="Copy page as Markdown for LLMs"
        aria-label="Copy page as Markdown for LLMs"
        onClick={handleCopyClick}
        disabled={isLoading}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
        >
          <path 
            d="M2 3.5C2 2.67157 2.67157 2 3.5 2H9.5L14 6.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M9 2V7H14" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className="copy-btn-text">
          {isLoading ? 'Copying...' : 'Copy Markdown for LLMs'}
        </span>
      </button>
      
      <div 
        className={`copy-tooltip ${showTooltip ? 'show' : ''}`} 
        role="tooltip"
      >
        Page copied!
      </div>
    </div>
  );
};

// Auto-initialize function that can be called from client module
export const initCopyButton = () => {
  if (typeof window === 'undefined') return;
  
  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButton);
    return;
  }

  // Only add on doc pages, not homepage
  if (window.location.pathname !== '/' && window.location.pathname !== '/search') {
    // Remove any existing button first
    const existing = document.querySelector('.copy-markdown-button-container');
    if (existing) existing.remove();
    
    // Find the main title (h1) to insert button after it
    const mainTitle = document.querySelector('main h1, article h1, .markdown h1');
    
    if (mainTitle) {
      // Create container and insert after title
      const container = document.createElement('div');
      mainTitle.parentNode.insertBefore(container, mainTitle.nextSibling);
      
      // Use React 18 createRoot
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(React.createElement(CopyMarkdownButton));
      });
    }
  }
};

export default CopyMarkdownButton;
