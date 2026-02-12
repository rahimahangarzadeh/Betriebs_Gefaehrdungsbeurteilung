# Betriebs-Gefährdungsbeurteilung PWA

Eine Progressive Web App (PWA) für die Janning Group zur Durchführung von Gefährdungsbeurteilungen.

## 📦 Enthaltene Dateien

- `index.html` - Hauptseite der Anwendung
- `style.css` - Stylesheet mit Janning Group Branding
- `script.js` - JavaScript mit Leaflet Map Integration und Icon-Fix
- `manifest.json` - PWA Manifest
- `service-worker.js` - Service Worker für Offline-Funktionalität
- `icon-192.png` - App Icon (192x192px)
- `icon-512.png` - App Icon (512x512px)

## 🔧 Installation

### Option 1: Lokaler Webserver

1. Alle Dateien in einen Ordner kopieren
2. Einen lokalen Webserver starten:

```bash
# Mit Python 3
python -m http.server 8000

# Mit Node.js (npx)
npx serve

# Mit PHP
php -S localhost:8000
```

3. Browser öffnen: `http://localhost:8000`

### Option 2: Als PWA installieren

1. App über HTTPS bereitstellen (erforderlich für PWA)
2. Im Browser die App öffnen
3. "Zur Startseite hinzufügen" / "App installieren" wählen

## ✅ Icon-Fix

Die Icons in der Leaflet-Karte werden jetzt korrekt angezeigt! Das Problem wurde behoben durch:

1. **Explizite Icon-Definition** beim Erstellen der Marker
2. **CDN-URLs** für die Leaflet Marker-Bilder:
   - marker-icon.png
   - marker-icon-2x.png (Retina)
   - marker-shadow.png

```javascript
marker = L.marker([lat, lng], {
  icon: L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  })
}).addTo(map);
```

## 🗺️ Karten-Funktionalität

- OpenStreetMap Integration via Leaflet.js
- Standort durch Klick auf Karte wählen
- Adresssuche mit Geocoding
- Reverse Geocoding für automatische Adresserkennung

## 📋 Features

- Grunddaten-Erfassung
- 23 Gefährdungen mit Risikobewertung
- Vorlagen für verschiedene Tätigkeiten:
  - Rohrbauarbeiten
  - Tiefbauarbeiten
  - Horizontalbohrung
  - Lagerarbeiten
  - Büroarbeiten
  - Fernwärmeleitungen
- Offline-Funktionalität durch Service Worker
- Responsive Design für Mobile und Desktop

## 🚀 Webhook

Die App sendet Daten an:
```
https://n8n.node.janning-it.de/webhook/368921c2-1f7c-4c9c-911e-713601dd76d5
```

## 🎨 Design

- Janning Group Corporate Design
- Orange Accent Color (#e8610a)
- Dunkler Header (#1a1a18)
- Barlow & Barlow Condensed Fonts

## 📱 PWA Features

- Installierbar auf Homescreen
- Offline-Nutzung
- App-Icon auf Startseite
- Standalone-Modus

## ⚠️ Wichtig

Die App benötigt:
- Moderne Browser mit ES6 Support
- HTTPS für PWA-Features (außer localhost)
- Internetverbindung für:
  - Kartenansicht
  - Geocoding
  - Formular-Übermittlung

## 📝 Lizenz

© Janning Group - Alle Rechte vorbehalten
