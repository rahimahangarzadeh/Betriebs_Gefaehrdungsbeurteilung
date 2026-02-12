// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Betriebs_Gefaehrdungsbeurteilung/service-worker.js')
      .then(reg => console.log('Service Worker registriert:', reg))
      .catch(err => console.log('Service Worker Fehler:', err));
  });
}

// ===== Globale Variablen =====
let map, marker, selectedLocation = null;

// ===== Datum und Zeit automatisch setzen =====
function setCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
  document.getElementById('datum').value = dateTimeString;
}

// ===== Map Modal öffnen =====
function openMapModal() {
  document.getElementById('mapModal').classList.remove('hidden');
  
  // Leaflet Map initialisieren (nur beim ersten Mal)
  if (!map) {
    map = L.map('leafletMap').setView([52.6892, 7.3117], 13); // Meppen
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Click Event
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        // ICON DEFINITION HINZUGEFÜGT
        marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          })
        }).addTo(map);
      }
      
      // Reverse Geocoding
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          selectedLocation = {
            address: data.display_name,
            lat: lat,
            lng: lng
          };
          
          document.getElementById('selectedAddress').textContent = data.display_name;
          document.getElementById('selectedAddress').classList.add('has-addr');
        })
        .catch(err => console.error('Geocoding Error:', err));
    });
  }
  
  // Map neu rendern
  setTimeout(() => map.invalidateSize(), 100);
}

// ===== Map Modal schließen =====
function closeMapModal() {
  document.getElementById('mapModal').classList.add('hidden');
}

// ===== Baustelle in Karte suchen =====
function searchMap() {
  const query = document.getElementById('mapSearchInput').value;
  
  if (!query) return;
  
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([lat, lon], 15);
        
        if (marker) {
          marker.setLatLng([lat, lon]);
        } else {
          // ICON DEFINITION HINZUGEFÜGT
          marker = L.marker([lat, lon], {
            icon: L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
              shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })
          }).addTo(map);
        }
        
        selectedLocation = {
          address: data[0].display_name,
          lat: parseFloat(lat),
          lng: parseFloat(lon)
        };
        
        document.getElementById('selectedAddress').textContent = data[0].display_name;
        document.getElementById('selectedAddress').classList.add('has-addr');
      }
    })
    .catch(err => console.error('Search Error:', err));
}

// ===== Baustelle bestätigen =====
function confirmLocation() {
  if (selectedLocation) {
    document.getElementById('baustelle').value = selectedLocation.address;
    closeMapModal();
  }
}

// ===== Vorlagen für Tätigkeiten =====
const templates = {
  rohrbau: {
    items: [
      { nr: 1, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 2, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 3, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 4, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 5, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 6, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 7, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 8, risiko: ['G'], soll: 'ja', ist: 'ja' },
      { nr: 9, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 10, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 11, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 13, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 14, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 15, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 16, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 18, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 20, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 21, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 22, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 23, risiko: ['G'], soll: 'ja', ist: 'nein' }
    ]
  },
  tiefbau: {
    items: [
      { nr: 1, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 2, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 3, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 4, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 5, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 6, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 7, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 8, risiko: ['G'], soll: 'ja', ist: 'ja' },
      { nr: 9, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 10, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 11, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 13, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 14, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 15, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 16, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 20, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 21, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 22, risiko: ['M'], soll: 'ja', ist: 'nein' }
    ]
  },
  horizontalbohrung: {
    items: [
      { nr: 1, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 2, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 3, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 4, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 5, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 6, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 7, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 9, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 10, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 11, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 13, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 14, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 15, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 16, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 19, risiko: ['G'], soll: 'ja', ist: 'nein' }
    ]
  },
  lager: {
    items: [
      { nr: 1, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 2, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 3, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 4, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 5, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 11, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 12, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 13, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 14, risiko: ['K'], soll: 'ja', ist: 'ja' }
    ]
  },
  buero: {
    items: [
      { nr: 1, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 2, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 4, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 9, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 12, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 13, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 14, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 17, risiko: ['M'], soll: 'ja', ist: 'ja' }
    ]
  },
  fernwaerme: {
    items: [
      { nr: 1, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 2, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 3, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 4, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 5, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 6, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 7, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 8, risiko: ['G'], soll: 'ja', ist: 'ja' },
      { nr: 9, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 10, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 11, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 13, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 14, risiko: ['K'], soll: 'ja', ist: 'ja' },
      { nr: 15, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 16, risiko: ['M'], soll: 'ja', ist: 'ja' },
      { nr: 18, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 20, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 21, risiko: ['G'], soll: 'ja', ist: 'nein' },
      { nr: 22, risiko: ['M'], soll: 'ja', ist: 'nein' },
      { nr: 23, risiko: ['G'], soll: 'ja', ist: 'nein' }
    ]
  }
};

function loadTemplate(templateName) {
  // Alle Felder zurücksetzen
  document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
  document.querySelectorAll('input[type="checkbox"][id^="risk-"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
  document.querySelectorAll('input[id^="pruef-"]').forEach(input => input.value = '');
  
  // Template-spezifische Felder aktivieren
  if (templates[templateName]) {
    templates[templateName].items.forEach(item => {
      const rowNum = item.nr;
      
      // Aktiviere Checkbox
      const checkbox = document.getElementById(`row-${rowNum}`);
      if (checkbox) {
        checkbox.checked = true;
      }
      
      // Setze Risiko
      if (item.risiko) {
        item.risiko.forEach(risk => {
          const riskCheckbox = document.getElementById(`risk-${risk.toLowerCase()}-${rowNum}`);
          if (riskCheckbox) {
            riskCheckbox.checked = true;
          }
        });
      }
      
      // Setze Handlungsbedarf Soll
      if (item.soll) {
        const sollRadio = document.querySelector(`input[name="soll-${rowNum}"][value="${item.soll}"]`);
        if (sollRadio) {
          sollRadio.checked = true;
        }
      }
      
      // Setze Handlungsbedarf Ist
      if (item.ist) {
        const istRadio = document.querySelector(`input[name="ist-${rowNum}"][value="${item.ist}"]`);
        if (istRadio) {
          istRadio.checked = true;
        }
      }
      
      // Setze Prüfvermerk (optional - kann leer bleiben oder Standard-Text)
      const pruefInput = document.getElementById(`pruef-${rowNum}`);
      if (pruefInput) {
        pruefInput.value = '✔'; // Einfaches Häkchen als Bestätigung
      }
    });
  }
}

// ===== Formular absenden =====
async function submitForm(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const messageDiv = document.getElementById('formMessage');
  
  // Validierung
  const requiredFields = ['datum', 'email', 'name', 'baustelle'];
  let isValid = true;
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.classList.add('invalid');
      isValid = false;
    } else {
      field.classList.remove('invalid');
    }
  });
  
  // Mindestens eine Firma
  const firmaCheckboxes = document.querySelectorAll('input[name="firma"]');
  const firmaChecked = Array.from(firmaCheckboxes).some(cb => cb.checked);
  if (!firmaChecked) {
    isValid = false;
    messageDiv.innerHTML = '<div class="form-message error">Bitte wählen Sie mindestens eine Firma aus.</div>';
    return;
  }
  
  if (!isValid) {
    messageDiv.innerHTML = '<div class="form-message error">Bitte füllen Sie alle Pflichtfelder aus.</div>';
    return;
  }
  
  // Sammle Formulardaten
  const formData = collectFormData();
  
  // DEBUGGING: Log the data to console
  console.log('=== FORMULAR DATEN ===');
  console.log('formular_typ:', formData.formular_typ);
  console.log('Komplette Daten:', formData);
  
  // Submit Button deaktivieren
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Sende...';
  
  try {
    const response = await fetch('https://n8n.node.janning-it.de/webhook/368921c2-1f7c-4c9c-911e-713601dd76d5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    console.log('Response Status:', response.status);
    
    if (response.ok) {
      messageDiv.innerHTML = '<div class="form-message success">✓ Gefährdungsbeurteilung erfolgreich gesendet!</div>';
      
      // Formular nach 2 Sekunden zurücksetzen
      setTimeout(() => {
        document.getElementById('mainForm').reset();
        setCurrentDateTime();
        messageDiv.innerHTML = '';
      }, 2000);
    } else {
      throw new Error('Netzwerkfehler');
    }
  } catch (error) {
    console.error('Error:', error);
    messageDiv.innerHTML = '<div class="form-message error">Fehler beim Senden. Bitte versuchen Sie es erneut.</div>';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Formular absenden';
  }
}

// ===== Formulardaten sammeln =====
function collectFormData() {
  // Basis-Daten mit formular_typ als ERSTES Feld
  const data = {
    formular_typ: "BetriebsGefaehrdungsbeurteilung",
    datum: document.getElementById('datum').value,
    email: document.getElementById('email').value,
    name: document.getElementById('name').value,
    baustelle: document.getElementById('baustelle').value,
    firma: Array.from(document.querySelectorAll('input[name="firma"]:checked')).map(cb => cb.value),
    gefaehrdungen: []
  };
  
  // Gefährdungen sammeln
  document.querySelectorAll('.row-checkbox:checked').forEach(checkbox => {
    const rowNum = checkbox.id.replace('row-', '');
    const rowData = {
      nummer: rowNum,
      risiko: {
        G: document.getElementById(`risk-g-${rowNum}`)?.checked || false,
        M: document.getElementById(`risk-m-${rowNum}`)?.checked || false,
        K: document.getElementById(`risk-k-${rowNum}`)?.checked || false
      },
      handlungsbedarf: {
        soll_ja: document.querySelector(`input[name="soll-${rowNum}"][value="ja"]`)?.checked || false,
        soll_nein: document.querySelector(`input[name="soll-${rowNum}"][value="nein"]`)?.checked || false,
        ist_ja: document.querySelector(`input[name="ist-${rowNum}"][value="ja"]`)?.checked || false,
        ist_nein: document.querySelector(`input[name="ist-${rowNum}"][value="nein"]`)?.checked || false
      },
      pruefvermerk: document.getElementById(`pruef-${rowNum}`)?.value || ''
    };
    
    data.gefaehrdungen.push(rowData);
  });
  
  return data;
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
  setCurrentDateTime();
  
  // Enter-Taste im Map-Suchfeld
  document.getElementById('mapSearchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchMap();
    }
  });
});
