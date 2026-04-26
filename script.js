function loadNavbar() {
    let navPath = 'nav.html';
    const isSubPage = window.location.pathname.includes('Projects%20page')
               || window.location.pathname.includes('Projects page')
               || window.location.pathname.includes('Projects%20Page'); 
    if (isSubPage) navPath = '../nav.html';

    fetch(navPath)
        .then(r => r.text())
        .then(data => {
            const placeholder = document.getElementById('navbar-placeholder');
            placeholder.style.opacity = '0';
            placeholder.innerHTML = data;

            if (isSubPage) {
                const logoImg = placeholder.querySelector('#logo-img');
                if (logoImg) logoImg.src = '../' + logoImg.getAttribute('src');
                placeholder.querySelectorAll('a').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('../')) {
                        link.setAttribute('href', '../' + href);
                    }
                });
            }

            setTimeout(() => {
                placeholder.style.transition = 'opacity 0.4s ease';
                placeholder.style.opacity = '1';

                // ── Overlay (body-level, so fixed positioning works) ──
                let overlay = document.querySelector('.menu-overlay');
if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    // 插到 body 第一个子元素之前，navbar placeholder 之前
    // 这样 DOM 顺序不会影响 fixed 定位的层叠
    document.body.insertBefore(overlay, document.body.firstChild);
}

                const menuBtn = document.getElementById('mobile-menu-btn');
                const navMenu = document.getElementById('nav-menu');

                function openMenu() {
                    navMenu.classList.add('active');
                    overlay.classList.add('active');
                    menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                    menuBtn.setAttribute('aria-label', 'Close menu');
                }
                function closeMenu() {
                    navMenu.classList.remove('active');
                    overlay.classList.remove('active');
                    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                    menuBtn.setAttribute('aria-label', 'Open menu');
                }

                if (menuBtn && navMenu) {
                    menuBtn.addEventListener('click', e => {
                        e.stopPropagation();
                        navMenu.classList.contains('active') ? closeMenu() : openMenu();
                    });
                    navMenu.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', closeMenu);
                    });
                    // Clicking the overlay (behind the menu) closes it
                    overlay.addEventListener('click', closeMenu);
                }

                initTheme();
            }, 50);
        });
}

function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'light'
                         ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(next);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fa-solid fa-lightbulb' : 'fa-solid fa-moon'
}

document.addEventListener('DOMContentLoaded', loadNavbar);

// ============================================================
//  上一页 / 下一页 导航
// ============================================================
function initPageNav() {
    const nav = document.querySelector('.page-nav');
    if (!nav) return;

    const prevHref = nav.dataset.prev;
    const prevLabel = nav.dataset.prevLabel || 'Prev';
    const nextHref = nav.dataset.next;
    const nextLabel = nav.dataset.nextLabel || 'Next';

    const prevBtn = nav.querySelector('.nav-prev');
    const nextBtn = nav.querySelector('.nav-next');

    if (prevBtn) {
        if (prevHref) {
            prevBtn.href = prevHref;
            prevBtn.querySelector('.nav-label').textContent = prevLabel;
        } else {
            prevBtn.style.visibility = 'hidden'; // 没有上一页就隐藏
        }
    }

    if (nextBtn) {
        if (nextHref) {
            nextBtn.href = nextHref;
            nextBtn.querySelector('.nav-label').textContent = nextLabel;
        } else {
            nextBtn.style.visibility = 'hidden';
        }
    }
}

document.addEventListener('DOMContentLoaded', initPageNav);

// ============================================================
//  Off the Record 折叠展开
// ============================================================
function initOffRecord() {
    const btn     = document.getElementById('offRecordToggle');
    const content = document.getElementById('offRecordContent');
    const arrow   = document.getElementById('offRecordArrow');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
        const isOpen = content.classList.toggle('open');
        arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
        btn.setAttribute('aria-expanded', isOpen);
    });
}

document.addEventListener('DOMContentLoaded', initOffRecord);

// 漫画章节折叠
function toggleManga(headEl) {
    const pages = headEl.nextElementSibling;
    const arrow = headEl.querySelector('.manga-chapter-arrow');
    const isOpen = pages.classList.toggle('open');
    arrow.className = isOpen
        ? 'fa-solid fa-chevron-down manga-chapter-arrow'
        : 'fa-solid fa-chevron-right manga-chapter-arrow';
}

// ============================================================
//  页脚动态加载
// ============================================================
function loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    const isSubPage = window.location.pathname.includes('Projects%20page')
                   || window.location.pathname.includes('Projects page');
    const footerPath = isSubPage ? '../footer.html' : 'footer.html';

    fetch(footerPath)
        .then(r => r.text())
        .then(data => {
            placeholder.innerHTML = data;

            // 子页面修正链接路径
            if (isSubPage) {
                placeholder.querySelectorAll('a').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('../')) {
                        link.setAttribute('href', '../' + href);
                    }
                });
            }
        });
}

document.addEventListener('DOMContentLoaded', loadFooter);


// 一键到顶
// 获取按钮
const backButton = document.getElementById("backToTop");

// 监听滚动事件
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    // 当滚动超过 300px 时显示按钮
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backButton.style.display = "block";
    } else {
        backButton.style.display = "none";
    }
}

// 点击按钮平滑回到顶部
backButton.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // 平滑滚动效果
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 1. 获取灯箱元素
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.querySelector(".close-lightbox");

    // 【关键修复】：只有当灯箱元素确实存在于当前页面时，才绑定事件
    if (lightbox && lightboxImg) {
        const assetImages = document.querySelectorAll('.asset-item img');
        assetImages.forEach(img => {
            img.onclick = function() {
                lightbox.style.display = "block";
                lightboxImg.src = this.src;
                document.body.style.overflow = 'hidden';
            }
        });

        // 关闭逻辑
        const closeBox = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        };
        
        lightbox.onclick = (e) => { if(e.target === lightbox) closeBox(); };
        if(closeBtn) closeBtn.onclick = closeBox;
    }

    // 2. 修复截图中的另一个报错：scrollFunction
    // 报错是因为 script.js 试图操作一个不存在的“回到顶部”按钮
    const backBtn = document.getElementById("backToTop");
    window.onscroll = function() {
        if (backBtn) { // 必须检查按钮是否存在
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backBtn.style.display = "block";
            } else {
                backBtn.style.display = "none";
            }
        }
    };
});