# BiblioHub

Eine einfache Benutzerverwaltung mit Node.js, Express und MongoDB. Das Projekt wurde im Rahmen des Moduls 165 erstellt.

## Technologien

- **Backend:** Node.js, Express
- **Datenbank:** MongoDB mit Mongoose
- **Frontend:** HTML, CSS und JavaScript

## Funktionen

- Benutzer erstellen, anzeigen, aktualisieren und löschen (CRUD)
- Avatarbilder hochladen und ändern
- Bilder im Dateisystem speichern
- Bildpfade in MongoDB verwalten
- Avatarbilder beim Aktualisieren und Löschen eines Benutzers entfernen

## Installation

### **1. Abhängigkeiten installieren**

```bash
npm install
```

### **2. `.env` erstellen**

```dotenv
PORT=3000
URI=mongodb://BENUTZER:PASSWORT@localhost:27017/?authSource=admin
```

Die MongoDB-Verbindung muss entsprechend der eigenen Umgebung angepasst werden.
Beispiel unter `.env.example`.

### **3. Server starten**

```bash
node server.js
```

Die Anwendung ist anschliessend unter `http://localhost:3000` erreichbar.

## API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| GET | `/users` | Alle Benutzer abrufen |
| GET | `/user/:id` | Einzelnen Benutzer abrufen |
| POST | `/user` | Benutzer erstellen |
| PUT | `/user/:id` | Benutzer aktualisieren |
| DELETE | `/user/:id` | Benutzer löschen |

## Bildspeicherung

Avatarbilder werden als Base64-String an das Backend übertragen und im Verzeichnis `public/uploads/` als Bilddateien gespeichert.

In MongoDB wird ausschliesslich der Dateipfad gespeichert.
