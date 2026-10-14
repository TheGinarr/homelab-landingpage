# Homelab-Landingpage

Eine schlanke, statische Startseite für ein privates Homelab: Übersicht über Dienste und Projekte, Impressum, Datenschutzerklärung und 404-Seite. Kein Build-Schritt, kein Framework, kein Tracking.

## Features

- **Reines HTML/CSS/JS** – läuft auf jedem Webserver (Apache, nginx, Caddy, XAMPP, GitHub Pages …)
- **Barrierearm** (Ziel WCAG 2.1 AA): Skip-Link, Fokus-Ringe, ausreichende Kontraste, Tastaturbedienung, Screenreader-Texte
- **Partikel-Hintergrund** mit Pause-Button, respektiert `prefers-reduced-motion`, pausiert bei unsichtbarem Tab
- **Whitelist-Dialog** (z. B. für einen Minecraft-Server): öffnet nur das E-Mail-Programm, überträgt nichts an den Server
- **Augenzwinkernder Cookie-Hinweis** („amtlich notwendige Cookies – genau keins“)
- **Lokale Schriften** (IBM Plex), keine externen Requests
- Vorlagen für **Impressum** und **Datenschutzerklärung** (deutsches Recht, inkl. Cloudflare-Abschnitt)

## Schnellstart

1. Ordner auf den Webserver kopieren, z. B. `C:\xampp\htdocs\homelab` → `http://localhost/homelab/`
2. Fertig. Alles Weitere ist Anpassung.

## Anpassen – Checkliste

| Was | Wo |
|---|---|
| Seitenname „Mein Homelab“ und Logo-Buchstabe „H“ | alle `*.html` (Header, Footer, `<title>`) |
| Dienste-Karten (Name, Status, URL, Beschreibung) | `index.html`, Abschnitt `#dienste` |
| Projekte | `index.html`, Abschnitt `#projekte` |
| Domain für `canonical`/`og:url` (`example.com`) | `<head>` aller Seiten |
| E-Mail-Adresse (`kontakt@example.com`) | `index.html` (Dialog), `impressum.html`, `datenschutz.html` |
| **Name und Anschrift** (`Vorname Nachname`, `Musterstraße 1` …) | `impressum.html`, `datenschutz.html` |
| **Zuständige Datenschutzaufsichtsbehörde** | `datenschutz.html`, Nr. 9 |
| Farben | `assets/style.css`, Variablen in `:root` |
| Cookie-Hinweis-Text | `assets/hinweis.js` |
| Favicon | `favicon.svg`, `favicon.ico` |

Status-Klassen für Karten: `public` (Öffentlich), `login` (Login nötig / Whitelist), `paused`, `planned`, `work`.

## Rechtliches – bitte selbst prüfen

Impressum und Datenschutzerklärung sind **Vorlagen, keine Rechtsberatung**. Sie gehen davon aus, dass

- die Seite privat und nichtkommerziell ist (Impressum nach § 18 Abs. 1 MStV),
- der Webserver **keine Zugriffs-Logs** schreibt (sonst Nr. 3 anpassen: Inhalt, Zweck, Speicherdauer),
- die Seite über **Cloudflare** ausgeliefert wird (sonst Nr. 4 streichen).

Passe die Texte an deinen tatsächlichen Betrieb an.

## Lizenz

- Code und Texte: [MIT](LICENSE)
- Schriften IBM Plex: SIL Open Font License 1.1, siehe [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt)
