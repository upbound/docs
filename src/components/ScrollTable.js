import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * ScrollTable - A wrapper component for tables that shows scroll shadow indicators
 *
 * Usage in MDX:
 * <ScrollTable>
 *
 * | Column 1 | Column 2 | Column 3 |
 * |----------|----------|----------|
 * | Data     | Data     | Data     |
 *
 * </ScrollTable>
 */
export default function ScrollTable({ children }) {
  const wrapperRef = useRef(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const updateShadows = useCallback(() => {
    const table = wrapperRef.current?.querySelector('table');
    if (!table) return;

    const { scrollLeft, scrollWidth, clientWidth } = table;
    const isScrollable = scrollWidth > clientWidth;

    // Show left shadow if scrolled away from start
    setShowLeftShadow(isScrollable && scrollLeft > 5);

    // Show right shadow if there's more content to scroll
    setShowRightShadow(isScrollable && scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  useEffect(() => {
    const table = wrapperRef.current?.querySelector('table');
    if (!table) return;

    // Initial check
    updateShadows();

    // Listen for scroll events
    table.addEventListener('scroll', updateShadows);

    // Listen for resize events
    const resizeObserver = new ResizeObserver(updateShadows);
    resizeObserver.observe(table);

    return () => {
      table.removeEventListener('scroll', updateShadows);
      resizeObserver.disconnect();
    };
  }, [updateShadows]);

  return (
    <div
      ref={wrapperRef}
      className="table-scroll-wrapper"
      style={{
        '--show-left-shadow': showLeftShadow ? 1 : 0,
        '--show-right-shadow': showRightShadow ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
