/* ==========================================================================
   SARVAGYA INSTITUTE - INTERACTIVE ANIMATIONS & 3D VISUALS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initMobileMenu();
  initBackgroundParticles();
  initParallaxElements();
  initHeroCodeToVR();
  initStatsCounter();
  initTiltCards();
  initRealityLab();
  initAIHologram();
  initDigitalGlobe();
  initFooterParticles();
  initCursorDrone();
});

/* --------------------------------------------------------------------------
   9. FUTURISTIC LOADING SCREEN
   -------------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader-screen');
  const barFill = document.getElementById('loader-bar-fill');
  const percentEl = document.getElementById('loader-percent');
  const textEl = document.getElementById('loader-text');
  const replayBtn = document.getElementById('replay-loader-btn');

  function runLoader() {
    loader.classList.remove('hidden');
    let progress = 0;
    const messages = [
      'Initializing Future...',
      'Constructing AR/VR Shaders...',
      'Calibrating Automotive Twin...',
      'Sarvagya Institute Ready.'
    ];

    const timer = setInterval(() => {
      progress += Math.random() * 5 + 3.2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(() => loader.classList.add('hidden'), 320);
      }
      barFill.style.width = `${Math.floor(progress)}%`;
      percentEl.textContent = `${Math.floor(progress)}%`;

      const idx = Math.min(messages.length - 1, Math.floor((progress / 100) * messages.length));
      textEl.textContent = messages[idx];
    }, 55);
  }

  runLoader();

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      runLoader();
    });
  }
}

/* --------------------------------------------------------------------------
   MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE BACKGROUND (PARTICLES + EMERALD/CYAN/PINK LIGHTNING)
   -------------------------------------------------------------------------- */
function initBackgroundParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const colors = ['#00f5d4', '#16e09b', '#ff2a85', '#70ffe8'];
  const count = Math.min(85, Math.floor((w * h) / 17000));
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    r: Math.random() * 2 + 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let lightning = null;
  let lightningTimer = 0;

  function spawnLightning() {
    const startX = Math.random() * w;
    const startY = Math.random() * h * 0.45;
    const points = [{ x: startX, y: startY }];
    let cx = startX;
    let cy = startY;
    const segs = 7 + Math.floor(Math.random() * 5);
    for (let i = 0; i < segs; i++) {
      cx += (Math.random() - 0.5) * 90;
      cy += Math.random() * 55 + 15;
      points.push({ x: cx, y: cy });
    }
    const palette = ['#00ff9d', '#00f5d4', '#ff2a85'];
    lightning = {
      points,
      alpha: 0.85,
      color: palette[Math.floor(Math.random() * palette.length)]
    };
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // Subtle emerald lightning
    lightningTimer++;
    if (lightningTimer > 160 && Math.random() < 0.03) {
      spawnLightning();
      lightningTimer = 0;
    }

    if (lightning) {
      ctx.save();
      ctx.globalAlpha = lightning.alpha;
      ctx.strokeStyle = lightning.color;
      ctx.shadowColor = lightning.color;
      ctx.shadowBlur = 16;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      lightning.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();
      lightning.alpha -= 0.035;
      if (lightning.alpha <= 0) lightning = null;
    }

    // Particles & connections
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dxm = p.x - mouse.x;
      const dym = p.y - mouse.y;
      const distM = Math.hypot(dxm, dym);
      if (distM < 130 && distM > 0) {
        const force = (130 - distM) / 130;
        p.x += (dxm / distM) * force * 1.8;
        p.y += (dym / distM) * force * 1.8;
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 245, 212, ${(1 - d / 120) * 0.14})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   3. 3D FLOATING ELEMENTS PARALLAX
   -------------------------------------------------------------------------- */
function initParallaxElements() {
  const items = document.querySelectorAll('[data-depth]');
  if (!items.length) return;

  window.addEventListener('mousemove', e => {
    const cx = e.clientX - window.innerWidth / 2;
    const cy = e.clientY - window.innerHeight / 2;

    items.forEach(el => {
      const depth = parseFloat(el.dataset.depth || '0.04');
      const tx = -cx * depth;
      const ty = -cy * depth;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });
}

/* --------------------------------------------------------------------------
   1. HERO: LIVE CODING -> 3D VR ENVIRONMENT GENERATION + ENERGY BRIDGE
   -------------------------------------------------------------------------- */
function initHeroCodeToVR() {
  const codeEl = document.getElementById('typed-code');
  const linesEl = document.getElementById('vscode-lines');
  const stageLabel = document.getElementById('vr-build-stage');
  const polyCountEl = document.getElementById('vr-poly-count');
  const shaderStateEl = document.getElementById('vr-shader-state');
  const stagePills = document.querySelectorAll('.stage-pill');

  const vrCanvas = document.getElementById('hero-vr-canvas');
  const bridgeCanvas = document.getElementById('bridge-canvas');
  if (!codeEl || !vrCanvas || !bridgeCanvas) return;

  const codeStages = [
    {
      label: 'Stage 1/4: Initializing VR Grid',
      shader: 'GRID_MATRIX',
      code:
        `// Sarvagya WebXR Core v4.2
import { VREngine, EmeraldScene } from '@sarvagya/xr';

const world = new EmeraldScene({
  ambient: '#031c15',
  gridGlow: '#00f5d4'
});
world.buildPerspectiveGrid(64, 64);`
    },
    {
      label: 'Stage 2/4: Constructing EV Chassis',
      shader: 'MESH_WIREFRAME',
      code:
        `
const evTwin = VREngine.spawnVehicle({
  model: 'Autonomous_EV_Prototype',
  wireframe: '#00f5d4',
  accentNeon: '#ff2a85'
});
evTwin.extrudeChassis(3.8, 1.9);`
    },
    {
      label: 'Stage 3/4: Attaching AR HUD Rings',
      shader: 'HOLO_TELEMETRY',
      code:
        `
const arHud = evTwin.attachAROverlay({
  lidarRings: 3,
  telemetryNodes: 18,
  syncRateHz: 120
});
arHud.enableSpatialTracking(true);`
    },
    {
      label: 'Stage 4/4: Full Immersive VR Live',
      shader: 'XR_IMMERSION_ON',
      code:
        `
VREngine.compileAndStream(world, {
  particles: 240,
  bloom: 'cyan-pink-emerald'
}); // -> VR World Generated!`
    }
  ];

  const fullCode = codeStages.map(s => s.code).join('\n');
  const stageThresholds = [];
  let acc = 0;
  codeStages.forEach(s => {
    acc += s.code.length;
    stageThresholds.push(acc);
  });

  let charIndex = 0;
  let currentStage = 0;
  let buildProgress = 0;
  let pauseTicks = 0;

  function highlightSyntax(raw) {
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(\/\/.*)/g, '<span class="tok-cm">$1</span>')
      .replace(/\b(import|from|const|new|true)\b/g, '<span class="tok-kw">$1</span>')
      .replace(/\b(VREngine|EmeraldScene|buildPerspectiveGrid|spawnVehicle|extrudeChassis|attachAROverlay|enableSpatialTracking|compileAndStream)\b/g, '<span class="tok-fn">$1</span>')
      .replace(/('[^']*')/g, '<span class="tok-str">$1</span>')
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
  }

  function updateLineNumbers(text) {
    const count = text.split('\n').length;
    let html = '';
    for (let i = 1; i <= count; i++) html += `${i}<br/>`;
    linesEl.innerHTML = html;
  }

  setInterval(() => {
    if (pauseTicks > 0) {
      pauseTicks--;
      if (pauseTicks === 0) {
        charIndex = 0;
        currentStage = 0;
        buildProgress = 0;
      }
      return;
    }

    charIndex += 2;
    if (charIndex >= fullCode.length) {
      charIndex = fullCode.length;
      pauseTicks = 95; // hold completed VR scene briefly before cycling
    }

    const slice = fullCode.slice(0, charIndex);
    codeEl.innerHTML = highlightSyntax(slice);
    updateLineNumbers(slice);

    buildProgress = charIndex / fullCode.length;
    for (let i = 0; i < stageThresholds.length; i++) {
      if (charIndex <= stageThresholds[i]) {
        currentStage = i;
        break;
      }
    }

    stageLabel.textContent = codeStages[currentStage].label;
    shaderStateEl.textContent = `SHADER: ${codeStages[currentStage].shader}`;
    polyCountEl.textContent = `MESH: ${Math.floor(buildProgress * 100)}%`;

    stagePills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx <= currentStage);
    });
  }, 36);

  // Energy Bridge Particle Stream
  const bCtx = bridgeCanvas.getContext('2d');
  function resizeBridge() {
    bridgeCanvas.width = bridgeCanvas.offsetWidth || 110;
    bridgeCanvas.height = bridgeCanvas.offsetHeight || 360;
  }
  resizeBridge();
  window.addEventListener('resize', resizeBridge);

  const streamDots = Array.from({ length: 24 }, () => ({
    t: Math.random(),
    yOffset: (Math.random() - 0.5) * 180,
    speed: 0.012 + Math.random() * 0.014,
    color: Math.random() > 0.4 ? '#00f5d4' : '#ff2a85',
    r: Math.random() * 2.2 + 1.4
  }));

  function renderBridge() {
    const bw = bridgeCanvas.width;
    const bh = bridgeCanvas.height;
    bCtx.clearRect(0, 0, bw, bh);

    streamDots.forEach(d => {
      d.t += d.speed;
      if (d.t > 1) d.t = 0;
      const x = d.t * bw;
      const y = bh / 2 + d.yOffset * Math.sin(d.t * Math.PI) * 0.65;
      bCtx.beginPath();
      bCtx.arc(x, y, d.r, 0, Math.PI * 2);
      bCtx.fillStyle = d.color;
      bCtx.shadowColor = d.color;
      bCtx.shadowBlur = 10;
      bCtx.fill();
    });
    bCtx.shadowBlur = 0;
    requestAnimationFrame(renderBridge);
  }
  renderBridge();

  // Right Side 3D VR World Canvas
  const vCtx = vrCanvas.getContext('2d');
  function resizeVR() {
    vrCanvas.width = vrCanvas.offsetWidth || 520;
    vrCanvas.height = vrCanvas.offsetHeight || 390;
  }
  resizeVR();
  window.addEventListener('resize', resizeVR);

  // 3D Car Wireframe Vertices
  const carVerts = [
    [-1.4, 0.3, -0.7], [1.4, 0.3, -0.7], [1.5, 0.3, 0.7], [-1.4, 0.3, 0.7],
    [-1.2, -0.1, -0.68], [1.35, -0.1, -0.68], [1.35, -0.1, 0.68], [-1.2, -0.1, 0.68],
    [-0.65, -0.55, -0.55], [0.55, -0.55, -0.55], [0.55, -0.55, 0.55], [-0.65, -0.55, 0.55]
  ];
  const carEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
    [8, 9], [9, 10], [10, 11], [11, 8],
    [4, 8], [5, 9], [6, 10], [7, 11]
  ];

  let angle = 0;
  function renderVRWorld() {
    const vw = vrCanvas.width;
    const vh = vrCanvas.height;
    vCtx.clearRect(0, 0, vw, vh);
    angle += 0.014;

    const cx = vw / 2;
    const cy = vh / 2 + 12;

    // Stage 1: Perspective VR Grid
    const gridAlpha = Math.min(1, buildProgress * 4);
    vCtx.save();
    vCtx.strokeStyle = `rgba(0, 245, 212, ${0.22 * gridAlpha})`;
    vCtx.lineWidth = 1;
    const horizonY = vh * 0.42;
    for (let i = -8; i <= 8; i++) {
      vCtx.beginPath();
      vCtx.moveTo(cx + i * 24, horizonY);
      vCtx.lineTo(cx + i * 95, vh);
      vCtx.stroke();
    }
    for (let j = 0; j < 7; j++) {
      const y = horizonY + Math.pow(j / 6, 1.6) * (vh - horizonY);
      vCtx.beginPath();
      vCtx.moveTo(0, y);
      vCtx.lineTo(vw, y);
      vCtx.stroke();
    }
    vCtx.restore();

    // Stage 2: 3D Automotive Chassis Wireframe
    if (buildProgress > 0.22) {
      const meshReveal = Math.min(1, (buildProgress - 0.22) / 0.35);
      const scale = Math.min(vw, vh) * 0.22;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const proj = carVerts.map(([x, y, z]) => {
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        const fov = 3.6 / (3.6 + rz);
        return [cx + rx * scale * fov, cy + y * scale * fov];
      });

      const edgesToDraw = Math.floor(carEdges.length * meshReveal);
      vCtx.save();
      vCtx.lineWidth = 1.8;
      for (let i = 0; i < edgesToDraw; i++) {
        const [a, b] = carEdges[i];
        vCtx.strokeStyle = i % 3 === 0 ? '#ff2a85' : '#00f5d4';
        vCtx.shadowColor = vCtx.strokeStyle;
        vCtx.shadowBlur = 10;
        vCtx.beginPath();
        vCtx.moveTo(proj[a][0], proj[a][1]);
        vCtx.lineTo(proj[b][0], proj[b][1]);
        vCtx.stroke();
      }
      vCtx.restore();
    }

    // Stage 3: AR HUD Rings & Telemetry Nodes
    if (buildProgress > 0.55) {
      const hudAlpha = Math.min(1, (buildProgress - 0.55) / 0.25);
      vCtx.save();
      vCtx.globalAlpha = hudAlpha;
      [1, 2].forEach((ring, idx) => {
        const rx = 120 + idx * 42;
        const ry = 36 + idx * 14;
        vCtx.strokeStyle = idx === 0 ? 'rgba(0, 245, 212, 0.55)' : 'rgba(255, 42, 133, 0.5)';
        vCtx.setLineDash([8, 6]);
        vCtx.beginPath();
        vCtx.ellipse(cx, cy + 48, rx, ry, 0, 0, Math.PI * 2);
        vCtx.stroke();
      });
      vCtx.setLineDash([]);

      // Orbiting telemetry nodes
      for (let k = 0; k < 6; k++) {
        const a = angle * 1.5 + (k * Math.PI) / 3;
        const nx = cx + Math.cos(a) * 145;
        const ny = cy - 25 + Math.sin(a) * 48;
        vCtx.beginPath();
        vCtx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        vCtx.fillStyle = k % 2 === 0 ? '#00f5d4' : '#f5b841';
        vCtx.shadowColor = vCtx.fillStyle;
        vCtx.shadowBlur = 12;
        vCtx.fill();
      }
      vCtx.restore();
    }

    // Stage 4: Full VR Ambient Aura
    if (buildProgress > 0.8) {
      const grad = vCtx.createRadialGradient(cx, cy, 20, cx, cy, 200);
      grad.addColorStop(0, 'rgba(0, 245, 212, 0.14)');
      grad.addColorStop(0.5, 'rgba(255, 42, 133, 0.08)');
      grad.addColorStop(1, 'transparent');
      vCtx.fillStyle = grad;
      vCtx.fillRect(0, 0, vw, vh);
    }

    requestAnimationFrame(renderVRWorld);
  }
  renderVRWorld();
}

/* --------------------------------------------------------------------------
   6. ANIMATED DIGITAL STATISTICS
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const nums = document.querySelectorAll('.stat-number');
  if (!nums.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${Math.floor(target * eased).toLocaleString()}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  nums.forEach(n => observer.observe(n));
}

/* --------------------------------------------------------------------------
   5. FUTURISTIC COURSE CARDS 3D TILT
   -------------------------------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   7. SOFTWARE-TO-REALITY ANIMATION LAB
   -------------------------------------------------------------------------- */
function initRealityLab() {
  const canvas = document.getElementById('reality-canvas');
  const codeEl = document.getElementById('reality-code-snippet');
  const labelEl = document.getElementById('reality-model-label');
  const langEl = document.getElementById('reality-lang-badge');
  const tabs = document.querySelectorAll('.reality-tab');
  if (!canvas || !codeEl) return;

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = canvas.offsetWidth || 500;
    canvas.height = canvas.offsetHeight || 310;
  }
  resize();
  window.addEventListener('resize', resize);

  const models = {
    car: {
      label: 'MODEL: EV-CHASSIS_V4',
      lang: 'C++ / WebGL',
      code:
        `struct EVChassis {
  float wheelbase = 2.95f;
  vec3 aeroProfile = { 0.21, 1.42, 4.65 };
  bool lidarActive = true;
};

render3DWireframe<EVChassis>("cyan-pink");`
    },
    building: {
      label: 'MODEL: SMART-FACTORY_TWIN',
      lang: 'TypeScript / BIM',
      code:
        `const plant = new DigitalTwin("SmartPlant");
plant.addTower({ floors: 8, safetyAR: true });
plant.connectSensors(["temp", "robotics"]);

plant.compileInteractive3D();`
    },
    cockpit: {
      label: 'MODEL: VR-COCKPIT_SIM',
      lang: 'GLSL / WebXR',
      code:
        `uniform mat4 vrHeadsetMatrix;
void main() {
  vec3 hud = projectARConsole(vrHeadsetMatrix);
  gl_FragColor = neonEmeraldGlow(hud);
}`
    }
  };

  let activeModel = 'car';

  function selectModel(key) {
    activeModel = key;
    codeEl.textContent = models[key].code;
    labelEl.textContent = models[key].label;
    langEl.textContent = models[key].lang;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.model === key));
  }

  tabs.forEach(t => t.addEventListener('click', () => selectModel(t.dataset.model)));
  selectModel('car');

  let rot = 0;
  function drawCubeEdges(cx, cy, s, w, h, d, color) {
    const pts = [
      [-w, -h, -d], [w, -h, -d], [w, h, -d], [-w, h, -d],
      [-w, -h, d], [w, -h, d], [w, h, d], [-w, h, d]
    ].map(([x, y, z]) => {
      const rx = x * Math.cos(rot) - z * Math.sin(rot);
      const rz = x * Math.sin(rot) + z * Math.cos(rot);
      const fov = 4 / (4 + rz);
      return [cx + rx * s * fov, cy + y * s * fov];
    });

    const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 1.6;
    edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
  }

  function animate() {
    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);
    rot += 0.015;
    const cx = cw / 2;
    const cy = ch / 2;

    if (activeModel === 'car') {
      drawCubeEdges(cx, cy + 18, 62, 1.55, 0.35, 0.72, '#00f5d4');
      drawCubeEdges(cx, cy - 18, 56, 0.85, 0.32, 0.62, '#ff2a85');
    } else if (activeModel === 'building') {
      drawCubeEdges(cx - 48, cy + 12, 58, 0.55, 1.1, 0.55, '#00f5d4');
      drawCubeEdges(cx + 42, cy + 28, 58, 0.75, 0.75, 0.65, '#f5b841');
      drawCubeEdges(cx, cy - 28, 52, 0.4, 0.4, 0.4, '#ff2a85');
    } else {
      drawCubeEdges(cx, cy, 68, 1.1, 0.7, 0.85, '#00f5d4');
      ctx.strokeStyle = '#ff2a85';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 115, 42, rot * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   2. AI ASSISTANT HOLOGRAM
   -------------------------------------------------------------------------- */
function initAIHologram() {
  const chips = document.querySelectorAll('.ai-chip');
  const headline = document.getElementById('ai-headline');
  const message = document.getElementById('ai-message');
  const core = document.getElementById('holo-core');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      headline.textContent = chip.dataset.headline || '';
      message.textContent = chip.dataset.msg || '';
      core.classList.add('pulse-react');
      setTimeout(() => core.classList.remove('pulse-react'), 320);
    });
  });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE 3D DIGITAL GLOBE
   -------------------------------------------------------------------------- */
function initDigitalGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth || 540;
    canvas.height = canvas.offsetHeight || 410;
  }
  resize();
  window.addEventListener('resize', resize);

  // Generate Fibonacci sphere points
  const totalPts = 220;
  const pts = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < totalPts; i++) {
    const y = 1 - (i / (totalPts - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    pts.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      hub: i % 19 === 0
    });
  }

  let rotY = 0;
  let rotX = 0.22;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('mousedown', e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener('mouseup', () => (dragging = false));
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    rotY += (e.clientX - lastX) * 0.008;
    rotX += (e.clientY - lastY) * 0.006;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  function animate() {
    const gw = canvas.width;
    const gh = canvas.height;
    ctx.clearRect(0, 0, gw, gh);

    if (!dragging) rotY += 0.0045;

    const cx = gw / 2;
    const cy = gh / 2;
    const R = Math.min(gw, gh) * 0.36;

    // Outer atmosphere glow
    const atm = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.2);
    atm.addColorStop(0, 'rgba(0, 245, 212, 0.14)');
    atm.addColorStop(1, 'transparent');
    ctx.fillStyle = atm;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2);
    ctx.fill();

    const projected = pts.map(p => {
      const x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
      const z1 = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
      const y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);
      return { sx: cx + x1 * R, sy: cy + y2 * R, z: z2, hub: p.hub };
    });

    // Connection arcs between visible hubs
    const hubs = projected.filter(p => p.hub && p.z > -0.1);
    ctx.lineWidth = 1;
    for (let i = 0; i < hubs.length - 1; i++) {
      const a = hubs[i];
      const b = hubs[i + 1];
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 245, 212, 0.4)' : 'rgba(255, 42, 133, 0.42)';
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.quadraticCurveTo(cx, cy - R * 0.35, b.sx, b.sy);
      ctx.stroke();
    }

    // Draw sphere nodes
    projected.forEach(p => {
      const alpha = (p.z + 1) / 2;
      if (p.hub) {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 42, 133, ${0.4 + alpha * 0.6})`;
        ctx.shadowColor = '#ff2a85';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 212, ${0.15 + alpha * 0.7})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   10. FOOTER DIGITAL PARTICLES
   -------------------------------------------------------------------------- */
function initFooterParticles() {
  const canvas = document.getElementById('footer-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || 280;
  }
  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: 32 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vy: -0.25 - Math.random() * 0.4,
    r: Math.random() * 1.8 + 0.8,
    color: Math.random() > 0.35 ? '#00f5d4' : '#ff2a85'
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.y += d.vy;
      if (d.y < 0) {
        d.y = canvas.height;
        d.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = 0.5;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   CREATIVE CURSOR DRONE COMPANION
   -------------------------------------------------------------------------- */
function initCursorDrone() {
  const drone = document.getElementById('cursor-drone');
  const bodyWrap = document.getElementById('drone-body-wrap');
  const hudTag = document.getElementById('drone-hud-tag');
  const trailCanvas = document.getElementById('drone-trail-canvas');
  if (!drone || !bodyWrap || !trailCanvas) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  const ctx = trailCanvas.getContext('2d');
  function resize() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Target cursor position & drone physics state
  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: target.x, y: target.y };
  const vel = { x: 0, y: 0 };
  const sparks = [];
  const pulses = [];
  let hoverTime = 0;

  window.addEventListener('mousemove', e => {
    // Center the drone directly on the cursor coordinates
    target.x = e.clientX;
    target.y = e.clientY;
    if (!drone.classList.contains('visible')) {
      drone.classList.add('visible');
    }

    const interactive = e.target.closest('a, button, .course-card, .mini-feature-card, .ai-chip, .reality-tab');
    if (interactive) {
      drone.classList.add('locked');
      if (hudTag) hudTag.textContent = 'LOCKED // SCAN';
    } else {
      drone.classList.remove('locked');
      if (hudTag) hudTag.textContent = 'DRONE-01 // TRACK';
    }
  });

  document.addEventListener('mouseleave', () => {
    drone.classList.remove('visible');
  });

  window.addEventListener('mousedown', e => {
    pulses.push({
      x: e.clientX,
      y: e.clientY,
      r: 4,
      alpha: 0.9,
      color: drone.classList.contains('locked') ? '#ff2a85' : '#00f5d4'
    });
  });

  function animate() {
    hoverTime += 0.06;

    // Responsive spring-damper physics so the drone feels crisp as the cursor
    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    vel.x = vel.x * 0.62 + dx * 0.24;
    vel.y = vel.y * 0.62 + dy * 0.24;
    pos.x += vel.x;
    pos.y += vel.y;

    const speed = Math.hypot(vel.x, vel.y);
    const bobY = speed < 0.8 ? Math.sin(hoverTime) * 2.2 : 0;
    const tilt = Math.max(-22, Math.min(22, vel.x * 1.45));

    drone.style.transform = `translate3d(${pos.x - 39}px, ${pos.y - 30 + bobY}px, 0)`;
    bodyWrap.style.transform = `rotate(${tilt.toFixed(2)}deg)`;

    // Emit thruster sparks when moving
    if (speed > 1.2 && drone.classList.contains('visible')) {
      sparks.push({
        x: pos.x + (Math.random() - 0.5) * 14,
        y: pos.y + 8 + bobY,
        vx: -vel.x * 0.18 + (Math.random() - 0.5) * 0.8,
        vy: -vel.y * 0.18 + Math.random() * 0.9,
        r: Math.random() * 2.2 + 1.1,
        alpha: 0.85,
        color: drone.classList.contains('locked') ? '#ff2a85' : (Math.random() > 0.35 ? '#00f5d4' : '#f5b841')
      });
    }

    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    // Draw thruster trail sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.035;
      if (s.alpha <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    // Draw click sonar pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.r += 3.2;
      p.alpha -= 0.04;
      if (p.alpha <= 0) {
        pulses.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }

  animate();
}
