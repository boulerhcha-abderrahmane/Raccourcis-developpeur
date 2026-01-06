// Content script pour la pipette de couleur
let eyedropperMode = false;
let magnifier = null;
let colorDisplay = null;

// Créer l'overlay de zoom et affichage de couleur
function createEyedropperUI() {
  // Supprimer l'UI existante si elle existe
  removeEyedropperUI();

  // Créer le zoom (loupe)
  magnifier = document.createElement('div');
  magnifier.id = 'dev-tools-magnifier';
  magnifier.style.cssText = `
    position: fixed;
    width: 200px;
    height: 200px;
    border: 3px solid #3498db;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
    display: none;
  `;

  // Créer l'affichage de couleur
  colorDisplay = document.createElement('div');
  colorDisplay.id = 'dev-tools-color-display';
  colorDisplay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: none;
    min-width: 200px;
  `;

  document.body.appendChild(magnifier);
  document.body.appendChild(colorDisplay);
}

function removeEyedropperUI() {
  if (magnifier) {
    magnifier.remove();
    magnifier = null;
  }
  if (colorDisplay) {
    colorDisplay.remove();
    colorDisplay = null;
  }
}

// Obtenir la couleur d'un pixel
function getColorAtPoint(x, y) {
  // Créer un canvas temporaire pour capturer la couleur
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Utiliser html2canvas ou une méthode alternative
  // Pour une solution simple, on utilise getComputedStyle
  const element = document.elementFromPoint(x, y);
  if (!element) return null;

  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  const color = style.color;

  // Parser la couleur RGB
  function parseRGB(rgb) {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    return null;
  }

  // Essayer d'obtenir la couleur de fond d'abord
  let rgb = parseRGB(bgColor);
  if (!rgb || (rgb.r === 0 && rgb.g === 0 && rgb.b === 0 && bgColor.includes('rgba'))) {
    // Si pas de couleur de fond visible, utiliser la couleur du texte
    rgb = parseRGB(color);
  }

  if (!rgb) {
    // Essayer de parser les couleurs hex
    const hexMatch = bgColor.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
    if (hexMatch) {
      const hex = hexMatch[1];
      rgb = {
        r: parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16),
        g: parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16),
        b: parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16)
      };
    }
  }

  if (!rgb) return null;

  // Convertir en HEX
  const hex = '#' + [rgb.r, rgb.g, rgb.b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    r: rgb.r,
    g: rgb.g,
    b: rgb.b
  };
}

// Fonction pour convertir RGB en HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

// Gérer le mouvement de la souris
function handleMouseMove(e) {
  if (!eyedropperMode) return;

  const x = e.clientX;
  const y = e.clientY;

  // Afficher la loupe
  if (magnifier) {
    magnifier.style.display = 'block';
    magnifier.style.left = (x - 100) + 'px';
    magnifier.style.top = (y - 100) + 'px';
  }

  // Obtenir la couleur
  const color = getColorAtPoint(x, y);
  
  if (color && colorDisplay) {
    colorDisplay.style.display = 'block';
    colorDisplay.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: bold;">Couleur détectée:</div>
      <div style="margin-bottom: 5px;">
        <strong>HEX:</strong> <span style="color: ${color.hex}">${color.hex}</span>
      </div>
      <div style="margin-bottom: 5px;">
        <strong>RGB:</strong> ${color.rgb}
      </div>
      <div style="width: 100%; height: 40px; background: ${color.hex}; border-radius: 4px; margin-top: 10px; border: 2px solid white;"></div>
    `;
  }
}

// Gérer le clic pour capturer la couleur
function handleMouseClick(e) {
  if (!eyedropperMode) return;

  e.preventDefault();
  e.stopPropagation();

  const x = e.clientX;
  const y = e.clientY;
  const color = getColorAtPoint(x, y);

  if (color) {
    // Stocker la couleur dans chrome.storage pour que le popup puisse la récupérer
    chrome.storage.local.set({ capturedColor: color }, () => {
      // Désactiver la pipette après capture
      deactivateEyedropper();
    });
  }
}

// Activer la pipette
function activateEyedropper() {
  eyedropperMode = true;
  createEyedropperUI();
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleMouseClick, true);
  document.body.style.cursor = 'crosshair';
  
  // Afficher un message
  if (colorDisplay) {
    colorDisplay.style.display = 'block';
    colorDisplay.innerHTML = '<div style="text-align: center;">Survolez les éléments et cliquez pour capturer la couleur</div>';
  }
}

// Désactiver la pipette
function deactivateEyedropper() {
  eyedropperMode = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleMouseClick, true);
  document.body.style.cursor = '';
  removeEyedropperUI();
}

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'activateEyedropper') {
    activateEyedropper();
    sendResponse({ success: true });
  } else if (message.action === 'deactivateEyedropper') {
    deactivateEyedropper();
    sendResponse({ success: true });
  }
  return true;
});

