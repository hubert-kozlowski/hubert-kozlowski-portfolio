# Hubert Kozlowski — Professional Portfolio

Static portfolio website for the Immersive Software Engineering Careers Lab assignment.

## Run locally

```bash
cd /Users/hubertkozlowski/portfolio-site
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Before submission

The current site is a strong structured draft, but it is **not submission-ready** until the personal evidence below is added. Do not leave placeholder text in the final version.

1. Replace the hero placeholder with a professional photograph.
   - Recommended file: `assets/profile.jpg`
   - Then replace the `.portrait-placeholder` element in `index.html` with an `<img>` element and descriptive alt text.
2. Add your student ID in the plagiarism declaration.
3. Replace the two marked cards in **What I learned from others** with real guest speakers, industry talks, employer events or professional engagement activities from the module.
4. Write the **Career Connect** reflection from your real experience.
5. Add completion evidence for the **Library Skills Programme**.
6. Add completion evidence for the **Assignment Toolkit**.
7. Review every reflective section so the writing is accurate, specific and in your own voice.
8. Update the AI declaration so it accurately reflects the tools and prompts you used. Keep records of prompts and responses for the academic year.
9. Add evidence images or screenshots only where they support the reflection and you have permission to use them.
10. Print or save the site as a PDF and check that the archive copy is readable.

## Deployment

This is a static site and can be deployed without a build step.

### GitHub Pages

1. Create a GitHub repository.
2. Commit and push these files.
3. In the repository settings, enable GitHub Pages from the main branch root.

### Netlify or Vercel

Import the repository and use no build command. Publish the repository root.

## Files

- `index.html` — all portfolio content and section structure
- `styles.css` — responsive styling and print/PDF styles
- `script.js` — mobile navigation, active section highlighting and print behaviour
- `assets/Hubert_Kozlowski_CV.pdf` — downloadable CV copy
