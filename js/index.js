// -------------------------------------------------------------
// Cyberpunk / Spatial Computing XR Portfolio Engine v2.5
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSFXAudio();
    initScrollReveal();
    initPortfolioFiltersAndToolbar();
    initTiltEffect();
    initThreeJSXRScene();
    initCyberCLI();
    initThemeMatrix();
    initProjectQuickModal();
    initSandboxDemos();
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

    // Hover & click SFX dynamic delegation
    document.addEventListener('mouseenter', (e) => {
        if (sfxEnabled && audioCtx && (e.target.classList.contains('sfx-hover') || e.target.classList.contains('sfx-btn'))) {
            playCyberHoverSound();
        }
    }, true);

    document.addEventListener('click', (e) => {
        if (sfxEnabled && audioCtx && (e.target.classList.contains('sfx-btn') || e.target.classList.contains('btn'))) {
            playCyberClickSound(1100, 0.06);
        }
    }, true);
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
        // Fallback
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
        // Fallback
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

// 4. Interactive Theme Matrix Switcher
function initThemeMatrix() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const theme = btn.getAttribute('data-theme');
            document.body.className = `cyber-theme theme-${theme}`;
            printCLILine(`System theme switched to: <span class="neon-cyan">${theme.toUpperCase()}</span>`);
        });
    });
}

// 5. Interactive Portfolio Filters, Live Search & View Modes (Grid / Timeline / Spotlight)
function initPortfolioFiltersAndToolbar() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio__item'));
    const container = document.getElementById('portfolio-container');
    const searchInput = document.getElementById('project-search');
    const searchClear = document.getElementById('search-clear');
    const viewButtons = document.querySelectorAll('.view-btn');
    const spotlightControls = document.getElementById('spotlight-controls');
    const spotlightPrev = document.getElementById('spotlight-prev');
    const spotlightNext = document.getElementById('spotlight-next');
    const spotlightCounter = document.getElementById('spotlight-counter');

    let currentFilter = 'all';
    let currentSearch = '';
    let currentView = 'grid';
    let spotlightIndex = 0;

    function updatePortfolioState() {
        let visibleItems = [];

        portfolioItems.forEach((item) => {
            const cat = item.getAttribute('data-category');
            const title = (item.getAttribute('data-title') || '').toLowerCase();
            const tech = (item.getAttribute('data-tech') || '').toLowerCase();

            const matchesCategory = (currentFilter === 'all' || cat === currentFilter);
            const matchesSearch = (!currentSearch || title.includes(currentSearch) || tech.includes(currentSearch));

            if (matchesCategory && matchesSearch) {
                visibleItems.push(item);
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // View Mode Layout Adjustments
        if (currentView === 'grid') {
            container.className = 'portfolio portfolio-grid';
            spotlightControls.style.display = 'none';
        } else if (currentView === 'timeline') {
            container.className = 'portfolio portfolio-timeline';
            spotlightControls.style.display = 'none';
        } else if (currentView === 'spotlight') {
            container.className = 'portfolio portfolio-spotlight';
            spotlightControls.style.display = 'flex';

            if (visibleItems.length > 0) {
                if (spotlightIndex >= visibleItems.length) spotlightIndex = 0;
                visibleItems.forEach((item, idx) => {
                    if (idx === spotlightIndex) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
                spotlightCounter.textContent = `${spotlightIndex + 1} / ${visibleItems.length}`;
            } else {
                spotlightCounter.textContent = `0 / 0`;
            }
        }
    }

    // Category Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            spotlightIndex = 0;
            updatePortfolioState();
        });
    });

    // Live Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            spotlightIndex = 0;
            updatePortfolioState();
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            currentSearch = '';
            updatePortfolioState();
        });
    }

    // View Mode Switcher Buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.getAttribute('data-view');
            spotlightIndex = 0;
            updatePortfolioState();
        });
    });

    // Spotlight Navigation
    if (spotlightPrev && spotlightNext) {
        spotlightPrev.addEventListener('click', () => {
            const visible = portfolioItems.filter(item => {
                const cat = item.getAttribute('data-category');
                const title = (item.getAttribute('data-title') || '').toLowerCase();
                const tech = (item.getAttribute('data-tech') || '').toLowerCase();
                return (currentFilter === 'all' || cat === currentFilter) && (!currentSearch || title.includes(currentSearch) || tech.includes(currentSearch));
            });
            if (visible.length === 0) return;
            spotlightIndex = (spotlightIndex - 1 + visible.length) % visible.length;
            updatePortfolioState();
        });

        spotlightNext.addEventListener('click', () => {
            const visible = portfolioItems.filter(item => {
                const cat = item.getAttribute('data-category');
                const title = (item.getAttribute('data-title') || '').toLowerCase();
                const tech = (item.getAttribute('data-tech') || '').toLowerCase();
                return (currentFilter === 'all' || cat === currentFilter) && (!currentSearch || title.includes(currentSearch) || tech.includes(currentSearch));
            });
            if (visible.length === 0) return;
            spotlightIndex = (spotlightIndex + 1) % visible.length;
            updatePortfolioState();
        });
    }
}

// 6. Vanilla 3D Tilt Effect on Cards
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

// 7. Interactive Cyber CLI Terminal Widget
function initCyberCLI() {
    const cliForm = document.getElementById('cli-form');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const cliTags = document.querySelectorAll('.cli-tag');

    if (!cliForm) return;

    cliForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = cliInput.value.trim();
        if (cmd) {
            executeCLICommand(cmd);
            cliInput.value = '';
        }
    });

    cliTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const cmd = tag.getAttribute('data-cmd');
            executeCLICommand(cmd);
        });
    });
}

function printCLILine(text) {
    const cliOutput = document.getElementById('cli-output');
    if (!cliOutput) return;
    const p = document.createElement('p');
    p.className = 'cli-line';
    p.innerHTML = text;
    cliOutput.appendChild(p);
    cliOutput.scrollTop = cliOutput.scrollHeight;
}

function executeCLICommand(cmd) {
    printCLILine(`<span class="cli-prompt">akif@xr-matrix:~$</span> ${cmd}`);
    const lower = cmd.toLowerCase().trim();

    if (lower === 'help') {
        printCLILine(`Available commands: <span class="neon-cyan">whoami, skills, stats, projects, clear, warp, theme, mesh</span>`);
    } else if (lower === 'whoami') {
        printCLILine(`Md. Akif Zaman // XR Creative Developer & Spatial Computing Engineer with 2.5+ years of industry experience.`);
    } else if (lower === 'skills') {
        printCLILine(`Core Tech: <span class="neon-pink">Unity 3D, WebXR, Meta Quest 3, 8th Wall, Three.js, C#, OpenCV, Spatial Audio</span>`);
    } else if (lower === 'stats') {
        printCLILine(`Status: 2.5+ Yrs Experience // 15+ Commercial Apps Delivered // 6+ Enterprise Clients (Nissan, KFC, Akij)`);
    } else if (lower === 'projects') {
        printCLILine(`Featured: Akij AR, GITEX Quest 3 Drone MR, Nissan 3D AI Visualizer, 8th Wall WebAR.`);
        document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
    } else if (lower === 'clear') {
        const cliOutput = document.getElementById('cli-output');
        if (cliOutput) cliOutput.innerHTML = '';
    } else if (lower === 'warp') {
        document.getElementById('btn-warp')?.click();
    } else {
        printCLILine(`Command not recognized: '<span class="neon-pink">${cmd}</span>'. Type '<span class="neon-cyan">help</span>' for menu.`);
    }
}

// 8. Three.js 3D Spatial Canvas & Dynamic Controls Architecture
let activeMeshType = 'torus';
let isWarpSpeed = false;
let isWireframe = true;

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
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = (Math.random() - 0.5) * 30;
        positions[i + 2] = (Math.random() - 0.5) * 25;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.22,
        transparent: true,
        opacity: 0.85
    });

    const particles = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particles);

    // B. Interactive Main Holographic Object Group
    const group = new THREE.Group();
    let mainMesh = createDynamicMesh('torus', isWireframe);
    group.add(mainMesh);

    // Secondary VR Core
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-9, -3, -3);
    group.add(icoMesh);

    // Central Spatial Grid
    const gridHelper = new THREE.GridHelper(50, 25, 0x00f0ff, 0xff0055);
    gridHelper.position.y = -10;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    scene.add(group);

    function createDynamicMesh(type, wireframe) {
        let geo;
        if (type === 'ico') geo = new THREE.IcosahedronGeometry(3.2, 1);
        else if (type === 'sphere') geo = new THREE.SphereGeometry(3, 24, 24);
        else if (type === 'helix') geo = new THREE.TorusGeometry(3, 0.8, 16, 100);
        else geo = new THREE.TorusKnotGeometry(3.2, 0.7, 100, 16);

        const mat = new THREE.MeshBasicMaterial({
            color: 0x8a2be2,
            wireframe: wireframe,
            transparent: true,
            opacity: 0.5
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(8, 2, -5);
        return mesh;
    }

    // Mesh Control Buttons Listener
    document.querySelectorAll('.mesh-btn[data-mesh]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mesh-btn[data-mesh]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            activeMeshType = btn.getAttribute('data-mesh');
            group.remove(mainMesh);
            mainMesh = createDynamicMesh(activeMeshType, isWireframe);
            group.add(mainMesh);

            const modeLabel = document.getElementById('hud-mesh-mode');
            if (modeLabel) modeLabel.textContent = activeMeshType.toUpperCase();
            printCLILine(`3D Geometry swapped to: <span class="neon-cyan">${activeMeshType.toUpperCase()}</span>`);
        });
    });

    // Overdrive Controls
    const btnWarp = document.getElementById('btn-warp');
    if (btnWarp) {
        btnWarp.addEventListener('click', () => {
            isWarpSpeed = !isWarpSpeed;
            btnWarp.classList.toggle('active', isWarpSpeed);
            btnWarp.innerHTML = `<i class="fas fa-tachometer-alt"></i> WARP SPEED [${isWarpSpeed ? 'ON' : 'OFF'}]`;
            printCLILine(`Overdrive Warp Speed: <span class="neon-pink">${isWarpSpeed ? 'ACTIVE' : 'NORMAL'}</span>`);
        });
    }

    const btnWire = document.getElementById('btn-wire');
    if (btnWire) {
        btnWire.addEventListener('click', () => {
            isWireframe = !isWireframe;
            btnWire.classList.toggle('active', isWireframe);
            btnWire.innerHTML = `<i class="fas fa-border-all"></i> WIREFRAME [${isWireframe ? 'ON' : 'OFF'}]`;
            if (mainMesh) mainMesh.material.wireframe = isWireframe;
        });
    }

    // Mouse Parallax & Spatial Telemetry
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const hudX = document.getElementById('hud-pos-x');
    const hudY = document.getElementById('hud-pos-y');

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        if (hudX) hudX.textContent = (mouseX > 0 ? '+' : '') + mouseX.toFixed(2);
        if (hudY) hudY.textContent = (mouseY > 0 ? '+' : '') + mouseY.toFixed(2);
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        const speedMult = isWarpSpeed ? 4 : 1;

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        if (mainMesh) {
            mainMesh.rotation.x += 0.005 * speedMult;
            mainMesh.rotation.y += 0.007 * speedMult;
        }

        icoMesh.rotation.x -= 0.006 * speedMult;
        icoMesh.rotation.y += 0.008 * speedMult;

        particles.rotation.y += 0.001 * speedMult;

        group.rotation.y = targetX * 0.2;
        group.rotation.x = -targetY * 0.2;

        camera.position.x = targetX * 2.5;
        camera.position.y = -targetY * 2.5;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}

// 9. Quick Spec Lightbox Modal
function initProjectQuickModal() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalSpecs = document.getElementById('modal-specs');
    const modalFullBtn = document.getElementById('modal-full-btn');

    if (!modal) return;

    document.querySelectorAll('.btn-quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.portfolio__item');
            if (!card) return;

            const title = card.getAttribute('data-title') || 'Project Spec';
            const cat = card.querySelector('.category-badge')?.textContent || 'XR';
            const desc = card.querySelector('.portfolio__desc')?.textContent || '';
            const specsStr = card.getAttribute('data-specs') || 'Engine: Unity | Target: Mobile/WebXR';
            const link = card.querySelector('.portfolio__link')?.getAttribute('href') || '#';

            modalBadge.textContent = cat;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalFullBtn.setAttribute('href', link);

            // Parse specs
            modalSpecs.innerHTML = '';
            specsStr.split('|').forEach(spec => {
                const div = document.createElement('div');
                div.className = 'spec-item';
                div.textContent = spec.trim();
                modalSpecs.appendChild(div);
            });

            modal.style.display = 'flex';
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// 10. Interactive Spatial R&D Lab & WebXR Sandbox Demos
function initSandboxDemos() {
    // Demo 1: Audio Frequency Visualizer Canvas
    const audioCanvas = document.getElementById('audio-visualizer-canvas');
    const audioBtn = document.getElementById('btn-audio-sim');
    const audioStatus = document.getElementById('audio-sim-status');

    if (audioCanvas) {
        const ctx = audioCanvas.getContext('2d');
        let pulseActive = false;
        let pulseTimer = 0;

        function drawAudioVis() {
            requestAnimationFrame(drawAudioVis);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, audioCanvas.width, audioCanvas.height);

            const bars = 24;
            const barWidth = audioCanvas.width / bars;

            for (let i = 0; i < bars; i++) {
                let h = Math.sin(Date.now() * 0.005 + i * 0.4) * 30 + 40;
                if (pulseActive) {
                    h += Math.random() * 60;
                }
                ctx.fillStyle = `hsl(${180 + i * 5}, 100%, 50%)`;
                ctx.fillRect(i * barWidth, audioCanvas.height - h, barWidth - 3, h);
            }

            if (pulseActive) {
                pulseTimer++;
                if (pulseTimer > 40) {
                    pulseActive = false;
                    pulseTimer = 0;
                    if (audioStatus) audioStatus.textContent = 'Status: Idle';
                }
            }
        }

        drawAudioVis();

        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                pulseActive = true;
                pulseTimer = 0;
                if (audioStatus) audioStatus.textContent = 'Status: Frequency Bursting...';
            });
        }
    }

    // Demo 2: WebGL Shader Material Simulator Canvas
    const shaderCanvas = document.getElementById('shader-sim-canvas');
    if (shaderCanvas) {
        const ctx = shaderCanvas.getContext('2d');
        let currentShader = 'hologram';

        document.querySelectorAll('.sandbox-card [data-shader]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sandbox-card [data-shader]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentShader = btn.getAttribute('data-shader');
            });
        });

        function drawShaderSim() {
            requestAnimationFrame(drawShaderSim);
            ctx.clearRect(0, 0, shaderCanvas.width, shaderCanvas.height);

            const time = Date.now() * 0.002;
            const cx = shaderCanvas.width / 2;
            const cy = shaderCanvas.height / 2;

            ctx.save();
            ctx.translate(cx, cy);

            if (currentShader === 'wireframe') {
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 60, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(0, 0, 60, 20, time, 0, Math.PI * 2);
                ctx.stroke();
            } else if (currentShader === 'glass') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, 60, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else if (currentShader === 'plasma') {
                const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 70);
                grad.addColorStop(0, '#ff0055');
                grad.addColorStop(0.5, '#8a2be2');
                grad.addColorStop(1, '#00f0ff');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, 60 + Math.sin(time * 3) * 8, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Hologram default
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 2;
                for (let r = 10; r <= 60; r += 12) {
                    ctx.beginPath();
                    ctx.arc(0, 0, r + Math.sin(time + r) * 3, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        drawShaderSim();
    }

    // Demo 3: AR Spatial Anchor Grid Placer
    const anchorSandbox = document.getElementById('anchor-sandbox');
    const anchorClearBtn = document.getElementById('btn-clear-anchors');
    const anchorCountLabel = document.getElementById('anchor-count');

    if (anchorSandbox) {
        let anchorCount = 0;

        anchorSandbox.addEventListener('click', (e) => {
            const rect = anchorSandbox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const node = document.createElement('div');
            node.className = 'anchor-node';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;

            anchorSandbox.appendChild(node);
            anchorCount++;
            if (anchorCountLabel) anchorCountLabel.textContent = anchorCount;
        });

        if (anchorClearBtn) {
            anchorClearBtn.addEventListener('click', () => {
                anchorSandbox.querySelectorAll('.anchor-node').forEach(node => node.remove());
                anchorCount = 0;
                if (anchorCountLabel) anchorCountLabel.textContent = 0;
            });
        }
    }
}
