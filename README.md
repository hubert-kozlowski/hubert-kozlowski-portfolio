# Hubert Kozlowski — Professional Portfolio

Static portfolio website for the Immersive Software Engineering Careers Lab assignment. The design is a wider editorial interpretation of Hubert's personal site: restrained navy surfaces, amber accents, precise typography, evidence-led reflection layouts and a print-friendly archive mode.

## Run locally

```bash
cd /Users/hubertkozlowski/portfolio-site
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Architecture

No framework or build step is required.

- `index.html` — semantic portfolio content and assignment section structure
- `styles.css` — navy/amber visual system, responsive editorial layout, reduced-motion handling and print/PDF styles
- `script.js` — mobile navigation, active section highlighting and print preparation
- `assets/` — CV, headshot and talk evidence images

The page is readable with JavaScript disabled. Interactive behaviour is progressive enhancement rather than a requirement for accessing content.

## Keyboard navigation

- `Tab` moves through links and controls with visible focus indicators
- `Escape` closes the mobile navigation
- Section navigation uses ordinary anchor links
- The skip link is the first tab stop

## Before submission

The current site is a strong structured draft, but it is **not submission-ready** until the personal evidence below is added. Do not leave placeholder text in the final version.

1. Add your student ID in the plagiarism declaration.
2. Review the drafted talk reflections for accuracy. Either add notes for **George F. Dierberger’s talk** or remove that incomplete evidence card before submission.
3. Write the **Career Connect** reflection from your real experience.
4. Add completion evidence for the **Library Skills Programme**.
5. Add completion evidence for the **Assignment Toolkit**.
6. Review every reflective section so the writing is accurate, specific and in your own voice.
7. Update the AI declaration so it accurately reflects the tools and prompts you used. Keep records of prompts and responses for the academic year.
8. Add evidence images or screenshots only where they support the reflection and you have permission to use them.
9. Print or save the site as a PDF and check that the archive copy is readable.

## Verification checklist

Before final submission, check:

- desktop and mobile rendering
- no horizontal overflow at 320px
- keyboard-only navigation and visible focus states
- mobile menu open, close and focus restoration
- reduced-motion rendering
- colour contrast on rendered surfaces
- no browser console errors or failed asset requests
- no-JavaScript readability
- print/PDF output

## Deployment

This is a static site and can be deployed without a build step.

### GitHub Pages

1. Commit and push these files.
2. In the repository settings, enable GitHub Pages from the main branch root.

### Netlify or Vercel

Import the repository and use no build command. Publish the repository root.
