import React from 'react';

const DocumentationCards = () => {
  const sections = [
    {
      title: 'Upbound Crossplane (UXP)',
      description: 'Enterprise-grade Crossplane distribution with enhanced compositions, functions, operations, and package management.',
      link: './uxp/overview'
    },
    {
      title: 'Spaces',
      description: 'Managed Crossplane control plane environments with cloud and self-hosted deployment options.',
      link: './spaces/overview'
    },
    {
      title: 'CLI',
      description: 'Command-line tools for managing Upbound configurations, contexts, and project tooling.',
      link: './cli/overview'
    },
    {
      title: 'Console',
      description: 'Web-based management interface with MCP Query API and self-service capabilities.',
      link: './console/'
    },
    {
      title: 'Official Packages',
      description: 'Production-ready provider packages for cloud and infrastructure platforms with authentication and migration guides.',
      link: './packages/overview'
    },
    {
      title: 'Marketplace',
      description: 'Package discovery, publishing, and repository management platform for internal and public distribution.',
      link: './marketplace/overview'
    },
    {
      title: 'Platform',
      description: 'Identity management, RBAC, organizations, teams, and SSO integration for enterprise deployments.',
      link: './platform/overview'
    }
  ];

  return (
    <>
      <style>{`
        .documentation-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin: 2rem auto;
          max-width: 1200px;
        }
        
        .documentation-card {
          display: block;
          padding: 1.25rem;
          border: 1px solid var(--upbound-border-color) !important;
          border-radius: 0.75rem;
          text-decoration: none !important;
          background-color: var(--ifm-background-color);
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .documentation-card:hover {
          border-color: var(--ifm-color-primary);
          transform: translateY(-2px);
          text-decoration: none !important;
          color: inherit;
        }
        
        .documentation-card-title {
          margin: 0 0 0.75rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--ifm-font-color-base);
          font-family: var(--ifm-heading-font-family);
          line-height: 1.3;
        }
        
        .documentation-card-description {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--ifm-color-content-secondary);
        }
        
        @media (max-width: 900px) {
          .documentation-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }
        
        @media (max-width: 600px) {
          .documentation-cards-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .documentation-card {
            padding: 1rem;
          }
          
          .documentation-card-title {
            font-size: 1.125rem;
          }
        }
      `}</style>
      
      <div className="documentation-cards-grid">
        {sections.map((section, index) => (
          <a
            key={index}
            href={section.link}
            className="documentation-card"
          >
            <h3 className="documentation-card-title">
              {section.title}
            </h3>
            <p className="documentation-card-description">
              {section.description}
            </p>
          </a>
        ))}
      </div>
    </>
  );
};

export default DocumentationCards;
