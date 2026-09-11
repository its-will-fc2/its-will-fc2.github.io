# Godzilla-Theme Interactive Portfolio — Starter Scaffold

A working Phaser 3 prototype: walk a kaiju across a 2D city, roar, fire an atomic
beam at buildings, and reveal résumé sections in a popup modal. Content is
pre-filled from Will Huang's resume.
Run it locally

No build step needed for this scaffold — it's plain HTML/JS loading Phaser from a CDN.

    Open a terminal in this folder.

    Start any static server, e.g.:

        python3 -m http.server 8000

        or npx serve .

    Open http://localhost:8000 in your browser.

(Opening index.html directly via file:// may block module loading in some
browsers — use a local server.)
Controls

    Arrow keys / A-D: walk left/right

    SPACE: roar (screen shake + expanding shockwave ring)

    F: fire atomic beam — if a building is in range, its section modal opens
