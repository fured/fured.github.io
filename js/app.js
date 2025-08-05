// Particles.js setup
particlesJS('particles-js', { /* ... existing particles config ... */ });

document.addEventListener('DOMContentLoaded', () => {
    const blogNav = document.getElementById('blog-nav');
    const postList = document.getElementById('post-list');

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
                link.href = 'post_view.html?file=' + encodeURIComponent(post.file);
                link.textContent = `${post.date} - ${post.title} - ${post.description}`;
                postList.appendChild(link);
            });
        } catch (error) {
            console.error("Error loading post index:", error);
            postList.innerHTML = "<p>Could not load blog posts.</p>";
        }
    };

    // Initial load
    loadPostIndex();
});

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

// scroll to section functionality
function highlightNav() {
    const sections = document.querySelectorAll('.section');
    let currentSection = '';

    const containerRect = sectionsContainer.getBoundingClientRect();
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top - containerRect.top <= containerRect.height / 2 &&
            rect.bottom - containerRect.top > containerRect.height / 2) {
            currentSection = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.index-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === currentSection) {
            link.classList.add('active');
        }
    });
}

const sectionsContainer = document.getElementById('sections');
sectionsContainer.addEventListener('scroll', highlightNav);

// 页面加载时也执行一次，确保HOME被点亮
document.addEventListener('DOMContentLoaded', highlightNav);

// Clock functionality
function pad(n) { 
    return n.toString().padStart(2, '0'); 
}
function updateClock() {
    const now = new Date();
    document.getElementById('h').textContent = pad(now.getHours());
    document.getElementById('m').textContent = pad(now.getMinutes());
    document.getElementById('s').textContent = pad(now.getSeconds());
}
updateClock();
setInterval(updateClock, 1000);