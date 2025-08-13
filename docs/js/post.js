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

// el元素是否在post-view视窗里面
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const postViewRect = postView.getBoundingClientRect();

    return (
        rect.top >= postViewRect.top &&
        rect.bottom <= postViewRect.bottom &&
        rect.left >= postViewRect.left &&
        rect.right <= postViewRect.right 
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
const postView = document.getElementById('post-view');

postView.addEventListener('scroll', checkVisibleElements);
window.addEventListener('resize', checkVisibleElements);
document.addEventListener('DOMContentLoaded', checkVisibleElements);

// 目录点击时 不要整个页面跳动 在div内滚动
tocLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            postView.scrollTop = targetElement.offsetTop - postView.offsetTop - 20; // 减去20px的偏移
        }
    });
});
