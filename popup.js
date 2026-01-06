// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    btn.classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
  });
});

// Drag to scroll functionality for tabs
const tabsContainer = document.querySelector('.tabs');
let isDown = false;
let startX;
let scrollLeft;

tabsContainer.addEventListener('mousedown', (e) => {
  isDown = true;
  tabsContainer.style.cursor = 'grabbing';
  startX = e.pageX - tabsContainer.offsetLeft;
  scrollLeft = tabsContainer.scrollLeft;
});

tabsContainer.addEventListener('mouseleave', () => {
  isDown = false;
  tabsContainer.style.cursor = 'grab';
});

tabsContainer.addEventListener('mouseup', () => {
  isDown = false;
  tabsContainer.style.cursor = 'grab';
});

tabsContainer.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - tabsContainer.offsetLeft;
  const walk = (x - startX) * 2; // Multiplier pour un scroll plus rapide
  tabsContainer.scrollLeft = scrollLeft - walk;
});

// Ajouter le style de curseur
tabsContainer.style.cursor = 'grab';

// ========== UUID Generator ==========
function generateUUID(version = 'v4') {
  if (version === 'v4') {
    // UUID v4 (random)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } else if (version === 'v1') {
    // UUID v1 (time-based, simplified)
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 14);
    return `${timestamp.toString(16)}-${random.substring(0, 4)}-1${random.substring(4, 7)}-8${random.substring(7, 10)}-${random.substring(10)}`;
  }
}

document.getElementById('generate-uuid').addEventListener('click', () => {
  const version = document.getElementById('uuid-version').value;
  const uuid = generateUUID(version);
  document.getElementById('uuid-output').value = uuid;
});

document.getElementById('copy-uuid').addEventListener('click', () => {
  const uuid = document.getElementById('uuid-output').value;
  if (uuid) {
    navigator.clipboard.writeText(uuid).then(() => {
      showNotification('UUID copié !', 'success');
    });
  }
});

document.getElementById('generate-multiple').addEventListener('click', () => {
  const version = document.getElementById('uuid-version').value;
  const container = document.getElementById('multiple-uuids');
  container.innerHTML = '';
  
  for (let i = 0; i < 5; i++) {
    const uuid = generateUUID(version);
    const div = document.createElement('div');
    div.innerHTML = `
      <span>${uuid}</span>
      <button class="copy-uuid-item">📋</button>
    `;
    div.querySelector('button').addEventListener('click', () => {
      navigator.clipboard.writeText(uuid).then(() => {
        showNotification('UUID copié !', 'success');
      });
    });
    container.appendChild(div);
  }
});

// ========== JSON Formatter ==========
function formatJSON(jsonString) {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    throw new Error('JSON invalide: ' + e.message);
  }
}

function minifyJSON(jsonString) {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj);
  } catch (e) {
    throw new Error('JSON invalide: ' + e.message);
  }
}

function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return { valid: true, message: 'JSON valide ✓' };
  } catch (e) {
    return { valid: false, message: 'JSON invalide: ' + e.message };
  }
}

document.getElementById('format-json').addEventListener('click', () => {
  const input = document.getElementById('json-input').value.trim();
  const statusEl = document.getElementById('json-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du JSON';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const formatted = formatJSON(input);
    document.getElementById('json-output').value = formatted;
    statusEl.textContent = 'JSON formaté avec succès ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = e.message;
    statusEl.className = 'status-message error';
    document.getElementById('json-output').value = '';
  }
});

document.getElementById('minify-json').addEventListener('click', () => {
  const input = document.getElementById('json-input').value.trim();
  const statusEl = document.getElementById('json-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du JSON';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const minified = minifyJSON(input);
    document.getElementById('json-output').value = minified;
    statusEl.textContent = 'JSON minifié avec succès ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = e.message;
    statusEl.className = 'status-message error';
    document.getElementById('json-output').value = '';
  }
});

document.getElementById('validate-json').addEventListener('click', () => {
  const input = document.getElementById('json-input').value.trim();
  const statusEl = document.getElementById('json-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du JSON';
    statusEl.className = 'status-message error';
    return;
  }
  
  const result = validateJSON(input);
  statusEl.textContent = result.message;
  statusEl.className = `status-message ${result.valid ? 'success' : 'error'}`;
  
  if (result.valid) {
    document.getElementById('json-output').value = formatJSON(input);
  } else {
    document.getElementById('json-output').value = '';
  }
});

// ========== Base64 Encoder/Decoder ==========
document.getElementById('encode-base64').addEventListener('click', () => {
  const input = document.getElementById('base64-input').value;
  const statusEl = document.getElementById('base64-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du texte à encoder';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    document.getElementById('base64-output').value = encoded;
    statusEl.textContent = 'Texte encodé avec succès ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur lors de l\'encodage: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

document.getElementById('decode-base64').addEventListener('click', () => {
  const input = document.getElementById('base64-input').value.trim();
  const statusEl = document.getElementById('base64-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du texte Base64 à décoder';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    document.getElementById('base64-output').value = decoded;
    statusEl.textContent = 'Texte décodé avec succès ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur lors du décodage: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

// ========== Color Picker ==========
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function updateColorDisplay() {
  const hex = document.getElementById('hex-input').value;
  const rgb = hexToRgb(hex);
  
  if (rgb) {
    document.getElementById('rgb-r').value = rgb.r;
    document.getElementById('rgb-g').value = rgb.g;
    document.getElementById('rgb-b').value = rgb.b;
    document.getElementById('color-picker').value = hex;
    document.getElementById('color-display').style.backgroundColor = hex;
    document.getElementById('hex-display').textContent = hex.toUpperCase();
    document.getElementById('rgb-display').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
}

function updateFromRGB() {
  const r = parseInt(document.getElementById('rgb-r').value) || 0;
  const g = parseInt(document.getElementById('rgb-g').value) || 0;
  const b = parseInt(document.getElementById('rgb-b').value) || 0;
  
  const hex = rgbToHex(r, g, b);
  document.getElementById('hex-input').value = hex.toUpperCase();
  document.getElementById('color-picker').value = hex;
  document.getElementById('color-display').style.backgroundColor = hex;
  document.getElementById('hex-display').textContent = hex.toUpperCase();
  document.getElementById('rgb-display').textContent = `rgb(${r}, ${g}, ${b})`;
}

// Color picker events
document.getElementById('color-picker').addEventListener('input', (e) => {
  document.getElementById('hex-input').value = e.target.value.toUpperCase();
  updateColorDisplay();
});

document.getElementById('hex-input').addEventListener('input', (e) => {
  let value = e.target.value;
  if (!value.startsWith('#')) {
    value = '#' + value;
  }
  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
    if (value.length === 7) {
      updateColorDisplay();
    }
  }
});

document.getElementById('rgb-r').addEventListener('input', updateFromRGB);
document.getElementById('rgb-g').addEventListener('input', updateFromRGB);
document.getElementById('rgb-b').addEventListener('input', updateFromRGB);

// Copy buttons for colors
document.querySelectorAll('[data-copy="hex"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const hex = document.getElementById('hex-display').textContent;
    navigator.clipboard.writeText(hex).then(() => {
      showNotification('HEX copié !', 'success');
    });
  });
});

document.querySelectorAll('[data-copy="rgb"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const rgb = document.getElementById('rgb-display').textContent;
    navigator.clipboard.writeText(rgb).then(() => {
      showNotification('RGB copié !', 'success');
    });
  });
});

// Initialize color display
updateColorDisplay();

// ========== Eyedropper (Pipette) ==========
let eyedropperActive = false;

document.getElementById('eyedropper-btn').addEventListener('click', async () => {
  try {
    // Essayer d'utiliser l'API EyeDropper native de Chrome si disponible
    if (window.EyeDropper) {
      const eyeDropper = new EyeDropper();
      try {
        const result = await eyeDropper.open();
        const color = result.sRGBHex;
        
        // Mettre à jour l'interface avec la couleur capturée
        document.getElementById('hex-input').value = color.toUpperCase();
        document.getElementById('color-picker').value = color;
        updateColorDisplay();
        showNotification(`Couleur capturée: ${color.toUpperCase()}`, 'success');
      } catch (err) {
        // L'utilisateur a annulé
        if (err.name !== 'AbortError') {
          console.error('Erreur EyeDropper:', err);
        }
      }
    } else {
      // Fallback: utiliser le content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (eyedropperActive) {
        // Désactiver la pipette
        chrome.tabs.sendMessage(tab.id, { action: 'deactivateEyedropper' });
        eyedropperActive = false;
        updateEyedropperButton(false);
      } else {
        // Activer la pipette
        chrome.tabs.sendMessage(tab.id, { action: 'activateEyedropper' });
        eyedropperActive = true;
        updateEyedropperButton(true);
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
    showNotification('Erreur lors de l\'activation de la pipette', 'error');
  }
});

function updateEyedropperButton(active) {
  const btn = document.getElementById('eyedropper-btn');
  if (active) {
    btn.textContent = 'Désactiver la pipette';
    btn.classList.add('active');
  } else {
    btn.innerHTML = `
      <svg class="eyedropper-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 22l10-10M16 8l-2-2M9 15l-2-2M22 2l-4 4M20 8l-2-2M15 13l-2-2"></path>
      </svg>
      Activer la pipette
    `;
    btn.classList.remove('active');
  }
}

// Écouter les changements de stockage pour la couleur capturée
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.capturedColor) {
    const color = changes.capturedColor.newValue;
    if (color) {
      // Mettre à jour l'interface avec la couleur capturée
      document.getElementById('hex-input').value = color.hex.toUpperCase();
      document.getElementById('color-picker').value = color.hex;
      updateColorDisplay();
      showNotification(`Couleur capturée: ${color.hex}`, 'success');
      // Effacer la couleur du stockage
      chrome.storage.local.remove('capturedColor');
    }
  }
});

// Vérifier s'il y a une couleur capturée au chargement
chrome.storage.local.get('capturedColor', (result) => {
  if (result.capturedColor) {
    const color = result.capturedColor;
    document.getElementById('hex-input').value = color.hex.toUpperCase();
    document.getElementById('color-picker').value = color.hex;
    updateColorDisplay();
    chrome.storage.local.remove('capturedColor');
  }
});

// ========== URL Encoder/Decoder ==========
document.getElementById('encode-url').addEventListener('click', () => {
  const input = document.getElementById('url-input').value;
  const statusEl = document.getElementById('url-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du texte à encoder';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const encoded = encodeURIComponent(input);
    document.getElementById('url-output').value = encoded;
    statusEl.textContent = 'Texte encodé avec succès ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur lors de l\'encodage: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

document.getElementById('decode-url').addEventListener('click', () => {
  const input = document.getElementById('url-input').value.trim();
  const statusEl = document.getElementById('url-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du texte à décoder';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const decoded = decodeURIComponent(input);
    document.getElementById('url-output').value = decoded;
    statusEl.textContent = 'Texte décodé avec succès ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur lors du décodage: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

// ========== Hash Generator ==========
// Fonction pour générer un hash (utilise Web Crypto API)
async function generateHash(text, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  let hashBuffer;
  switch(algorithm) {
    case 'md5':
      // MD5 n'est pas disponible dans Web Crypto API, on utilise une implémentation simple
      return md5(text);
    case 'sha1':
      hashBuffer = await crypto.subtle.digest('SHA-1', data);
      break;
    case 'sha256':
      hashBuffer = await crypto.subtle.digest('SHA-256', data);
      break;
    case 'sha512':
      hashBuffer = await crypto.subtle.digest('SHA-512', data);
      break;
    default:
      throw new Error('Algorithme non supporté');
  }
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Implémentation MD5 simple (pour compatibilité)
function md5(string) {
  function md5_RotateLeft(lValue, iShiftBits) {
    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
  }
  function md5_AddUnsigned(lX,lY) {
    var lX4,lY4,lX8,lY8,lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }
  function md5_F(x,y,z) { return (x & y) | ((~x) & z); }
  function md5_G(x,y,z) { return (x & z) | (y & (~z)); }
  function md5_H(x,y,z) { return (x ^ y ^ z); }
  function md5_I(x,y,z) { return (y ^ (x | (~z))); }
  function md5_FF(a,b,c,d,x,s,ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_GG(a,b,c,d,x,s,ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_HH(a,b,c,d,x,s,ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_II(a,b,c,d,x,s,ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1=lMessageLength + 8;
    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
    var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
    var lWordArray=Array(lNumberOfWords-1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while ( lByteCount < lMessageLength ) {
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
    return lWordArray;
  }
  function md5_WordToHex(lValue) {
    var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
    for (lCount = 0;lCount<=3;lCount++) {
      lByte = (lValue>>>(lCount*8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
    }
    return WordToHexValue;
  }
  function md5_Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  var x=Array();
  var k,AA,BB,CC,DD,a,b,c,d;
  var S11=7, S12=12, S13=17, S14=22;
  var S21=5, S22=9 , S23=14, S24=20;
  var S31=4, S32=11, S33=16, S34=23;
  var S41=6, S42=10, S43=15, S44=21;
  string = md5_Utf8Encode(string);
  x = md5_ConvertToWordArray(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k=0;k<x.length;k+=16) {
    AA=a; BB=b; CC=c; DD=d;
    a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
    d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
    c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
    b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
    a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
    d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
    c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
    b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
    a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
    d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
    c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
    b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
    d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
    c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
    b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
    d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
    c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
    b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
    a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
    d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
    c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
    b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
    a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
    d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
    c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
    b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
    a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
    d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
    c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
    b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
    d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
    c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
    b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
    d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
    c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
    b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
    d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
    c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
    b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
    a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
    d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
    c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
    b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
    a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
    d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
    c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
    b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
    a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
    d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
    c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
    b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
    a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
    d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
    c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
    b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
    d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
    c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
    b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
    a=md5_AddUnsigned(a,AA);
    b=md5_AddUnsigned(b,BB);
    c=md5_AddUnsigned(c,CC);
    d=md5_AddUnsigned(d,DD);
  }
  return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
}

document.getElementById('generate-hash').addEventListener('click', async () => {
  const input = document.getElementById('hash-input').value;
  const algorithm = document.getElementById('hash-algorithm').value;
  const statusEl = document.getElementById('hash-status');
  
  if (!input) {
    statusEl.textContent = 'Veuillez entrer du texte à hasher';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const hash = await generateHash(input, algorithm);
    document.getElementById('hash-output').value = hash;
    statusEl.textContent = `Hash ${algorithm.toUpperCase()} généré avec succès ✓`;
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur lors de la génération: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

document.getElementById('copy-hash').addEventListener('click', () => {
  const hash = document.getElementById('hash-output').value;
  if (hash) {
    navigator.clipboard.writeText(hash).then(() => {
      showNotification('Hash copié !', 'success');
    });
  }
});

// ========== Timestamp Converter ==========
document.getElementById('use-current-timestamp').addEventListener('click', () => {
  const now = Math.floor(Date.now() / 1000);
  document.getElementById('timestamp-input').value = now;
  convertTimestampToDate();
});

document.getElementById('timestamp-to-date').addEventListener('click', () => {
  convertTimestampToDate();
});

document.getElementById('date-to-timestamp').addEventListener('click', () => {
  convertDateToTimestamp();
});

function convertTimestampToDate() {
  const timestamp = document.getElementById('timestamp-input').value;
  const statusEl = document.getElementById('timestamp-status');
  
  if (!timestamp) {
    statusEl.textContent = 'Veuillez entrer un timestamp';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const date = new Date(parseInt(timestamp) * 1000);
    
    if (isNaN(date.getTime())) {
      throw new Error('Timestamp invalide');
    }
    
    // Afficher les résultats
    document.getElementById('timestamp-result').textContent = timestamp;
    document.getElementById('date-utc-result').textContent = date.toUTCString();
    document.getElementById('date-local-result').textContent = date.toLocaleString();
    
    // Mettre à jour le champ date
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    document.getElementById('date-input').value = localDate.toISOString().slice(0, 16);
    
    statusEl.textContent = 'Conversion réussie ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur: ' + e.message;
    statusEl.className = 'status-message error';
  }
}

function convertDateToTimestamp() {
  const dateInput = document.getElementById('date-input').value;
  const statusEl = document.getElementById('timestamp-status');
  
  if (!dateInput) {
    statusEl.textContent = 'Veuillez sélectionner une date';
    statusEl.className = 'status-message error';
    return;
  }
  
  try {
    const date = new Date(dateInput);
    const timestamp = Math.floor(date.getTime() / 1000);
    
    // Afficher les résultats
    document.getElementById('timestamp-input').value = timestamp;
    document.getElementById('timestamp-result').textContent = timestamp;
    document.getElementById('date-utc-result').textContent = date.toUTCString();
    document.getElementById('date-local-result').textContent = date.toLocaleString();
    
    statusEl.textContent = 'Conversion réussie ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur: ' + e.message;
    statusEl.className = 'status-message error';
  }
}

// Copier les résultats du timestamp
document.querySelectorAll('[data-copy-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-copy-target');
    const text = document.getElementById(targetId).textContent;
    if (text && text !== '-') {
      navigator.clipboard.writeText(text).then(() => {
        showNotification('Copié !', 'success');
      });
    }
  });
});

// ========== Utility Functions ==========
function showNotification(message, type = 'success') {
  // Simple notification - could be enhanced with a toast library
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ========== Password Generator ==========
document.getElementById('generate-password').addEventListener('click', () => {
  const length = parseInt(document.getElementById('password-length').value) || 16;
  const uppercase = document.getElementById('password-uppercase').checked;
  const lowercase = document.getElementById('password-lowercase').checked;
  const numbers = document.getElementById('password-numbers').checked;
  const symbols = document.getElementById('password-symbols').checked;
  const excludeSimilar = document.getElementById('password-exclude-similar').checked;
  const statusEl = document.getElementById('password-status');

  if (length < 4 || length > 128) {
    statusEl.textContent = 'La longueur doit être entre 4 et 128';
    statusEl.className = 'status-message error';
    return;
  }

  if (!uppercase && !lowercase && !numbers && !symbols) {
    statusEl.textContent = 'Sélectionnez au moins une option';
    statusEl.className = 'status-message error';
    return;
  }

  let charset = '';
  if (uppercase) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijkmnopqrstuvwxyz';
  if (numbers) charset += '23456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (excludeSimilar) {
    charset = charset.replace(/[iIlL1oO0]/g, '');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  document.getElementById('password-output').value = password;
  statusEl.textContent = 'Mot de passe généré avec succès ✓';
  statusEl.className = 'status-message success';
});

document.getElementById('copy-password').addEventListener('click', () => {
  const password = document.getElementById('password-output').value;
  if (password) {
    navigator.clipboard.writeText(password).then(() => {
      showNotification('Mot de passe copié !', 'success');
    });
  }
});

// ========== Regex Tester ==========
document.getElementById('test-regex').addEventListener('click', () => {
  const patternInput = document.getElementById('regex-pattern').value.trim();
  const text = document.getElementById('regex-text').value;
  const statusEl = document.getElementById('regex-status');
  const resultsEl = document.getElementById('regex-results');

  if (!patternInput) {
    statusEl.textContent = 'Veuillez entrer une expression régulière';
    statusEl.className = 'status-message error';
    return;
  }

  try {
    // Parser le pattern (supporter /pattern/flags)
    let pattern, flags = '';
    if (patternInput.startsWith('/') && patternInput.lastIndexOf('/') > 0) {
      const lastSlash = patternInput.lastIndexOf('/');
      pattern = patternInput.substring(1, lastSlash);
      flags = patternInput.substring(lastSlash + 1);
    } else {
      pattern = patternInput;
    }

    // matchAll() nécessite le flag global (g)
    if (!flags.includes('g')) {
      flags += 'g';
    }

    const regex = new RegExp(pattern, flags);
    const matches = text.matchAll(regex);
    const matchArray = Array.from(matches);

    if (matchArray.length === 0) {
      resultsEl.innerHTML = '<div style="color: #6c757d;">Aucune correspondance trouvée</div>';
      statusEl.textContent = 'Aucune correspondance';
      statusEl.className = 'status-message error';
    } else {
      let html = `<div style="margin-bottom: 12px; font-weight: bold;">${matchArray.length} correspondance(s) trouvée(s):</div>`;
      matchArray.forEach((match, index) => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #3498db;">`;
        html += `<strong>Match ${index + 1}:</strong> "${match[0]}"<br>`;
        html += `<small style="color: #6c757d;">Position: ${match.index} - ${match.index + match[0].length}</small>`;
        if (match.length > 1) {
          html += `<br><small style="color: #6c757d;">Groupes: ${match.slice(1).join(', ')}</small>`;
        }
        html += `</div>`;
      });
      resultsEl.innerHTML = html;
      statusEl.textContent = `${matchArray.length} correspondance(s) trouvée(s) ✓`;
      statusEl.className = 'status-message success';
    }
  } catch (e) {
    resultsEl.innerHTML = '';
    statusEl.textContent = 'Erreur regex: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

document.getElementById('clear-regex').addEventListener('click', () => {
  document.getElementById('regex-pattern').value = '';
  document.getElementById('regex-text').value = '';
  document.getElementById('regex-results').innerHTML = '';
  document.getElementById('regex-status').textContent = '';
  document.getElementById('regex-status').className = 'status-message';
});

// ========== Base Converter ==========
function convertFromBase(value, fromBase) {
  if (fromBase === 'bcd') {
    // BCD: chaque chiffre décimal est représenté par 4 bits
    return parseInt(value, 10);
  }
  return parseInt(value, parseInt(fromBase));
}

function toBCD(decimal) {
  return decimal.toString().split('').map(d => parseInt(d).toString(2).padStart(4, '0')).join(' ');
}

document.getElementById('convert-base').addEventListener('click', () => {
  const input = document.getElementById('base-input').value.trim();
  const fromBase = document.getElementById('base-from').value;
  const statusEl = document.getElementById('base-status');

  if (!input) {
    statusEl.textContent = 'Veuillez entrer une valeur';
    statusEl.className = 'status-message error';
    return;
  }

  try {
    let decimal;
    if (fromBase === 'bcd') {
      // Convertir BCD en décimal
      const bcdParts = input.split(' ').filter(p => p);
      decimal = parseInt(bcdParts.map(b => parseInt(b, 2)).join(''), 10);
    } else {
      decimal = convertFromBase(input, fromBase);
    }

    if (isNaN(decimal)) {
      throw new Error('Valeur invalide pour la base sélectionnée');
    }

    document.getElementById('base-binary').textContent = decimal.toString(2);
    document.getElementById('base-octal').textContent = decimal.toString(8);
    document.getElementById('base-decimal').textContent = decimal.toString(10);
    document.getElementById('base-hex').textContent = decimal.toString(16).toUpperCase();
    document.getElementById('base-bcd').textContent = toBCD(decimal);

    statusEl.textContent = 'Conversion réussie ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

// ========== Diff Checker ==========
function diffText(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const maxLen = Math.max(lines1.length, lines2.length);
  let result = '';

  for (let i = 0; i < maxLen; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';

    if (line1 === line2) {
      result += `  ${line1}\n`;
    } else {
      if (line1) result += `- ${line1}\n`;
      if (line2) result += `+ ${line2}\n`;
    }
  }

  return result;
}

document.getElementById('compare-diff').addEventListener('click', () => {
  const text1 = document.getElementById('diff-text1').value;
  const text2 = document.getElementById('diff-text2').value;
  const statusEl = document.getElementById('diff-status');
  const resultEl = document.getElementById('diff-result');

  if (!text1 && !text2) {
    statusEl.textContent = 'Veuillez entrer au moins un texte';
    statusEl.className = 'status-message error';
    return;
  }

  const diff = diffText(text1, text2);
  resultEl.textContent = diff || 'Les deux textes sont identiques';
  resultEl.style.color = diff ? '#495057' : '#28a745';
  statusEl.textContent = diff ? 'Différences trouvées ✓' : 'Textes identiques ✓';
  statusEl.className = 'status-message ' + (diff ? 'success' : 'success');
});

document.getElementById('clear-diff').addEventListener('click', () => {
  document.getElementById('diff-text1').value = '';
  document.getElementById('diff-text2').value = '';
  document.getElementById('diff-result').textContent = '';
  document.getElementById('diff-status').textContent = '';
  document.getElementById('diff-status').className = 'status-message';
});

// ========== Minifier ==========
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Supprimer les commentaires
    .replace(/\s+/g, ' ') // Remplacer les espaces multiples
    .replace(/;\s*}/g, '}') // Supprimer le point-virgule avant }
    .replace(/\s*{\s*/g, '{') // Supprimer les espaces autour de {
    .replace(/\s*}\s*/g, '}') // Supprimer les espaces autour de }
    .replace(/\s*:\s*/g, ':') // Supprimer les espaces autour de :
    .replace(/\s*;\s*/g, ';') // Supprimer les espaces autour de ;
    .replace(/\s*,\s*/g, ',') // Supprimer les espaces autour de ,
    .trim();
}

function minifyHTML(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // Supprimer les commentaires
    .replace(/\s+/g, ' ') // Remplacer les espaces multiples
    .replace(/>\s+</g, '><') // Supprimer les espaces entre les balises
    .trim();
}

document.getElementById('minify-code').addEventListener('click', () => {
  const input = document.getElementById('minify-input').value;
  const type = document.getElementById('minify-type').value;
  const statusEl = document.getElementById('minify-status');

  if (!input) {
    statusEl.textContent = 'Veuillez entrer du code';
    statusEl.className = 'status-message error';
    return;
  }

  try {
    const minified = type === 'css' ? minifyCSS(input) : minifyHTML(input);
    document.getElementById('minify-output').value = minified;
    statusEl.textContent = `Code ${type.toUpperCase()} minifié avec succès ✓`;
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

document.getElementById('copy-minified').addEventListener('click', () => {
  const minified = document.getElementById('minify-output').value;
  if (minified) {
    navigator.clipboard.writeText(minified).then(() => {
      showNotification('Code minifié copié !', 'success');
    });
  }
});

// ========== HTML Formatter ==========
function formatHTML(html) {
  let formatted = '';
  let indent = 0;
  const tab = '  ';

  html = html.replace(/>\s+</g, '><'); // Supprimer les espaces entre balises

  html.split(/>/).forEach((part, index) => {
    if (part.trim()) {
      const closing = part.startsWith('/');
      if (closing) indent--;
      formatted += tab.repeat(Math.max(0, indent)) + part.trim() + '>\n';
      if (!closing && !part.match(/\/$/)) indent++;
    }
  });

  return formatted.trim();
}

document.getElementById('format-html').addEventListener('click', () => {
  const input = document.getElementById('html-input').value;
  const statusEl = document.getElementById('html-status');

  if (!input) {
    statusEl.textContent = 'Veuillez entrer du code HTML';
    statusEl.className = 'status-message error';
    return;
  }

  try {
    const formatted = formatHTML(input);
    document.getElementById('html-output').value = formatted;
    statusEl.textContent = 'HTML formaté avec succès ✓';
    statusEl.className = 'status-message success';
  } catch (e) {
    statusEl.textContent = 'Erreur: ' + e.message;
    statusEl.className = 'status-message error';
  }
});

document.getElementById('copy-html').addEventListener('click', () => {
  const html = document.getElementById('html-output').value;
  if (html) {
    navigator.clipboard.writeText(html).then(() => {
      showNotification('HTML copié !', 'success');
    });
  }
});

// ========== Lorem Ipsum Generator ==========
const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'];

function generateLorem(type, amount) {
  let result = '';

  if (type === 'words') {
    result = loremWords.slice(0, amount).join(' ');
  } else if (type === 'sentences') {
    for (let i = 0; i < amount; i++) {
      const sentenceLength = Math.floor(Math.random() * 10) + 5;
      const sentence = loremWords.slice(0, sentenceLength).join(' ');
      result += sentence.charAt(0).toUpperCase() + sentence.slice(1) + '. ';
    }
  } else if (type === 'paragraphs') {
    for (let i = 0; i < amount; i++) {
      const paraLength = Math.floor(Math.random() * 3) + 2;
      let para = '';
      for (let j = 0; j < paraLength; j++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = loremWords.slice(0, sentenceLength).join(' ');
        para += sentence.charAt(0).toUpperCase() + sentence.slice(1) + '. ';
      }
      result += para + '\n\n';
    }
  } else if (type === 'chars') {
    let text = '';
    while (text.length < amount) {
      text += loremWords.join(' ') + ' ';
    }
    result = text.substring(0, amount);
  }

  return result.trim();
}

document.getElementById('generate-lorem').addEventListener('click', () => {
  const type = document.getElementById('lorem-type').value;
  const amount = parseInt(document.getElementById('lorem-amount').value) || 3;
  const statusEl = document.getElementById('lorem-status');

  if (amount < 1 || amount > 100) {
    statusEl.textContent = 'La quantité doit être entre 1 et 100';
    statusEl.className = 'status-message error';
    return;
  }

  const lorem = generateLorem(type, amount);
  document.getElementById('lorem-output').value = lorem;
  statusEl.textContent = 'Lorem Ipsum généré avec succès ✓';
  statusEl.className = 'status-message success';
});

document.getElementById('copy-lorem').addEventListener('click', () => {
  const lorem = document.getElementById('lorem-output').value;
  if (lorem) {
    navigator.clipboard.writeText(lorem).then(() => {
      showNotification('Lorem Ipsum copié !', 'success');
    });
  }
});

