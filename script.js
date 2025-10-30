// لعبة The Walking Dead - Survival
// الكود الرئيسي للعبة

// متغيرات اللعبة
let scene, camera, renderer;
let castle, zombies = [];
let currentWeapon = 'shotgun';
let playerHealth = 100;
let resources = {
    gems: 45,
    coins: 297,
    food: 3785,
    wood: 1680,
    tools: 218
};

// تهيئة Three.js والمشهد
function initGame() {
    // إنشاء المشهد
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    
    // إنشاء الكاميرا
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);
    
    // إنشاء العارض
    const canvas = document.getElementById('gameCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // إضافة الإضاءة
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // إنشاء الأرضية
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2d5a27,
        roughness: 0.8
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // بناء القلعة
    buildCastle();
    
    // إنشاء البيئة المحيطة
    createEnvironment();
    
    // بدء دورة اللعبة
    animate();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
    
    console.log("🎮 لعبة The Walking Dead جاهزة!");
}

// بناء القلعة
function buildCastle() {
    const castleGroup = new THREE.Group();
    
    // الجدران
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const wallGeometry = new THREE.BoxGeometry(20, 4, 1);
    
    // الجدار الأمامي
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.set(0, 2, 10);
    frontWall.castShadow = true;
    castleGroup.add(frontWall);
    
    // الجدار الخلفي
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 2, -10);
    backWall.castShadow = true;
    castleGroup.add(backWall);
    
    // الجداران الجانبيان
    const sideWallGeometry = new THREE.BoxGeometry(1, 4, 18);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-10, 2, 0);
    leftWall.castShadow = true;
    castleGroup.add(leftWall);
    
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(10, 2, 0);
    rightWall.castShadow = true;
    castleGroup.add(rightWall);
    
    // الأبراج
    const towerGeometry = new THREE.CylinderGeometry(1.5, 2, 8, 8);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x5a3a1e });
    
    const positions = [
        [9, 4, 9], [-9, 4, 9],
        [9, 4, -9], [-9, 4, -9]
    ];
    
    positions.forEach(pos => {
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(pos[0], pos[1], pos[2]);
        tower.castShadow = true;
        castleGroup.add(tower);
    });
    
    // البوابة
    const gateGeometry = new THREE.BoxGeometry(6, 5, 0.5);
    const gateMaterial = new THREE.MeshStandardMaterial({ color: 0xb88c5a });
    const gate = new THREE.Mesh(gateGeometry, gateMaterial);
    gate.position.set(0, 2.5, 10);
    gate.castShadow = true;
    castleGroup.add(gate);
    
    scene.add(castleGroup);
    castle = castleGroup;
}

// إنشاء البيئة المحيطة
function createEnvironment() {
    // أشجار
    const treeTrunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
    const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5a3a1e });
    
    const treeTopGeometry = new THREE.SphereGeometry(1.5, 8, 6);
    const treeTopMaterial = new THREE.MeshStandardMaterial({ color: 0x2a5a1e });
    
    for (let i = 0; i < 15; i++) {
        const x = (Math.random() - 0.5) * 80 - 20;
        const z = (Math.random() - 0.5) * 80 - 20;
        
        // تجنب الأشجار داخل القلعة
        if (Math.abs(x) < 12 && Math.abs(z) < 12) continue;
        
        const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
        trunk.position.set(x, 1.5, z);
        trunk.castShadow = true;
        scene.add(trunk);
        
        const top = new THREE.Mesh(treeTopGeometry, treeTopMaterial);
        top.position.set(x, 4, z);
        top.castShadow = true;
        scene.add(top);
    }
    
    // إضافة بعض الزومبي
    createZombies();
}

// إنشاء الزومبي
function createZombies() {
    const zombieGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
    const zombieMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
    
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const distance = 25 + Math.random() * 10;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        const zombie = new THREE.Mesh(zombieGeometry, zombieMaterial);
        zombie.position.set(x, 1, z);
        zombie.castShadow = true;
        
        // تخزين معلومات الزومبي
        zombie.userData = {
            health: 100,
            speed: 0.5 + Math.random() * 0.5,
            attacking: false
        };
        
        scene.add(zombie);
        zombies.push(zombie);
    }
}

// دورة الرسوم المتحركة الرئيسية
function animate() {
    requestAnimationFrame(animate);
    
    // تحريك الزومبي نحو القلعة
    zombies.forEach(zombie => {
        const direction = new THREE.Vector3();
        direction.subVectors(new THREE.Vector3(0, 1, 0), zombie.position).normalize();
        zombie.position.add(direction.multiplyScalar(zombie.userData.speed * 0.05));
        
        // تدوير الزومبي ليواجه القلعة
        zombie.lookAt(0, 1, 0);
    });
    
    // تدوير القلعة ببطء (لإظهار الحركة)
    if (castle) {
        castle.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    
    // تحديث واجهة الموارد
    updateResourceDisplay();
}

// التعامل مع تغيير حجم النافذة
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// تحديث عرض الموارد
function updateResourceDisplay() {
    document.getElementById('gems').textContent = resources.gems;
    document.getElementById('coins').textContent = resources.coins;
    document.getElementById('food').textContent = resources.food;
    document.getElementById('wood').textContent = resources.wood;
    document.getElementById('tools').textContent = resources.tools;
}

// وظائف القوائم
function showCastle() {
    closeAllMenus();
    document.getElementById('castleMenu').style.display = 'block';
}

function showCharacters() {
    closeAllMenus();
    document.getElementById('charactersMenu').style.display = 'block';
}

function showSettings() {
    closeAllMenus();
    document.getElementById('settingsMenu').style.display = 'block';
}

function showBuildings() {
    alert('🏠 قائمة المباني - قريباً!');
}

function showWeapons() {
    alert('⚔️ قائمة الأسلحة - قريباً!');
}

function showDailyGift() {
    alert('🎁 هدية اليوم: 10 ياقوت! عد غداً للمزيد.');
}

function showShop() {
    alert('🛒 متجر اللعبة - تسوق للموارد والمعدات!');
}

function showMissions() {
    alert('📋 المهام اليومية - أكمل المهام لكسب المكافآت!');
}

function closeMenu(menuId) {
    document.getElementById(menuId).style.display = 'none';
}

function closeAllMenus() {
    const menus = document.querySelectorAll('.menu');
    menus.forEach(menu => {
        menu.style.display = 'none';
    });
}

// نظام القتال
function attack() {
    const weapons = {
        shotgun: { name: 'بندقية الصيد', damage: 40, sound: '🔫 باو!' },
        awm: { name: 'بندقية قنص', damage: 80, sound: '🎯 بووم!' },
        sword: { name: 'سيف', damage: 25, sound: '⚔️ شق!' }
    };
    
    const weapon = weapons[currentWeapon];
    
    // تأثير الهجوم
    const attackBtn = document.getElementById('attackBtn');
    attackBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        attackBtn.style.transform = 'scale(1)';
    }, 100);
    
    // عرض رسالة الهجوم
    showCombatMessage(`${weapon.sound} هجوم بـ ${weapon.name} - ضرر: ${weapon.damage}`);
    
    // تقليل صحة الزومبي العشوائي
    if (zombies.length > 0) {
        const randomZombie = zombies[Math.floor(Math.random() * zombies.length)];
        randomZombie.userData.health -= weapon.damage;
        
        if (randomZombie.userData.health <= 0) {
            scene.remove(randomZombie);
            zombies = zombies.filter(z => z !== randomZombie);
            showCombatMessage('🧟 الزومبي تم تدميره! +10 عملات');
            resources.coins += 10;
            updateResourceDisplay();
        }
    }
}

function switchWeapon() {
    const weapons = ['shotgun', 'awm', 'sword'];
    const weaponNames = {
        shotgun: 'بندقية الصيد',
        awm: 'بندقية قنص', 
        sword: 'سيف'
    };
    
    const currentIndex = weapons.indexOf(currentWeapon);
    const nextIndex = (currentIndex + 1) % weapons.length;
    currentWeapon = weapons[nextIndex];
    
    showCombatMessage(`🔄 تم التبديل إلى: ${weaponNames[currentWeapon]}`);
}

function showCombatMessage(message) {
    // إنشاء عنصر رسالة مؤقت
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: #ff4444;
        padding: 10px 20px;
        border-radius: 10px;
        border: 2px solid #ff4444;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
    `;
    messageElement.textContent = message;
    document.getElementById('gameContainer').appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}

// نظام الترقية
function upgradeBuilding(building) {
    const costs = {
        wall: { wood: 500, tools: 50 },
        tower: { wood: 300, tools: 30 },
        gate: { wood: 400, tools: 40 }
    };
    
    const cost = costs[building];
    
    if (resources.wood >= cost.wood && resources.tools >= cost.tools) {
        resources.wood -= cost.wood;
        resources.tools -= cost.tools;
        updateResourceDisplay();
        alert(`✅ تم ترقية ${building} بنجاح!`);
    } else {
        alert('❌ موارد غير كافية للترقية!');
    }
}

function showCharacterDetails(character) {
    alert(`👤 تفاصيل ${character} - قريباً!`);
}

function saveSettings() {
    alert('✅ تم حفظ الإعدادات بنجاح!');
    closeMenu('settingsMenu');
}

// تحديث شريط الصحة
function updateHealthBar() {
    const healthFill = document.getElementById('healthFill');
    const healthText = document.getElementById('healthText');
    
    healthFill.style.width = `${playerHealth}%`;
    healthText.textContent = `${playerHealth}%`;
    
    // تغيير اللون حسب الصحة
    if (playerHealth > 70) {
        healthFill.style.background = 'linear-gradient(to right, #2e7d32, #4caf50)';
    } else if (playerHealth > 30) {
        healthFill.style.background = 'linear-gradient(to right, #f57c00, #ff9800)';
    } else {
        healthFill.style.background = 'linear-gradient(to right, #c62828, #f44336)';
    }
}

// محاكاة هجوم الزومبي
setInterval(() => {
    if (zombies.length > 0 && Math.random() < 0.3) {
        playerHealth = Math.max(0, playerHealth - 5);
        updateHealthBar();
        showCombatMessage('🧟 الزومبي يهاجم! -5 صحة');
        
        if (playerHealth === 0) {
            alert('💀 لقد ماتت! Game Over');
            playerHealth = 100;
            updateHealthBar();
        }
    }
}, 5000);

// بدء اللعبة عند تحميل الصفحة
window.onload = initGame;
