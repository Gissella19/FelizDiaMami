const appShell = document.querySelector(".app-shell");
const flower = document.querySelector(".sunflower");
const canvas = document.getElementById("flower-canvas");
const controlsPanel = document.getElementById("flower-controls");
const controlsToggle = document.getElementById("controls-toggle");

window.addEventListener("DOMContentLoaded", () => {
  if (appShell) appShell.classList.add("is-ready");
  if (flower) startFloatingAnimation(flower);
  if (canvas) initFlowerCanvas(canvas);
  initBeeThoughts();
  if (controlsToggle && controlsPanel) {
    controlsToggle.addEventListener("click", () => {
      const isOpen = controlsPanel.classList.toggle("is-open");
      controlsToggle.setAttribute("aria-expanded", String(isOpen));
      controlsToggle.textContent = isOpen ? "Cerrar" : "Ajustes";
    });
  }
});

function startFloatingAnimation(element) {
  let direction = 1;
  let offset = 0;

  setInterval(() => {
    offset += 0.2 * direction;
    if (offset > 6) direction = -1;
    if (offset < -6) direction = 1;
    element.style.transform = `translateX(-50%) translateY(${offset}px)`;
  }, 30);
}

function initBeeThoughts() {
  const thoughts = [
    "te quiero",
    "❤",
    "eres la mejor mamá",
    "te mereces esto y más",
    "te amo",
    "mami hermosa"
  ];

  const bees = document.querySelectorAll(".bee");
  let currentBeeIndex = 0;

  function createThoughtForBee() {
    // Ciclar a través de las abejas
    const bee = bees[currentBeeIndex];
    currentBeeIndex = (currentBeeIndex + 1) % bees.length;

    if (!bee) return;

    // Eliminar pensamiento anterior si existe
    const oldThought = bee.querySelector(".bee-thought");
    if (oldThought) oldThought.remove();

    // Crear contenedor de pensamiento
    const thought = document.createElement("div");
    thought.className = `bee-thought thought-${currentBeeIndex % 3 + 1}`;
    
    // Seleccionar pensamiento aleatorio
    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    
    // HTML de la burbuja
    thought.innerHTML = `<div class="thought-bubble">${randomThought}</div>`;

    // Posicionar encima de la abeja
    thought.style.position = "absolute";
    thought.style.left = "50%";
    thought.style.top = "-32px";
    thought.style.transform = "translateX(-50%)";
    thought.style.whiteSpace = "nowrap";

    bee.appendChild(thought);

    // Limpiar elemento después de la animación
    setTimeout(() => {
      if (thought.parentNode) {
        thought.remove();
      }
    }, 3800);
  }

  // Generar pensamientos cada 3.5 segundos en orden
  setInterval(() => {
    createThoughtForBee();
  }, 3500);

  // Primer pensamiento después de 1.5 segundos
  setTimeout(() => {
    createThoughtForBee();
  }, 1500);
}

function initFlowerCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  // controls
  const ctrlPetals = document.getElementById('ctrl-petals');
  const ctrlDensity = document.getElementById('ctrl-density');
  const ctrlWidth = document.getElementById('ctrl-width');
  const ctrlColor2 = document.getElementById('ctrl-color2');
  const ctrlColor3 = document.getElementById('ctrl-color3');
  const btnAnimate = document.getElementById('btn-animate');

  let drawProgress = 1; // 0..1 progressive draw
  let animating = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawPetal(ctx, x, y, angle, length, width, fillStyle, strokeStyle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.quadraticCurveTo(width * 0.6, -length * 0.25, width * 0.3, -length);
    ctx.quadraticCurveTo(0, -length * 1.06, -width * 0.3, -length);
    ctx.quadraticCurveTo(-width * 0.6, -length * 0.25, 0, -6);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    if (strokeStyle) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLeafShape(x, y, width, height, angle, fillStyle, veinStyle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(width * 0.2, -height * 0.8, width * 0.95, -height * 0.75, width, 0);
    ctx.bezierCurveTo(width * 0.95, height * 0.45, width * 0.25, height * 0.92, 0, 0);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(16, 85, 61, 0.9)';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, 3);
    ctx.quadraticCurveTo(width * 0.45, -height * 0.1, width - 6, 4);
    ctx.strokeStyle = veinStyle;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  function drawMiniFlower(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.translate(Math.cos(a) * 7, Math.sin(a) * 7);
      ctx.rotate(a + Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, -8, 3.4, 9, 0, 0, Math.PI * 2);
      const g = ctx.createLinearGradient(0, -2, 0, -14);
      g.addColorStop(0, '#ffe37d');
      g.addColorStop(1, '#d99d1d');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = 'rgba(110, 68, 18, 0.55)';
      ctx.stroke();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
    const core = ctx.createRadialGradient(0, 0, 1, 0, 0, 4.2);
    core.addColorStop(0, '#7a4917');
    core.addColorStop(1, '#3d230a');
    ctx.fillStyle = core;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 4.2);
    ctx.lineTo(0, 18);
    ctx.strokeStyle = '#1f8b74';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(-4.6, 15, 4.8, 2.5, -0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#138f63';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4.6, 15, 4.8, 2.5, 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function draw() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = 124; // center y for petals

    // params from controls
    const outerCount = parseInt(ctrlPetals ? ctrlPetals.value : 36, 10) || 36;
    const outerRadius = parseInt(ctrlDensity ? ctrlDensity.value : 76, 10) || 76;
    const petalWidth = parseInt(ctrlWidth ? ctrlWidth.value : 20, 10) || 20;
    const color2 = ctrlColor2 ? ctrlColor2.value : '#f7bc2a';
    const color3 = ctrlColor3 ? ctrlColor3.value : '#e4a315';
    const color1 = '#fff2bb';
    const coreStart = '#5b330d';
    const coreEnd = '#3d230a';

    // stem first so it stays behind the crown like the reference
    const stemTop = cy + 22;
    ctx.beginPath();
    ctx.moveTo(cx, stemTop);
    ctx.lineTo(cx, h - 18);
    ctx.lineWidth = 10;
    const stemGrad = ctx.createLinearGradient(cx, stemTop, cx, h - 18);
    stemGrad.addColorStop(0, '#31a58d');
    stemGrad.addColorStop(1, '#106554');
    ctx.strokeStyle = stemGrad;
    ctx.lineCap = 'round';
    ctx.stroke();

    // leaves sit on top of the stem but still below the crown
    drawLeafShape(cx - 26, h * 0.72, 60, 40, -0.24, '#138f63', 'rgba(255,255,255,0.15)');
    drawLeafShape(cx + 14, h * 0.68, 60, 40, 0.25, '#138f63', 'rgba(255,255,255,0.15)');

    // outer crown petals
    const drawCount = Math.max(1, Math.floor(outerCount * drawProgress));
    for (let i = 0; i < drawCount; i++) {
      const a = (i / outerCount) * Math.PI * 2 - Math.PI / 2;
      const px = cx + Math.cos(a) * 8;
      const py = cy + Math.sin(a) * 8;
      const angle = a + Math.PI / 2;
      // petal gradient using canvas gradient
      const g = ctx.createLinearGradient(0, -10, 0, -60);
      g.addColorStop(0, color1);
      g.addColorStop(0.5, color2);
      g.addColorStop(1, color3);
      drawPetal(ctx, px, py, angle, outerRadius, petalWidth, g, 'rgba(110,68,18,0.9)');
    }

    // inner crown petals to restore fullness like the reference
    const innerCount = 24;
    for (let i = 0; i < innerCount; i++) {
      const a = (i / innerCount) * Math.PI * 2 - Math.PI / 2 + (Math.PI / innerCount) * 0.35;
      const px = cx + Math.cos(a) * 5;
      const py = cy + Math.sin(a) * 5;
      const angle = a + Math.PI / 2;
      const innerGradient = ctx.createLinearGradient(0, -6, 0, -42);
      innerGradient.addColorStop(0, '#fff0a8');
      innerGradient.addColorStop(0.55, '#f3b826');
      innerGradient.addColorStop(1, '#d99611');
      drawPetal(ctx, px, py, angle, 50, 14, innerGradient, 'rgba(110,68,18,0.82)');
    }

    // central core
    const coreX = cx;
    const coreY = cy - 1;
    const coreR = 44;
    const coreGrad = ctx.createRadialGradient(coreX, coreY, 4, coreX, coreY, coreR);
    coreGrad.addColorStop(0, coreStart);
    coreGrad.addColorStop(0.25, '#7a4917');
    coreGrad.addColorStop(0.6, '#6d3f12');
    coreGrad.addColorStop(1, coreEnd);
    ctx.beginPath();
    ctx.arc(coreX, coreY, coreR, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(86,49,13,0.6)';
    ctx.stroke();

    // dense seed texture like the reference
    ctx.fillStyle = 'rgba(60, 30, 10, 0.72)';
    for (let ring = 0; ring < 13; ring++) {
      const radius = 3.5 + ring * 2.95;
      const seeds = 26 + ring * 14;
      for (let i = 0; i < seeds; i++) {
        const a = (i / seeds) * Math.PI * 2 + ring * 0.22;
        const sx = coreX + Math.cos(a) * radius;
        const sy = coreY + Math.sin(a) * radius * 0.95;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.75 + ring * 0.03, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.beginPath();
    ctx.arc(coreX, coreY, 12, 0, Math.PI * 2);
    const centerDot = ctx.createRadialGradient(coreX, coreY, 1, coreX, coreY, 12);
    centerDot.addColorStop(0, '#5c3412');
    centerDot.addColorStop(1, '#3b220a');
    ctx.fillStyle = centerDot;
    ctx.fill();

    // mini flower on the left like the reference image
    drawMiniFlower(cx - 162, cy + 18, 0.64);
  }

  // resize observer to react to layout changes
  const ro = new ResizeObserver(() => {
    resize();
    draw();
  });
  ro.observe(canvas);

  // wire control events
  function scheduleDraw() { draw(); }
  [ctrlPetals, ctrlDensity, ctrlWidth, ctrlColor2, ctrlColor3].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
      drawProgress = 1;
      animating = false;
      scheduleDraw();
    });
  });

  btnAnimate && btnAnimate.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    drawProgress = 0;
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      drawProgress = t;
      if (t < 1) requestAnimationFrame(tick);
      else animating = false;
    }
    requestAnimationFrame(tick);
  });

  // initial
  resize();
  draw();

  // continuous subtle redraw
  function loop() {
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
