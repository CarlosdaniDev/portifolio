// 1. Cursor de Brilho no Fundo
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
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

// 3. Efeito 3D Tilt nos Cards
const cards = document.querySelectorAll('.p-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = "transform 0.1s ease-out";
    });
});

// 4. Scroll Reveal (corrigido)
const revealElements = document.querySelectorAll('.p-card, .hero-container');

// Estado inicial: invisível e deslocado para baixo
revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
});

const reveal = () => {
    revealElements.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 120;

        if (elementTop < windowHeight - elementVisible) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
};

// Roda uma vez no load para elementos já visíveis
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);