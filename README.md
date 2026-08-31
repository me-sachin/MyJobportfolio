# Sachin Kumar Sharma — Portfolio

A single-page, terminal-themed portfolio built with plain HTML/CSS/JS (no frameworks, no build step).

## File structure : 

```
portfolio/
├── index.html              ← all page content (text, sections, structure)
├── css/
│   └── style.css            ← all styling (colors, fonts, spacing, layout)
├── js/
│   └── script.js            ← terminal typing animation, scroll effects, accordion
├── assets/
│   └── Sachin_Kumar_Sharma_Resume.pdf   ← the downloadable resume file
└── README.md
```

## Opening it locally

Double-click `index.html`, or in VS Code right-click it → **Open with Live Server** (install the "Live Server" extension first — plain double-click also works fine, just without auto-reload).

---

## Where to change things

### 1. Text content → `index.html`
Everything you read on the page (name, bio, job history, project descriptions, links) lives here as plain HTML. Search for the section you want by its `<!-- COMMENT -->` marker:

| Section | Marker in `index.html` | What's inside |
|---|---|---|
| Hero / intro | `<!-- HERO -->` | Name, tagline, tech tags, terminal typing lines are actually in `js/script.js` (see below) |
| About | `<!-- ABOUT -->` | Bio paragraphs, stat numbers |
| Skills | `<!-- SKILLS -->` | Skill category boxes and pills |
| Experience | `<!-- EXPERIENCE -->` | Job history timeline |
| Projects | `<!-- PROJECTS -->` | Expandable project cards |
| Education & Certifications | `<!-- CERTS + EDUCATION -->` | Degrees, certs |
| Contact | `<!-- CONTACT -->` | Email, phone, links |

To update a job, project, or bullet point, just edit the text between the relevant HTML tags — no need to touch CSS or JS.

**Contact details** — update these three lines in `index.html` if your email/phone/links ever change:
```html
<a class="contact-link" href="mailto:i.sachin950930@gmail.com">
<a class="contact-link" href="tel:+919509305040">
<a class="contact-link" href="https://linkedin.com/in/sachin-kumar-sharma">
<a class="contact-link" href="https://github.com/sachin-sharma">
```

### 2. Terminal typing animation → `js/script.js`
The lines that "type themselves" in the hero terminal are defined near the top of `script.js`:
```js
const lines = [
  {text:"$ whoami", cls:"prompt"},
  {text:"> Sachin Kumar Sharma", cls:""},
  ...
];
```
Edit the `text` values to change what it types. Keep `cls: "pass"` on lines you want in green (checkmarks), `"prompt"` for the `$` lines, `"sum"` for the final summary line.

### 3. Resume file → `assets/`
To update your resume, replace `assets/Sachin_Kumar_Sharma_Resume.pdf` with a new PDF **using the exact same filename** — the download button already points to that path. If you rename the file, also update this line in `index.html`:
```html
<a href="assets/Sachin_Kumar_Sharma_Resume.pdf" ... id="resumeBtn" download>↓ Download Resume</a>
```

### 4. Colors, fonts, spacing → `css/style.css`
All design tokens are set as CSS variables at the very top of the file:
```css
:root{
  --bg:#0B0E14;        /* page background */
  --pass:#4ADE80;       /* green accent (checkmarks, highlights) */
  --info:#5FA8FF;        /* blue accent (links) */
  --text:#EBEEF3;        /* main text color */
  --display:'Space Grotesk', sans-serif;   /* headings font */
  --body:'Inter', sans-serif;               /* paragraph font */
  --mono:'JetBrains Mono', monospace;       /* terminal/label font */
  ...
}
```
Change a variable here and it updates everywhere it's used — you don't need to hunt through the rest of the file.

### 5. Nav sections / order
If you add or remove a `<section>` in `index.html`, also update the matching button in the `<nav>` block at the top, and the `sectionIds` array near the top of `script.js`:
```js
const sectionIds = ['home','about','skills','experience','projects','contact'];
```

---

## Deploying to GitHub Pages

1. Create a new GitHub repo (e.g. `portfolio` or `sachin-sharma.github.io` if you want it at the root of your GitHub domain).
2. In VS Code, open this `portfolio` folder, then in the terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: go to the repo → **Settings → Pages** → under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)` → **Save**.
4. Wait 1–2 minutes, then your site is live at:
   - `https://<your-username>.github.io/<repo-name>/` (normal repo), or
   - `https://<your-username>.github.io/` (if the repo is named `<your-username>.github.io`)

No build step, no dependencies to install — it's static files, so this is the entire deployment process.

## Notes

- All copy on the site is taken directly from your resume — no invented stats or claims.
- The contact "curl" box is decorative (a nod to your Rest Assured background) — it copies a sample command to the clipboard, it doesn't send anything. Real outreach happens through the email/phone/LinkedIn links above it.
- Respects `prefers-reduced-motion` — if a visitor has that OS setting on, the typing animation skips straight to the final state.
