// 1. Cursor de Brilho no Fundo (com throttle via requestAnimationFrame)
const cursor = document.getElementById('cursor');
let cursorTicking = false;
let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (!cursorTicking) {
        requestAnimationFrame(() => {
            // transform em vez de left/top: evita reflow, só repaint na GPU
            cursor.style.transform = `translate(${lastMouseX}px, ${lastMouseY}px) translate(-50%, -50%)`;
            cursorTicking = false;
        });
        cursorTicking = true;
    }
});

// 2. Typewriter Effect
const words = ['Carlos Daniel', 'Front-End Dev', 'Digital Architect', 'ADS Student'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typeEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 1800; // pausa no final da palavra
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
    }

    setTimeout(type, speed);
}

type();

// 3. Efeito 3D Tilt nos Cards (desativado em touch, onde não faz sentido)
const supportsHover = window.matchMedia('(hover: hover)').matches;
const cards = document.querySelectorAll('.p-card');

if (supportsHover) {
    cards.forEach(card => {
        let tiltTicking = false;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (!tiltTicking) {
                requestAnimationFrame(() => {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 12;
                    const rotateY = (centerX - x) / 12;

                    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
                    tiltTicking = false;
                });
                tiltTicking = true;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = "transform 0.1s ease-out";
        });
    });
}

// 4. Scroll Reveal (usa classe em vez de sobrescrever inline, evitando
// conflito com o transform do tilt 3D acima)
const revealElements = document.querySelectorAll('.p-card, .hero-container, .about-content');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    });

    const reveal = () => {
        revealElements.forEach(el => {
            if (el.dataset.revealed === "true") return; // já revelado, não reprocessa

            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 120;

            if (elementTop < windowHeight - elementVisible) {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
                el.dataset.revealed = "true";
            }
        });
    };

    window.addEventListener('scroll', reveal, { passive: true });
    window.addEventListener('load', reveal);
}