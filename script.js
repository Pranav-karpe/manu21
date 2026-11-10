/* ============================================================
   HAPPY 21ST BIRTHDAY LOVELY MANU 💜
   Single-Viewport Flow with 5-Second Transition & Serial 21 Wishes
   Crafted with all the love by Pranav Karpe
   ============================================================ */

const $ = (id) => document.getElementById(id);

/* ============================================================
   1. PROCEDURAL SOUND ENGINE (WEB AUDIO API)
   ============================================================ */
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playMagicalChime() {
  try {
    const actx = getAudioContext();
    if (!actx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, i) => {
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, actx.currentTime + i * 0.07);
      gain.gain.setValueAtTime(0.14, actx.currentTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + i * 0.07 + 0.55);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime + i * 0.07);
      osc.stop(actx.currentTime + i * 0.07 + 0.6);
    });
  } catch (e) {
    console.warn(e);
  }
}

/* ============================================================
   2. CONTINUOUS BACKGROUND MUSIC (STARTS IMMEDIATELY ON LOAD)
   ============================================================ */
const bgSong = $('bgSong');
const musicToggle = $('music-toggle');
const musicLabel = $('music-label');
let musicStarted = false;

function syncMusicUI(playing) {
  musicToggle.classList.toggle('music-playing', playing);
  musicLabel.textContent = playing ? 'Music: On' : 'Music: Off';
}

function tryStartMusicImmediate() {
  if (bgSong && !musicStarted) {
    bgSong.volume = 0.85;
    const playPromise = bgSong.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicStarted = true;
        syncMusicUI(true);
      }).catch((e) => {
        console.log('Browser autoplay policy deferred playback until first interaction:', e);
      });
    }
  }
}

// Start immediately on load
tryStartMusicImmediate();

// Also unlock immediately upon ANY user interaction with the window
['click', 'pointerdown', 'touchstart', 'keydown', 'mousemove'].forEach((evt) => {
  window.addEventListener(evt, tryStartMusicImmediate, { once: true, passive: true });
});

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgSong.paused) {
    bgSong.volume = 0.85;
    bgSong.play().then(() => syncMusicUI(true)).catch(console.warn);
  } else {
    bgSong.pause();
    syncMusicUI(false);
  }
});

/* Fullscreen Toggle */
const fullscreenBtn = $('project-fullscreen');
fullscreenBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      fullscreenBtn.classList.add('is-fullscreen');
    }).catch(console.warn);
  } else {
    document.exitFullscreen().then(() => {
      fullscreenBtn.classList.remove('is-fullscreen');
    }).catch(console.warn);
  }
});
document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.classList.toggle('is-fullscreen', Boolean(document.fullscreenElement));
});

/* ============================================================
   3. CURSOR TRAILING SPARKLING HEARTS (RICH, DENSE & HIGHLY VISIBLE)
   ============================================================ */
let lastCursorX = 0;
let lastCursorY = 0;
let lastCursorTime = 0;
const cursorIcons = ['💜', '💖', '💕', '🌸', '✨', '🤍', '🧁', '🌷', '💝'];

function spawnCursorHearts(x, y, count = 2) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'cursor-heart-particle';
    particle.textContent = cursorIcons[Math.floor(Math.random() * cursorIcons.length)];

    const scatterX = (Math.random() - 0.5) * 28;
    const scatterY = (Math.random() - 0.5) * 28;
    const size = 13 + Math.random() * 4.5; // Small, dainty & elegant!
    const rot = (Math.random() - 0.5) * 55;

    particle.style.left = `${x + scatterX}px`;
    particle.style.top = `${y + scatterY}px`;
    particle.style.fontSize = `${size}px`;
    particle.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1100);
  }
}

window.addEventListener('mousemove', (e) => {
  const now = performance.now();
  const dx = e.clientX - lastCursorX;
  const dy = e.clientY - lastCursorY;
  const dist = Math.hypot(dx, dy);

  // Spawn whenever mouse moves at least 6px or every 22ms
  if (dist > 6 || now - lastCursorTime > 22) {
    lastCursorTime = now;
    lastCursorX = e.clientX;
    lastCursorY = e.clientY;
    
    // Spawn 2-3 visible glowing hearts on each move!
    spawnCursorHearts(e.clientX, e.clientY, dist > 20 ? 3 : 2);
  }
});

/* ============================================================
   4. THREE.JS 3D FLOATING HEARTS (WITH CANVAS 2D FAILSAFE FALLBACK)
   ============================================================ */
function initHeartFieldCanvas2D(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    });

    const icons = ['💜', '💖', '🌸', '✨', '💕', '🤍', '🧁'];
    const items = Array.from({ length: 65 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vy: 0.45 + Math.random() * 0.85,
      vx: (Math.random() - 0.5) * 0.4,
      size: 16 + Math.random() * 22,
      alpha: 0.35 + Math.random() * 0.45,
      icon: icons[Math.floor(Math.random() * icons.length)],
    }));

    function loop() {
      ctx.clearRect(0, 0, W, H);
      items.forEach((it) => {
        it.y -= it.vy;
        it.x += it.vx;
        if (it.y < -30) {
          it.y = H + 30;
          it.x = Math.random() * W;
        }
        ctx.save();
        ctx.globalAlpha = it.alpha;
        ctx.font = `${it.size}px sans-serif`;
        ctx.fillText(it.icon, it.x, it.y);
        ctx.restore();
      });
      requestAnimationFrame(loop);
    }
    loop();
  } catch (err) {
    console.warn('Canvas 2D fallback error:', err);
  }
}

(function initHeartField() {
  const canvas = $('heart-field');
  if (!canvas) return;

  try {
    if (typeof THREE === 'undefined') {
      throw new Error('THREE.js library is not available, activating 2D fallback');
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    function makeHeartTexture(color) {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      ctx.translate(64, 20);
      ctx.beginPath();
      const topCurveHeight = 40;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, topCurveHeight - 40, -64, topCurveHeight - 40, -64, topCurveHeight);
      ctx.bezierCurveTo(-64, topCurveHeight + 30, -20, topCurveHeight + 66, 0, topCurveHeight + 96);
      ctx.bezierCurveTo(20, topCurveHeight + 66, 64, topCurveHeight + 30, 64, topCurveHeight);
      ctx.bezierCurveTo(64, topCurveHeight - 40, 0, topCurveHeight - 40, 0, topCurveHeight);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }

    const palette = ['#c084fc', '#f472b6', '#a855f7', '#ffffff', '#fbcfe8', '#e9d5ff', '#ec4899'];
    const textures = palette.map(makeHeartTexture);

    const COUNT = window.innerWidth < 700 ? 55 : 100;
    const group = new THREE.Group();
    const hearts = [];

    for (let i = 0; i < COUNT; i++) {
      const tex = textures[i % textures.length];
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.42 + Math.random() * 0.42,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      const scale = 0.45 + Math.random() * 1.25;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set(
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 18
      );
      sprite.userData = {
        speed: 0.12 + Math.random() * 0.38,
        drift: (Math.random() - 0.5) * 0.35,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      };
      group.add(sprite);
      hearts.push(sprite);
    }
    scene.add(group);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      hearts.forEach((h) => {
        h.position.y += h.userData.speed * 0.018;
        h.position.x += h.userData.drift * 0.018;
        if (h.material && typeof h.material.rotation === 'number') {
          h.material.rotation += h.userData.rotSpeed;
        }
        if (h.position.y > 14) {
          h.position.y = -14;
          h.position.x = (Math.random() - 0.5) * 36;
        }
        if (h.position.x > 19) h.position.x = -19;
        if (h.position.x < -19) h.position.x = 19;
      });

      group.rotation.y += (mouseX * 0.15 - group.rotation.y) * 0.02;
      group.rotation.x += (-mouseY * 0.08 - group.rotation.x) * 0.02;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (err) {
    console.warn('WebGL Heart field initialization fallback to Canvas 2D:', err);
    initHeartFieldCanvas2D(canvas);
  }
})();

/* Sparkles & Petal Float Layers */
(function initSparklesAndPetals() {
  const overlay = $('sparkle-overlay');
  if (overlay) {
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle-dot';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = Math.random() * 3 + 's';
      s.style.animationDuration = 1.5 + Math.random() * 2 + 's';
      const sz = 2 + Math.random() * 4;
      s.style.width = sz + 'px';
      s.style.height = sz + 'px';
      overlay.appendChild(s);
    }
  }

  const petalLayer = $('petal-layer');
  if (petalLayer) {
    const colors = ['#f472b6', '#c084fc', '#fbcfe8', '#e9d5ff', '#ffffff'];
    function createPetal() {
      const p = document.createElement('div');
      p.className = 'petal-item';
      p.style.left = Math.random() * 100 + '%';
      p.style.opacity = 0.35 + Math.random() * 0.45;
      const sz = 12 + Math.random() * 16;
      p.style.width = sz + 'px';
      p.style.height = sz + 'px';
      const dur = 6 + Math.random() * 7;
      p.style.animationDuration = dur + 's';
      p.style.setProperty('--drift', Math.random() * 80 - 40 + 'px');
      p.style.setProperty('--rot', Math.random() * 720 + 'deg');
      const c = colors[Math.floor(Math.random() * colors.length)];
      p.style.background = `radial-gradient(ellipse, ${c} 30%, transparent 100%)`;
      petalLayer.appendChild(p);
      setTimeout(() => {
        p.remove();
        createPetal();
      }, dur * 1000);
    }
    for (let i = 0; i < 20; i++) {
      setTimeout(createPetal, i * 350);
    }
  }
})();

/* ============================================================
   5. SINGLE-VIEWPORT STAGE MANAGER (WITH 4-SECOND TRANSITION)
   ============================================================ */
let currentStageIndex = 0;
const stages = [
  $('stage-0'),
  $('stage-1'),
  $('stage-2'),
  $('stage-3'),
  $('stage-4'),
];
const magicVeil = $('magicVeil');
const veilTitle = $('veilTitle');
const veilSub = $('veilSub');
const veilTimerProg = $('veilTimerProg');
const veilPercentLabel = $('veilPercentLabel');

let veilTickerInterval = null;

function triggerLoveTransitionEffect() {
  playMagicalChime();
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.style.cssText = `position:fixed;left:${Math.random() * 80 + 10}vw;top:${Math.random() * 80 + 10}vh;font-size:${24 + Math.random() * 26}px;pointer-events:none;z-index:99999;`;
    el.textContent = ['💜', '🌸', '✨', '💖', '💕'][Math.floor(Math.random() * 5)];
    document.body.appendChild(el);

    if (typeof gsap !== 'undefined') {
      gsap.to(el, {
        y: -60 - Math.random() * 80,
        scale: 1.6,
        opacity: 0,
        duration: 0.9 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => el.remove(),
      });
    } else {
      setTimeout(() => el.remove(), 900);
    }
  }
}

// Instantly wipe all party paper / confetti so screens remain completely clean
function clearAllPartyPaper() {
  if (typeof confetti === 'function' && typeof confetti.reset === 'function') {
    confetti.reset();
  }
}

// Gentle celebratory sparkle that clears automatically
function triggerConfettiBurst() {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.65 },
    colors: ['#f472b6', '#c084fc', '#ffd700', '#ffffff'],
    ticks: 110,
    gravity: 1.2,
  });
  setTimeout(clearAllPartyPaper, 1400);
}

// 5-SECOND TRANSITION VEIL WITH CONTINUOUS GREEN 0% -> 100% PROGRESS BAR
let veilAnimFrameId = null;

function showTransitionVeil(title, subtitle, durationMs = 5000, onComplete) {
  clearAllPartyPaper(); // Ensure no leftover party paper covers the transition!

  if (veilAnimFrameId) {
    cancelAnimationFrame(veilAnimFrameId);
    veilAnimFrameId = null;
  }

  const veilEl = $('magicVeil');
  const titleEl = $('veilTitle');
  const subEl = $('veilSub');
  const progEl = $('veilTimerProg');
  const pctEl = $('veilPercentLabel');

  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = subtitle;

  // Immediately initialize to 0%
  if (progEl) {
    progEl.style.transition = 'none';
    progEl.style.width = '0%';
  }
  if (pctEl) {
    pctEl.textContent = '0%';
  }

  if (veilEl) veilEl.classList.add('veil-active');
  triggerLoveTransitionEffect();

  const startTs = performance.now();

  function tick(now) {
    const elapsed = now - startTs;
    const fraction = Math.min(Math.max(elapsed / durationMs, 0), 1);
    const pct = Math.floor(fraction * 100);

    // Frame-by-frame direct update: smooth, lag-free & impossible to freeze!
    if (progEl) {
      progEl.style.width = `${fraction * 100}%`;
    }
    if (pctEl) {
      pctEl.textContent = `${pct}%`;
    }

    if (fraction < 1) {
      veilAnimFrameId = requestAnimationFrame(tick);
    } else {
      // REACHED EXACTLY 100% AT 5 SECONDS!
      if (pctEl) pctEl.textContent = '100%';
      if (progEl) progEl.style.width = '100%';
      veilAnimFrameId = null;

      // Switch underlying stage content now that progress reached 100%
      if (typeof onComplete === 'function') {
        onComplete();
      }

      // Smoothly unveil the new screen
      setTimeout(() => {
        if (veilEl) veilEl.classList.remove('veil-active');
      }, 350);
    }
  }

  // Kick off frame loop
  veilAnimFrameId = requestAnimationFrame(tick);
}

function goToStage(index, durationMs = 5000) {
  if (index < 0 || index >= stages.length) return;
  currentStageIndex = index;

  clearAllPartyPaper(); // Clean screen before switching stage
  tryStartMusicImmediate();

  // Dim background Three.js hearts specifically in Stage 3 so the blossom tree has crystal clarity
  document.body.classList.toggle('stage-3-active', index === 3);

  showTransitionVeil(
    veilTitle.textContent,
    veilSub.textContent,
    durationMs,
    () => {
      stages.forEach((st, i) => {
        st.classList.toggle('active-stage', i === index);
      });

      // Stage 2: Initial wish card spring pop-up entrance
      if (index === 2) {
        renderDeckWish(0);
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(
            currentDeckCard,
            { scale: 0.72, opacity: 0, y: 25 },
            { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.8)' }
          );
        }
      }

      // Stage 3: Auto-trigger the blossom tree engine
      if (index === 3) {
        startTreeEngine();
      }
    }
  );
}

window.goToStage = goToStage;

function safeBindClick(id, handler) {
  const el = $(id);
  if (el) {
    el.addEventListener('click', handler);
  }
}

/* Stage Navigation Buttons (Each with 5-second wait & green progress line) */

// 1. Stage 0 -> Stage 1: Make a Birthday Wish
safeBindClick('btnGoToCandle', () => {
  veilTitle.textContent = 'Sending Birthday Magic to Lovely Manu… ✨';
  veilSub.textContent = 'Close your eyes, Lovely… take a gentle breath and feel all the blessings around you. Your 21st year is going to bring every dream of yours to life 💜';
  goToStage(1, 5000); // 5 seconds wait with green line!
});

// 2. Stage 1 -> Stage 2: 21 Wishes Deck
safeBindClick('btnGoToCards', () => {
  veilTitle.textContent = 'Unlocking 21 Special Wishes For You 💌';
  veilSub.textContent = '21 personal wishes crafted with care by Pranav for my girl Manu — the sweetest cutie pie turning 21 today 🌸';
  goToStage(2, 5000); // 5 seconds wait with green line!
});

// 3. Stage 2 -> Stage 3: Sacred Blossom Tree
safeBindClick('btnGoToTree', () => {
  veilTitle.textContent = 'Growing Your Sacred Heart Blossom Tree 🌸';
  veilSub.textContent = 'In a world of 8 billion souls, this tree blooms especially for my girl Manu… forming an eternal heart of radiant beauty and sunshine ✨';
  goToStage(3, 5000); // 5 seconds wait with green line!
});

// 4. Stage 3 -> Stage 4: Pranav's Birthday Letter
safeBindClick('btnGoToLetter', () => {
  veilTitle.textContent = 'Unsealing Pranav’s Birthday Letter to Manu 📜';
  veilSub.textContent = 'A personal heartfelt letter for my girl… celebrating your pure cuteness, radiant beauty, and the god-sent angel that you are 🤎';
  goToStage(4, 5000); // 5 seconds wait with green line!
});

// Restart Film
safeBindClick('btnRestartApp', () => {
  veilTitle.textContent = 'Restarting Manu’s 21st Birthday Film ↺';
  veilSub.textContent = 'Reliving every sweet wish, every bloom, and every smile once again… 🌸';
  goToStage(0, 5000); // 5 seconds wait with green line!
});

/* ============================================================
   6. STAGE 1: DUAL-PHASE CANDLE BLOWOUT CEREMONY & HEAVY PARTY BOMBS
   ============================================================ */
const btnBlowCandle = $('btnBlowCandle');
const candleBox = $('candleBox');
const candleFlame = $('candleFlame');
const phaseCandleBlow = $('phaseCandleBlow');
const phaseSwamiBlessing = $('phaseSwamiBlessing');
let candleBlown = false;

// MASSIVE PARTY POPPERS / PAPER BOMB EXPLOSION (HEAVY QUANTITY FROM BOTH SIDES)
function triggerHeavyPartyBombConfetti() {
  if (typeof confetti !== 'function') return;

  const colors = ['#f472b6', '#c084fc', '#ffd700', '#34d399', '#ffffff', '#ec4899', '#38bdf8', '#fb7185'];

  // Wave 1: Immediate massive twin cannon blast from left & right corners shooting inwards!
  confetti({
    particleCount: 160,
    angle: 55,
    spread: 80,
    origin: { x: 0, y: 0.78 },
    startVelocity: 68,
    colors: colors,
    ticks: 130,
    gravity: 1.1,
  });
  confetti({
    particleCount: 160,
    angle: 125,
    spread: 80,
    origin: { x: 1, y: 0.78 },
    startVelocity: 68,
    colors: colors,
    ticks: 130,
    gravity: 1.1,
  });

  // Wave 2 at 180ms: Higher arched party pop
  setTimeout(() => {
    confetti({
      particleCount: 130,
      angle: 65,
      spread: 85,
      origin: { x: 0.05, y: 0.8 },
      startVelocity: 72,
      colors: colors,
      ticks: 130,
      gravity: 1.1,
    });
    confetti({
      particleCount: 130,
      angle: 115,
      spread: 85,
      origin: { x: 0.95, y: 0.8 },
      startVelocity: 72,
      colors: colors,
      ticks: 130,
      gravity: 1.1,
    });
  }, 180);

  // Wave 3 at 360ms: Central starburst shower
  setTimeout(() => {
    confetti({
      particleCount: 130,
      spread: 360,
      origin: { x: 0.5, y: 0.45 },
      startVelocity: 50,
      colors: colors,
      ticks: 120,
      gravity: 1.1,
    });
  }, 360);

  // DISAPPEAR IMMEDIATELY: Clear all party paper after cheering so screen stays spotless!
  setTimeout(clearAllPartyPaper, 1900);
}

function blowOutCandle() {
  if (candleBlown) return;
  candleBlown = true;

  candleBox.classList.add('candle-blown');
  btnBlowCandle.disabled = true;
  btnBlowCandle.innerHTML = '<span>✨ Wish Sealed with the Universe! ✨</span>';
  $('candleHint').textContent = 'The flame is out! Swami is processing your wish! 🪔✨';

  playMagicalChime();

  // Fire heavy party bombs immediately!
  triggerHeavyPartyBombConfetti();

  // After the heavy party bombs explosion, show the 5-second 0%->100% green line transition!
  setTimeout(() => {
    showTransitionVeil(
      'Swami is Processing Your Wish 🪔✨',
      'Whispering your sacred prayers to the universe… Swami is always with you, holding your hand 🌸',
      5000,
      () => {
        clearAllPartyPaper();
        phaseCandleBlow.classList.remove('active-phase');
        phaseSwamiBlessing.classList.add('active-phase');
        playMagicalChime();
      }
    );
  }, 1100);
}

btnBlowCandle.addEventListener('click', blowOutCandle);
candleFlame.addEventListener('click', blowOutCandle);

/* ============================================================
   7. STAGE 2: 21 WISHES (SERIAL 1-BY-1 FLIP & PROGRESSION)
   ============================================================ */
const wishes21 = [
  {
    num: '01',
    emoji: '🌟',
    cluster: '🌟 🌸 ✨',
    title: 'May All Your Dreams Come True',
    back: 'May every single dream, big or small, that you hold close to your heart turn into a glowing reality this 21st year.',
    quote: 'Dream big, Lovely! 🌈',
  },
  {
    num: '02',
    emoji: '🌸',
    cluster: '🌸 🌿 🌺',
    title: 'Radiant Health & Vitality',
    back: 'May you always be blessed with glowing health, sound sleep, and boundless energy to conquer every single day with ease.',
    quote: 'Stay blessed & healthy always 🌿',
  },
  {
    num: '03',
    emoji: '😊',
    cluster: '😊 💖 ✨',
    title: 'That World-Healing Smile',
    back: 'May that cute, genuine smile never fade from your face. It has the miraculous power to brighten anyone’s gloomiest day.',
    quote: 'Your smile cures everything 💕',
  },
  {
    num: '04',
    emoji: '✨',
    cluster: '✨ 🥺 💎',
    title: 'Sparkling Tears-Free Eyes',
    back: 'Your beautiful eyes should never, ever have to shed a tear of pain or sorrow. Only tears of pure laughter and joy are allowed.',
    quote: 'Only happy tears for you 🥺',
  },
  {
    num: '05',
    emoji: '🛡️',
    cluster: '🛡️ 🕊️ 🍀',
    title: 'Shield from Life’s Hardships',
    back: 'May the universe protect you from every hardship and difficulty in life. May you glide through every challenge with grace.',
    quote: 'Unshakable grace always 🛡️',
  },
  {
    num: '06',
    emoji: '🚀',
    cluster: '🚀 💼 🌟',
    title: 'Unstoppable Career Success',
    back: 'May you achieve so much grand success in your life and career that you could hardly even handle it! Record breaker in the making!',
    quote: 'Limitless heights await you 🌟',
  },
  {
    num: '07',
    emoji: '🎯',
    cluster: '🎯 👑 🏆',
    title: 'The Dream Placement',
    back: 'The dream job placement, highest package, and stellar internship are already waiting for you with your name on the offer letter.',
    quote: 'Placement queen Manu 💼',
  },
  {
    num: '08',
    emoji: '🍀',
    cluster: '🍀 🌈 ✨',
    title: 'My Permanent Lucky Charm',
    back: 'Having you in my life is living proof that good luck exists. May the world shower you back with 100x that good fortune!',
    quote: 'Forever my lucky charm 🍀',
  },
  {
    num: '09',
    emoji: '💖',
    cluster: '💖 🌸 🕊️',
    title: 'God-Gifted Bala',
    back: 'The purest, sweetest soul with a heart made of 24k gold. May God preserve that childlike innocent goodness in you forever.',
    quote: 'Amchi mast god god manu 🌸',
  },
  {
    num: '10',
    emoji: '🏠',
    cluster: '🏠 ☕ 🧸',
    title: 'Endless Warmth & Comfort',
    back: 'May you always feel safe, respected, deeply cherished, and at home no matter where you go in this wide world.',
    quote: 'You deserve absolute peace 🕊️',
  },
  {
    num: '11',
    emoji: '🎧',
    cluster: '🎧 😂 ♾️',
    title: 'Our Non-Stop Laughs & Smiles',
    back: 'May our silly inside jokes, endless laughs, and goofy memories continue for decades without ever running out of smiles.',
    quote: 'Best wavelength ever ♾️',
  },
  {
    num: '12',
    emoji: '🧠',
    cluster: '🧠 ⚡ 💡',
    title: 'Confidence & Fearless Courage',
    back: 'Whenever self-doubt whispers, may you always remember how brilliant, talented, and fiercely capable you truly are.',
    quote: 'Believe in your magic ✨',
  },
  {
    num: '13',
    emoji: '🧁',
    cluster: '🧁 🍰 🍫',
    title: 'Daily Sweet Surprises',
    back: 'May unexpected sweet moments, favorite desserts, and pleasant surprises find their way to you every single day.',
    quote: 'Sweet life for sweet Manu 🍰',
  },
  {
    num: '14',
    emoji: '☀️',
    cluster: '☀️ 🌻 💛',
    title: 'Pure Sunshine Energy',
    back: 'May your infectious warmth keep touching and uplifting everyone around you. You are literally pure sunshine in human form.',
    quote: 'Keep shining bright ☀️',
  },
  {
    num: '15',
    emoji: '🤝',
    cluster: '🤝 🤎 🛡️',
    title: 'Never Feeling Alone',
    back: 'No matter what happens, what distance exists, or what time it is, remember that Pranav is always just one call away from you.',
    quote: 'Always in your corner 🤎',
  },
  {
    num: '16',
    emoji: '🕊️',
    cluster: '🕊️ ✈️ 🌍',
    title: 'Freedom & Living On Your Terms',
    back: 'May you travel to every city you dream of, fly as high as you desire, and live your life strictly on your own beautiful terms.',
    quote: 'Fly high, Lovely Queen 👑',
  },
  {
    num: '17',
    emoji: '🌸',
    cluster: '🌸 🧁 🎀',
    title: 'World’s Cutest Person Forever',
    back: 'Even when you turn 30, 50, or 80, you will forever remain our number one cutie pie with that world-famous cuteness!',
    quote: 'Unmatched cuteness overload 🧁',
  },
  {
    num: '18',
    emoji: '💰',
    cluster: '💰 💎 🛍️',
    title: 'Limitless Abundance & Wealth',
    back: 'May financial independence, prosperity, luxury, and success overflow into everything you lay your hands on.',
    quote: 'Prosperity in every step 💎',
  },
  {
    num: '19',
    emoji: '🌺',
    cluster: '🌺 👨‍👩‍👧 💖',
    title: 'Family Happiness & Pride',
    back: 'May your family always be blessed with good health, togetherness, and proud tears of joy watching you achieve greatness.',
    quote: 'Pride of everyone who knows you 💖',
  },
  {
    num: '20',
    emoji: '🌟',
    cluster: '🌟 🎂 🎆',
    title: 'A Golden 21st Milestone Year',
    back: 'Stepping into 21 with unmatched elegance and strength. This year will be the most unforgettable chapter of your life yet.',
    quote: '21 is your golden year ✨',
  },
  {
    num: '21',
    emoji: '💍',
    cluster: '💜 💍 🌸',
    title: 'Manu, Be Mine Forever 💍💜',
    back: 'Plz Manu, be mine forever… I promise you with all my heart that I will never let a tear fall from your eyes, and I will give you every bit of happiness this world holds. I love you so, so much dear 🌸✨',
    quote: 'Forever yours, with all my love & soul 🥺💕',
    isSpecial: true,
  },
];

let activeWishIndex = 0;
const cardNumEl = $('cardNum');
const cardEmojiCluster = $('cardEmojiCluster');
const cardTitleEl = $('cardTitle');
const cardBackEl = $('cardBack');
const cardQuoteEl = $('cardQuote');
const currentDeckCard = $('currentDeckCard');
const cardCounter = $('cardCounter');
const cardDotsRail = $('cardDotsRail');
const btnNextWishSerial = $('btnNextWishSerial');
const btnPrevWish = $('btnPrevWish');
const nextWishBtnLabel = $('nextWishBtnLabel');
const wishesFinalAction = $('wishesFinalAction');

// Build 21 dots for deck
wishes21.forEach((_, i) => {
  const d = document.createElement('span');
  d.className = `c-dot ${i === 0 ? 'active' : ''}`;
  d.title = `Wish ${i + 1}`;
  d.addEventListener('click', () => {
    if (i !== activeWishIndex) {
      animateWishCardChange(i, i > activeWishIndex ? 1 : -1);
    }
  });
  cardDotsRail.appendChild(d);
});

function spawnCardLoveHeart() {
  const rect = currentDeckCard.getBoundingClientRect();
  const heart = document.createElement('span');
  heart.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + 30}px;font-size:32px;pointer-events:none;z-index:99999;`;
  heart.textContent = ['💜', '💖', '🌸', '✨', '💕'][Math.floor(Math.random() * 5)];
  document.body.appendChild(heart);

  if (typeof gsap !== 'undefined') {
    gsap.to(heart, {
      y: -90,
      scale: 1.6,
      opacity: 0,
      duration: 1.1,
      ease: 'power2.out',
      onComplete: () => heart.remove(),
    });
  } else {
    setTimeout(() => heart.remove(), 1100);
  }
}

function renderDeckWish(index) {
  if (index < 0) index = 0;
  if (index >= wishes21.length) index = wishes21.length - 1;
  activeWishIndex = index;

  const w = wishes21[index];
  cardEmojiCluster.textContent = w.cluster;
  cardTitleEl.textContent = w.title;
  cardBackEl.textContent = w.back;
  cardQuoteEl.textContent = `“${w.quote}”`;
  cardCounter.textContent = `Wish ${index + 1} of 21`;

  // Update dots rail
  const allDots = cardDotsRail.querySelectorAll('.c-dot');
  allDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.classList.toggle('passed', i < index);
  });

  // Prev button state
  if (btnPrevWish) {
    btnPrevWish.disabled = index === 0;
  }

  // Next button label & final tree trigger
  if (index === wishes21.length - 1) {
    // 21st wish reached! The blossom tree option unlocks!
    currentDeckCard.classList.add('wish-golden-milestone');
    cardNumEl.textContent = '🌟 Wish 21 of 21 · The 21st Golden Milestone 🌟';
    nextWishBtnLabel.textContent = '🌸 Discover Sacred Blossom Tree ➔';
    btnNextWishSerial.classList.add('btn-wish-final-glow');
    wishesFinalAction.style.display = 'block';
    triggerConfettiBurst();
  } else {
    currentDeckCard.classList.remove('wish-golden-milestone');
    cardNumEl.textContent = `Wish ${w.num} of 21`;
    nextWishBtnLabel.textContent = `Next Wish (Wish ${index + 2}) ➔`;
    btnNextWishSerial.classList.remove('btn-wish-final-glow');
    wishesFinalAction.style.display = 'none';
  }
}

function animateWishCardChange(targetIndex, direction = 1) {
  playMagicalChime();
  spawnCardLoveHeart();

  if (typeof gsap !== 'undefined') {
    // Current card pops down slightly and fades
    gsap.to(currentDeckCard, {
      scale: 0.84,
      opacity: 0,
      y: direction > 0 ? -16 : 16,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: () => {
        renderDeckWish(targetIndex);
        // Next card springs up into view like a luxury pop-up greeting card!
        gsap.fromTo(
          currentDeckCard,
          { scale: 0.78, opacity: 0, y: direction > 0 ? 24 : -24 },
          { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.8)' }
        );
      },
    });
  } else {
    renderDeckWish(targetIndex);
  }
}

// Next button handler
btnNextWishSerial.addEventListener('click', (e) => {
  e.stopPropagation();
  if (activeWishIndex < wishes21.length - 1) {
    animateWishCardChange(activeWishIndex + 1, 1);
  } else {
    // Once all 21 wishes are done, go to Blossom tree!
    $('btnGoToTree').click();
  }
});

// Prev button handler
if (btnPrevWish) {
  btnPrevWish.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeWishIndex > 0) {
      animateWishCardChange(activeWishIndex - 1, -1);
    }
  });
}

/* ============================================================
   8. STAGE 3: PROCEDURAL HEART BLOSSOM TREE ENGINE
   ============================================================ */
let treeEngineStarted = false;
function startTreeEngine() {
  if (treeEngineStarted) return;
  treeEngineStarted = true;

  const canvas = $('treeCanvas');
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  let isMobile = W < 860;
  let cx = isMobile ? W * 0.5 : W * 0.74;
  let cy = isMobile ? H * 0.38 : H * 0.44;
  let scale = Math.min(W * (isMobile ? 0.021 : 0.025), H * (isMobile ? 0.022 : 0.026));

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    isMobile = W < 860;
    cx = isMobile ? W * 0.5 : W * 0.74;
    cy = isMobile ? H * 0.38 : H * 0.44;
    scale = Math.min(W * (isMobile ? 0.021 : 0.025), H * (isMobile ? 0.022 : 0.026));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // 5 high-contrast blossom palettes designed for purple background
  const BLOSSOMS = [
    { c0: '#ffffff', c1: '#f472b6', core: '#fef08a' }, // White to vibrant pink with golden stamen
    { c0: '#ffd1ea', c1: '#ec4899', core: '#ffffff' }, // Magenta rose bloom
    { c0: '#f3e8ff', c1: '#c084fc', core: '#fef08a' }, // Soft lavender to royal purple
    { c0: '#ffffff', c1: '#e879f9', core: '#ffd700' }, // Pure radiant lilac
    { c0: '#fff1f2', c1: '#fb7185', core: '#fef08a' }, // Gentle coral blush
  ];

  const SS = 120;
  const sprites = BLOSSOMS.map(({ c0, c1, core }) => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = SS;
    const c = cv.getContext('2d');
    const mid = SS / 2, rad = SS * 0.38;

    // Petal radial gradient
    const grad = c.createRadialGradient(mid, mid, 2, mid, mid, rad);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, c0);
    grad.addColorStop(0.85, c1);
    grad.addColorStop(1, 'rgba(168, 85, 247, 0.8)');

    c.fillStyle = grad;
    for (let i = 0; i < 5; i++) {
      const ang = (i * Math.PI * 2) / 5;
      const px = mid + Math.cos(ang) * (rad * 0.46);
      const py = mid + Math.sin(ang) * (rad * 0.46);
      c.beginPath();
      c.arc(px, py, rad * 0.48, 0, Math.PI * 2);
      c.fill();
    }
    // Inner stamen
    c.beginPath();
    c.arc(mid, mid, rad * 0.26, 0, Math.PI * 2);
    c.fillStyle = core;
    c.shadowColor = core;
    c.shadowBlur = 6;
    c.fill();
    return cv;
  });

  // Parametric cardioid heart equation
  function getHeartPos(t, s, cx0, cy0) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: cx0 + x * s, y: cy0 + y * s };
  }

  // Generate 650 blossoms:
  // - 320 perimeter blossoms closely tracing the heart edge so the shape is razor-sharp
  // - 330 interior blossoms filling the body of the heart with lush volume
  const blossoms = [];
  const TOTAL_COUNT = isMobile ? 380 : 660;
  for (let i = 0; i < TOTAL_COUNT; i++) {
    const isPerimeter = i < TOTAL_COUNT * 0.52;
    const t = Math.random() * Math.PI * 2;
    // For perimeter, r is 0.90 to 1.05; for interior, r is sqrt(random) * 0.88
    const r = isPerimeter ? 0.90 + Math.random() * 0.15 : Math.sqrt(Math.random()) * 0.88;

    blossoms.push({
      t: t,
      r: r,
      jitterX: (Math.random() - 0.5) * (isPerimeter ? 8 : 18),
      jitterY: (Math.random() - 0.5) * (isPerimeter ? 8 : 18),
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
      delay: Math.random() * 2.2,
      baseScale: (isPerimeter ? 0.32 : 0.28) + Math.random() * 0.25,
      rot: Math.random() * Math.PI * 2,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: 0,
    });
  }

  // Orbiting Golden & Violet Firefly Motes
  const fireflies = [];
  for (let i = 0; i < 32; i++) {
    fireflies.push({
      ang: Math.random() * Math.PI * 2,
      rad: (0.35 + Math.random() * 0.85) * (scale * 17),
      speed: (0.008 + Math.random() * 0.014) * (Math.random() < 0.5 ? 1 : -1),
      yOffset: (Math.random() - 0.5) * (scale * 12),
      size: 2.2 + Math.random() * 3.5,
      pulseSpeed: 1.5 + Math.random() * 2.5,
      color: ['#ffd700', '#f472b6', '#ffffff', '#c084fc', '#fbcfe8'][Math.floor(Math.random() * 5)],
    });
  }

  // Falling Petals
  const petals = [];
  function spawnPetal() {
    if (petals.length > 45) return;
    petals.push({
      x: cx + (Math.random() - 0.5) * (scale * 28),
      y: cy - scale * 6 + (Math.random() - 0.5) * (scale * 10),
      vx: (Math.random() - 0.5) * 1.6,
      vy: 1.1 + Math.random() * 1.8,
      sway: 0.02 + Math.random() * 0.035,
      phase: Math.random() * Math.PI * 2,
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
      scale: 0.2 + Math.random() * 0.16,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      alpha: 0.85,
    });
  }

  let progress = 0;
  function render() {
    ctx.clearRect(0, 0, W, H);
    progress += 0.016;

    const pulse = 1 + Math.sin(progress * 2.2) * 0.018;

    // 1. Radiant Ambient Aura behind Heart Canopy (makes tree pop out against dark background)
    const aura = ctx.createRadialGradient(cx, cy - 15, 10, cx, cy - 15, scale * 22);
    aura.addColorStop(0, 'rgba(244, 114, 182, 0.35)');
    aura.addColorStop(0.35, 'rgba(192, 132, 252, 0.22)');
    aura.addColorStop(0.75, 'rgba(147, 51, 234, 0.10)');
    aura.addColorStop(1, 'rgba(18, 5, 26, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy - 15, scale * 22, 0, Math.PI * 2);
    ctx.fill();

    // 2. Animated Glowing Heart Contour (unmistakable neon heart silhouette)
    ctx.save();
    ctx.shadowColor = '#f472b6';
    ctx.shadowBlur = 24;
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * Math.PI * 2;
      const hp = getHeartPos(t, scale * pulse, cx, cy);
      if (i === 0) ctx.moveTo(hp.x, hp.y);
      else ctx.lineTo(hp.x, hp.y);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner soft white/gold luminous halo
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 3. Sculpted Organic Trunk & Heart Branches
    const groundY = H * 0.98;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const trunkGrad = ctx.createLinearGradient(cx, groundY, cx, cy);
    trunkGrad.addColorStop(0, '#23072e');
    trunkGrad.addColorStop(0.5, '#401152');
    trunkGrad.addColorStop(1, '#6b21a8');

    // Base root flare
    ctx.fillStyle = trunkGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 35, groundY);
    ctx.quadraticCurveTo(cx - 15, groundY - 25, cx - 18, groundY - 60);
    ctx.lineTo(cx + 18, groundY - 60);
    ctx.quadraticCurveTo(cx + 15, groundY - 25, cx + 35, groundY);
    ctx.closePath();
    ctx.fill();

    // Central trunk
    ctx.strokeStyle = trunkGrad;
    ctx.lineWidth = Math.max(20, scale * 1.25);
    ctx.beginPath();
    ctx.moveTo(cx, groundY - 45);
    ctx.quadraticCurveTo(cx - 10, (groundY + cy) * 0.58, cx, cy + 60);
    ctx.stroke();

    // Left Main Heart Bough (curves gracefully into left heart lobe)
    ctx.lineWidth = Math.max(12, scale * 0.72);
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy + 65);
    ctx.bezierCurveTo(cx - scale * 4, cy + 40, cx - scale * 7, cy + 10, cx - scale * 8.5, cy - scale * 2);
    ctx.stroke();

    // Left Sub-branch reaching up into top of left lobe
    ctx.lineWidth = Math.max(6, scale * 0.38);
    ctx.beginPath();
    ctx.moveTo(cx - scale * 6, cy + 18);
    ctx.quadraticCurveTo(cx - scale * 8, cy - scale * 5, cx - scale * 7.5, cy - scale * 8);
    ctx.stroke();

    // Right Main Heart Bough (curves gracefully into right heart lobe)
    ctx.lineWidth = Math.max(12, scale * 0.72);
    ctx.beginPath();
    ctx.moveTo(cx + 4, cy + 65);
    ctx.bezierCurveTo(cx + scale * 4, cy + 40, cx + scale * 7, cy + 10, cx + scale * 8.5, cy - scale * 2);
    ctx.stroke();

    // Right Sub-branch reaching up into top of right lobe
    ctx.lineWidth = Math.max(6, scale * 0.38);
    ctx.beginPath();
    ctx.moveTo(cx + scale * 6, cy + 18);
    ctx.quadraticCurveTo(cx + scale * 8, cy - scale * 5, cx + scale * 7.5, cy - scale * 8);
    ctx.stroke();

    // Center V-cleft branch
    ctx.lineWidth = Math.max(7, scale * 0.4);
    ctx.beginPath();
    ctx.moveTo(cx, cy + 60);
    ctx.quadraticCurveTo(cx, cy + 15, cx, cy - scale * 2);
    ctx.stroke();
    ctx.restore();

    // 4. Render Heart Blossoms (Spring blooming + subtle breathing animation)
    blossoms.forEach((b) => {
      const el = progress - b.delay;
      if (el > 0) {
        b.alpha = Math.min(el * 1.5, 1);
        const growEase = Math.min(el * 1.2, 1);
        const microSway = 1 + Math.sin(progress * 1.6 + b.swayOffset) * 0.04;
        const s = 65 * b.baseScale * growEase * microSway;

        // Dynamic position recalculation with heart pulse
        const pos = getHeartPos(b.t, scale * b.r * pulse, cx, cy);
        const bx = pos.x + b.jitterX;
        const by = pos.y + b.jitterY;

        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.translate(bx, by);
        ctx.rotate(b.rot);
        ctx.drawImage(b.sprite, -s / 2, -s / 2, s, s);
        ctx.restore();
      }
    });

    // 5. Render Orbiting Golden & Pink Fireflies
    fireflies.forEach((f) => {
      f.ang += f.speed;
      const fx = cx + Math.cos(f.ang) * f.rad;
      const fy = cy + Math.sin(f.ang * 1.5) * (f.rad * 0.65) + f.yOffset;
      const fa = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(progress * f.pulseSpeed));
      ctx.save();
      ctx.globalAlpha = fa;
      ctx.shadowColor = f.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(fx, fy, f.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 6. Drifting Falling Petals
    if (Math.random() < 0.32) spawnPetal();
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.phase += p.sway;
      p.x += p.vx + Math.sin(p.phase) * 1.3;
      p.y += p.vy;
      p.rot += p.rotSpeed;

      const s = 52 * p.scale;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(p.sprite, -s / 2, -s / 2, s, s);
      ctx.restore();

      if (p.y > groundY) {
        petals.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }
  render();
}

/* ============================================================
   9. STAGE 4: ROYAL LETTER ACTIONS & CELEBRATION
   ============================================================ */
if ($('btnLoveShower')) {
  $('btnLoveShower').addEventListener('click', () => {
  playMagicalChime();
  triggerConfettiBurst();

  for (let i = 0; i < 20; i++) {
    const el = document.createElement('span');
    el.style.cssText = `position:fixed;left:${Math.random() * 90 + 5}vw;bottom:20px;font-size:${24 + Math.random() * 24}px;pointer-events:none;z-index:99999;`;
    el.textContent = ['💜', '🌸', '✨', '💖', '🎂', '🧁', '👑', '🍀', '💕'][Math.floor(Math.random() * 9)];
    document.body.appendChild(el);

    if (typeof gsap !== 'undefined') {
      gsap.to(el, {
        y: -(180 + Math.random() * 320),
        x: (Math.random() - 0.5) * 80,
        scale: 1.5,
        opacity: 0,
        duration: 1.6 + Math.random() * 0.8,
        ease: 'power2.out',
        onComplete: () => el.remove(),
      });
    } else {
      setTimeout(() => el.remove(), 1600);
    }
  }
  });
}

// Initial render
renderDeckWish(0);
