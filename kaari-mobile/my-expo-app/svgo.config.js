module.exports = {
  plugins: [
    { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
    { name: 'convertStyleToAttrs' },
    { name: 'inlineStyles', params: { onlyMatchedOnce: false } },
    { name: 'removeStyleElement' },
    { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
  ],
};


