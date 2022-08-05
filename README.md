# JCode MD

让码上掘金支持 Markdown。

## 使用方法

直接使用CDN：

```html
<script src="https://cdn.jsdelivr.net/npm/jcode-md"></script>
```

定义容器：

```html
<div class="markdown-body"></div> <!--浅色模式-->
```

```html
<div class="markdown-body-dark"></div> <!--深色模式-->
```

写自定义脚本：

```markdown
#!/jcode/lang/markdown https://xitu.github.io/jcode-languages/dist/lang-markdown.json

# 玩转码上掘金

## 第二章

如何使用码上掘金？如何使用码上掘金？如何使用码上掘金？
```

可以结合 [JCode 精选](https://github.com/xitu/jcode-select) 用码上掘金来写文档合辑。

例子： [玩转码上掘金](https://jcode.pub)

## 高级用法

支持 ES-Modules 方式加载：

```
import 'https://unpkg.com/jcode-md';
```

可以取消自动渲染：

```html
<div class="markdown-body" autoload="false"></div>
```

然后：

```
import {render} from 'https://unpkg.com/jcode-md';
render(root, {
  // options
});
```

默认jcode-md带有深色、浅色两种样式，也可以使用不带样式的纯净版：

```
<script src="https://unpkg.com/jcode-md/dist/jcode-md-pure.js"></script>
```

然后结合[掘金 Markdown 主题](https://github.com/xitu/juejin-markdown-themes)使用。

👉🏻 [例子](https://code.juejin.cn/pen/7128211175501742087)
