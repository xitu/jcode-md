const fs = require('fs');
const {version} = require('./package.json');

const StyleLoader = {
  name: 'inline-style',
  setup({onLoad}) {
    const template = css =>
      // eslint-disable-next-line
      `typeof document<'u'&&` +
      // eslint-disable-next-line
      `document.head.appendChild(document.createElement('style'))` +
      `.appendChild(document.createTextNode(${JSON.stringify(css)}))`;

    onLoad({filter: /\.css$/}, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      return {contents: template(css.replace(/\s+/g, ''))};
    });
  },
};

const options = {
  entryPoints: ['src/index.js'],
  outfile: 'dist/jcode-md.js',
  bundle: true,
  loader: {
    '.png': 'base64',
    '.svg': 'base64',
    '.woff': 'file',
    '.ttf': 'file',
    '.woff2': 'file',
  },
  define: {
    VERSION: `"${version}"`,
  },
  plugins: [StyleLoader],
};

if(process.env.mode === 'production') {
  require('esbuild').build({minify: true, ...options});
  require('esbuild').build({
    ...options,
    format: 'esm',
    entryPoints: ['src/jcode-md.js'],
    outfile: 'dist/jcode-md.esm.js',
  });
} else {
  require('esbuild').serve({
    servedir: '.',
  }, options).then((server) => {
    console.log(`Server is running at ${server.host}:${server.port}`);
    const scriptURL = `http://localhost:${server.port}/${options.outfile}`;
    console.log(`打开 https://code.juejin.cn
设置 ${scriptURL} 到 script 依赖资源，进行调试。`);
  });
}