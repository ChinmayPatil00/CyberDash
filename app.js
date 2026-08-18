// DevDash - Core Logic

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // PAGE 1: DATA FORMATTERS (index.html)
  // ==========================================

  // --- JSON Beautifier ---
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const btnFormatJson = document.getElementById('btn-format-json');
  const btnClearJson = document.getElementById('btn-clear-json');
  const jsonStatus = document.getElementById('json-status');

  function formatJSON() {
    if (!jsonInput || !jsonInput.value.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput.value);
      jsonOutput.innerText = JSON.stringify(parsed, null, 2);
      jsonOutput.classList.remove('error');
      jsonStatus.innerText = "Valid JSON";
      jsonStatus.className = "status-badge success";
    } catch (e) {
      jsonOutput.innerText = e.message;
      jsonOutput.classList.add('error');
      jsonStatus.innerText = "Invalid Syntax";
      jsonStatus.className = "status-badge error";
    }
  }

  if (btnFormatJson) btnFormatJson.addEventListener('click', formatJSON);
  if (btnClearJson) {
    btnClearJson.addEventListener('click', () => {
      jsonInput.value = '';
      jsonOutput.innerText = '';
      jsonStatus.innerText = "Waiting for input";
      jsonStatus.className = "status-badge";
    });
  }

  // --- JWT Decoder ---
  const jwtInput = document.getElementById('jwt-input');
  const jwtHeader = document.getElementById('jwt-header-output');
  const jwtPayload = document.getElementById('jwt-payload-output');
  const jwtStatus = document.getElementById('jwt-status');

  function decodeJWT() {
    const token = jwtInput.value.trim();
    if (!token) {
      jwtHeader.innerText = '';
      jwtPayload.innerText = '';
      jwtStatus.innerText = "Waiting for token";
      jwtStatus.className = "status-badge";
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      jwtHeader.innerText = "Invalid JWT Format";
      jwtPayload.innerText = "Expected 3 parts separated by dots.";
      jwtStatus.innerText = "Invalid Token";
      jwtStatus.className = "status-badge error";
      return;
    }

    try {
      // Decode base64url to base64, then decode, then parse JSON
      const decodeB64Url = (str) => {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with '='
        while (b64.length % 4) b64 += '=';
        return decodeURIComponent(atob(b64).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
      };

      const headerObj = JSON.parse(decodeB64Url(parts[0]));
      const payloadObj = JSON.parse(decodeB64Url(parts[1]));

      jwtHeader.innerText = JSON.stringify(headerObj, null, 2);
      jwtPayload.innerText = JSON.stringify(payloadObj, null, 2);
      
      jwtStatus.innerText = "Decoded Successfully";
      jwtStatus.className = "status-badge success";
    } catch (e) {
      jwtHeader.innerText = "Decoding Error";
      jwtPayload.innerText = e.message;
      jwtStatus.innerText = "Error";
      jwtStatus.className = "status-badge error";
    }
  }

  if (jwtInput) {
    jwtInput.addEventListener('input', decodeJWT);
  }

  // ==========================================
  // PAGE 2: GENERATORS & CRYPTO (tools.html)
  // ==========================================

  // --- Hash Generator ---
  const hashInput = document.getElementById('hash-input');
  const hash256 = document.getElementById('hash-256-output');
  const hash384 = document.getElementById('hash-384-output');

  async function generateHashes() {
    const text = hashInput.value;
    if (!text) {
      hash256.innerText = '';
      hash384.innerText = '';
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // SHA-256
    const hashBuffer256 = await crypto.subtle.digest('SHA-256', data);
    const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
    hash256.innerText = hashArray256.map(b => b.toString(16).padStart(2, '0')).join('');

    // SHA-384
    const hashBuffer384 = await crypto.subtle.digest('SHA-384', data);
    const hashArray384 = Array.from(new Uint8Array(hashBuffer384));
    hash384.innerText = hashArray384.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  if (hashInput) {
    hashInput.addEventListener('input', generateHashes);
  }

  // --- Base64 Encoder/Decoder ---
  const b64Plain = document.getElementById('b64-plain');
  const b64Encoded = document.getElementById('b64-encoded');
  let b64IsEncoding = false;

  if (b64Plain && b64Encoded) {
    b64Plain.addEventListener('input', () => {
      if (b64IsEncoding) return;
      b64IsEncoding = true;
      try {
        b64Encoded.value = btoa(b64Plain.value);
      } catch (e) {
        b64Encoded.value = "Error encoding (invalid characters)";
      }
      b64IsEncoding = false;
    });

    b64Encoded.addEventListener('input', () => {
      if (b64IsEncoding) return;
      b64IsEncoding = true;
      try {
        b64Plain.value = atob(b64Encoded.value);
      } catch (e) {
        // Just ignore errors while typing invalid base64
      }
      b64IsEncoding = false;
    });
  }

  // --- UUID Generator ---
  const btnUuid = document.getElementById('btn-uuid');
  const uuidOutput = document.getElementById('uuid-output');

  if (btnUuid && uuidOutput) {
    function generateUUID() {
      // Use native crypto.randomUUID if available, else fallback
      if (crypto.randomUUID) {
        uuidOutput.innerText = crypto.randomUUID();
      } else {
        uuidOutput.innerText = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
    }
    btnUuid.addEventListener('click', generateUUID);
    generateUUID(); // generate one on load
  }

});
