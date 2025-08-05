// src/components/GetStartedCallout.js
import React, { useState, useEffect } from 'react';

const styles = `
.get-started-section {
  background: linear-gradient(135deg, var(--up-grey-700) 0%, var(--up-grey-800) 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: var(--upbound-card-shadow-hover);
}
.get-started-section h2 {
  margin-top: 0;
  font-size: 1.8rem;
  font-weight: var(--ifm-heading-font-weight);
  font-family: var(--ifm-heading-font-family);
  color: white;
}
.get-started-section ul {
  font-size: 1.1rem;
  margin: 1.5rem 0;
  font-family: var(--ifm-font-family-base);
}
.get-started-section li {
  margin-bottom: 0.8rem;
  color: white;
}
.get-started-section a {
  color: var(--up-purple-200);
  text-decoration: underline;
  transition: all 0.2s ease;
}
.get-started-section a:hover {
  color: var(--up-purple-100);
  text-decoration: none;
}
.code-block {
  background: var(--up-grey-900);
  border: 1px solid var(--up-grey-700);
  border-radius: 8px;
  padding: 0;
  margin: 1rem 0;
  font-family: var(--ifm-font-family-monospace);
  font-size: var(--ifm-code-font-size);
  position: relative;
  overflow: hidden;
}
.code-content {
  padding: 1rem;
  margin: 0;
  background: none;
  border: none;
  color: var(--up-grey-200);
  font-family: inherit;
  font-size: inherit;
}
.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--up-grey-700);
  border: 1px solid var(--up-grey-600);
  border-radius: 6px;
  color: var(--up-grey-200);
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-family: var(--ifm-font-family-base);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.copy-button:hover {
  background: var(--up-grey-600);
  border-color: var(--up-grey-500);
  color: white;
}
.copy-icon {
  width: 12px;
  height: 12px;
}
.installation-note {
  font-style: italic;
  opacity: 0.9;
  margin-top: 0.5rem;
  font-family: var(--ifm-font-family-base);
  color: rgba(255,255,255,0.9);
}
.tip-box {
  background: rgba(0,0,0,0.15);
  border-left: 4px solid var(--up-purple-300);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
}
.tip-label {
  font-weight: var(--ifm-font-weight-bold);
  color: var(--up-purple-200);
  margin-bottom: 0.5rem;
  font-family: var(--ifm-font-family-base);
}
html[data-theme='light'] .get-started-section {
  background: var(--up-grey-200);
  color: var(--up-grey-900);
}
html[data-theme='light'] .get-started-section h2 {
  color: var(--up-grey-900);
}
html[data-theme='light'] .get-started-section li {
  color: var(--up-grey-900);
}
html[data-theme='light'] .get-started-section a {
  color: var(--up-purple-500);
}
html[data-theme='light'] .get-started-section a:hover {
  color: var(--up-purple-600);
}
html[data-theme='light'] .installation-note {
  color: var(--up-grey-700);
}
html[data-theme='light'] .tip-label {
  color: var(--up-purple-500);
}
html[data-theme='light'] .code-block {
  background: var(--up-grey-300);
}
html[data-theme='light'] .code-content {
  color: var(--up-grey-900);
}
html[data-theme='light'] .copy-button {
  background: var(--up-grey-500);
  color: var(--up-grey-200);
}
html[data-theme='light'] .copy-button:hover {
  background: var(--up-grey-600);
  color: var(--up-grey-000);
}
@media (max-width: 768px) {
  .get-started-section {
    margin: 1rem 0;
    padding: 1.5rem;
  }
  .get-started-section h2 {
    font-size: 1.5rem;
  }
  .get-started-section ul {
    font-size: 1rem;
  }
  .code-block {
    font-size: 0.85rem;
  }
}
`;

function CopyIcon({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className="copy-icon"
    >
      <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/>
      <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
    </svg>
  );
}

function CheckIcon({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className="copy-icon"
    >
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
    </svg>
  );
}

export function GetStarted() {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Inject styles into document head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    return () => {
      // Clean up styles when component unmounts
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('curl -sL "https://cli.upbound.io" | sh');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="get-started-section">
      <h2>🚀 Sign up and install the Upbound CLI</h2>
      <ul>
        <li>Create an account on Upbound by <a href="https://accounts.upbound.io/register">registering your organization</a>.</li>
        <li>Install the <a href="/manuals/cli/overview">up</a> CLI to gain access to all Upbound's tooling on your machine.</li>
      </ul>
      
      <div className="code-block">
        <div className="code-content">
          curl -sL "https://cli.upbound.io" | sh
        </div>
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="installation-note">
        Find more installation methods on the <a href="/manuals/cli/overview">Up CLI installation guide</a>.
      </div>
      
      <div className="tip-box">
        <div className="tip-label">💡 TIP</div>
        Get started with Upbound using the free <em>Community</em> plan or upgrade to a <em>Standard</em> plan. For more information, review our <a href="https://upbound.io/pricing">pricing plans</a>
      </div>
    </section>
  );
}
