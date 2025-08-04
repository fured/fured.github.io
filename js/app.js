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
        "detect_on": "canvas",
        "events": { 
            "onhover": { 
                "enable": true, 
                "mode": "repulse" 
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