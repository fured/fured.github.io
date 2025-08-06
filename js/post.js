// Particles.js setup
particlesJS('particles-js', {
    "particles": {
        "number": { 
            "value": 80, 
            "density": { 
                "enable": true, 
                "value_area": 800 
            } 
        },
        "color": { 
            "value": "#ffffff" 
        },
        "shape": { 
            "type": "circle" 
        },
        "opacity": { 
            "value": 0.5, 
            "random": false 
        },
        "size": { 
            "value": 3, 
            "random": true 
        },
        "line_linked": { 
            "enable": true, 
            "distance": 150, 
            "color": "#ffffff", 
            "opacity": 0.4, 
            "width": 1 },
        "move": { 
            "enable": true, 
            "speed": 2, 
            "direction": "none", 
            "random": false, 
            "straight": false, 
            "out_mode": "out", 
            "bounce": false 
        }
    },
    "interactivity": {
        "detect_on": "window",
        "events": { 
            "onhover": { 
                "enable": true, 
                "mode": "grab" 
            }, 
            "onclick": { 
                "enable": true, 
                "mode": "push" 
            }, 
            "resize": true 
        },
        "modes": { 
            "repulse": { 
                "distance": 100, 
                "duration": 0.4
            }, 
            "push": { 
                "particles_nb": 4 
            } 
        }
    },
    "retina_detect": true
});

const urlParams = new URLSearchParams(window.location.search);
const postFile = urlParams.get('file');
const markdownContentDiv = document.getElementById('markdown-content');
// const md = window.markdownit();
// 代码高亮
const md = window.markdownit({
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

async function loadPost() {
    try {
        const response = await fetch(`posts/${postFile}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        // const sanitizedHtml = DOMPurify.sanitize(marked.parse(markdown));
        const html = md.render(markdown);
        const sanitizedHtml = DOMPurify.sanitize(html);
        markdownContentDiv.innerHTML = sanitizedHtml;
    } catch (error) {
        console.error("Error loading post:", error);
        markdownContentDiv.innerHTML = "<p>Error: Could not load post.</p>";
    }
}

loadPost();
