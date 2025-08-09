export const config = {
  assetPath: import.meta.env.PROD ? '/assets/phaser-tutorial/' : '',
};

export const getAssetPath = (path: string) => {
  return `${config.assetPath}${path}`;
};