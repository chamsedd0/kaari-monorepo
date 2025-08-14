module.exports = {
  // Ensure imported SVGs don't hardcode colors; allow overriding via props
  svgoConfig: {
    plugins: [
      { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
    ],
  },
  svgProps: {
    fill: 'currentColor',
  },
};


