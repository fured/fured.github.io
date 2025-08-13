# github personal page
## 1 build
为了SEO，页面内容在后端用node.js渲染
```shell
# 安装库
npm install jsdom
npm install markdown-it prismjs dompurify
npm install markdown-it-anchor markdown-it-toc-done-right

# 生成html
node build.js
```
## 2 本地调试
```python
cd docs
python3 -m http.server 9000
```

## 3 PLAN
- [x] 增加目录条目点亮
- [x] 徒步blog 在toc下面增加两步路轨迹链接、tags、推荐指数