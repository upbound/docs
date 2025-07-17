import React from 'react';
import Layout from '@theme/Layout';
import { ChevronRight, Zap, Shield, Code, BookOpen, Settings, Target, Rocket } from 'lucide-react';

const LandingPage = () => {
  const sections = [
    {
      id: 'get-started',
      title: 'Get Started',
      description: 'Quick introduction to Upbound Crossplane and building your first control plane',
      icon: <Rocket className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      items: [
        'Prerequisites and setup',
        'Create a control plane project',
        'Define custom resource types',
        'Deploy and use resources'
      ]
    },
    {
      id: 'guides',
      title: 'Guides',
      description: 'Step-by-step tutorials for platform engineering scenarios and integrations',
      icon: <BookOpen className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
      items: [
          'Build control plane projects',
          'Create an Internal Developer Platform',
          'Common use cases',
              ]
    },
    {
      id: 'manuals',
      title: 'Manuals',
      description: 'Comprehensive documentation for Upbound Crossplane features and concepts',
      icon: <Settings className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-500',
        items: [
        'Install, configure, and manage Upbound',
        'Control Plane Concepts',
        'How-to deploy Upbound in production',
      ]
    },
    {
      id: 'reference',
      title: 'Reference',
      description: 'API documentation, CLI commands, and technical specifications',
      icon: <Code className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-500',
      items: [
        'Crossplane API',
        'Spaces API',
        'CLI reference',
        'Release notes'
      ]
    },
    // {
    //   id: 'solutions',
    //   title: 'Solutions',
    //   description: 'End-to-end guides for building complete platform solutions',
    //   icon: <Target className="w-8 h-8" />,
    //   gradient: 'from-indigo-500 to-purple-500',
    //   items: [
    //   ]
    // }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Native Distribution',
      description: 'Built for autonomous infrastructure platforms serving both humans and AI systems'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Control Plane Pattern',
      description: 'Software that controls other software through declarative APIs and continuous reconciliation'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Custom APIs',
      description: 'Build your own platform APIs with Custom Resource Definitions and composition functions'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Upbound
            </h1>
            <p className="hero-description">
              Welcome to the Upbound Crossplane, the AI-native distribution of Crossplane. <p className="hero-description">Build autonomous infrastructure platforms ready for the age of autonomous systems.
      </p>
            </p>
          </div>
        </div>
      </div>
      {/* Quick Start Section */}
      <div className="quickstart-section">
        <div className="container">
          <div className="quickstart-grid">
            <div className="quickstart-content">
              <h2 className="quickstart-title">Ready to Get Started?</h2>
              <p className="quickstart-description">
                Create your first control plane project in just 10 minutes. Our quickstart guide walks you through 
                creating a custom resource type and deploying it to a local Upbound Crossplane instance.
              </p>
              <div className="quickstart-buttons">
                <a href="/getstarted" className="quickstart-button quickstart-button--primary">
                  Start Tutorial
                  <ChevronRight className="button-icon" />
                </a>
                              </div>
            </div>
            
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-controls">
                  <div className="terminal-dot terminal-dot--red"></div>
                  <div className="terminal-dot terminal-dot--yellow"></div>
                  <div className="terminal-dot terminal-dot--green"></div>
                </div>
              </div>
              <div className="terminal-content">
                <div className="terminal-line terminal-command">$ up project init --scratch my-new-project</div>
                <div className="terminal-line terminal-output">✓ Created control plane project</div>
                <div className="terminal-line terminal-command">$ cd my-new-project && up project run --local</div>
                <div className="terminal-line terminal-output">🚀 Upbound Crossplane running at localhost:8080</div>
                <div className="terminal-line terminal-command">$ kubectl apply -f examples/app/example.yaml</div>
                <div className="terminal-line terminal-output">app.example.crossplane.io/my-app created</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Control Planes?</h2>
            <p className="section-description">
              Control planes unlock the benefits of building custom APIs to manage the resources your users need.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="docs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Control Plane Journey</h2>
            <p className="section-description">
              Get started and build your best platform.
            </p>
          </div>

          <div className="docs-grid">
            {sections.map((section) => (
              <div key={section.id} className="doc-card">
                <div className={`doc-card-header ${section.id}`}>
                  <div className="doc-card-icon">
                    {section.icon}
                  </div>
                  <h3 className="doc-card-title">{section.title}</h3>
                  <p className="doc-card-description">{section.description}</p>
                </div>
                
                <div className="doc-card-body">
                  <ul className="doc-card-list">
                    {section.items.map((item, index) => (
                      <li key={index} className="doc-card-item">
                        <ChevronRight className="doc-card-item-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a href={`/${section.id}`} className={`doc-card-button ${section.id}`}>
                    Explore {section.title}
                    <ChevronRight className="button-icon" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default function Home() {
  return (
    <Layout
      title="Upbound Documentation"
      description="Guide your internal cloud platform journey with Upbound Crossplane"
      noFooter={false}>
      <main>
        <LandingPage />
      </main>
    </Layout>
  );
}
