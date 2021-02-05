module.exports = {
  extends: [
    '@shihengtech/react-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-return-assign': 'off',
    'no-undefined': 'off',
    // 回调层数
    'max-nested-callbacks': ['error', 5],
    'no-implicit-coercion': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-throw-literal': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
  },
};
