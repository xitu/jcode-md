import {marked} from 'marked';
import Prism from 'prismjs';

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
      return ret.replace(/^<pre>/, `<pre class="language-${infostring}">`);
    }
  }

  marked.setOptions({
    renderer: new Renderer(),
    highlight(code, lang) {
      const language = Prism.languages[lang] || 'language-plaintext';
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
  const el = document.querySelector('.markdown-body,.markdown-body-dark');
  el.innerHTML = marked.parse(content);
})();