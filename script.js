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


// ── Shake NO Button ──
function shakeNo() {
  const btn = document.getElementById('btn-no');
  btn.classList.add('shake');
  btn.textContent = '😾 NO';

  setTimeout(() => {
    btn.classList.remove('shake');
  }, 500);

  // After 2 shakes, disable the button
  setTimeout(() => {
    btn.textContent = 'FINE...';
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
  }, 1200);
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
