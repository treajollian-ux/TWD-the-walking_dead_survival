// متغيرات اللعبة
let scene, camera, renderer, cube;
let gameStarted = false;

// تهيئة المشهد ثلاثي الأبعاد
function initThreeJS() {
    // إنشاء المشهد
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // إنشاء الكاميرا
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // إنشاء العارض
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('gameCanvas'),
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // إضافة إضاءة
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // إنشاء أرضية
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    
    // إنشاء قلعة (مكعب)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.5;
    scene.add(cube);
    
    // بدء الرسوم المتحركة
    animate();
    
    // التعامل مع تغيير حجم النافذة
    window.addEventListener('resize', onWindowResize);
}

// دورة الرسوم المتحركة
function animate() {
    requestAnimationFrame(animate);
    
    if (gameStarted && cube) {
        cube.rotation.y += 0.01;
    }
    
    renderer.render(scene, camera);
}

// التعامل مع تغيير حجم النافذة
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// بدء اللعبة
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    gameStarted = true;
    console.log("بدأت اللعبة!");
}

// فتح القوائم
function openMenu(menuType) {
    alert(`فتح قائمة: ${menuType}`);
    // هنا يمكنك إضافة منطق فتح القوائم المختلفة
}

// تهيئة اللعبة عند تحميل الصفحة
window.onload = function() {
    initThreeJS();
};
