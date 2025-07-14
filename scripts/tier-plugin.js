// plugins/tier-plugin.js
const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');

module.exports = function tierPlugin(context, options) {
  return {
    name: 'upbound-tier-plugin',
    
    async loadContent() {
      const tierData = {};
      const docsPath = path.join(context.siteDir, 'docs');
      
      function processDirectory(dir, relativePath = '') {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            processDirectory(itemPath, path.join(relativePath, item));
          } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
            const content = fs.readFileSync(itemPath, 'utf8');
            const { data: frontmatter } = matter(content);
            
            if (frontmatter.tier) {
              const docId = path.join(relativePath, item.replace(/\.(md|mdx)$/, ''));
              tierData[docId] = {
                tier: frontmatter.tier,
                title: frontmatter.title,
                path: itemPath
              };
            }
          }
        });
      }
      
      if (fs.existsSync(docsPath)) {
        processDirectory(docsPath);
      }
      
      return { tierData };
    },
    
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
    
    getPathsToWatch() {
      return [path.join(context.siteDir, 'docs/**/*.{md,mdx}')];
    },
  };
};
