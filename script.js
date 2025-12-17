const projects = [
    { 
        title: "Modelo 3D #1 - Espadas do Asta", 
        img: "images/model1.webp", 
        desc: "Modelagem detalhada das espadas anti-magia do Asta (Black Clover) com texturas realistas e normal maps.", 
        category: "3d",
        tags: ["Blender", "Texturização", "Hard Surface"]
    },
    { 
        title: "Modelo 3D #2 - Ambiente Futurista", 
        img: "images/model2.webp", 
        desc: "Cena completa com iluminação volumétrica e texturização PBR, criada para um projeto de jogo sci-fi.", 
        category: "3d",
        tags: ["Iluminação", "PBR", "Cenários"]
    },
    { 
        title: "Modelo 3D #3 - Roblox Studio Map", 
        img: "images/model3.webp", 
        desc: "Mapa completo otimizado para Roblox com LODs e colisões, pronto para implementação.", 
        category: "3d",
        tags: ["Roblox", "Otimização", "Game Ready"]
    },
    { 
        title: "Modelo 3D #4 - Personagem Estilizado", 
        img: "images/model4.webp", 
        desc: "Personagem low-poly com rigging básico e texturas hand-painted, perfeito para jogos mobile.", 
        category: "3d",
        tags: ["Character", "Low-Poly", "Rigging"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    AOS.init({ 
        duration: 1000, 
        once: true,
        offset: 50
    });
    
    renderProjects();
    initThreeJS();
    initModal();
    initParticles();
    initEventListeners();
    initThemeToggle();
});

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    
    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-category', p.category);
        
        card.innerHTML = `
            <img src="${p.img}" alt="${p.title}" loading="lazy">
            <div class="project-info">
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <div class="project-tags">
                    ${p.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        card.onclick = () => openModal(p);
        grid.appendChild(card);
    });
    
    initFilters();
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

function initModal() {
    const modal = document.getElementById('imageModal');
    const close = document.querySelector('.close-modal');
    
    close.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    window.onclick = (e) => { 
        if (e.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

function openModal(project) {
    const modal = document.getElementById('imageModal');
    document.getElementById('imgFull').src = project.img;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDesc').textContent = project.desc;
    
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function initThreeJS() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('webgl-bg'), 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const geometries = [
        new THREE.TorusGeometry(10, 3, 16, 100),
        new THREE.IcosahedronGeometry(8, 0),
        new THREE.OctahedronGeometry(7, 0)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.1 }),
        new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true, transparent: true, opacity: 0.08 }),
        new THREE.MeshBasicMaterial({ color: 0x33ff33, wireframe: true, transparent: true, opacity: 0.06 })
    ];
    
    const meshes = [];
    
    geometries.forEach((geometry, index) => {
        const mesh = new THREE.Mesh(geometry, materials[index]);
        mesh.position.x = (index - 1) * 25;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        scene.add(mesh);
        meshes.push(mesh);
    });
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xff0033,
        transparent: true,
        opacity: 0.5
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 40;
    
    function animate() {
        requestAnimationFrame(animate);
        
        meshes.forEach((mesh, index) => {
            mesh.rotation.x += 0.005 * (index + 1);
            mesh.rotation.y += 0.005 * (index + 1);
        });
        
        particlesMesh.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--red);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: floatParticle ${duration}s infinite ease-in-out ${delay}s;
        `;
        
        container.appendChild(particle);
    }
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
            50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
            75% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
        }
    `;
    document.head.appendChild(styleSheet);
}

function initEventListeners() {
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('portfolio').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = button.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i data-lucide="check"></i> Copiado!';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                }, 2000);
            });
        });
    });
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const nav = document.querySelector('nav');
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'var(--glass)';
            nav.style.backdropFilter = 'blur(15px)';
            nav.style.padding = '20px';
            nav.style.borderTop = '1px solid var(--glass-border)';
            nav.style.borderBottom = '1px solid var(--glass-border)';
            nav.style.gap = '15px';
        });
    }
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        lucide.createIcons();
        themeIcon.setAttribute('data-lucide', 'moon');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeIcon.setAttribute('data-lucide', 'moon');
        } else {
            localStorage.setItem('theme', 'dark');
            themeIcon.setAttribute('data-lucide', 'sun');
        }
        
        lucide.createIcons();
    });
}

function initTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

window.addEventListener('load', () => {
    initTypingEffect();
    initIntersectionObserver();
});
