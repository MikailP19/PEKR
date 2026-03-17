document.addEventListener("DOMContentLoaded", () => {

    initFadeIn();
    initMenuHighlight();
    initScrollToTop();
    initNavbarScrollHide();
    initCircles();
    initCursor();
    initScrollButton();
    initPortfolioFilter();
    initProjectReveal();   // scroll reveal voor detailpagina's
    initVisualGallery();   // galerij met pijlen in .case-visual__img

});

/* ========================= */
/* FADE IN SECTIONS          */
/* ========================= */
function initFadeIn() {

    const faders = document.querySelectorAll('.fade-in-section');
    if (!faders.length) return;

    function handleScroll() {
        faders.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight - 100) {
                section.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
}

/* ========================= */
/* MENU                      */
/* ========================= */
function toggleMenu() {
    const menu = document.getElementById('overlayMenu');
    if (menu) menu.classList.toggle('active');
}

// Sluit menu automatisch bij klikken op een link
document.querySelectorAll('.overlay-menu .menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('overlayMenu');
        if (menu) menu.classList.remove('active');
    });
});

function initMenuHighlight() {
    const links = document.querySelectorAll('.menu-links a');
    if (!links.length) return;

    const currentPage = window.location.pathname.split("/").pop() || 'index.html';

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
            link.classList.add("active");
        }
    });
}

/* ========================= */
/* NAVBAR: HIDE ON SCROLL    */
/* ========================= */
function initNavbarScrollHide() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const scrollThreshold = 10;
    const topThreshold = 80;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY <= topThreshold) {
            navbar.classList.remove("navbar--hidden");
        } else if (scrollY > lastScrollY && scrollY - lastScrollY > scrollThreshold) {
            navbar.classList.add("navbar--hidden");
        } else if (lastScrollY > scrollY && lastScrollY - scrollY > scrollThreshold) {
            navbar.classList.remove("navbar--hidden");
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
}

/* ========================= */
/* SCROLL TO TOP             */
/* ========================= */
function initScrollToTop() {
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (!scrollBtn) return;

    window.addEventListener("scroll", () => {
        scrollBtn.style.display = window.scrollY > 200 ? "flex" : "none";
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ========================= */
/* CIRCLES                   */
/* ========================= */
function initCircles() {
    const circles = document.querySelectorAll(".circle");
    if (!circles.length) return;

    // Zet --percent op 0 zodat de animatie start vanuit leeg
    circles.forEach(circle => {
        circle.style.setProperty("--percent", "0");
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const circle  = entry.target;
                const percent = circle.getAttribute("data-percent");
                const span    = circle.querySelector("span");
                // Kleine timeout zodat de transition zichtbaar is
                setTimeout(function () {
                    circle.style.setProperty("--percent", percent);
                    if (span) span.textContent = percent + "%";
                }, 120);
                observer.unobserve(circle);
            }
        });
    }, { threshold: 0.3 });

    circles.forEach(function (circle) {
        observer.observe(circle);
    });
}

/* ========================= */
/* SCROLL BUTTON             */
/* ========================= */
function initScrollButton() {
    const button = document.querySelector(".scroll-down");
    if (!button) return;

    const target = document.querySelector(".hero-stage");
    if (!target) return;

    button.addEventListener("click", () => {
        window.scrollTo({ top: target.offsetHeight, behavior: "smooth" });
    });
}

/* ========================= */
/* CUSTOM CURSOR             */
/* ========================= */
function initCursor() {
    const dot = document.querySelector(".cursor-dot");
    if (!dot) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        dot.style.left = dotX + "px";
        dot.style.top  = dotY + "px";
        requestAnimationFrame(animate);
    }

    animate();

    document.querySelectorAll("a, button, .btn, .dienst-card").forEach(el => {
        el.addEventListener("mouseenter", () => dot.classList.add("hover"));
        el.addEventListener("mouseleave", () => dot.classList.remove("hover"));
    });
}

/* ========================= */
/* PORTFOLIO FILTER          */
/* ========================= */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.pf-filter__btn, .filter-btn');
    const pfCards    = document.querySelectorAll('.pf-card, .portfolio-card');
    const pfCount    = document.getElementById('pfCount');
    const ANIM_MS    = 350;

    if (!filterBtns.length || !pfCards.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter  = btn.getAttribute('data-filter');
            var visible = 0;

            pfCards.forEach(function (card) {
                var match = filter === 'all' || card.getAttribute('data-category') === filter;

                if (match) {
                    visible++;
                    card.classList.remove('is-hidden');
                    card.classList.remove('is-hiding');
                    void card.offsetWidth;
                    card.classList.add('is-showing');
                    setTimeout(function () { card.classList.remove('is-showing'); }, ANIM_MS + 10);
                } else {
                    card.classList.remove('is-showing');
                    card.classList.add('is-hiding');
                    setTimeout(function () {
                        card.classList.add('is-hidden');
                        card.classList.remove('is-hiding');
                    }, ANIM_MS);
                }
            });

            if (pfCount) {
                setTimeout(function () {
                    var label = filter === 'all'
                        ? 'projecten'
                        : btn.textContent.trim().toLowerCase() + ' projecten';
                    pfCount.innerHTML = '<span>' + visible + '</span> ' + label;
                }, ANIM_MS + 20);
            }
        });
    });
}

/* ========================= */
/* VISUAL GALERIJ            */
/* Meerdere <img> tags in    */
/* .case-visual__img worden  */
/* een carrousel met pijlen. */
/* ========================= */
function initVisualGallery() {
    document.querySelectorAll('.case-visual__img, .case-step__img').forEach(function (gallery) {
        var items = Array.from(gallery.querySelectorAll('img, video'));
        if (!items.length) return;

        var current = 0;
        var total   = items.length;

        // Eerste item altijd actief
        items[0].classList.add('active');

        // Bij één item: geen pijlen nodig
        if (total <= 1) return;

        // Pijlen aanmaken
        var prev = document.createElement('button');
        var next = document.createElement('button');
        prev.className = 'case-visual__btn case-visual__btn--prev';
        next.className = 'case-visual__btn case-visual__btn--next';
        prev.setAttribute('aria-label', 'Vorige afbeelding');
        next.setAttribute('aria-label', 'Volgende afbeelding');
        prev.innerHTML = '&#8592;';
        next.innerHTML = '&#8594;';

        // Teller aanmaken
        var counter = document.createElement('div');
        counter.className = 'case-visual__counter';
        counter.innerHTML = '<span class="case-visual__counter-current">1</span> / ' + total;

        gallery.appendChild(prev);
        gallery.appendChild(next);
        gallery.appendChild(counter);

        function goTo(index) {
            var leaving = items[current];
            leaving.classList.remove('active');
            // Pauzeer video bij weggaan
            if (leaving.tagName === 'VIDEO') leaving.pause();

            current = (index + total) % total;

            var arriving = items[current];
            arriving.classList.add('active');
            // Speel video af bij aankomen
            if (arriving.tagName === 'VIDEO') arriving.play();

            counter.innerHTML = '<span class="case-visual__counter-current">' + (current + 1) + '</span> / ' + total;
        }

        prev.addEventListener('click', function () { goTo(current - 1); });
        next.addEventListener('click', function () { goTo(current + 1); });

        // Touch / swipe (niet op video's om scrubben te voorkomen)
        var startX = 0;
        gallery.addEventListener('touchstart', function (e) {
            if (e.target.tagName !== 'VIDEO') startX = e.touches[0].clientX;
        }, { passive: true });
        gallery.addEventListener('touchend', function (e) {
            if (e.target.tagName === 'VIDEO') return;
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });
    });
}

/* ========================= */
/* PROJECT DETAIL REVEAL     */
/* Scroll reveal voor alle   */
/* .reveal elementen op de   */
/* project detailpagina's.   */
/* ========================= */
function initProjectReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var inViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (inViewport) {
            // Al zichtbaar bij load: kleine timeout zodat CSS-transition nog afspeelt
            setTimeout(function () { el.classList.add('visible'); }, 80);
        } else {
            observer.observe(el);
        }
    });
}

/* ========================= */
/* PROCESS ROWS              */
/* ========================= */
const rows = document.querySelectorAll('.process-row');

if (rows.length) {

    function handleProcessScroll() {
        rows.forEach(row => {
            const rect = row.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const progressBar = row.querySelector('.progress-fill');

            if (rect.top < windowHeight * 0.85) {
                row.classList.add('show');
            }

            if (progressBar && rect.top < windowHeight && rect.bottom > 0) {
                const total    = rect.height + windowHeight;
                const progress = (windowHeight - rect.top) / total;
                const clamped  = Math.max(0, Math.min(1, progress));
                progressBar.style.width = (clamped * 100) + "%";
            }
        });
    }

    window.addEventListener('scroll', () => { requestAnimationFrame(handleProcessScroll); });
    window.addEventListener('resize', handleProcessScroll);
    handleProcessScroll();
}

/* ========================= */
/* FADE IN (.fade-in)        */
/* ========================= */
const fadeInObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in').forEach(el => {
    fadeInObserver.observe(el);
});