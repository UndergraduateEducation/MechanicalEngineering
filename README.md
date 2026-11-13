# Mechanical Engineering: Problem Generators

Static site; no build step. Served by GitHub Pages from the `main` branch root.

## Layout

- `index.html`: course list.
- `machine-design/`, `mechanics-of-materials/`: one folder per course, each with an `index.html` and one HTML file per chapter generator.
- `assets/generator.css`: styles shared by all chapter generators.
- `assets/common.js`: seeded random numbers, number formatting, SVG drawing helpers.
- `assets/fatigue.js`: Marin factors, S-N line, and fatigue criteria.
- `assets/engine.js`: page logic shared by all chapters (problem selector, seed handling, answer checking, solution toggle).
- `assets/site.css`: styles for the index pages.

## Adding a chapter

1. Copy an existing chapter file in the course folder.
2. Replace the problem templates in the inline `<script>` (the `TEMPLATES` object and its helpers); keep the `<script src>` lines.
3. Add a card to the course `index.html`.

All links are relative, so the site works under `/<repository>/` and when opened from a local folder.
