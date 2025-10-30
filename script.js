// لعبة البقاء - عالم الموتى السائرين
console.log("🎮 جار تحميل اللعبة...");

let scene, camera, renderer;
let gameStarted = false;

function init() {
    try {
        console.log("✅ بدء تهيئة Three.js");
        
        // إنشاء المشهد
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);
        
        // إنشاء الكاميرا
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // إنشاء العارض
        const canvas = document.getElementById('gameCanvas');
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // إضاءة
        const light = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(light);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // أرضية
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x2d5a27,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);
        
        // قلعة
        const castleGeometry = new THREE.BoxGeometry(2, 1.5, 2);
        const castleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x8b4513 
        });
        const castle = new THREE.Mesh(castleGeometry, castleMaterial);
        castle.position.y = 0.75;
        scene.add(castle);
        
        // أشجار
        createEnvironment();
        
        // بدء الرسوم المتحركة
        animate();
        
        // التعامل مع تغيير حجم النافذة
        window.addEventListener('resize', onWindowResize);
        
        console.log("✅ Three.js تم التهيئة بنجاح");
        
    } catch (error) {
        console.error("❌ خطأ في التهيئة:", error);
    }
}

function createEnvironment() {
    // أشجار حول القلعة
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // جذع الشجرة
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
        const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x5d4037 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 0.75, z);
        scene.add(trunk);
        
        // تاج الشجرة
        const topGeometry = new THREE.SphereGeometry(0.8, 8, 6);
        const topMaterial = new THREE.MeshBasicMaterial({ color: 0x2e7d32 });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.set(x, 1.8, z);
        scene.add(top);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (gameStarted) {
        // تدوير المشهد ببطء
        scene.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('ui').style.display = 'block';
    gameStarted = true;
    console.log("🎮 بدأت اللعبة! حظًا موفقًا في البقاء!");
}

// وظائف القوائم
function openGift() {
    alert("🎁 هدية اليوم: 10 ياقوت!");
}

function openShop() {
    alert("🛒 متجر اللعبة - يمكنك شراء المعدات هنا");
}

function openCastle() {
    alert("🏰 قائمة القلعة - إدارة وتطوير القلعة");
}

function openCharacters() {
    alert("👥 قائمة الشخصيات - إدارة أعضاء فريقك");
}

function openBuildings() {
    alert("🏠 قائمة المباني - بناء وتطوير المنشآت");
}

function openWeapons() {
    alert("⚔️ قائمة الأسلحة - تسليح فريقك");
}

function openSettings() {
    alert("⚙️ الإعدادات - الصوت واللغة والإعدادات الأخرى");
}

// تهيئة اللعبة عند تحميل الصفحة
window.onload = init;
