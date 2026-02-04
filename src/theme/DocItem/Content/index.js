import React, { useEffect, useRef, useState } from 'react';
import Content from '@theme-original/DocItem/Content';
import CopyMarkdownButton from '@site/src/components/CopyMarkdownButton';
import { useLocation } from '@docusaurus/router';
import { createRoot } from 'react-dom/client';

export default function ContentWrapper(props) {
  const location = useLocation();
  const contentRef = useRef(null);
  const [buttonRendered, setButtonRendered] = useState(false);

  const shouldShowButton = location.pathname !== "/" &&
    location.pathname !== "/search" &&
    location.pathname !== "/guides/" &&
    location.pathname !== "/manuals/" &&
    location.pathname !== "/reference/";

  useEffect(() => {
    if (!shouldShowButton || buttonRendered) return;

    // Find the h1 element within the content
    const h1Element = contentRef.current?.querySelector('h1');

    if (h1Element) {
      // Create a container for the button
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'copy-markdown-button-wrapper';

      // Insert the container right after the h1
      h1Element.parentNode.insertBefore(buttonContainer, h1Element.nextSibling);

      // Render the button into the container
      const root = createRoot(buttonContainer);
      root.render(<CopyMarkdownButton />);

      setButtonRendered(true);
    }
  }, [shouldShowButton, buttonRendered, location.pathname]);

  return (
    <div ref={contentRef}>
      <Content {...props} />
    </div>
  );
}
