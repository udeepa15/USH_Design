/* ==========================================================================
   PORTFOLIO DATA
   One entry per collection. `slug` must match a folder name inside
   portfolio/images/. Collections appear on the site in the order below.

   Per collection:
     slug         folder name in portfolio/images/            (required)
     title        display title
     category     must match one of `categories` to be filterable
     year         optional
     description  optional short text
     cover        optional file name to use as the cover (default: first file)
     order        optional array of file names to override alphabetical order
     images       optional per-file { caption, alt }
     hidden       true to keep a collection off the site

   A folder that exists in portfolio/images/ but is not listed here still
   appears (after the listed ones) with a title made from its folder name.

   Titles, categories and descriptions below are WORKING COPY written from
   what is visible in the photographs. Replace them with the designer's own.
   ========================================================================== */
window.PORTFOLIO = {
  /* Filter buttons, in this order. Suggestions for later: 'Couture',
     'Bridal', 'Evening Wear', 'Contemporary', 'Custom', 'Experimental'. */
  categories: ['Fabric Manipulation', 'Draping', 'Illustration'],

  collections: [
    {
      slug: 'folded-calico',
      title: 'Folded Calico',
      category: 'Fabric Manipulation',
      year: '',
      description: 'Tiered, hand-folded points in unbleached calico, pinned and studied on the stand.',
      cover: '01-bib.jpeg',
      images: {
        '01-bib.jpeg':      { caption: 'Tiered bib, front',  alt: 'Tiered bib of folded calico points pinned to the front of a black dress form' },
        '02-shoulder.jpeg': { caption: 'Shoulder piece',     alt: 'Cascading folded calico points pinned over the shoulder of a black dress form' },
        '03-detail.jpeg':   { caption: 'Fold detail',        alt: 'Close view of rows of folded unbleached calico' },
      },
    },
    {
      slug: 'violet-bloom',
      title: 'Violet Bloom',
      category: 'Fabric Manipulation',
      year: '',
      description: 'A layered, radial fold in violet, placed at the bust, the waist and the hip.',
      cover: '01-bust.jpeg',
      images: {
        '01-bust.jpeg':  { caption: 'Placement at the bust',  alt: 'Large layered violet fabric bloom across the bust of a black dress form' },
        '02-waist.jpeg': { caption: 'Placement at the waist', alt: 'Layered violet fabric bloom at the waist of a black dress form' },
        '03-hip.jpeg':   { caption: 'Placement at the hip',   alt: 'Layered violet fabric bloom at the hip of a black dress form' },
      },
    },
    {
      slug: 'petal-forms',
      title: 'Petal Forms',
      category: 'Draping',
      year: '',
      description: 'Overlapping petal shapes in magenta, draped as a peplum and across the shoulders.',
      cover: '01-peplum.jpeg',
      images: {
        '01-peplum.jpeg':    { caption: 'Petal peplum',    alt: 'Overlapping magenta petal shapes pinned as a peplum on a black dress form' },
        '02-shoulders.jpeg': { caption: 'Petal shoulders', alt: 'Overlapping magenta petal shapes draped across the shoulders of a black dress form' },
      },
    },
    {
      slug: 'evening-illustrations',
      title: 'Evening Illustrations',
      category: 'Illustration',
      year: '2025',
      description: 'Hand-rendered gowns and evening looks in marker and coloured pencil.',
      cover: '01-ivory-and-black-gown.jpeg',
      images: {
        '01-ivory-and-black-gown.jpeg': { caption: 'Column gown with draped sleeves and train', alt: 'Fashion illustration of a black column gown with an ivory draped bodice and long train' },
        '02-red-and-black-gown.jpeg':   { caption: 'Tiered high-low gown',                      alt: 'Fashion illustration of a red and black tiered high-low gown with a corset bodice' },
        '03-blue-ball-gown.jpeg':       { caption: 'Panelled ball gown',                        alt: 'Fashion illustration of a blue ball gown with swirling linear pattern' },
        '04-pink-coat.jpeg':            { caption: 'Textured floor-length coat',                alt: 'Fashion illustration of a textured pink floor-length coat over a matching two-piece' },
        '05-ombre-dress.jpeg':          { caption: 'Off-shoulder fluted dress',                 alt: 'Fashion illustration of an off-shoulder dress fading from wine to pale pink' },
      },
    },
    {
      slug: 'tailoring-and-line',
      title: 'Tailoring & Line',
      category: 'Illustration',
      year: '2025',
      description: 'Sharp-shouldered suiting and figure studies in coloured pencil and graphite.',
      cover: '01-suit-close.jpeg',
      images: {
        '01-suit-close.jpeg':      { caption: 'Belted suit, detail',  alt: 'Fashion illustration, close view of a rust belted suit with strong shoulders' },
        '02-graphite-figure.jpeg': { caption: 'Graphite figure study', alt: 'Graphite fashion illustration of a figure in a cropped top and slim trousers' },
        '03-suit-full.jpeg':       { caption: 'Belted suit, full look', alt: 'Fashion illustration, full-length view of a rust belted suit with wide trousers' },
      },
    },
  ],
};
