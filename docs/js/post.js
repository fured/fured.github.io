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

// el元素是否在视窗里面
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 检测可视元素并激活目录中可视条目
function checkVisibleElements() {
    const items = document.querySelectorAll('.header-anchor');

    items.forEach(item => {
        tocLinks.forEach(link => {
            if (link.getAttribute('href') === item.getAttribute('href')) {
                if (isElementInViewport(item)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });
}

function getAllTOCLinks() {
    const tocLinks = document.querySelectorAll('#toc-view a');
    return Array.from(tocLinks);
}

const tocLinks = getAllTOCLinks();

window.addEventListener('scroll', checkVisibleElements);
window.addEventListener('resize', checkVisibleElements);
document.addEventListener('DOMContentLoaded', checkVisibleElements);


