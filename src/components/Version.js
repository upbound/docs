export const versions = {
  cli: '0.44.3',
  spaces: '1.15.2',
  aws: '1.23.0',
  azure: '1.13.0',
  gcp: '1.14.0',
  helm: '0.21.1',
  kubernetes: '0.18.0',
  mcpconnector: 'v0.10.0'
};

export default function Version({type = 'cli'}) {
  return <span>{versions[type]}</span>;
}
