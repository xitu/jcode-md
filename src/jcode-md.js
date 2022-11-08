import './css/common.css';

import {marked} from 'marked';
import Prism from 'prismjs';
import katex from './katex';

const getCustomCode = async () => {
  let el;
  do {
    el = document.querySelector('body>script:last-of-type');
    if(el && el.type === 'text/markdown') return el.textContent;
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, 50));
  } while(1);
};

export const codeExtensions = [
  [/^mermaid$/, (code, infostring, escaped) => {
    return `<div class="mermaid">${code}</div>`;
  }],
];

class Renderer extends marked.Renderer {
  code(code, infostring, escaped) {
    infostring = infostring.trim();
    for(let i = 0; i < codeExtensions.length; i++) {
      const [pattern, fn] = codeExtensions[i];
      if(pattern.test(infostring)) {
        return fn(code, infostring, escaped);
      }
    }
    const ret = super.code(code, infostring, escaped);
    return ret.replace(/^<pre>/, `<pre class="language-${infostring}">`);
  }

  link(href, title, text) {
    if(!title && text === href && href.startsWith('https://code.juejin.cn/pen/')) {
      return `<iframe class="jcode-playground" src="${href}"></iframe>`;
    }
    return super.link(href, title, text);
  }
}

const defaultOptions = {
  renderer: new Renderer(),
  highlight(code, lang) {
    const language = Prism.languages[lang] || Prism.languages.plaintext;
    return Prism.highlight(code, language, lang);
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  headerIds: false,
};

export const renderOptions = {};
export const markedExtensions = [];

export const render = async (el, options = {}) => {
  const content = await getCustomCode();
  const opt = {...defaultOptions, ...renderOptions, ...options};

  marked.setOptions(opt);
  marked.use({extensions: [...markedExtensions, ...katex]});
  el.innerHTML = marked.parse(content);
  const isDark = el.classList.contains('markdown-body-dark');

  if(window.mermaid && window.mermaid.init) {
    const mermaidGraphs = document.querySelectorAll('.mermaid');
    window.mermaid.initialize({theme: isDark ? 'dark' : 'neutral'});
    window.mermaid.init(mermaidGraphs);
  }
};

window.onload = () => {
  const el = document.querySelector('.markdown-body,.markdown-body-dark');
  const isAutoLoad = el && el.getAttribute('autoload');
  if(isAutoLoad !== 'false' && isAutoLoad !== false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'markdown-body-wrapper';
    el.appendChild(wrapper);
    render(wrapper);
  }
};