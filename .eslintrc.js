module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  'max-file-line-count': [true, 1000], // 定义每个文件代码行数
  'no-duplicate-imports': true, // 禁止在一个文件内，多次引用同一module
};
