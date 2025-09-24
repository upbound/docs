const versions = {
  cli: '0.39.1',
  spaces: '1.14.1',
  aws: '1.23.0',
  azure: '1.13.0',
  gcp: '1.14.0',
  helm: '0.21.1',
  kubernetes: '0.18.0',
  mcpconnector: 'v0.9.1'
};

export default function Version({type = 'cli'}) {
  return <span>{versions[type]}</span>;
}
