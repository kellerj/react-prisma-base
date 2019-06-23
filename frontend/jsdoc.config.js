

module.exports = {
  source: {
    include: ['server.js', 'components', 'lib', 'pages'],
  },
  plugins: [
    'plugins/markdown',
    'node_modules/jsdoc-memberof-namespace',
  ],
  templates: {
    default: {
      useLongNameInNav: true,
    },
  },
  opts: {
    // template: 'node_modules/minami',
    private: true,
    readme: 'README.md',
    destination: './doc',
    encoding: 'utf8',
    recurse: true,
  },
};
