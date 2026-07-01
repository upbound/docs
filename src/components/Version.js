export const versions = {
  cli: '0.48.2.',
  spaces: '1.17.0',
  aws: '2.6.1',
  azure: '2.6.0',
  gcp: '2.6.0',
  helm: '1.3.0',
  kubernetes: '1.2.6',
  mcpconnector: 'v0.10.0'
};

export default function Version({type = 'cli'}) {
  return <span>{versions[type]}</span>;
}
