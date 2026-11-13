# Fashion Design Portfolio

A static, single-page portfolio site: plain HTML, CSS and JavaScript, no build
step and no framework. Text and photographs are kept in a few small files so
the site can be updated without touching layout code.

## Run it locally

Either double-click `index.html`, or serve the folder (closer to how it will
behave once hosted):

```
python -m http.server 8000
```

then open <http://localhost:8000>.

## Where everything lives

```
index.html                    page structure + SEO tags in <head>
favicon.svg                   placeholder mark
content/
  designer.js                 name, biography, philosophy, process   <- personal information
  contact.js                  WhatsApp, email, Instagram, location   <- contact details
  site.config.js              hero wording, which photos the hero/process use
  images/                     portrait photo goes here
portfolio/
  portfolio.config.js         collections: titles, categories, descriptions, order
  images/<collection>/        ORIGINAL photographs (you add these)
  optimized/                  generated web-sized copies (do not edit)
  manifest.js                 generated list of images (do not edit)
assets/css/styles.css         design tokens (colours, fonts, spacing) at the top
assets/js/app.js              behaviour
tools/build_portfolio.py      image pipeline
```

## Add or change photographs

1. Put the files in a folder inside `portfolio/images/`. One folder is one
   collection, e.g. `portfolio/images/bridal-2026/`. JPG, JPEG, PNG and WebP
   are supported. Files are shown in file-name order, so `01-...`, `02-...`
   is the easy way to arrange them.
2. Run the image pipeline:

   ```
   python tools/build_portfolio.py
   ```

   (needs Pillow once: `python -m pip install pillow`). It writes web-sized
   WebP copies to `portfolio/optimized/` and refreshes `portfolio/manifest.js`.
   Originals are never altered.
3. Optional: describe the collection in `portfolio/portfolio.config.js`
   (title, category, year, description, cover image, captions, alt text).
   A folder that is not listed there still appears, titled after its folder
   name.

To remove a photo or a collection, delete it from `portfolio/images/` and run
the script again. Remove its entry from `portfolio.config.js` too - a listed
collection with no photographs is shown with neutral placeholders.

By default the script trims solid black bars from the top and bottom of images
(left by phone screenshots). Use `--no-trim` to switch that off.

The hero and process photographs are chosen in `content/site.config.js`
(`images`). The portrait is set with `portrait` in `content/designer.js`.

## Update the text

- **Designer name, biography, philosophy, process:** `content/designer.js`
- **Section headings and hero line:** `content/site.config.js`
- **Collection titles and descriptions:** `portfolio/portfolio.config.js`
- **Browser title, search description, link-preview tags:** the `<head>` of `index.html`

Anything written as `[LIKE_THIS]` is a placeholder. Placeholders are shown in
the accent colour on the site so unfinished copy is easy to spot.

## Contact details

All in `content/contact.js`.

- **WhatsApp:** set `whatsapp.number` to the full international number
  (country code first, e.g. `94771234567`) and adjust `whatsapp.message`.
  The site builds `https://wa.me/<number>?text=<encoded message>`. Until a
  valid number is set, no WhatsApp button is shown anywhere.
- **Email:** `email`
- **Instagram:** `instagram.url` (and optionally `instagram.handle`)
- **Location:** `location`
- **Other profiles:** add `{ label, url }` entries to `social`

## Change the look

Colours, typefaces and spacing are CSS variables at the top of
`assets/css/styles.css`. The fonts (Cormorant Garamond and DM Sans) are loaded
from Google Fonts in the `<head>` of `index.html`.

## Publishing

Upload the whole folder to any static host (GitHub Pages, Netlify, Vercel,
ordinary web hosting). After the address is known, make `og:image` in
`index.html` an absolute URL so link previews show the image.
