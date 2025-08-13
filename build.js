const fs = require('fs').promises;
const Path = require('path');
const { JSDOM } = require('jsdom');
const MarkdownIt = require('markdown-it');
const DOMPurify = require('dompurify');
const Anchor = require('markdown-it-anchor')
const MarkdownTOC = require("markdown-it-toc-done-right")
const Prism = require('prismjs'); // 代码高亮
require('prismjs/components/prism-javascript'); 
require('prismjs/components/prism-python'); 

const md = new MarkdownIt({
  html:         true,
  linkify: true,
  typography: true,
  xhtmlOut: true,
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

md.use(Anchor, {
    level: 2,
    permalink: Anchor.permalink.linkInsideHeader({
        symbol: '§',
        placement: 'before'
    }),
});

md.use(MarkdownTOC, {
    level: 2,
    itemClass: "list-item",
    containerId: "md-toc",
});

const postsDir = 'posts';
const postsHtmlDir = 'docs/posts';
const indexHtmlPath = 'docs/index.html';

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data;
    } catch (err) {
        console.error(`read ${filePath} fail:`, err);
        return '';
    }
}

function getTOC(htmlStr) {
    const dom = new JSDOM(htmlStr);
    const document = dom.window.document;
    const tocNav = document.getElementById('md-toc');
    if (!tocNav) {
        console.warn("WARN: No TOC element found.");
        return '', htmlStr;
    }
    const tocHtmlStr = tocNav.outerHTML;
    tocNav.remove(); // 从文档中移除 TOC 元素
    return {
        tocHtml: tocHtmlStr, 
        html: dom.serialize(),
    };
}

async function genPostHtml(postFileName, post) {
    const postHtml = await readFile('post_view.html');
    if (!postHtml) {
        console.error('Error: post_view.html is empty or not found.');
        return;
    }

    const postContent = await readFile(`${postsDir}/${postFileName}`);
    if (!postContent) {
        console.error(`Error: Could not read post file ${postFileName}.`);
        return;
    }

    const postDom = new JSDOM(postHtml);
    const postWindow = postDom.window;
    const postPurify = DOMPurify(postWindow); // 通过 window 对象初始化 DOMPurify
    const postDocument = postDom.window.document;
    const markdownContentDiv = postDocument.getElementById('markdown-content');
    // 设置标题
    postDocument.title = `${post.title}:${post.description}` || "FURED Blog Post";
    // 设置元数据
    const metaDescription = postDocument.createElement('meta');
    metaDescription.name = "description";
    metaDescription.content = post.metaDesc || "FURED Blog Post";
    postDocument.head.appendChild(metaDescription);

    const metaKeywords = postDocument.createElement('meta');
    metaKeywords.name = "keywords";
    metaKeywords.content = post.tags ? post.tags.join(', ') : "FURED Blog Post Tags";
    postDocument.head.appendChild(metaKeywords);

    const html = md.render(postContent);
    const sanitizedHtml = postPurify.sanitize(html);
    const rslt = getTOC(sanitizedHtml);
    if (rslt.tocHtml) {
        const tocView = postDocument.getElementById('toc-content');
        tocView.innerHTML = rslt.tocHtml;
    }
    markdownContentDiv.innerHTML = rslt.html;

    // 保存新的子页 HTML
    const postHtmlFileName = `${encodeURIComponent(Path.basename(postFileName, Path.extname(postFileName)))}.html`;
    try {
        await fs.writeFile(`${postsHtmlDir}/${postHtmlFileName}`, postDom.serialize());
        console.log(`gen post page: ${postHtmlFileName} success`); 
    } catch (err) {
        console.error(`gen post page: ${postHtmlFileName} fail:`, err);
    }
}

async function genIndexHtml(posts) {
    const homeHtml = await readFile('home.html');
    if (!homeHtml) {
        console.error('Error: home.html is empty or not found.');
        return;
    }

    const dom = new JSDOM(homeHtml);
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
        if (!posts.hasOwnProperty(key)) continue;

        const post = posts[key];

        // 创建外层容器
        const postItem = document.createElement('div');
        postItem.className = 'post-item';

        // 第一行：日期+标题（带链接）
        const titleLine = document.createElement('div');
        titleLine.className = 'post-title-line';
        const link = document.createElement('a');
        const postURL = `posts/${encodeURIComponent(Path.basename(key, Path.extname(key)))}.html`;
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
    }

    // 生成新的 HTML 内容
    const newHtml = dom.serialize();

    // 将新的 HTML 保存到文件
    try {
        await fs.writeFile(`${indexHtmlPath}`, newHtml);
        console.log('gen home page: index.html success');
    } catch (err) {
        console.error('gen home page: index.html fail: ', err);
    }
}

async function build() {
    const postJsonStr = await readFile('posts.json');
    if (!postJsonStr) {
        console.error('Error: posts.json is empty or not found.');
        return;
    }

    let posts;
    try {
        posts = JSON.parse(postJsonStr);
    } catch (error) {
        console.error('parse posts.json fail:', error);
        return;
    }

    await genIndexHtml(posts);
    
    for (let key in posts) {
        if (!posts.hasOwnProperty(key)) continue;

        await genPostHtml(key, posts[key]);
    }
}

build();
