module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': 'off',
    'no-bitwise': 'off',
    'react/no-unstable-nested-components': [
      'warn',
      {
        'propNamePattern': '+(render*|headerTitle|headerLeft|headerRight|tabBarIcon)',
      },
    ],
  },
};
