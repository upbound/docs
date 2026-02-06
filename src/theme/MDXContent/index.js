import React, { useState, useRef } from "react";
import { useLocation } from "@docusaurus/router";
import OriginalMDXContent from "@theme-original/MDXContent";

export default function MDXContentWrapper({ children, ...props }) {
    const [copied, setCopied] = useState(false);
    const contentRef = useRef();
    const location = useLocation();
    
    const excludedPaths = ["/guides/", "/manuals/", "/reference/"];
    const isHidden = excludedPaths.includes(location.pathname);
    
    const handleCopy = () => {
        if (contentRef.current) {
            navigator.clipboard
                .writeText(contentRef.current.innerText)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
        }
    };
    
    return (
        <>
            <button onClick={handleCopy} style={{marginBottom: '20px'}}>
                {copied ? "Copied!" : "Copy Markdown"}
            </button>
            <div ref={contentRef}>
                <OriginalMDXContent {...props}>{children}</OriginalMDXContent>
            </div>
        </>
    );
}
