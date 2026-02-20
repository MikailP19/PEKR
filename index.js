document.addEventListener("DOMContentLoaded", () => {

    initFadeIn();
    initMenuHighlight();
    initScrollToTop();
    initNavbarScrollHide();
    initCircles();
    initHeroScroll();
    initCursor();
    initScrollButton();
    initPortfolioFilter();
});

/* ========================= */
/* FADE IN SECTIONS */
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
/* MENU */
/* ========================= */
function toggleMenu() {
    const menu = document.getElementById("overlayMenu");
    if (menu) menu.classList.toggle("active");
}

function initMenuHighlight() {
    const links = document.querySelectorAll('.menu-links a');
    if (!links.length) return;

    const currentPage = window.location.pathname.split("/").pop() || 'index.html';

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}


/* ========================= */
/* NAVBAR: HIDE ON SCROLL DOWN / SHOW ON SCROLL UP */
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
/* SCROLL TO TOP */
/* ========================= */
function initScrollToTop() {

    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (!scrollBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollBtn.style.display = "flex";
        } else {
            scrollBtn.style.display = "none";
        }
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* ========================= */
/* CIRCLES */
/* ========================= */
function initCircles() {

    const circles = document.querySelectorAll(".circle");
    if (!circles.length) return;

    circles.forEach(circle => {
        const percent = circle.getAttribute("data-percent");
        circle.style.setProperty("--percent", percent);
        const span = circle.querySelector("span");
        if (span) span.textContent = percent + "%";
    });
}


/* ========================= */
/* HERO SCROLL ANIMATION */
/* ========================= */
function initHeroScroll() {

    const hero = document.querySelector(".hero");
    const stage = document.querySelector(".hero-stage");

    if (!hero || !stage) return;

    window.addEventListener("scroll", () => {

        const scrollY = window.scrollY;
        const maxScroll = stage.offsetHeight - window.innerHeight;

        let progress = scrollY / maxScroll;
        if (progress > 1) progress = 1;

        const scale = 1 - (0.3 * progress);
        hero.style.transform = `scale(${scale})`;

        const radius = 40 * progress;
        hero.style.borderRadius = radius + "px";

        const width = 100 - (20 * progress);
        hero.style.width = width + "%";

    });
}


/* ========================= */
/* SCROLL BUTTON */
/* ========================= */
function initScrollButton() {
    const button = document.querySelector(".scroll-down");
    if (!button) return;

    button.addEventListener("click", () => {
        window.scrollTo({
            top: document.querySelector(".hero-stage").offsetHeight,
            behavior: "smooth"
        });
    });
}


/* ========================= */
/* CUSTOM CURSOR */
/* ========================= */
function initCursor() {

    const dot = document.querySelector(".cursor-dot");
    if (!dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;

        dot.style.left = dotX + "px";
        dot.style.top = dotY + "px";

        requestAnimationFrame(animate);
    }

    animate();

    document.querySelectorAll("a, button, .btn, .dienst-card")
        .forEach(el => {
            el.addEventListener("mouseenter", () => {
                dot.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                dot.classList.remove("hover");
            });
        });
}

function initPortfolioFilter() {

    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioCards = document.querySelectorAll(".portfolio-card");

    if (!filterButtons.length || !portfolioCards.length) return;

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            portfolioCards.forEach(card => {

                const category = card.getAttribute("data-category");

                if (filterValue === "all" || category === filterValue) {

                    // Eerst display terugzetten
                    card.classList.remove("is-hidden");

                    // Force reflow zodat animatie werkt
                    void card.offsetWidth;

                    card.classList.remove("is-hiding");

                } else {

                    // Eerst fade out
                    card.classList.add("is-hiding");

                    // Na animatie volledig verwijderen uit layout
                    setTimeout(() => {
                        card.classList.add("is-hidden");
                    }, 400);

                }

            });

        });

    });
}
const rows = document.querySelectorAll('.process-row');

function handleProcessScroll() {

    rows.forEach(row => {

        const rect = row.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progressBar = row.querySelector('.progress-fill');

        /* Reveal animatie */
        if (rect.top < windowHeight * 0.85) {
            row.classList.add('show');
        }

        /* Progress berekening */
        if (rect.top < windowHeight && rect.bottom > 0) {

            const total = rect.height + windowHeight;
            const progress = (windowHeight - rect.top) / total;

            const clamped = Math.max(0, Math.min(1, progress));
            progressBar.style.width = (clamped * 100) + "%";
        }
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(handleProcessScroll);
});

window.addEventListener('resize', handleProcessScroll);

handleProcessScroll();
