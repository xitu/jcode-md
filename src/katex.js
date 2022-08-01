import katex from 'katex';
import 'katex/dist/katex.css';

function renderer(token) {
  const {text: code, macros} = token;
  const ret = code;
  try {
    return katex.renderToString(code, {
      macros,
    });
  } catch (ex) {
    console.error(ex.message);
    return ret;
  }
}

export default [{
  name: 'katex',
  level: 'block',
  tokenizer(src) {
    const match = src.match(/^\$\$([\s\S]*)\$\$/i);
    if(match) {
      const body = match[1].trim();
      const m = body.match(/^(\{[\s\S]*?\})?([\s\S]*)/i);

      let macros = m[1];

      if(macros) {
        try {
          macros = JSON.parse(m[1]);
        } catch (ex) {
          console.error(ex.message);
        }
      }
      return {
        type: 'katex',
        raw: match[0],
        macros,
        text: m[2].trim(),
      };
    }
  },
  renderer,
}, {
  name: 'katex-inline',
  level: 'inline',
  tokenizer(src) {
    const match = src.match(/^\$([^\n]+?)\$/);
    if(match) {
      return {
        type: 'katex',
        raw: match[0],
        text: match[1].trim(),
      };
    }
  },
  renderer,
}];