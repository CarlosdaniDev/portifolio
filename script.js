// 1. Typewriter
const words = ["Carlos Daniel", "Front-End Developer", "ADS Student", "JavaScript Developer"];
const typing = document.getElementById("typing");

if (typing) {
    let word = 0, letter = 0, deleting = false;

    (function type() {
        const current = words[word];
        typing.textContent = deleting ? current.substring(0, letter--) : current.substring(0, letter++);

        let speed = deleting ? 45 : 90;

        if (!deleting && letter > current.length) {
            deleting = true;
            speed = 1400;
        }
        if (deleting && letter < 0) {
            deleting = false;
            word = (word + 1) % words.length;
            speed = 400;
        }

        setTimeout(type, speed);
    })();
}

// 2. Cursor de brilho no fundo (throttle via requestAnimationFrame)
const cursor = document.getElementById("cursor");
let cursorTicking = false;
let lastX = 0, lastY = 0;

if (cursor) {
    document.addEventListener("mousemove", (e) => {
        lastX = e.clientX;
        lastY = e.clientY;

        if (!cursorTicking) {
            requestAnimationFrame(() => {
                cursor.style.transform = `translate(${lastX}px, ${lastY}px) translate(-50%, -50%)`;
                cursorTicking = false;
            });
            cursorTicking = true;
        }
    });
}

// 3. Scroll: barra de progresso + fundo do nav + link ativo
// Tudo consolidado em UM listener com rAF, em vez de três listeners
// separados rodando a cada pixel de scroll.
const progressBar = document.getElementById("progress");
const nav = document.querySelector("nav");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

let scrollTicking = false;

function onScroll() {
    // Barra de progresso
    if (progressBar) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const percent = total > 0 ? (window.scrollY / total) * 100 : 0;
        progressBar.style.width = percent + "%";
    }

    // Fundo do nav ao rolar
    if (nav) {
        nav.classList.toggle("scrolled", window.scrollY > 80);
    }

    // Link ativo conforme a seção visível
    let current = "";
    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 150) {
            current = section.id;
        }
    });
    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
}

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            onScroll();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

onScroll(); // estado inicial correto sem esperar o primeiro scroll

// 4. Contadores animados das estatísticas
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    if (Number.isNaN(target)) return;

    let count = 0;
    const step = Math.max(1, Math.round(target / 40)); // ~40 frames

    const timer = setInterval(() => {
        count += step;
        if (count >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = count + suffix;
        }
    }, 30);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll(".stats strong[data-target]").forEach((el) => statObserver.observe(el));

// 5. Scroll reveal das seções (usa a classe .reveal/.show definida no CSS)
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
} else {
    // Sem preferência por menos animação: mostra tudo direto
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("show"));
}

// 6. Tilt 3D nos cards de projeto (só em dispositivos com mouse)
if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
        let tiltTicking = false;

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (!tiltTicking) {
                requestAnimationFrame(() => {
                    const rx = -(y - rect.height / 2) / 18;
                    const ry = (x - rect.width / 2) / 18;
                    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
                    card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
                    card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
                    tiltTicking = false;
                });
                tiltTicking = true;
            }
        });

        card.addEventListener("mouseleave", () => {
            card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
            card.style.transform = "";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "transform 0.1s ease-out";
        });
    });
}

// 7. Ano do rodapé
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}
