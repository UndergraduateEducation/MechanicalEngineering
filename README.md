# Mechanical Engineering: Problem Generators

Practice problems for undergraduate mechanical engineering courses, generated in the browser. Each problem has its own numbers, geometry and figure, an answer checker, and a worked solution.

Static site; no build step and no server. Served by GitHub Pages from the `main` branch root, at `https://undergraduateeducation.github.io/MechanicalEngineering/`.

## Layout

- **`index.html`**: front page, listing the courses; styled by `assets/site.css`.
- **`assets/`**: `site.css` is the only file that any page loads. `common.js`, `engine.js`, `fatigue.js` and `generator.css` hold code extracted from the Shaft Analysis chapter; no page loads them.
- **Course folders**: one per course, each holding one HTML file per chapter generator and, except for `system-dynamics/`, a course index page named `index-<course>.html`.

| Folder | Course | Chapter generators | Course index |
|---|---|---|---|
| `statics/` | Statics | 9 | `index-statics.html` |
| `thermodynamics/` | Thermodynamics | 14 | `index-thermodynamics.html` |
| `mechanics-of-materials/` | Mechanics of Materials | 13 | `index-mechanics-of-materials.html` |
| `machine-design/` | Machine Design | 7 | `index-machine-design.html` |
| `system-dynamics/` | System Dynamics | 2 (Laplace transform, time-domain control) | none; not linked from the front page |

## Chapter generators

Each chapter is one self-contained file named `<Chapter>ProblemGenerator.html`, with its CSS and JavaScript inline. A chapter offers several problem types. Every problem is generated from a seed with a seeded random number generator, and the page address records the problem type and seed (`#<type>-<seed>`), so a link reproduces the same problem for anyone.

- **Answer checking**: numerical answers within 2% are accepted; the worked solution is shown on request.
- **Error reports**: every chapter outside `machine-design/` has a "Report an error" button that opens an external Google Form.
- **Local use**: all links are relative, so the site works under `/<repository>/` and when opened from a local folder.

## Adding a chapter

1. Copy an existing chapter file in the course folder and replace its problem templates in the inline `<script>`.
2. Add a card for it to the course index page.
3. For a new course, create a folder with its own `index-<course>.html` and add a card to the root `index.html`.
4. Open the page from a local folder, press **New problem** for each problem type, and check the answers against the worked solution.
