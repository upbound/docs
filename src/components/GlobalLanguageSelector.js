import React, { useState, useEffect, createContext, useContext } from 'react';

// Simple context for language state
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState('kcl');
  const [selectedCloud, setSelectedCloud] = useState('aws');
  const [availableLanguages, setAvailableLanguages] = useState(new Set());
  const [availableClouds, setAvailableClouds] = useState(new Set());

  useEffect(() => {
    const savedLang = localStorage.getItem('selected-language') || 'kcl';
    const savedCloud = localStorage.getItem('selected-cloud') || 'aws';
    setSelectedLanguage(savedLang);
    setSelectedCloud(savedCloud);
  }, []);

  // Auto-select first available if current selection isn't available
  useEffect(() => {
    if (availableLanguages.size > 0 && !availableLanguages.has(selectedLanguage)) {
      const firstLang = Array.from(availableLanguages)[0];
      setSelectedLanguage(firstLang);
      localStorage.setItem('selected-language', firstLang);
    }
  }, [availableLanguages, selectedLanguage]);

  useEffect(() => {
    if (availableClouds.size > 0 && !availableClouds.has(selectedCloud)) {
      const firstCloud = Array.from(availableClouds)[0];
      setSelectedCloud(firstCloud);
      localStorage.setItem('selected-cloud', firstCloud);
    }
  }, [availableClouds, selectedCloud]);

  const updateLanguage = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selected-language', language);
  };

  const updateCloud = (cloud) => {
    setSelectedCloud(cloud);
    localStorage.setItem('selected-cloud', cloud);
  };

  const registerLanguage = (language) => {
    setAvailableLanguages(prev => new Set([...prev, language]));
  };

  const registerCloud = (cloud) => {
    setAvailableClouds(prev => new Set([...prev, cloud]));
  };

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      selectedCloud,
      availableLanguages,
      availableClouds,
      updateLanguage,
      updateCloud,
      registerLanguage,
      registerCloud
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  return useContext(LanguageContext);
}

// Simple selector with BOTH cloud and language - only shows available options
export default function GlobalLanguageSelector() {
  const { 
    selectedLanguage, 
    selectedCloud, 
    availableLanguages,
    availableClouds,
    updateLanguage, 
    updateCloud 
  } = useLanguageContext();

  // Don't show if no options available
  if (availableLanguages.size === 0 && availableClouds.size === 0) {
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
      </div>
    </div>
  );
}

// Simple content wrapper that auto-registers its options
export function CodeBlock({ cloud, language, children }) {
  const { selectedLanguage, selectedCloud, registerLanguage, registerCloud } = useLanguageContext();
  
  // Register this content's options
  useEffect(() => {
    if (language) registerLanguage(language);
    if (cloud) registerCloud(cloud);
  }, [language, cloud, registerLanguage, registerCloud]);
  
  const shouldShow = (!cloud || cloud === selectedCloud) && 
                    (!language || language === selectedLanguage);
  
  return shouldShow ? <div className="code-block">{children}</div> : null;
}
