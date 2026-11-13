# Portfolio photographs

Original, full-quality photographs live here. **One folder = one collection.**

```
portfolio/images/
  folded-calico/
    01-bib.jpeg
    02-shoulder.jpeg
  bridal-2026/            <- a new collection is just a new folder
    01-front.jpg
    02-back.jpg
```

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- Folder names: lowercase words joined with hyphens (`evening-wear`). The
  folder name is the collection's `slug` in `../portfolio.config.js`.
- Order: files are shown in file-name order - prefix them `01-`, `02-`, ...
- Size: export at the highest quality available (2000px or more on the long
  edge is ideal). Smaller, web-sized copies are generated automatically.

After adding, removing or renaming anything here, run from the project root:

```
python tools/build_portfolio.py
```

Then, if you like, give the collection a title, category, description,
captions and alt text in `portfolio/portfolio.config.js`.
