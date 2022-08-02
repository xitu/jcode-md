const fs = require('fs');
const {version} = require('./package.json');
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
};

function injectStyle() {
  const css = fs.readFileSync('./dist/jcode-md.css', 'utf8');
  ['./dist/jcode-md.js', './dist/jcode-md.esm.js'].forEach((file) => {
    const js = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file,
      `${js}
function __eds__injectStyle(css) {
  const headEl = document.head || document.getElementsByTagName('head')[0];
  const styleEl = document.createElement('style');
  if(styleEl.styleSheet) {
    styleEl.styleSheet.cssText = css;
  } else {
    styleEl.appendChild(document.createTextNode(css));
  }
  headEl.appendChild(styleEl);
}
__eds__injectStyle(${JSON.stringify(css)})`);
  });
}

if(process.env.mode === 'production') {
  require('esbuild').buildSync({minify: true, ...options});
  require('esbuild').buildSync({
    ...options,
    format: 'esm',
    entryPoints: ['src/jcode-md.js'],
    outfile: 'dist/jcode-md.esm.js',
  });
  injectStyle();
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