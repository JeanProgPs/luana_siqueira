/**
 * script.js - Animações e Interações para o site Studio Luana Siqueira
 */

// --- 1. Efeito de Scroll na Navbar ---
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- 2. Menu Mobile (Hamburger) ---
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle open/close do menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fechar menu ao clicar em algum link (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- 3. Intersection Observer (Animações on-scroll com fade-up) ---
const observerOptions = {
    threshold: 0.15, // Aciona quando 15% do elemento estiver visível
    rootMargin: "0px 0px -40px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Opcional: Para fazer a animação acontecer apenas uma vez e melhorar performance:
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const fadeUpElements = document.querySelectorAll('.fade-up');

fadeUpElements.forEach((element) => {
    observer.observe(element);
});

// --- 4. Animação Interativa do Hero (Siga o Mouse - Estilo Antigravity/Constelação) ---
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    // Cores premium alinhadas com o tema "Oásis da Beleza", cor dourada suave/bege
    const particleColor = 'rgba(184, 156, 126, 0.8)';
    const lineColor = 'rgba(184, 156, 126, ';

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.querySelector('.hero').offsetHeight;
        init();
    }
    
    window.addEventListener('resize', resize);

    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
        // Remove a atração/repulsão quando o mouse estiver fora
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;

            if (this.x > width || this.x < 0) this.dx = -this.dx;
            if (this.y > height || this.y < 0) this.dy = -this.dy;

            // Interação com o mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius && mouse.x !== -1000) {
                // Efeito repulsivo elegante
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Volta para base suavemente
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 100;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 100;
                }
            }
            
            this.draw();
        }
    }

    function init() {
        particles = [];
        let particleCount = (width * height) / 12000; // Menos partículas = mais elegante
        for (let i = 0; i < particleCount; i++) {
            let size = (Math.random() * 1.5) + 0.5;
            let x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
            let dx = (Math.random() - 0.5) * 0.6;
            let dy = (Math.random() - 0.5) * 0.6;
            particles.push(new Particle(x, y, dx, dy, size));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                             + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                if (distance < (width / 10) * (height / 10)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = lineColor + opacityValue + ')';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
            
            // Conecta levemente as partículas ao mouse
            let distanceToMouse = ((particles[a].x - mouse.x) * (particles[a].x - mouse.x))
                                + ((particles[a].y - mouse.y) * (particles[a].y - mouse.y));     
            if (distanceToMouse < 25000 && mouse.x !== -1000) {
                 let mouseOpacity = 1 - (distanceToMouse / 25000);
                 ctx.strokeStyle = lineColor + (mouseOpacity * 0.5) + ')'; // Menos opaco nas conexões com o mouse
                 ctx.lineWidth = 1;
                 ctx.beginPath();
                 ctx.moveTo(particles[a].x, particles[a].y);
                 ctx.lineTo(mouse.x, mouse.y);
                 ctx.stroke();
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }

    setTimeout(() => {
        resize();
        animate();
    }, 150);
}
