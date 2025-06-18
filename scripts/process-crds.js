// scripts/process-crds.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Define the CRD directories and their output locations
const crdDirectories = [
  { 
    source: 'docs/apis-cli/query-api/yaml', 
    output: 'docs/apis-cli/query-api/yaml',
    name: 'Query API'
  },
  { 
    source: 'docs/apis-cli/spaces-api/yaml', 
    output: 'docs/apis-cli/spaces-api/yaml',
    name: 'Spaces API'
  },
  { 
    source: 'docs/apis-cli/testing-api/yaml', 
    output: 'docs/apis-cli/testing/yaml',
    name: 'Testing API'
  }
];

crdDirectories.forEach(dir => {
  processDirectory(dir.source, dir.output, dir.name);
});

function processDirectory(sourceDir, outputDir, apiName) {
  console.log(`Processing ${apiName} CRDs from: ${sourceDir}`);
  
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Source directory not found: ${sourceDir} - skipping`);
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }
  
  try {
    const files = fs.readdirSync(sourceDir)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
    
    console.log(`Found ${files.length} YAML files in ${sourceDir}`);
    
    if (files.length === 0) {
      console.warn(`No YAML files found in ${sourceDir}`);
      return;
    }
    
    files.forEach(file => {
      try {
        const crdPath = path.join(sourceDir, file);
        const crdContent = fs.readFileSync(crdPath, 'utf8');
        
        try {
          const crd = yaml.load(crdContent);
          
          if (!crd.kind || crd.kind !== 'CustomResourceDefinition') {
            console.warn(`Skipping ${file}: Not a CRD`);
            return;
          }
          
          const kind = crd.spec.names.kind;
          const group = crd.spec.group;
          console.log(`Processing CRD: ${kind} (${group})`);
          
        } catch (yamlError) {
          console.error(`Error parsing YAML in ${file}:`, yamlError.message);
          return; 
        }
        
        const outputPath = path.join(outputDir, file);
        
        
        fs.copyFileSync(crdPath, outputPath);
        
        console.log(`Copied ${crdPath} -> ${outputPath}`);
        
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    });
    
  } catch (error) {
    console.error(`Error reading directory ${sourceDir}:`, error.message);
  }
}

console.log('CRD processing complete!');
