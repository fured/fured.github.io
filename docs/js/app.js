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
    // Time: build the web 
    const start = new Date('2025-08-04T10:47:20');
    const now = new Date();
    // document.getElementById('year').textContent = pad(now.getFullYear());
    // document.getElementById('month').textContent = pad(now.getMonth());
    // document.getElementById('day').textContent = pad(now.getDay());
    // document.getElementById('h').textContent = pad(now.getHours());
    // document.getElementById('m').textContent = pad(now.getMinutes());
    // document.getElementById('s').textContent = pad(now.getSeconds());

    let diff = Math.floor((now - start) / 1000); // 秒差

    const days = Math.floor(diff / (24 * 3600));
    diff %= 24 * 3600;
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    // 展示建站时间
    document.getElementById('day').textContent = days;
    document.getElementById('h').textContent = pad(hours);
    document.getElementById('m').textContent = pad(minutes);
    document.getElementById('s').textContent = pad(seconds);
}
updateClock();
setInterval(updateClock, 1000);

const cmdList = [
    {
        "example": "yd: It's a test",
        "icon": "fa fa-clipboard",
    },
    {
        "example": "yd: hiking",
        "icon": "fa fa-clipboard",
    },
    {
        "example": "yd: 徒步",
        "icon": "fa fa-clipboard",
    },
    {
        "example": "ts: 1755517705",
        "icon": "fa fa-clipboard",
    },
    {
        "example": "ts: now",
        "icon": "fa fa-clipboard",
    },
    {
        "example": "ts: age",
        "icon": "fa fa-clipboard",
    },
    {
        "example": "csdn: fured",
        "icon": "fa fa-link",
    },
];


const input = document.getElementById("command");
const suggestionsContainer = document.getElementById("suggestions");

function showSuggestions() {
    // 生成命令建议列表
    // const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.style.display = 'block';
    input.classList.add('active');
    suggestionsContainer.innerHTML = ""
    cmdList.forEach((item, index) => {
        const suggestionItem = document.createElement("div");
        const icon = document.createElement("i");
        icon.setAttribute("class", item.icon);
        suggestionItem.appendChild(icon);
        suggestionItem.classList.add("suggestion-item");
        if (index == cmdList.length - 1) {
            // 最后一个元素
            suggestionItem.classList.add("suggestion-last-item");
        }
        const textNode = document.createTextNode(item.example);
        suggestionItem.appendChild(textNode);
        suggestionItem.addEventListener("click", () => {
            input.value = item.example
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeButton = document.querySelector(".close");
const rsltContent = document.getElementById("result-content");
closeButton.onclick = function() {
    modal.style.display = "none"; // 隐藏警告框
};

const dateOptions = {
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false // 24小时制
};

function handlerToolAction(inputStr) {
    const inputArray = inputStr.split(":").map(part => part.trim()).filter(part => part.length > 0);
    console.log("input:", inputArray)
    if (inputArray.length < 1) {
        return
    }
    if (inputArray[0] == "yd") {
        const ydURL = "https://m.youdao.com/result?lang=en&word=" + inputArray[1]
        window.open(ydURL)
    } else if (inputArray[0] == "csdn") {
        const csdnURL = "https://blog.csdn.net/" + inputArray[1]
        window.open(csdnURL)
    } else if (inputArray[0] == "ts") {
        if (inputArray[1] == "now") {
            rsltContent.innerHTML = ""
            const currentDate = new Date();
            const dateP = document.createElement("p")
            dateP.textContent = "当前时间：" + currentDate.toLocaleString("zh-CN", dateOptions);
            rsltContent.appendChild(dateP)
            const tsP = document.createElement("p")
            tsP.textContent = "时间戳：" + currentDate.getTime()
            rsltContent.appendChild(tsP)
        } else if (inputArray[1] == "age") {
            rsltContent.innerHTML = ""
            const start = new Date('2025-08-04T10:47:20');
            const now = new Date();

            let diff = Math.floor((now - start) / 1000); // 秒差

            const days = Math.floor(diff / (24 * 3600));
            diff %= 24 * 3600;
            const hours = Math.floor(diff / 3600);
            diff %= 3600;
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            const dateP = document.createElement("p")
            dateP.textContent = "已建站：" + days + "天 " + hours + "时 " + minutes + "分 " + seconds + "秒";
            rsltContent.appendChild(dateP)

        } else {
            rsltContent.innerHTML = ""
            let ts = Number(inputArray[1])
            if (ts.toString().length === 10) {
                // 如果是 10 位，则转换为毫秒
                ts *= 1000; // 将秒转换为毫秒
            }
            const date = new Date(ts);
            const dateP = document.createElement("p")
            dateP.textContent = "对应当地时间：" + date.toLocaleString("zh-CN", dateOptions);
            rsltContent.appendChild(dateP)

        }
        modal.style.display = "block";
    }
}

// 输入框获得焦点事件
input.addEventListener("focus", () => {
    // 在这里显示建议列表
    showSuggestions();  
});

// 处理键盘事件
let selectedIndex = -1; // 当前选中的建议项索引
input.addEventListener("keydown", (event) => {
    const suggestions = suggestionsContainer.getElementsByClassName("suggestion-item");
    if (event.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % suggestions.length; // 循环选择
        event.preventDefault(); // 阻止页面滚动
        input.value = suggestions[selectedIndex].textContent;
    } else if (event.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length; // 循环选择
        event.preventDefault(); // 阻止页面滚动
        input.value = suggestions[selectedIndex].textContent;
    } else if (event.key == "Enter") {
        handlerToolAction(input.value);
    }

    Array.from(suggestions).forEach((item, index) => {
        if (index == selectedIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
});

// 点击输入框外的区域时，关闭下拉建议
document.addEventListener("click", (event) => {
    if (!event.target.closest(".cmd-view")) {
        // 隐藏建议列表
        suggestionsContainer.style.display = 'none'; 
        input.classList.remove('active');
    }
});