// src/components/CrdViewer.js
import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function CrdDocViewer({ crdUrl }) {
  const [crd, setCrd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    async function loadCrd() {
      try {
        console.log(`Fetching CRD from: ${crdUrl}`);
        const response = await fetch(crdUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch CRD: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log(`Received ${text.length} characters of YAML`);
        
        const parsedCrd = yaml.load(text);
        
        if (!parsedCrd) {
          throw new Error('Failed to parse YAML: Empty or invalid YAML content');
        }
        
        setCrd(parsedCrd);
        setDebugInfo({
          kind: parsedCrd.kind,
          apiVersion: parsedCrd.apiVersion,
          name: parsedCrd.metadata?.name,
          group: parsedCrd.spec?.group,
          versions: parsedCrd.spec?.versions?.map(v => v.name).join(', ')
        });
        
      } catch (err) {
        console.error('Error loading CRD:', err);
        setError(err.message);
        setDebugInfo({
          url: crdUrl,
          error: err.message,
          stack: err.stack
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (crdUrl) {
      loadCrd();
    } else {
      setLoading(false);
      setError('No CRD URL provided');
    }
  }, [crdUrl]);

  if (loading) {
    return <div>Loading CRD documentation...</div>;
  }

  if (error) {
    return (
      <div className="crd-viewer-error">
        <p>Error loading CRD: {error}</p>
        <details>
          <summary>Debug Information</summary>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </details>
      </div>
    );
  }

  if (!crd) {
    return (
      <div className="crd-viewer-error">
        <p>No CRD data available.</p>
        <details>
          <summary>Debug Information</summary>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          <p>URL: {crdUrl}</p>
          <p>Please ensure the CRD file exists at this location and has been properly processed.</p>
        </details>
      </div>
    );
  }

  const kind = crd?.spec?.names?.kind || 'Resource';
  const group = crd?.spec?.group || '';
  const version = crd?.spec?.versions?.[0]?.name || '';
  const schema = crd?.spec?.versions?.[0]?.schema?.openAPIV3Schema || {};
  const description = schema.description || '';
  
  const specProperties = schema.properties?.spec?.properties || {};
  const statusProperties = schema.properties?.status?.properties || {};

  const renderProperties = (properties, depth = 0) => {
    if (!properties || Object.keys(properties).length === 0) {
      return <p>No properties found.</p>;
    }

    return (
      <table className="crd-properties-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(properties).map(([name, prop]) => {
            const type = prop.type || (prop.properties ? 'object' : prop.items ? 'array' : 'unknown');
            return (
              <React.Fragment key={name}>
                <tr>
                  <td>
                    <code style={{ paddingLeft: `${depth * 10}px` }}>
                      {name}
                      {prop.required && <span style={{ color: 'red' }}>*</span>}
                    </code>
                  </td>
                  <td><code>{type}</code></td>
                  <td>{prop.description}</td>
                </tr>
                {type === 'object' && prop.properties && 
                  Object.entries(prop.properties).map(([subName, subProp]) => (
                    <tr key={`${name}.${subName}`}>
                      <td>
                        <code style={{ paddingLeft: `${(depth + 1) * 10}px` }}>
                          {name}.{subName}
                          {subProp.required && <span style={{ color: 'red' }}>*</span>}
                        </code>
                      </td>
                      <td><code>{subProp.type || (subProp.properties ? 'object' : subProp.items ? 'array' : 'unknown')}</code></td>
                      <td>{subProp.description}</td>
                    </tr>
                  ))
                }
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="crd-viewer">
      <h3>CRD Information</h3>
      <table className="crd-info-table">
        <tbody>
          <tr>
            <th>Group:</th>
            <td><code>{group}</code></td>
          </tr>
          <tr>
            <th>Version:</th>
            <td><code>{version}</code></td>
          </tr>
          <tr>
            <th>Kind:</th>
            <td><code>{kind}</code></td>
          </tr>
          <tr>
            <th>Scope:</th>
            <td><code>{crd.spec.scope || 'Namespaced'}</code></td>
          </tr>
        </tbody>
      </table>
      
      {description && (
        <>
          <h3>Description</h3>
          <p>{description}</p>
        </>
      )}
      
      <h3>Example</h3>
      <CodeBlock language="yaml">{`apiVersion: ${group}/${version}
kind: ${kind}
metadata:
  name: example-${kind.toLowerCase()}
spec:
  # Add spec properties here
`}</CodeBlock>

      <h3>Schema</h3>
      <Tabs>
        <TabItem value="spec" label="Spec" default>
          <h4>Spec Properties</h4>
          {renderProperties(specProperties)}
        </TabItem>
        
        {/* Check if there's a response field and render it */}
        {schema.properties?.response?.properties && (
          <TabItem value="response" label="Response">
            <h4>Response Properties</h4>
            {renderProperties(schema.properties.response.properties)}
          </TabItem>
        )}
        
        {/* Keep the status tab for conventional CRDs */}
        {schema.properties?.status?.properties && Object.keys(schema.properties.status.properties).length > 0 && (
          <TabItem value="status" label="Status">
            <h4>Status Properties</h4>
            {renderProperties(statusProperties)}
          </TabItem>
        )}
        
       
        <TabItem value="full" label="Full Schema">
          <CodeBlock language="yaml">
            {yaml.dump(crd)}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
}
