# Aman Manderna — Data Analyst Portfolio

Static site (plain HTML/CSS/JS, no build step) hosted on GitHub Pages.

## Pages
| File | What it is |
|---|---|
| `index.html` | Home page |
| `project-uber.html`, `project-ev.html`, `project-linkedin.html` | Case studies |
| `certificates-analytics.html` | Data Analytics (Coursera) certificates |
| `certificates-corporate.html` | Organisation / corporate (GlobalLogic) certificates |

## Updating things

**Your photo** — save a portrait as `assets/profile.jpg` (roughly 4:5). Until it exists, the hero shows an "AM" placeholder.

**Certificates** — only edit `certificates-data.js`:
1. Put the certificate image in `assets/certificates/analytics/` or `assets/certificates/corporate/`.
2. Copy an entry in `certificates-data.js`, fill in `title`, `issuer`, `date`, `category`, `image`, `desc` (the one-liner) and optionally `link` (verification URL).

Card order follows the list, filter chips are built from `category`, and the counts on the home-page folders update automatically. If an image is missing, a drawn placeholder certificate is shown instead.

**Styling** — `style.css` (shared design system, day/night themes), `certificates.css`, `project.css`.
