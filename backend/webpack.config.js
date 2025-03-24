const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    node: {
      global: true,
      __filename: false,
    },
    entry: './src/index.ts',
    target: 'node',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          use: {
            loader: 'ts-loader',
            options: {
              // eslint-disable-next-line no-undef
              configFile: path.resolve(__dirname, 'tsconfig.build.json'),
              transpileOnly: true,
              compilerOptions: {
                module: 'ESNext',
              },
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          // eslint-disable-next-line no-undef
          configFile: path.resolve(__dirname, 'tsconfig.build.json'),
        }),
      ],
    },
    output: {
      filename: 'index.js',
      // eslint-disable-next-line no-undef
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'commonjs2',
      },
    },
    experiments: {
      outputModule: true,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
      usedExports: true, // Enable tree-shaking
    },
  };
};
