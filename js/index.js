// Navigation toggling
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

// Interactive Portfolio Filtering
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

// Three.js Dynamic XR Hero Scene
function initXRScene() {
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
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Spatial Node Grid / Particle Network
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 35;
        positions[i + 1] = (Math.random() - 0.5) * 25;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.25,
        transparent: true,
        opacity: 0.8
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Floating Interactive XR Holographic Geometry (Icosahedron wireframe representing XR matrix)
    const icoGeo = new THREE.IcosahedronGeometry(4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x7000ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(6, 0, -2);
    scene.add(icoMesh);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(2, 0);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    icoMesh.add(coreMesh);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        icoMesh.rotation.x += 0.003;
        icoMesh.rotation.y += 0.005;

        coreMesh.rotation.x -= 0.006;
        coreMesh.rotation.y -= 0.004;

        particles.rotation.y += 0.001;
        particles.rotation.x = targetY * 0.2;
        particles.rotation.y += targetX * 0.002;

        camera.position.x = targetX * 2;
        camera.position.y = -targetY * 2;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener('DOMContentLoaded', initXRScene);
