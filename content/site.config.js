/* ==========================================================================
   SITE CONFIGURATION
   General wording and which photographs appear outside the gallery.
   Anything in [SQUARE_BRACKETS] is a placeholder waiting for real content.

   SEO note: the page <title>, meta description and Open Graph tags live in
   the <head> of index.html (search engines and link previews read them
   before any script runs) - update them there once the name is final.
   ========================================================================== */
window.SITE_CONFIG = {
  hero: {
    eyebrow: 'Fashion Design Portfolio',
    edition: 'Selected Works',
    // WORKING COPY - a neutral line describing the photographs. Replace freely.
    statement: 'Studies in form, fold and silhouette.',
    cta: 'Explore the Work',
  },

  /* Photographs used outside the gallery. Each one points at a file inside
     portfolio/images/<collection>/. Leave `file` empty to use the first image
     of that collection; remove the entry to show a neutral placeholder. */
  images: {
    hero:       { collection: 'folded-calico', file: '01-bib.jpeg' },
    heroDetail: { collection: 'folded-calico', file: '03-detail.jpeg' },
    process:    { collection: 'folded-calico', file: '02-shoulder.jpeg' },
  },

  works: {
    heading: 'Selected Works',
    intro: 'A growing index of studies, experiments and illustrations.',
  },

  social: {
    heading: 'Follow the work',
    // How many portfolio images appear in the strip beside the Instagram link.
    stripCount: 5,
  },
};
