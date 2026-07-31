/* ============================================================
   LOVE.EXE — Interactive Logic & Screen Management
   ============================================================ */

// ── State ──
let currentScreen = 'screen-loading';
let inventoryVisited = { flowers: false, hugs: false, letter: false };

// ── Screen Transitions ──
function goToScreen(targetId) {
  const current = document.getElementById(currentScreen);
  const target = document.getElementById(targetId);

  if (!current || !target) return;

  // Fade out current
  current.classList.add('fade-out');

  setTimeout(() => {
    current.classList.remove('active', 'fade-out');
    target.classList.add('active');
    currentScreen = targetId;

    // Screen-specific setup
    onScreenEnter(targetId);
  }, 280);
}

function onScreenEnter(screenId) {
  switch (screenId) {
    case 'screen-hello':
      typeText('hello-text', 'Hey Nandini... I made something just for you. Continue?', 40);
      setTimeout(initRunawayNo, 100);
      break;
    case 'screen-achievement':
      spawnFloatingHearts('ach-hearts', 8);
      break;
    case 'screen-question':
      // Reset question state
      document.getElementById('question-buttons').classList.remove('hidden');
      document.getElementById('question-next').classList.add('hidden');
      document.getElementById('question-text').textContent = 'Do you know how amazing you are?';
      break;
    case 'screen-inventory':
      checkInventoryComplete();
      break;
    case 'screen-hugs':
      spawnFloatingHearts('hug-hearts', 12);
      break;
    case 'screen-letter':
      // Reset and play envelope animation
      document.getElementById('envelope-anim').classList.remove('hidden');
      document.getElementById('letter-content').classList.add('hidden');
      setTimeout(() => {
        document.getElementById('envelope-anim').classList.add('hidden');
        document.getElementById('letter-content').classList.remove('hidden');
      }, 1500);
      break;
    case 'screen-conclusion':
      spawnSparkles('sparkles', 20);
      spawnFloatingHearts('final-hearts', 15);
      break;
  }
}


// ── Typewriter Effect ──
function typeText(elementId, text, speed) {
  const el = document.getElementById(elementId);
  el.innerHTML = '';
  let i = 0;

  // Add cursor
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';

  function type() {
    if (i < text.length) {
      el.textContent = text.substring(0, i + 1);
      el.appendChild(cursorSpan);
      i++;
      setTimeout(type, speed);
    } else {
      // Remove cursor after done
      setTimeout(() => {
        if (cursorSpan.parentNode) {
          cursorSpan.remove();
        }
      }, 1500);
    }
  }

  type();
}


// ── Runaway NO Button ──
let noAttempts = 0;

function initRunawayNo() {
  const btn = document.getElementById('btn-no');
  const container = document.getElementById('screen-hello');

  btn.addEventListener('mouseenter', runAwayFromCursor);
}

function runAwayFromCursor() {
  const btn = document.getElementById('btn-no');
  const container = document.getElementById('screen-hello');
  const cRect = container.getBoundingClientRect();
  const bRect = btn.getBoundingClientRect();

  noAttempts++;

  // Fun messages that cycle
  const msgs = ['NOPE!', 'NAH!', 'NOOOO!', 'CATCH ME!', 'NEVER!', 'HEHE!', 'TRY AGAIN!'];
  btn.textContent = msgs[noAttempts % msgs.length];

  // Make it position: fixed to move freely
  if (btn.style.position !== 'fixed') {
    btn.style.position = 'fixed';
    btn.style.left = bRect.left + 'px';
    btn.style.top = bRect.top + 'px';
    btn.style.zIndex = '9998';
    btn.style.margin = '0';
  }

  const btnW = bRect.width;
  const btnH = bRect.height;
  const margin = 20;

  const maxX = window.innerWidth - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;

  let newX, newY;
  const tries = 20;
  for (let i = 0; i < tries; i++) {
    newX = margin + Math.random() * maxX;
    newY = margin + Math.random() * maxY;
    const curX = parseFloat(btn.style.left);
    const curY = parseFloat(btn.style.top);
    if (Math.abs(newX - curX) > 80 || Math.abs(newY - curY) > 80) break;
  }

  btn.style.transition = 'left 0.15s, top 0.15s';
  btn.style.left = newX + 'px';
  btn.style.top = newY + 'px';

  // After 5 attempts, give up and go to YES
  if (noAttempts >= 5) {
    btn.removeEventListener('mouseenter', runAwayFromCursor);
    btn.textContent = 'FINE... YES 😩';
    btn.style.transition = 'left 0.4s, top 0.4s';

    // Fly it to the center
    btn.style.left = (window.innerWidth / 2 - 70) + 'px';
    btn.style.top = (window.innerHeight / 2) + 'px';

    setTimeout(() => {
      btn.style.position = '';
      btn.style.left = '';
      btn.style.top = '';
      btn.style.zIndex = '';
      goToScreen('screen-achievement');
    }, 800);
  }
}

function shakeNo() {
  // Legacy — now handled by initRunawayNo
}


// ── Question Answer Logic ──
function answerQuestion(answer) {
  const buttonsContainer = document.getElementById('question-buttons');
  const nextBtn = document.getElementById('question-next');
  const textEl = document.getElementById('question-text');

  buttonsContainer.classList.add('hidden');

  switch (answer) {
    case 'not-really':
      textEl.textContent = "Not really?! Well, let me prove it to you then... 💕";
      break;
    case 'maybe':
      textEl.textContent = "Only maybe? I'll have to remind you every single day then. 💗";
      break;
    case 'of-course':
      textEl.textContent = "That's what I like to hear! But I'll remind you anyway 😊";
      break;
  }

  nextBtn.classList.remove('hidden');
}


// ── Inventory System ──
function openInventory(item) {
  goToScreen('screen-' + item);
}

function backToInventory(item) {
  inventoryVisited[item] = true;

  // Mark the item as visited visually
  const invItem = document.getElementById('inv-' + item);
  if (invItem) {
    invItem.classList.add('visited');
  }

  goToScreen('screen-inventory');
}

function checkInventoryComplete() {
  const allVisited = Object.values(inventoryVisited).every(v => v);
  const continueBtn = document.getElementById('inventory-continue');

  if (allVisited) {
    continueBtn.style.display = 'flex';
  }
}

function inventoryContinue() {
  // Show heart loading then go to conclusion
  goToScreen('screen-heart-loading');

  setTimeout(() => {
    goToScreen('screen-conclusion');
  }, 2000);
}


// ── Floating Hearts ──
function spawnFloatingHearts(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const hearts = ['💕', '💗', '💖', '❤️', '💓', '♥'];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 90 + 5 + '%';
    heart.style.bottom = '-20px';
    heart.style.animationDelay = Math.random() * 3 + 's';
    heart.style.animationDuration = (2 + Math.random() * 2) + 's';
    heart.style.fontSize = (12 + Math.random() * 12) + 'px';
    container.appendChild(heart);
  }
}


// ── Sparkle Effects ──
function spawnSparkles(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(sparkle);
  }
}


// ── Replay ──
function replayAll() {
  // Reset all state
  inventoryVisited = { flowers: false, hugs: false, letter: false };

  // Reset visited classes
  document.querySelectorAll('.inventory-item.visited').forEach(el => {
    el.classList.remove('visited');
  });

  // Reset inventory continue
  document.getElementById('inventory-continue').style.display = 'none';

  // Reset NO button
  const btnNo = document.getElementById('btn-no');
  btnNo.textContent = 'NO';
  btnNo.style.opacity = '1';
  btnNo.style.pointerEvents = 'auto';
  btnNo.style.position = '';
  btnNo.style.left = '';
  btnNo.style.top = '';
  btnNo.style.zIndex = '';
  btnNo.style.transition = '';
  noAttempts = 0;
  btnNo.removeEventListener('mouseenter', runAwayFromCursor);

  // Go to loading
  goToScreen('screen-loading');

  setTimeout(() => {
    goToScreen('screen-hello');
  }, 2500);
}


// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  // Auto-transition from loading to hello screen
  setTimeout(() => {
    goToScreen('screen-hello');
  }, 3000);
});
