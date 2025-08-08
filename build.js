const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const MarkdownIt = require('markdown-it');
const DOMPurify = require('dompurify');

// 代码高亮
const Prism = require('prismjs');
require('prismjs/components/prism-javascript'); 
require('prismjs/components/prism-python'); 
// const md = new MarkdownIt();
const md = new MarkdownIt({
  html:         true,
  highlight: function (str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return '<pre class="language-' + lang + '"><code>' +
          Prism.highlight(str, Prism.languages[lang], lang) +
          '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="language-none"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// 读取 HTML 文件
fs.readFile('home.html', 'utf8', (err, html) => {
    if (err) {
        console.error('读取文件失败:', err);
        return;
    }

    fs.readFile('posts.json', 'utf8', async (err, data) => {
        if (err) {
            console.error('读取 posts.json 失败:', err);
            return;
        }

        let posts;
        try {
            posts = JSON.parse(data);
        } catch (error) {
            console.error('解析 posts.json 失败:', error);
            return;
        }
        // 使用 jsdom 解析 HTML 文件为 Document 对象
        const dom = new JSDOM(html);
        const window = dom.window;
        const purify = DOMPurify(window);
        const document = dom.window.document;
        const postList = document.getElementById('post-list');
        if (!postList) {
            console.error("Error: No post list element found.");
            return;
        }

        // 清空现有的列表
        postList.innerHTML = '';

        // 遍历 posts 对象
        for (let key in posts) {
            if (posts.hasOwnProperty(key)) {
                const post = posts[key];

                // 创建外层容器
                const postItem = document.createElement('div');
                postItem.className = 'post-item';

                // 第一行：日期+标题（带链接）
                const titleLine = document.createElement('div');
                titleLine.className = 'post-title-line';
                const link = document.createElement('a');
                const postURL = `posts/${encodeURIComponent(path.basename(key, path.extname(key)))}.html`;
                link.href = postURL;
                link.textContent = `${post.date} - ${post.title}`;
                titleLine.appendChild(link);

                // tags 紧跟标题
                if (Array.isArray(post.tags)) {
                    const tagsSpan = document.createElement('span');
                    tagsSpan.className = 'post-tags-inline';
                    post.tags.forEach(tag => {
                        const tagSpan = document.createElement('span');
                        tagSpan.className = 'post-tag';
                        tagSpan.textContent = tag;
                        tagsSpan.appendChild(tagSpan);
                    });
                    titleLine.appendChild(tagsSpan);
                }

                // 第二行：描述
                const descLine = document.createElement('div');
                descLine.className = 'post-desc-line';
                descLine.textContent = post.description;

                // 组装
                postItem.appendChild(titleLine);
                postItem.appendChild(descLine);
                postList.appendChild(postItem);

                // 生成子页
                fs.readFile('post_view.html', 'utf8', (err, postHtml) => {
                    if (err) {
                        console.error('读取 post_view.html 失败:', err);
                        return;
                    }

                    fs.readFile(`posts/${key}`, 'utf8', (err, markdown) => {
                        if (err) {
                            console.error(`read posts/${key} failed:`, err);
                            markdownContentDiv.innerHTML = "<p>Error: Could not load post.</p>";
                            return;
                        }
                        const postDom = new JSDOM(postHtml);
                        const postWindow = postDom.window;
                        const postPurify = DOMPurify(postWindow); // 通过 window 对象初始化 DOMPurify
                        const postDocument = postDom.window.document;
                        const markdownContentDiv = postDocument.getElementById('markdown-content');

                        // 设置标题
                        postDocument.title = `${post.title}:${post.description}` || "FURED Blog Post";
                
                        const metaDescription = postDocument.createElement('meta');
                        metaDescription.name = "description";
                        metaDescription.content = post.metaDesc || "FURED Blog Post";
                        postDocument.head.appendChild(metaDescription);

                        const metaKeywords = postDocument.createElement('meta');
                        metaKeywords.name = "keywords";
                        metaKeywords.content = post.tags ? post.tags.join(', ') : "FURED Blog Post Tags";
                        postDocument.head.appendChild(metaKeywords);

                        const html = md.render(markdown);
                        const sanitizedHtml = postPurify.sanitize(html);
                        markdownContentDiv.innerHTML = sanitizedHtml;

                        // 保存新的子页 HTML
                        fs.writeFile(`docs/${postURL}`, postDom.serialize(), (err) => {
                            if (err) {
                                console.error(`gen post page: ${postURL} fail:`, err);
                            } else {
                                console.log(`gen post page: ${postURL} success`);
                            }
                        });
                    });
                });
            }
        }

        // 生成新的 HTML 内容
        const newHtml = dom.serialize();

        // 将新的 HTML 保存到文件
        fs.writeFile('docs/index.html', newHtml, (err) => {
            if (err) {
                console.error('gen home page: index.html fail: ', err);
            } else {
                console.log('gen home page: index.html success');
            }
        });
    });
});