import React, { useState, useEffect, createContext, useContext } from 'react';

// Simple context for language state
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState('kcl');
  const [selectedCloud, setSelectedCloud] = useState('aws');
  const [selectedVersion, setSelectedVersion] = useState('v1');
  const [availableLanguages, setAvailableLanguages] = useState(new Set());
  const [availableClouds, setAvailableClouds] = useState(new Set());
  const [availableVersions, setAvailableVersions] = useState(new Set());

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
    if (availableLanguages.size > 1 && !availableLanguages.has(selectedLanguage)) {
      const firstLang = Array.from(availableLanguages)[0];
      setSelectedLanguage(firstLang);
      localStorage.setItem('selected-language', firstLang);
    }
  }, [availableLanguages, selectedLanguage]);

  useEffect(() => {
    if (availableClouds.size > 1 && !availableClouds.has(selectedCloud)) {
      const firstCloud = Array.from(availableClouds)[0];
      setSelectedCloud(firstCloud);
      localStorage.setItem('selected-cloud', firstCloud);
    }
  }, [availableClouds, selectedCloud]);

  useEffect(() => {
    if (availableVersions.size > 1 && !availableVersions.has(selectedVersion)) {
      const firstVersion = Array.from(availableVersions)[0];
      setSelectedVersion(firstVersion);
      localStorage.setItem('selected-version', firstVersion);
    }
  }, [availableVersions, selectedVersion]);

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

  const registerLanguage = (language) => {
    setAvailableLanguages(prev => new Set([...prev, language]));
  };

  const registerCloud = (cloud) => {
    setAvailableClouds(prev => new Set([...prev, cloud]));
  };

  const registerVersion = (version) => {
    setAvailableVersions(prev => new Set([...prev, version]));
  };

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      selectedCloud,
      selectedVersion,
      availableLanguages,
      availableClouds,
      availableVersions,
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
    availableLanguages,
    availableClouds,
    availableVersions,
    updateLanguage, 
    updateCloud,
    updateVersion
  } = useLanguageContext();

  // Don't show if no options available
  if (availableLanguages.size === 0 && availableClouds.size === 0 && availableVersions.size === 0) {
    return null;
  }

  return (
    <div className="global-language-selector">
      <div className="selector-controls">
        {availableClouds.size > 0 && (
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
        
        {availableLanguages.size > 0 && (
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

        {availableVersions.size > 0 && (
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
  
  // Register this content's options
  useEffect(() => {
    if (language) registerLanguage(language);
    if (cloud) registerCloud(cloud);
    if (version) registerVersion(version);
  }, [language, cloud, version, registerLanguage, registerCloud, registerVersion]);
  
  const shouldShow = (!cloud || cloud === selectedCloud) && 
                    (!language || language === selectedLanguage) &&
                    (!version || version === selectedVersion);
  
  // Return children directly without wrapper, or use a neutral wrapper
  return shouldShow ? <>{children}</> : null;
}
