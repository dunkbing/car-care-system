module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
      }
    ],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        cwd: 'babelrc',
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@components': './src/components',
          '@components/*': ['src/components'],
          '@constants': './src/constants',
          '@models': './src/models',
          '@redux': './src/redux',
          '@redux/*': ['src/redux'],
          '@utils': './src/utils',
          '@screens': './src/screens',
        }
      }
    ]
  ],
};
