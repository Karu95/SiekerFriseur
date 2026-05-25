# Deployment-Anleitung: Sieker Friseur Website

Diese Anleitung erklärt Schritt für Schritt, wie die Website online gestellt wird.
Kein technisches Vorwissen erforderlich.

---

## 1. Hosting-Empfehlung

| Anbieter           | Kosten            | Besonderheiten |
|--------------------|-------------------|----------------|
| **Netlify**        | Kostenlos (Basis) | Drag & Drop Upload, automatisches HTTPS, weltweites CDN, ideal für statische Seiten |
| **Hetzner Webspace** | ~2 EUR/Monat    | Deutsches Unternehmen, DSGVO-freundlich, FTP-Upload, .de-Domains direkt buchbar |
| **SiteGround**     | ~5–10 EUR/Monat  | Sehr guter Support, einfaches Control Panel, overkill für eine statische Seite |

**Empfehlung: Netlify (kostenlos starten)**
Für eine statische One-Pager-Website ist Netlify die beste Wahl. Der kostenlose Plan
reicht für diese Website vollkommen aus (kein Datenbankzugriff, kein serverseitiger Code).
Später kann bei Bedarf auf Hetzner gewechselt werden, wenn mehr Kontrolle gewünscht wird.

---

## 2. Domain registrieren

**Empfohlene Anbieter für .de-Domains:**
- **INWX** (https://www.inwx.de) – günstigste Option, ~6–8 EUR/Jahr, technisch versiert
- **Hetzner** (https://www.hetzner.com/de/webhosting) – einfaches Interface, ~12 EUR/Jahr

**Kosten:** Eine .de-Domain kostet ca. **10–12 EUR pro Jahr**.

**Empfohlener Domainname:** `sieker-friseur.de` oder `siekerfriseur.de`

**So geht's (am Beispiel INWX):**
1. Auf https://www.inwx.de gehen → Konto erstellen
2. Im Suchfeld die gewünschte Domain eingeben → bestellen
3. Jährlich automatisch verlängern lassen

---

## 3. Website hochladen

### Variante A: Netlify (Drag & Drop – empfohlen)

1. Gehe auf https://app.netlify.com → kostenloses Konto erstellen
2. Im Dashboard: **"Add new site" → "Deploy manually"**
3. Den gesamten Website-Ordner (mit `index.html`, `style.css`, `main.js`, `assets/` usw.)
   in das gestrichelte Feld ziehen
4. Netlify generiert automatisch eine Adresse wie `random-name.netlify.app`
5. Später eigene Domain verbinden (siehe Abschnitt 4)

### Variante B: FTP-Upload (z. B. für Hetzner)

Benötigtes Programm: **FileZilla** (kostenlos, https://filezilla-project.org)

1. FileZilla öffnen → oben links: `Datei → Servermanager`
2. Neuen Server anlegen mit:
   - **Host:** (steht in der Hetzner-Willkommens-E-Mail, z. B. `s123456.web.hetzner.net`)
   - **Protokoll:** FTP oder SFTP
   - **Benutzername & Passwort:** aus der Hetzner-E-Mail
3. Verbinden
4. Im rechten Bereich (Server) in den Ordner `/public_html` oder `/httpdocs` wechseln
5. Alle Dateien aus dem Website-Ordner nach rechts ziehen (hochladen)
6. Fertig – die Seite ist nun über die Hetzner-Domain erreichbar

---

## 4. DNS einrichten

DNS verbindet die Domain (z. B. `sieker-friseur.de`) mit dem Hosting.

### Was der Entwickler macht:
- Die technischen DNS-Einträge (A-Record oder Nameserver) heraussuchen
- Diese dem Salon-Inhaber oder dem Domain-Anbieter mitteilen

### Was der Salon-Inhaber (oder der Entwickler mit Zugangsdaten) macht:

**Bei Netlify:**
1. Im Netlify-Dashboard: `Domain settings → Add custom domain`
2. Domain eingeben → Netlify zeigt Nameserver an (z. B. `dns1.p01.nsone.net`)
3. Beim Domain-Anbieter (INWX/Hetzner) einloggen → Domain-Einstellungen → Nameserver ändern
4. Netlifies Nameserver eintragen (alle 4 Stück)
5. Warten: DNS-Änderungen dauern 1–24 Stunden

**Bei Hetzner Webspace:**
1. Im Hetzner-Panel: IP-Adresse des Webspaces notieren
2. Beim Domain-Anbieter: `DNS → A-Record` anlegen
   - Name: `@` (für die Hauptdomain)
   - Wert: IP-Adresse des Webspaces
   - TTL: 3600

---

## 5. SSL-Zertifikat (HTTPS)

**Warum wichtig?**
Ohne HTTPS zeigen Browser eine Sicherheitswarnung. Google bevorzugt HTTPS-Seiten
im Ranking. Außerdem schützt HTTPS Besucher vor Datenmissbrauch.

**Netlify:** HTTPS wird **automatisch und kostenlos** aktiviert (über Let's Encrypt),
sobald die Domain verbunden ist. Kein Handlungsbedarf.

**Hetzner Webspace:** Im Hetzner-Control-Panel unter `SSL/TLS` → Let's Encrypt-Zertifikat
mit einem Klick aktivieren. Kostenlos und automatisch erneuert.

---

## 6. Google Analytics einrichten

1. Gehe auf https://analytics.google.com → neues Konto & Property anlegen
2. Property-Typ: **Web**, Domain eingeben
3. Die **Measurement-ID** kopieren (Format: `G-XXXXXXXXXX`)
4. In der Datei `cookie-consent.js` die Zeile suchen:
   ```js
   const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
   ```
5. `G-XXXXXXXXXX` durch die echte Measurement-ID ersetzen
6. Website neu hochladen

Analytics-Daten erscheinen nach dem ersten Seitenaufruf im Google-Dashboard.

---

## 7. Meta Pixel einrichten

1. Gehe auf https://business.facebook.com → Events Manager → Pixel erstellen
2. Die **Pixel-ID** kopieren (16-stellige Zahl)
3. In der Datei `cookie-consent.js` die Zeile suchen:
   ```js
   const META_PIXEL_ID = 'XXXXXXXXXXXXXXXXXX';
   ```
4. `XXXXXXXXXXXXXXXXXX` durch die echte Pixel-ID ersetzen
5. Website neu hochladen

Der Pixel wird nur geladen, wenn ein Besucher im Cookie-Banner „Alle akzeptieren" wählt.

---

## 8. Buchungssystem konfigurieren (Simplybook.me)

1. Konto anlegen unter https://simplybook.me → **"Kostenlos starten"**
2. Im Einrichtungsassistenten:
   - **Dienstleistungen** anlegen: z. B. „Herrenhaarschnitt", „Damenhaarschnitt",
     „Bart trimmen", „Färben" – jeweils mit Dauer und Preis
   - **Mitarbeiter** anlegen: Sipan + ggf. weitere
   - **Arbeitszeiten** eintragen: Mo–Fr 09:00–19:00, Sa 09:00–18:00
3. Im Simplybook-Dashboard: `Settings → iFrame` → die Einbettungs-URL kopieren
   (Format: `https://DEIN-NAME.simplybook.me/v2/`)
4. In `index.html` die Zeile suchen:
   ```html
   src="https://IHRE-SUBDOMAIN.simplybook.me/v2/"
   ```
5. `IHRE-SUBDOMAIN` durch den eigenen Kontonamen ersetzen
6. Website neu hochladen

---

## 9. Nach dem Launch – Checkliste

Folgende Punkte nach dem Go-Live erledigen:

- [ ] **Google Search Console** einrichten: https://search.google.com/search-console
      → Property hinzufügen → Sitemap einreichen (optional: `sitemap.xml` erstellen)
- [ ] **Google Business Profil** aktualisieren: https://business.google.com
      → Website-URL auf die neue Adresse ändern
      → Öffnungszeiten prüfen
      → Fotos aktualisieren
- [ ] **Planity-Account** kündigen (Kündigungsfrist prüfen!)
- [ ] **Impressum** (`impressum.html`) und **Datenschutzerklärung** (`datenschutz.html`)
      erstellen – ein Anwalt oder Generator wie https://www.e-recht24.de empfohlen
- [ ] Echte Fotos (Hero, Team, Galerie) einbauen und Platzhalter entfernen
- [ ] Social-Media-Links in `index.html` auf echte Profile aktualisieren
- [ ] Simplybook.me-iFrame-URL eintragen (siehe Abschnitt 8)
- [ ] Website auf Mobilgerät (375 px) und Tablet (768 px) testen
- [ ] Cookie-Banner testen: Ablehnen → keine externen Anfragen; Akzeptieren → Analytics lädt
