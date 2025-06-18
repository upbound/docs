import React, { useState, useEffect } from "react";
import { useLocation } from "@docusaurus/router";

const Hover = ({ label, line, children }) => {
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isHovering) return;

    const codeBlock = document.querySelector(`#${label} pre code`);
    if (!codeBlock) return;

    const lineNumber = parseInt(line, 10);
    if (isNaN(lineNumber)) return;

    // Find the line element (1-indexed in the attribute, but 0-indexed in the DOM)
    const lineElement =
      codeBlock.querySelectorAll(".token-line")[lineNumber - 1];
    if (!lineElement) return;

    // Add highlight class
    const originalBackground = lineElement.style.background;
    lineElement.style.background = "rgba(147, 112, 219, 0.2)";

    // Return cleanup function
    return () => {
      lineElement.style.background = originalBackground;
    };
  }, [isHovering, label, line, location.pathname]);

  return (
    <span
      className="code-hover"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        borderBottom: "1px dashed #9370db",
        cursor: "pointer",
        color: "#9370db",
      }}
    >
      {children}
    </span>
  );
};

export default Hover;
