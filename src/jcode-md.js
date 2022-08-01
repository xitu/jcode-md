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

(async () => {
  const content = await getCustomCode();

  class Renderer extends marked.Renderer {
    code(code, infostring, escaped) {
      const ret = super.code(code, infostring, escaped);
      if(infostring === 'mermaid') {
        return ret.replace(/^<pre><code/, '<div').replace(/<\/code><\/pre>$/, '</div>');
      }
      return ret.replace(/^<pre>/, `<pre class="language-${infostring}">`);
    }
  }
  marked.setOptions({
    renderer: new Renderer(),
    highlight(code, lang) {
      if(lang === 'mermaid') {
        return `<div class="mermaid">${code}</div>`;
      }
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
  });
  marked.use({extensions: [...katex]});
  const el = document.querySelector('.markdown-body,.markdown-body-dark');
  el.innerHTML = marked.parse(content);
  const isDark = el.classList.contains('markdown-body-dark');

  if(window.mermaid && window.mermaid.init) {
    const mermaidGraphs = document.querySelectorAll('.mermaid');
    window.mermaid.initialize({theme: isDark ? 'dark' : 'neutral'});
    window.mermaid.init(mermaidGraphs);
  }
})();