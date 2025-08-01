// src/components/CopyMarkdownButton.js
import React, { useState, useEffect } from 'react';

const styles = `
.copy-markdown-button-container {
  margin: 1rem 0;
  display: flex;
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .copy-markdown-button-container {
    margin: 0.75rem 0;
  }
}

.copy-page-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--ifm-background-color);
  border: 1px solid var(--upbound-border-color);
  border-radius: 0.375rem;
  color: var(--ifm-font-color-base);
  font-family: var(--ifm-font-family-base);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  min-width: auto;
}

.copy-page-btn:hover:not(:disabled) {
  background-color: var(--upbound-light-bg);
  border-color: var(--grape);
  color: var(--grape);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.copy-page-btn:active:not(:disabled) {
  transform: translateY(0);
}

.copy-page-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.copy-page-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.copy-page-btn:hover:not(:disabled) svg {
  transform: scale(1.05);
}

.copy-btn-text {
  transition: all 0.15s ease;
}

.copy-page-btn.success svg {
  transform: scale(1.1);
}

/* Loading animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.copy-page-btn.loading svg {
  animation: spin 1s linear infinite;
}

/* Tooltip */
.copy-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.375rem 0.625rem;
  background-color: var(--up-grey-800);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s ease;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.copy-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--up-grey-800);
}

.copy-tooltip.show {
  opacity: 1;
  visibility: visible;
}

/* Dark theme */
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

/* Mobile adjustments */
@media (max-width: 768px) {
  .copy-page-btn {
    padding: 0.4375rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.3125rem;
  }
  
  .copy-page-btn svg {
    width: 13px;
    height: 13px;
  }
  
  .copy-tooltip {
    font-size: 0.625rem;
    padding: 0.3125rem 0.5rem;
  }
}

@media print {
  .copy-markdown-button-container {
    display: none;
  }
}
`;

const CopyMarkdownButton = () => {
  const [state, setState] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [showTooltip, setShowTooltip] = useState(false);
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
    
    // Improved content extraction
    const processElement = (element, level = 0) => {
      let content = '';
      
      // Skip unwanted elements
      if (element.closest && (
          element.closest('.navbar') ||
          element.closest('.menu') ||
          element.closest('.table-of-contents') ||
          element.closest('.pagination-nav') ||
          element.closest('.breadcrumbs') ||
          element.closest('.copy-markdown-button-container') ||
          element.closest('[class*="sidebar"]') ||
          element.closest('nav') ||
          element.matches && element.matches('script, style, noscript')
      )) {
        return '';
      }

      const tagName = element.tagName?.toLowerCase();
      
      switch (tagName) {
        case 'h1':
          // Skip main title as we already added it
          if (element === document.querySelector('h1')) return '';
          content += `\n# ${element.textContent.trim()}\n\n`;
          break;
        case 'h2':
          content += `\n## ${element.textContent.trim()}\n\n`;
          break;
        case 'h3':
          content += `\n### ${element.textContent.trim()}\n\n`;
          break;
        case 'h4':
          content += `\n#### ${element.textContent.trim()}\n\n`;
          break;
        case 'h5':
          content += `\n##### ${element.textContent.trim()}\n\n`;
          break;
        case 'h6':
          content += `\n###### ${element.textContent.trim()}\n\n`;
          break;
        case 'p':
          const text = element.textContent?.trim();
          if (text && !element.closest('pre, code')) {
            content += `${text}\n\n`;
          }
          break;
        case 'pre':
          const codeElement = element.querySelector('code');
          const codeText = codeElement ? codeElement.textContent : element.textContent;
          const language = codeElement?.className?.match(/language-(\w+)/)?.[1] || '';
          content += `\`\`\`${language}\n${codeText.trim()}\n\`\`\`\n\n`;
          break;
        case 'blockquote':
          const quoteLines = element.textContent?.trim().split('\n') || [];
          const quotedText = quoteLines.map(line => `> ${line.trim()}`).join('\n');
          content += `${quotedText}\n\n`;
          break;
        case 'ul':
          const ulItems = Array.from(element.children).filter(child => child.tagName === 'LI');
          ulItems.forEach(li => {
            content += `- ${li.textContent?.trim()}\n`;
          });
          content += '\n';
          break;
        case 'ol':
          const olItems = Array.from(element.children).filter(child => child.tagName === 'LI');
          olItems.forEach((li, index) => {
            content += `${index + 1}. ${li.textContent?.trim()}\n`;
          });
          content += '\n';
          break;
        case 'table':
          const rows = Array.from(element.querySelectorAll('tr'));
          if (rows.length > 0) {
            rows.forEach((row, rowIndex) => {
              const cells = Array.from(row.querySelectorAll('td, th'));
              const rowText = cells.map(cell => cell.textContent?.trim() || '').join(' | ');
              content += `| ${rowText} |\n`;
              
              // Add separator after header row
              if (rowIndex === 0) {
                const separator = cells.map(() => '---').join(' | ');
                content += `| ${separator} |\n`;
              }
            });
            content += '\n';
          }
          break;
        case 'div':
        case 'section':
        case 'article':
          // For container elements, process children
          Array.from(element.children).forEach(child => {
            content += processElement(child, level + 1);
          });
          break;
        default:
          // For other elements, check if they have direct text content
          if (element.children.length === 0) {
            const text = element.textContent?.trim();
            if (text && text.length > 0) {
              // Handle inline code
              if (tagName === 'code') {
                content += `\`${text}\``;
              } else if (tagName === 'strong' || tagName === 'b') {
                content += `**${text}**`;
              } else if (tagName === 'em' || tagName === 'i') {
                content += `*${text}*`;
              } else if (tagName === 'a') {
                const href = element.href;
                if (href) {
                  content += `[${text}](${href})`;
                } else {
                  content += text;
                }
              } else {
                content += text;
              }
            }
          } else {
            // Has children, process them
            Array.from(element.children).forEach(child => {
              content += processElement(child, level + 1);
            });
          }
          break;
      }
      
      return content;
    };

    // Process all direct children of main content
    Array.from(mainContent.children).forEach(child => {
      markdown += processElement(child);
    });
    
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
    setState('loading');
    
    try {
      const markdown = extractPageContent();
      await navigator.clipboard.writeText(markdown);
      
      setState('success');
      setShowTooltip(true);
      
      // Reset to idle after showing success
      setTimeout(() => {
        setState('idle');
        setShowTooltip(false);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to copy page content:', error);
      
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = extractPageContent();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setState('success');
        setShowTooltip(true);
        
        setTimeout(() => {
          setState('idle');
          setShowTooltip(false);
        }, 2000);
        
      } catch (fallbackError) {
        setState('error');
        setShowTooltip(true);
        
        setTimeout(() => {
          setState('idle');
          setShowTooltip(false);
        }, 3000);
      }
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ),
          text: 'Copying...'
        };
      case 'success':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          text: 'Copied!'
        };
      case 'error':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ),
          text: 'Error'
        };
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ),
          text: 'Copy as Markdown'
        };
    }
  };

  const { icon, text } = getButtonContent();
  const tooltipText = state === 'success' ? 'Page copied to clipboard!' : 
                     state === 'error' ? 'Failed to copy' :
                     'Copy this page as Markdown for use with LLMs';

  return (
    <div className="copy-markdown-button-container">
      <button
        className={`copy-page-btn ${state}`}
        title={tooltipText}
        aria-label={tooltipText}
        onClick={handleCopyClick}
        disabled={state === 'loading'}
      >
        {icon}
        <span className="copy-btn-text">{text}</span>
      </button>
      
      <div 
        className={`copy-tooltip ${showTooltip ? 'show' : ''}`} 
        role="tooltip"
      >
        {tooltipText}
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
