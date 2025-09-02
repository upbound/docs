import React, { useState, useEffect } from 'react';

// Global state (safe for SSR)
let globalSelectedVersion = 'v1';
let globalAvailableVersions = new Set();
let globalUpdateCallbacks = new Set();
let globalInitialized = false;

const initializeFromStorage = () => {
  if (typeof window !== 'undefined' && !globalInitialized) {
    const savedVersion = localStorage.getItem('selected-version') || 'v1';
    globalSelectedVersion = savedVersion;
    globalInitialized = true;
  }
};

const updateGlobalVersion = (version) => {
  globalSelectedVersion = version;
  if (typeof window !== 'undefined') {
    localStorage.setItem('selected-version', version);
  }
  globalUpdateCallbacks.forEach(callback => callback());
};

const registerGlobalVersion = (version) => {
  globalAvailableVersions.add(version);
  globalUpdateCallbacks.forEach(callback => callback());
};

// Single component that does everything
export default function VersionSelector({ version, children }) {
  const [, forceUpdate] = useState({});
  
  // Initialize on first mount
  useEffect(() => {
    initializeFromStorage();
    
    // Register for updates
    const callback = () => forceUpdate({});
    globalUpdateCallbacks.add(callback);
    
    return () => globalUpdateCallbacks.delete(callback);
  }, []);

  // Register this version if provided
  useEffect(() => {
    if (version) {
      registerGlobalVersion(version);
    }
  }, [version]);

  // Auto-select first available if current selection isn't available
  useEffect(() => {
    if (globalAvailableVersions.size > 1 && !globalAvailableVersions.has(globalSelectedVersion)) {
      const firstVersion = Array.from(globalAvailableVersions)[0];
      updateGlobalVersion(firstVersion);
    }
  });

  // If no version prop, show selector
  if (!version) {
    if (globalAvailableVersions.size === 0) {
      return null;
    }
    
    return (
      <div className="global-language-selector">
        <div className="selector-controls">
          <div className="selector-group">
            <label>Version:</label>
            <select 
              value={globalSelectedVersion} 
              onChange={(e) => updateGlobalVersion(e.target.value)}
              className="language-select"
            >
              {Array.from(globalAvailableVersions).sort().map(v => (
                <option key={v} value={v}>
                  {v.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
  
  // If version prop provided, show/hide content
  return version === globalSelectedVersion ? <>{children}</> : null;
}
