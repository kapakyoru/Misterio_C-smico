// --- VERSIÓN DEFINITIVA: EL MISTERIO CÓSMICO (ESTÉTICA NEÓN RESTAURADA + TRACKPAD BLINDADO) ---

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.015); 

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 16); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.style.touchAction = 'none'; 
document.body.appendChild(renderer.domElement);

const controles = new THREE.OrbitControls(camera, renderer.domElement);
controles.enableDamping = true;
controles.enablePan = false; 
controles.minDistance = 8.0;  
controles.maxDistance = 26.0; 

scene.add(new THREE.AmbientLight(0xffffff, 0.25));

const monumento = new THREE.Group();
scene.add(monumento);


// 1. POLVO CÓSMICO
const geomPolvo = new THREE.BufferGeometry();
const posPolvo = new Float32Array(3500 * 3);
for(let i=0; i<3500*3; i++) posPolvo[i] = (Math.random() - 0.5) * 90;
geomPolvo.setAttribute('position', new THREE.BufferAttribute(posPolvo, 3));
scene.add(new THREE.Points(geomPolvo, new THREE.PointsMaterial({ size: 0.022, color: 0xffffff, opacity: 0.35, transparent: true })));


// 2. FÁBRICA DE CARTELES
function crearCartel(texto, tamano = 22, color = "#ffffff") {
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    canvas.width = 1024; canvas.height = 128; ctx.font = `italic bold ${tamano}px Georgia`; ctx.textAlign = "center";
    ctx.shadowColor = color === "#ffffff" ? "rgba(255, 120, 220, 0.95)" : "rgba(0, 180, 255, 0.95)"; 
    ctx.shadowBlur = 18; ctx.fillStyle = color; ctx.fillText(texto, 512, 70);
    ctx.shadowColor = "rgba(0, 0, 0, 0.98)"; ctx.shadowBlur = 8; ctx.fillText(texto, 512, 70);

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
    sprite.scale.set(9.6, 1.2, 1); sprite.position.set(0, 0, 1.2); 
    return sprite;
}

function crearCartelClimax() {
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    canvas.width = 1024; canvas.height = 256; ctx.font = "italic bold 28px Georgia"; ctx.textAlign = "center";
    ctx.shadowColor = "rgba(255, 40, 140, 1)"; ctx.shadowBlur = 26; ctx.fillStyle = "#ffffff";
    ctx.fillText("Quería decirte que me encanta conocerte", 512, 95); ctx.fillText("y me gustaría seguir creando momentos contigo ❤️", 512, 175);
    ctx.shadowColor = "rgba(0, 0, 0, 0.98)"; ctx.shadowBlur = 8; 
    ctx.fillText("Quería decirte que me encanta conocerte", 512, 95); ctx.fillText("y me gustaría seguir creando momentos contigo ❤️", 512, 175);
    
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
    sprite.scale.set(0.01, 0.01, 1); sprite.position.set(0, 0, 1.5); 
    return sprite;
}


// 3. GENERADOR ÓPTICO EXACTO A TU REFERENCIA DORADA
function generarTexturaHalo(rgb) {
    const canvas = document.createElement('canvas'); 
    canvas.width = 512; canvas.height = 512; const ctx = canvas.getContext('2d');
    
    // Curva de luz hiper-nítida (Efecto Donut Neón)
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    grad.addColorStop(0.0, '#ffffff'); 
    grad.addColorStop(0.08, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`);   // Anillo saturado puro
    grad.addColorStop(0.32, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.22)`); // Resplandor exterior
    grad.addColorStop(0.58, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);    // Corte al vacío en el 58%
    
    ctx.fillStyle = grad; ctx.fillRect(0,0,512,512); 
    return new THREE.CanvasTexture(canvas);
}

function crearEstrella(hex, rgb, x, y, z, esPista = false) {
    const grupo = new THREE.Group(); grupo.position.set(x, y, z);
    
    // Esfera física interna con color propio real
    grupo.add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshBasicMaterial({ color: hex })));
    
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ 
        map: generarTexturaHalo(rgb), 
        blending: THREE.AdditiveBlending, 
        transparent: true,
        depthWrite: false 
    }));
    halo.scale.set(2.2, 2.2, 1); grupo.add(halo);

    grupo.userData = { colorBase: hex, esPista: esPista }; 
    if(esPista) grupo.add(new THREE.PointLight(hex, 3.5, 14)); 
    return grupo;
}

const estrellasClickables = [];

const paletaGemas = [
    { h: 0xff3344, rgb: [255, 51, 68] },   // Rojo láser
    { h: 0x00ffff, rgb: [0, 255, 255] },   // Cian neón
    { h: 0xffff00, rgb: [255, 255, 0] },   // Amarillo oro
    { h: 0x44ff66, rgb: [68, 255, 102] },  // Verde eléctrico
    { h: 0xff00aa, rgb: [255, 0, 170] },   // Magenta
    { h: 0x8844ff, rgb: [136, 68, 255] },  // Violeta
    { h: 0xff8833, rgb: [255, 136, 51] }   // Naranja solar
];

// Dispersión panorámica amplia (Rango X: ±13 metros)
for(let i=0; i<20; i++) {
    let gx, gy;
    do {
        gx = (Math.random() - 0.5) * 26.0; 
        gy = (Math.random() - 0.5) * 15.0;  
    } while (Math.abs(gx) < 4.0 && Math.abs(gy) < 1.4); // Caja central despejada

    const gz = -3 - Math.random() * 7.5; 
    const g = paletaGemas[i % paletaGemas.length];
    const trampa = crearEstrella(g.h, g.rgb, gx, gy, gz, false);
    monumento.add(trampa); estrellasClickables.push(trampa);
}

// Las 3 reales ancladas en la zona visual segura de ambas pantallas
const p1 = crearEstrella(0x00ffff, [0, 255, 255], -4.2, 2.5, -4.2, true); 
const p2 = crearEstrella(0xff00aa, [255, 0, 170], 4.4, -2.2, -4.5, true); 
const p3 = crearEstrella(0xffff00, [255, 255, 0], 0.5, 3.6, -5.2, true);  
estrellasClickables.push(p1, p2, p3);
estrellasClickables.forEach(e => monumento.add(e));


// 4. SUPERNOVAS
const grupoExplosiones = []; const ondasExpansivas = [];
const texAnillo = (() => {
    const c = document.createElement('canvas'); c.width=128; c.height=128; const cx=c.getContext('2d');
    cx.strokeStyle="white"; cx.lineWidth=6; cx.beginPath(); cx.arc(64,64,54,0,Math.PI*2); cx.stroke(); return new THREE.CanvasTexture(c);
})();

function detonarSupernova(posicion, colorHex) {
    const geo = new THREE.SphereGeometry(0.05, 8, 8); const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 1 });
    const chispas = [];
    for(let i=0; i<30; i++) {
        const m = new THREE.Mesh(geo, mat.clone()); m.position.copy(posicion);
        m.userData = { vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, vz: (Math.random()-0.5)*0.3 };
        monumento.add(m); chispas.push(m);
    }
    grupoExplosiones.push(chispas);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texAnillo, color: colorHex, blending: THREE.AdditiveBlending, transparent: true, opacity: 1, depthWrite: false }));
    sp.position.copy(posicion); sp.scale.set(0.1, 0.1, 1); monumento.add(sp); ondasExpansivas.push(sp);
}


// 5. SANTUARIO Y METEOROS
const auraClimax = new THREE.Sprite(new THREE.SpriteMaterial({ 
    map: (() => {
        const c=document.createElement('canvas'); c.width=512; c.height=512; const cx=c.getContext('2d');
        const g=cx.createRadialGradient(256,256,20,256,256,256); 
        g.addColorStop(0,'rgba(255,100,170,0.45)'); g.addColorStop(0.5,'rgba(180,30,100,0.12)'); g.addColorStop(1,'rgba(255,100,170,0)');
        cx.fillStyle=g; cx.fillRect(0,0,512,512); return new THREE.CanvasTexture(c);
    })(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false 
}));
auraClimax.position.set(0, 0, -4.0); auraClimax.scale.setScalar(24); monumento.add(auraClimax);

const meteoros = []; let activarLluvia = false;
function generarMeteoro() {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xffaa00 : 0xff88bb, transparent: true, opacity: 0.8 }));
    m.position.set((Math.random() - 0.5) * 40, 18 + Math.random() * 10, -10 + (Math.random() - 0.5) * 15);
    scene.add(m); meteoros.push(m);
}


// 6. RAYCASTER + ANIQUILACIÓN FÍSICA DE RAM
const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();

const memoriaProgreso = { 
    0: "He escondido 3 estrellas especiales para ti. Búscalas...",
    1: "Dicen que la curiosidad siempre encuentra respuestas ⭐", 
    2: "Gracias por llegar hasta aquí 🤍", 
    3: "Eso significa que valía la pena descubrir el final..." 
};

const frasesTrampa = ["¡Uy, casi! Sigue buscando... 👀", "Frío, frío... por aquí no es 🧊", "Brilla hermoso, pero no es ✨", "Mmmm... prueba con otra 🪐", "Es solo una trampa de color 🙈"];

let encontradas = 0; let temblorIntensidad = 0; let animarZoomClimax = false; let factorZoom = 0.01;
let temporizadorBroma = null; 
let toqueInicioX = 0, toqueInicioY = 0;

let cartelActual = crearCartel(memoriaProgreso[0], 22, "#ffffff");
monumento.add(cartelActual);

function dispararLaser(clientX, clientY) {
    if (encontradas === 3) return; 

    mouse.x = (clientX / window.innerWidth) * 2 - 1; 
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const hits = raycaster.intersectObjects(estrellasClickables, true);

    if (hits.length > 0) {
        let tocada = hits[0].object;
        if (tocada.parent && tocada.parent !== monumento) tocada = tocada.parent;

        // Aniquilación permanente en memoria (Imposible chocar con fantasmas)
        const idx = estrellasClickables.indexOf(tocada);
        if (idx > -1) {
            estrellasClickables.splice(idx, 1);
            monumento.remove(tocada);

            if (tocada.userData.esPista) {
                encontradas++; temblorIntensidad = 0.35; 
                detonarSupernova(tocada.position, tocada.userData.colorBase);
                if (temporizadorBroma) clearTimeout(temporizadorBroma);

                monumento.remove(cartelActual);
                cartelActual = crearCartel(memoriaProgreso[encontradas], 22, "#ffffff");
                monumento.add(cartelActual);

                if (encontradas === 3) {
                    setTimeout(() => {
                        monumento.remove(cartelActual); cartelActual = crearCartelClimax(); monumento.add(cartelActual);
                        animarZoomClimax = true; auraClimax.material.opacity = 1; 
                        activarLluvia = true; for(let k=0; k<25; k++) generarMeteoro(); 
                    }, 3800); 
                }
            } else {
                detonarSupernova(tocada.position, tocada.userData.colorBase);
                if (temporizadorBroma) clearTimeout(temporizadorBroma); 

                monumento.remove(cartelActual);
                cartelActual = crearCartel(frasesTrampa[Math.floor(Math.random() * frasesTrampa.length)], 22, "#88ddff");
                monumento.add(cartelActual);

                temporizadorBroma = setTimeout(() => {
                    if (encontradas < 3) {
                        monumento.remove(cartelActual);
                        cartelActual = crearCartel(memoriaProgreso[encontradas], 22, "#ffffff");
                        monumento.add(cartelActual);
                    }
                }, 1500); 
            }
        }
    }
}

window.addEventListener('pointerdown', (e) => { toqueInicioX = e.clientX; toqueInicioY = e.clientY; });
window.addEventListener('pointerup', (e) => {
    // Discriminador de presión: Trackpads reciben 28px de margen, móviles reciben 14px
    const margen = e.pointerType === 'touch' ? 14 : 28; 
    if (Math.hypot(e.clientX - toqueInicioX, e.clientY - toqueInicioY) <= margen) {
        dispararLaser(e.clientX, e.clientY);
    }
});


// 7. MOTOR RESPONSIVO
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight);
});


// 8. ANIMACIÓN
let tiempo = 0;

function animar() {
    requestAnimationFrame(animar); controles.update(); tiempo += 0.04;
    
    if (temblorIntensidad > 0.005) {
        monumento.position.set((Math.random()-0.5)*temblorIntensidad, (Math.random()-0.5)*temblorIntensidad, 0);
        temblorIntensidad *= 0.88; 
    } else { monumento.position.set(0,0,0); }

    if (animarZoomClimax && factorZoom < 0.999) {
        factorZoom += (1 - factorZoom) * 0.065; cartelActual.scale.set(11.5 * factorZoom, 2.87 * factorZoom, 1);
    }

    estrellasClickables.forEach(e => e.scale.setScalar(1 + Math.sin(tiempo * 1.5) * 0.22));
    if (auraClimax.material.opacity > 0) auraClimax.scale.setScalar(24 + Math.sin(tiempo * 1.2) * 1.8);

    grupoExplosiones.forEach((chispas, indexG) => {
        chispas.forEach(c => { c.position.x += c.userData.vx; c.position.y += c.userData.vy; c.position.z += c.userData.vz; c.material.opacity -= 0.022; });
        if(chispas[0] && chispas[0].material.opacity <= 0) { chispas.forEach(c => monumento.remove(c)); grupoExplosiones.splice(indexG, 1); }
    });

    ondasExpansivas.forEach((anillo, idxA) => {
        anillo.scale.x += 0.38; anillo.scale.y += 0.38; anillo.material.opacity -= 0.035;
        if(anillo.material.opacity <= 0) { monumento.remove(anillo); ondasExpansivas.splice(idxA, 1); }
    });

    if (activarLluvia) {
        meteoros.forEach(m => {
            m.position.x += 0.25; m.position.y -= 0.25;
            if (m.position.y < -16) m.position.set((Math.random() - 0.5) * 40, 18, -10 + (Math.random() - 0.5) * 15);
        });
    }

    renderer.render(scene, camera);
}

animar();