const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv');

// Determine the NODE_ENV at the start of the build process
const initialNodeEnv = process.env.NODE_ENV || 'development';

// Dynamically load the appropriate .env file based on NODE_ENV
const dotenvFilePath = (() => {
  switch (initialNodeEnv) {
    case 'test':
      return '.env.test';
    case 'development':
      return '.env.development';
    case 'production':
    default:
      return '.env';
  }
})();

// Load environment variables from the selected .env file
const envConfig =
  // eslint-disable-next-line no-undef
  dotenv.config({ path: path.resolve(__dirname, dotenvFilePath) }).parsed || {};

// Create env keys for DefinePlugin
const envKeys = {};
Object.keys(envConfig).forEach((key) => {
  envKeys[`process.env.${key}`] = JSON.stringify(envConfig[key]);
});

// Add all process.env variables except NODE_ENV
Object.keys(process.env).forEach((key) => {
  if (key !== 'NODE_ENV') {
    envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);
  }
});

module.exports = () => {
  // Use a dedicated build optimization flag
  const shouldOptimize = process.env.OPTIMIZE_BUILD === 'true';
  const webpackMode = shouldOptimize ? 'production' : 'development';

  return {
    node: {
      global: true,
      __filename: false,
    },
    entry: './src/index.ts',
    target: 'node',
    mode: webpackMode,
    devtool: shouldOptimize ? 'source-map' : 'inline-source-map',
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
    plugins: [
      // Inject environment variables using DefinePlugin
      new webpack.DefinePlugin({
        ...envKeys,
        'process.env.NODE_ENV': JSON.stringify(initialNodeEnv), // Ensure NODE_ENV is consistent
      }),
    ],
    optimization: {
      nodeEnv: false, // Disable automatic NODE_ENV injection by webpack
      minimize: shouldOptimize,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false,
            },
          },
        }),
      ],
      usedExports: true,
    },
  };
};
