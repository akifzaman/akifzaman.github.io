// -------------------------------------------------------------
// Cyberpunk / Spatial Computing XR Portfolio Engine
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSFXAudio();
    initScrollReveal();
    initPortfolioFilters();
    initTiltEffect();
    initThreeJSXRScene();
});

// 1. Navigation Controller
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    });
}

// 2. Web Audio API SFX Engine
let audioCtx = null;
let sfxEnabled = false;

function initSFXAudio() {
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const audioLabel = document.querySelector('.audio-label');

    if (!audioToggle) return;

    audioToggle.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        sfxEnabled = !sfxEnabled;

        if (sfxEnabled) {
            audioIcon.className = 'fas fa-volume-up';
            audioLabel.textContent = 'SFX: ON';
            audioToggle.classList.add('active');
            playCyberClickSound(800, 0.05);
        } else {
            audioIcon.className = 'fas fa-volume-mute';
            audioLabel.textContent = 'SFX: OFF';
            audioToggle.classList.remove('active');
        }
    });

    // Hover sounds for elements marked .sfx-hover
    document.querySelectorAll('.sfx-hover, .filter-btn, .btn').forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            if (sfxEnabled && audioCtx) {
                playCyberHoverSound();
            }
        });
    });

    // Click sounds for elements marked .sfx-btn
    document.querySelectorAll('.sfx-btn, .btn, .filter-btn').forEach(elem => {
        elem.addEventListener('click', () => {
            if (sfxEnabled && audioCtx) {
                playCyberClickSound(1200, 0.08);
            }
        });
    });
}

function playCyberHoverSound() {
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
        // Audio error fallback
    }
}

function playCyberClickSound(freq = 900, duration = 0.06) {
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio error fallback
    }
}

// 3. Scroll Reveal Observer
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));
}

// 4. Interactive Portfolio Filter System
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio__item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// 5. Vanilla 3D Tilt Effect on Cards
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// 6. Three.js 3D Spatial Canvas Architecture
function initThreeJSXRScene() {
    const canvas = document.querySelector('#xr-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const container = canvas.parentElement;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // A. Cybernetic Particle Constellation Network
    const particleCount = 220;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = (Math.random() - 0.5) * 30;
        positions[i + 2] = (Math.random() - 0.5) * 25;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.22,
        transparent: true,
        opacity: 0.85
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // B. Floating Wireframe Holographic Objects
    const group = new THREE.Group();

    // 1. Torus Knot Matrix
    const torusGeo = new THREE.TorusKnotGeometry(3.5, 0.8, 100, 16);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0x8a2be2,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(8, 2, -5);
    group.add(torusMesh);

    // 2. Glowing Icosahedron VR Core
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-9, -3, -3);
    group.add(icoMesh);

    // 3. Central Spatial Grid
    const gridHelper = new THREE.GridHelper(50, 25, 0x00f0ff, 0xff0055);
    gridHelper.position.y = -10;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    scene.add(group);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        torusMesh.rotation.x += 0.005;
        torusMesh.rotation.y += 0.007;

        icoMesh.rotation.x -= 0.006;
        icoMesh.rotation.y += 0.008;

        particles.rotation.y += 0.001;

        group.rotation.y = targetX * 0.2;
        group.rotation.x = -targetY * 0.2;

        camera.position.x = targetX * 2.5;
        camera.position.y = -targetY * 2.5;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}
