// src/theme/CodeBlock/index.js
import React, { useEffect, useRef } from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import { useLocation } from '@docusaurus/router';

function CodeBlockWithCopyLines(props) {
  const codeBlockRef = useRef(null);
  const location = useLocation();
  
  const metastring = props.metastring || '';
  
  const disableCopyMatch = metastring.match(/copy-lines=["|']?none["|']?/i);
  const disableAllCopy = disableCopyMatch !== null;
  
  let copyLinesMatch = null;
  let copyLinesStr = '';
  try {
    copyLinesMatch = metastring.match(/copy-lines=["|']?([\d,-]+)["|']?/i);
    copyLinesStr = copyLinesMatch ? copyLinesMatch[1] : '';
  } catch (e) {
    console.error('Error parsing copy-lines:', e);
  }
  
  const hasCopyLines = copyLinesStr !== '';
  
  function parseLineRanges(rangeStr) {
    if (!rangeStr) return [];
    
    try {
      const lineNumbers = [];
      rangeStr.split(',').forEach(part => {
        part = part.trim();
        if (!part) return;
        
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              lineNumbers.push(i);
            }
          }
        } else {
          const num = parseInt(part, 10);
          if (!isNaN(num)) {
            lineNumbers.push(num);
          }
        }
      });
      return lineNumbers;
    } catch (e) {
      console.error('Error parsing line ranges:', e);
      return [];
    }
  }

  useEffect(() => {
    if (!hasCopyLines && !disableAllCopy) return;
    
    const patchCopyButton = () => {
      setTimeout(() => {
        const wrapper = codeBlockRef.current;
        if (!wrapper) return;
        
        const copyButton = wrapper.querySelector('button[aria-label="Copy code to clipboard"]');
        if (!copyButton) return;
        
        if (disableAllCopy) {
          copyButton.style.display = 'none';
          return;
        }
        
        if (hasCopyLines) {
          const linesToCopy = parseLineRanges(copyLinesStr);
          if (linesToCopy.length === 0) return;
          
          copyButton.setAttribute('aria-label', `Copy lines ${copyLinesStr}`);
          copyButton.setAttribute('title', `Copy lines ${copyLinesStr}`);
          
          const originalClick = copyButton.onclick;
          
          copyButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
              const lineElements = wrapper.querySelectorAll('.token-line');
              
              if (!lineElements || lineElements.length === 0) {
                console.error('Could not find line elements');
                return;
              }
              
              const linesToExtract = linesToCopy
                .filter(lineNum => lineNum > 0 && lineNum <= lineElements.length);
              
              const contentLines = linesToExtract.map(lineNum => {
                const lineElement = lineElements[lineNum - 1];
                return lineElement ? lineElement.textContent : '';
              });
              
              const content = contentLines.join('\n');
              console.log('Copying content:', content);
              
              navigator.clipboard.writeText(content)
                .then(() => {
                  copyButton.classList.add('copied');
                  
                  const svgElements = copyButton.querySelectorAll('svg');
                  if (svgElements.length >= 2) {
                    svgElements[0].style.display = 'none';
                    svgElements[1].style.display = 'block';
                  }
                  
                  setTimeout(() => {
                    copyButton.classList.remove('copied');
                    if (svgElements.length >= 2) {
                      svgElements[0].style.display = 'block';
                      svgElements[1].style.display = 'none';
                    }
                  }, 2000);
                })
                .catch(error => {
                  console.error('Failed to copy: ', error);
                });
            } catch (error) {
              console.error('Error in custom copy handler:', error);
              if (originalClick) originalClick(e);
            }
          };
              
        }
      }, 100); 
    };
    
    patchCopyButton();
    
    return () => {};
  }, [disableAllCopy, hasCopyLines, copyLinesStr, location.pathname]);
  
  return (
    <div ref={codeBlockRef}>
      <CodeBlock {...props} />
    </div>
  );
}

export default CodeBlockWithCopyLines;
