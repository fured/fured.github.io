# github personal page
## 1 build
为了SEO，页面内容在后端用node.js渲染
```shell
# 安装库
npm install jsdom
npm install markdown-it prismjs dompurify

# 生成html
node build.js
```
## 2 本地调试
```python
cd docs
python3 -m http.server 9000
```