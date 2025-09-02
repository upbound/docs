import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

// Simple context for language state
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState('kcl');
  const [selectedCloud, setSelectedCloud] = useState('aws');
  const [selectedVersion, setSelectedVersion] = useState('v1');
  
  // Track active registrations using refs (cleared each render)
  const activeLanguages = useRef(new Set());
  const activeClouds = useRef(new Set());
  const activeVersions = useRef(new Set());
  const hasActiveLanguage = useRef(false);
  const hasActiveCloud = useRef(false);
  const hasActiveVersion = useRef(false);
  
  // Force re-render when registrations change
  const [, forceUpdate] = useState({});
  const triggerUpdate = () => forceUpdate({});

  useEffect(() => {
    const savedLang = localStorage.getItem('selected-language') || 'kcl';
    const savedCloud = localStorage.getItem('selected-cloud') || 'aws';
    const savedVersion = localStorage.getItem('selected-version') || 'v1';
    setSelectedLanguage(savedLang);
    setSelectedCloud(savedCloud);
    setSelectedVersion(savedVersion);
  }, []);

  // Auto-select first available if current selection isn't available
  useEffect(() => {
    if (activeLanguages.current.size > 1 && !activeLanguages.current.has(selectedLanguage)) {
      const firstLang = Array.from(activeLanguages.current)[0];
      setSelectedLanguage(firstLang);
      localStorage.setItem('selected-language', firstLang);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (activeClouds.current.size > 1 && !activeClouds.current.has(selectedCloud)) {
      const firstCloud = Array.from(activeClouds.current)[0];
      setSelectedCloud(firstCloud);
      localStorage.setItem('selected-cloud', firstCloud);
    }
  }, [selectedCloud]);

  useEffect(() => {
    if (activeVersions.current.size > 1 && !activeVersions.current.has(selectedVersion)) {
      const firstVersion = Array.from(activeVersions.current)[0];
      setSelectedVersion(firstVersion);
      localStorage.setItem('selected-version', firstVersion);
    }
  }, [selectedVersion]);

  const updateLanguage = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selected-language', language);
  };

  const updateCloud = (cloud) => {
    setSelectedCloud(cloud);
    localStorage.setItem('selected-cloud', cloud);
  };

  const updateVersion = (version) => {
    setSelectedVersion(version);
    localStorage.setItem('selected-version', version);
  };

  // Registration functions that track active content
  const registerLanguage = (language) => {
    activeLanguages.current.add(language);
    hasActiveLanguage.current = true;
    triggerUpdate();
  };

  const registerCloud = (cloud) => {
    activeClouds.current.add(cloud);
    hasActiveCloud.current = true;
    triggerUpdate();
  };

  const registerVersion = (version) => {
    activeVersions.current.add(version);
    hasActiveVersion.current = true;
    triggerUpdate();
  };

  // Clear registrations at start of each render
  activeLanguages.current.clear();
  activeClouds.current.clear();
  activeVersions.current.clear();
  hasActiveLanguage.current = false;
  hasActiveCloud.current = false;
  hasActiveVersion.current = false;

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      selectedCloud,
      selectedVersion,
      availableLanguages: activeLanguages.current,
      availableClouds: activeClouds.current,
      availableVersions: activeVersions.current,
      hasActiveLanguage: hasActiveLanguage.current,
      hasActiveCloud: hasActiveCloud.current,
      hasActiveVersion: hasActiveVersion.current,
      updateLanguage,
      updateCloud,
      updateVersion,
      registerLanguage,
      registerCloud,
      registerVersion
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  return useContext(LanguageContext);
}

// Simple selector with cloud, language, AND version - only shows available options
export default function GlobalLanguageSelector() {
  const { 
    selectedLanguage, 
    selectedCloud, 
    selectedVersion,
    hasActiveLanguage,
    hasActiveCloud,
    hasActiveVersion,
    availableLanguages,
    availableClouds,
    availableVersions,
    updateLanguage, 
    updateCloud,
    updateVersion
  } = useLanguageContext();

  // Don't show if no options available
  if (!hasActiveLanguage && !hasActiveCloud && !hasActiveVersion) {
    return null;
  }

  return (
    <div className="global-language-selector">
      <div className="selector-controls">
        {hasActiveCloud && (
          <div className="selector-group">
            <label>Cloud Provider:</label>
            <select 
              value={selectedCloud} 
              onChange={(e) => updateCloud(e.target.value)}
              className="cloud-select"
            >
              {Array.from(availableClouds).sort().map(cloud => (
                <option key={cloud} value={cloud}>
                  {cloud.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {hasActiveLanguage && (
          <div className="selector-group">
            <label>Language:</label>
            <select 
              value={selectedLanguage} 
              onChange={(e) => updateLanguage(e.target.value)}
              className="language-select"
            >
              {Array.from(availableLanguages).sort().map(language => (
                <option key={language} value={language}>
                  {language.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveVersion && (
          <div className="selector-group">
            <label>Version:</label>
            <select 
              value={selectedVersion} 
              onChange={(e) => updateVersion(e.target.value)}
              className="language-select"
            >
              {Array.from(availableVersions).sort().map(version => (
                <option key={version} value={version}>
                  {version.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple content wrapper that auto-registers its options
export function CodeBlock({ cloud, language, version, children }) {
  const { 
    selectedLanguage, 
    selectedCloud, 
    selectedVersion, 
    registerLanguage, 
    registerCloud, 
    registerVersion 
  } = useLanguageContext();
  
  // Register this content's options on every render
  if (language !== undefined) registerLanguage(language);
  if (cloud !== undefined) registerCloud(cloud);
  if (version !== undefined) registerVersion(version);
  
  const shouldShow = (cloud === undefined || cloud === selectedCloud) && 
                    (language === undefined || language === selectedLanguage) &&
                    (version === undefined || version === selectedVersion);
  
  // Return children directly without wrapper, or use a neutral wrapper
  return shouldShow ? <>{children}</> : null;
}
