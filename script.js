/* ========================================
   VALENTINE'S APP FOR CITLALLI
   ======================================== */

// ── Floating Hearts Background ──
function createFloatingHearts() {
    const container = document.getElementById('hearts-bg');
    const hearts = ['💕', '💗', '💖', '❤️', '💘', '💝', '♥️', '🩷'];
    const heartCount = 15;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
        heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(heart);
    }
}

createFloatingHearts();

// ── Screen Navigation ──
let currentScreen = 'intro';

function nextScreen(screenId) {
    const current = document.getElementById(currentScreen);
    const next = document.getElementById(screenId);

    current.classList.remove('active');
    setTimeout(() => {
        next.classList.add('active');
        currentScreen = screenId;

        // Trigger re-animation for content inside new screen
        const fadeEls = next.querySelectorAll('.gif-message, .gif-submessage, .gif-container, .btn, h1, p');
        fadeEls.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 200);
        });
    }, 400);
}

// ── NO Button Sequence ──
// Phase 1: NO runs away & shrinks (hover/touch)
// Phase 2: NO comes back to normal (clickable)
// Phase 3: Click NO → Rick Ross invasion
// Phase 4: Back to question with arrows pointing YES

let noPhase = 1;
let noHoverCount = 0;
let noLocked = false; // prevents interaction during transitions

const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const noMessage = document.getElementById('no-message');
const angryCatBg = document.getElementById('angry-cat-bg');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');
const arrowTop = document.getElementById('arrow-top');

const hoverMessages = [
    "Nah, try again... 😏",
    "You really tryna say no?? 🤨",
    "The cat is NOT having it 😤",
    "It's getting smaller... 👀",
];

// ── Phase 1: Hover/touch makes NO run away ──
function handleNoHover(e) {
    if (noPhase !== 1 || noLocked) return;
    e.preventDefault();
    e.stopPropagation();
    noHoverCount++;

    moveNoButton();

    const msgIndex = Math.min(noHoverCount - 1, hoverMessages.length - 1);
    showNoMessage(hoverMessages[msgIndex]);

    // Attempt 2: angry cat appears
    if (noHoverCount === 2) {
        angryCatBg.classList.add('visible');
    }

    // Attempt 3: NO starts shrinking
    if (noHoverCount === 3) {
        noBtn.classList.add('shrinking');
        yesBtn.classList.add('growing');
    }

    // Attempt 4+: bring NO back to normal, enter Phase 2
    if (noHoverCount >= 4) {
        noLocked = true;
        setTimeout(() => {
            resetNoButton();
            noPhase = 2;
            noLocked = false;
            angryCatBg.classList.remove('visible');
            showNoMessage("Fine... go ahead and click it 😏");
        }, 800);
    }
}

// ── Phase 2: NO is clickable → triggers Rick Ross invasion ──
function handleNoClick(e) {
    if (noLocked) return;
    e.preventDefault();
    e.stopPropagation();

    if (noPhase === 2) {
        noLocked = true;
        launchRickRossInvasion();
    }
}

// ── Reset NO button to normal position ──
function resetNoButton() {
    noBtn.classList.remove('runaway', 'shrinking', 'fading');
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.transform = '';
    noBtn.style.opacity = '';
    yesBtn.classList.remove('growing', 'giant');
}

// ── Debounce ──
let lastNoTime = 0;

function throttledHover(e) {
    const now = Date.now();
    if (now - lastNoTime < 600) return;
    lastNoTime = now;
    handleNoHover(e);
}

// Desktop: hover
noBtn.addEventListener('mouseenter', function (e) {
    if (noPhase === 1) throttledHover(e);
});

// Mobile: touchstart for hover phase
noBtn.addEventListener('touchstart', function (e) {
    if (noPhase === 1) {
        e.preventDefault();
        throttledHover(e);
    }
}, { passive: false });

// Click for Phase 2 (and fallback for Phase 1 on mobile)
noBtn.addEventListener('click', function (e) {
    if (noPhase === 2) {
        handleNoClick(e);
    } else if (noPhase === 1) {
        throttledHover(e);
    }
});

// ── Move NO to random position ──
function moveNoButton() {
    noBtn.classList.add('runaway');
    const padding = 20;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    noBtn.style.left = Math.floor(Math.random() * maxX) + padding + 'px';
    noBtn.style.top = Math.floor(Math.random() * maxY) + padding + 'px';
}

function showNoMessage(msg) {
    noMessage.textContent = msg;
    noMessage.style.opacity = '1';
}

// ── RICK ROLL INVASION ──
function launchRickRossInvasion() {
    const invasion = document.getElementById('rickroll-invasion');
    const container = document.getElementById('rickroll-container');
    invasion.classList.remove('hidden');
    invasion.classList.add('visible');

    const rickUrl = 'https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif';
    const totalRicks = 20;
    let spawned = 0;

    // Spawn Rick Ross one by one
    const spawnInterval = setInterval(() => {
        if (spawned >= totalRicks) {
            clearInterval(spawnInterval);
            // After all ricks spawned, wait then go back to question
            setTimeout(() => {
                endRickRossInvasion();
            }, 2000);
            return;
        }

        const rick = document.createElement('img');
        rick.src = rickUrl;
        rick.classList.add('rick-ross-float');

        // Random start position
        const startX = Math.random() * (window.innerWidth - 120);
        const startY = Math.random() * (window.innerHeight - 120);
        rick.style.left = startX + 'px';
        rick.style.top = startY + 'px';

        // Random movement direction
        const directions = ['up', 'down', 'diagonal-left', 'diagonal-right'];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        let tx = 0, ty = 0, rotate = 0;

        switch (dir) {
            case 'up': ty = -300; rotate = -20; break;
            case 'down': ty = 300; rotate = 20; break;
            case 'diagonal-left': tx = -250; ty = -200; rotate = -30; break;
            case 'diagonal-right': tx = 250; ty = -200; rotate = 30; break;
        }

        rick.style.setProperty('--rick-rotate', rotate + 'deg');
        rick.style.setProperty('--rick-tx', tx + 'px');
        rick.style.setProperty('--rick-ty', ty + 'px');
        rick.style.animationDuration = (Math.random() * 2 + 2) + 's';

        container.appendChild(rick);
        spawned++;
    }, 200);
}

function endRickRossInvasion() {
    const invasion = document.getElementById('rickroll-invasion');
    const container = document.getElementById('rickroll-container');

    // Fade out invasion
    invasion.style.transition = 'opacity 0.8s ease';
    invasion.style.opacity = '0';

    setTimeout(() => {
        invasion.classList.remove('visible');
        invasion.classList.add('hidden');
        invasion.style.opacity = '';
        container.innerHTML = '';

        // Hide angry cat and clear old message
        angryCatBg.classList.remove('visible');
        noMessage.style.opacity = '0';

        // Back to question - NO is gone, arrows point to YES
        noBtn.style.display = 'none';
        yesBtn.classList.add('giant');

        // Show arrows flanking the YES button
        arrowLeft.classList.remove('hidden');
        arrowLeft.classList.add('visible');
        arrowRight.classList.remove('hidden');
        arrowRight.classList.add('visible');
        arrowTop.classList.remove('hidden');
        arrowTop.classList.add('visible');

        setTimeout(() => {
            showNoMessage("There's only one right answer 💕");
        }, 300);

        noLocked = false;
        noPhase = 3;
    }, 800);
}

// ── YES - Celebration ──
// Loop the entire trimmed audio clip
const LOOP_START = 0;

function sayYes() {
    nextScreen('celebration');

    setTimeout(() => {
        startConfetti();
        createPetals();
        createSparkles();
        playCelebrationAudio();
    }, 500);
}

function playCelebrationAudio() {
    const audio = document.getElementById('celebration-audio');
    audio.currentTime = LOOP_START;
    audio.loop = true;
    audio.play().catch(() => {
        // Autoplay blocked on mobile - play on next tap
        const handler = () => {
            audio.currentTime = LOOP_START;
            audio.loop = true;
            audio.play();
            document.removeEventListener('click', handler);
        };
        document.addEventListener('click', handler);
    });
}

// ── Confetti Canvas ──
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#ff6b9d', '#ff2d78', '#ffd700', '#ff69b4', '#ff1493',
        '#ffb3d0', '#ff85a2', '#ffc0cb', '#ff4081', '#e040fb'];

    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2,
            opacity: Math.random() * 0.5 + 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach(p => {
            p.y += p.speed;
            p.x += p.drift + Math.sin(p.angle) * 0.5;
            p.angle += p.spin;

            // Reset when off screen
            if (p.y > canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ── Falling Flower Petals ──
function createPetals() {
    const container = document.getElementById('petals-container');
    const petals = ['💕', '💗', '💖', '❤️', '🩷', '💘', '✨', '💝'];

    for (let i = 0; i < 25; i++) {
        const petal = document.createElement('span');
        petal.classList.add('petal');
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.fontSize = (Math.random() * 18 + 16) + 'px';
        petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
        petal.style.animationDelay = (Math.random() * 8) + 's';
        container.appendChild(petal);
    }
}

// ── Sparkles ──
function createSparkles() {
    const container = document.getElementById('sparkle-container');

    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = (Math.random() * 3) + 's';
        sparkle.style.animationDuration = (Math.random() * 1 + 1) + 's';
        container.appendChild(sparkle);
    }
}

// ── Preload GIFs ──
function preloadGifs() {
    const gifs = [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzNsaG9iZ3RuemFpNXExdHE0dDhzMHAwMjRyYjE4ZGticXh5M3NkOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8tWFiyF4thmIqgDD0q/giphy.gif',
        'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWt0bms5amhzeXV0bmQ2MXBuMThtMnVsazlndDl6dzdwMGZwaHVkNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/y74Z50eZ8Oiqf0s4b1/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bTA0aDUxNmp1eDI5d2F0bThwazVsdDZkN29ucm93cXM5dGhoNmZ4aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3ohhwgKzV4SuseaZag/giphy.gif',
        'https://gifdb.com/images/high/funny-puke-be-mine-valentines-day-e259th6xfh5hg9nh.gif',
        'https://media1.tenor.com/m/XqcivfMwQYYAAAAC/happy-valentines.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnJ4cTVpc3dzYXVwemx2M2wzaXYwYWcxaWQ2cXdsNnA1YzNxNGF5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GAXXHdS0zXawVLOJLY/giphy.gif',
        'https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif',
        'https://media.giphy.com/media/T5eZR2cnVZWxxScSwU/giphy.gif',
        'https://media.giphy.com/media/65R5eanb4wj9jPZKDN/giphy.gif'
    ];

    gifs.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadGifs();
