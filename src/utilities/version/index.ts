import packageJson from '../../package.json';

export const getCurrentAppVersion = () => {
  const { version } = packageJson;
  return version;
};
