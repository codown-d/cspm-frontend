import FileManagerPlugin from 'filemanager-webpack-plugin';

import type { IApi } from 'umi';

const { REACT_APP_SUBJECT = 'tensor' } = process.env;
export default (api: IApi) => {
  // webpack
  api.modifyWebpackConfig((memo) => {
    if (process.env.NODE_ENV !== 'production') {
      return memo;
    }
    REACT_APP_SUBJECT !== 'tensor' &&
      memo.plugins.push(
        new FileManagerPlugin({
          events: {
            onEnd: {
              copy: [
                {
                  source: `public/oemAssets/${REACT_APP_SUBJECT}/*.{jpg,ico,svg,png}`,
                  destination: 'dist/images',
                },
                {
                  source: `dist/oemAssets/${REACT_APP_SUBJECT}/theme.css`,
                  destination: 'dist/theme.css',
                },
              ],
              delete: [`dist/oemAssets/*/*.{jpg,ico,svg,png}`],
            },
          },
        }),
      );
    return memo;
  });
};
