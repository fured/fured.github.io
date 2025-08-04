// Particles.js setup
particlesJS('particles-js', { /* ... existing particles config ... */ });

document.addEventListener('DOMContentLoaded', () => {
    const blogNav = document.getElementById('blog-nav');
    const postView = document.getElementById('post-view');
    const postList = document.getElementById('post-list');
    const markdownContentDiv = document.getElementById('markdown-content');
    const backButton = document.getElementById('back-button');

    const showPostList = () => {
        postView.style.display = 'none';
        blogNav.style.display = 'block';
    };

    const showPostContent = () => {
        blogNav.style.display = 'none';
        postView.style.display = 'block';
    };

    const loadPost = async (postFile) => {
        try {
            const response = await fetch(`posts/${postFile}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const markdown = await response.text();
            const sanitizedHtml = DOMPurify.sanitize(marked.parse(markdown));
            markdownContentDiv.innerHTML = sanitizedHtml;
            showPostContent();
        } catch (error) {
            console.error("Error loading post:", error);
            markdownContentDiv.innerHTML = "<p>Error: Could not load post.</p>";
            showPostContent();
        }
    };

    const loadPostIndex = async () => {
        try {
            const response = await fetch('posts.json');
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            postList.innerHTML = ''; // Clear existing list
            posts.forEach(post => {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = `${post.date} - ${post.title} - ${post.description}`;
                link.onclick = (e) => {
                    e.preventDefault();
                    loadPost(post.file);
                };
                postList.appendChild(link);
            });
        } catch (error) {
            console.error("Error loading post index:", error);
            postList.innerHTML = "<p>Could not load blog posts.</p>";
        }
    };

    backButton.addEventListener('click', showPostList);

    // Initial load
    loadPostIndex();
});

// NOTE: The full particlesJS config is omitted here for brevity,
// but it should be included in the actual file.
// particlesJS('particles-js', {
//     "particles": {
//         "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
//         "color": { "value": "#00ff00" },
//         "shape": { "type": "circle" },
//         "opacity": { "value": 0.5, "random": true },
//         "size": { "value": 3, "random": true },
//         "line_linked": { "enable": true, "distance": 150, "color": "#00ff00", "opacity": 0.4, "width": 1 },
//         "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
//     },
//     "interactivity": {
//         "detect_on": "canvas",
//         "events": {
//             "onhover": { "enable": true, "mode": "repulse" },
//             "onclick": { "enable": true, "mode": "push" },
//             "resize": true
//         },
//         "modes": {
//             "repulse": { "distance": 100, "duration": 0.4 },
//             "push": { "particles_nb": 4 }
//         }
//     },
//     "retina_detect": true
// });
particlesJS('particles-js', {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
        "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
    },
    "retina_detect": true
});