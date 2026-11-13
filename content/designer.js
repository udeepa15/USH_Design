/* ==========================================================================
   DESIGNER INFORMATION
   Everything about the person: name, biography, philosophy, process.
   Replace each [PLACEHOLDER] (and the guidance sentence after it) with the
   real text. Placeholders are highlighted on the website so that nothing
   unfinished can be mistaken for final copy.
   ========================================================================== */
window.DESIGNER = {
  name: '[DESIGNER_NAME]',
  role: 'Fashion Designer',

  /* Portrait: save a photo (ideally 4:5, at least 1200px wide) in
     content/images/ and put its path here, e.g. 'content/images/portrait.jpg'.
     While empty, a neutral placeholder is shown. */
  portrait: '',
  portraitAlt: 'Portrait of the designer',

  /* ---- About ---------------------------------------------------------- */
  intro: '[DESIGNER_INTRO] One or two sentences that introduce the designer in their own voice.',

  biography: [
    '[DESIGNER_BIO] The opening paragraph of the biography: who the designer is and what they make.',
    '[DESIGNER_BIO_CONTINUED] A second paragraph for the story so far. Add or remove paragraphs as needed.',
  ],

  details: [
    { label: 'Design philosophy',       text: '[DESIGN_PHILOSOPHY] What the designer believes clothing should do.' },
    { label: 'Creative inspiration',    text: '[CREATIVE_INSPIRATION] The references, places or ideas the work returns to.' },
    { label: 'Background & experience', text: '[BACKGROUND_AND_EXPERIENCE] Training, studios and milestones - only what is true.' },
  ],

  /* ---- Creative philosophy ------------------------------------------- */
  quote: '[DESIGNER_QUOTE] A single sentence, in the designer’s own words, that captures the point of view behind the work.',

  philosophy: [
    { title: 'Creative vision',     text: '[CREATIVE_VISION] What the work is reaching for.' },
    { title: 'Design philosophy',   text: '[DESIGN_PHILOSOPHY] The principle every piece is held to.' },
    { title: 'Inspiration',         text: '[INSPIRATION] Where ideas begin.' },
    { title: 'Craftsmanship',       text: '[CRAFTSMANSHIP] How things are made, and why it matters.' },
    { title: 'Individuality',       text: '[INDIVIDUALITY] How each piece relates to its wearer.' },
    { title: 'Attention to detail', text: '[ATTENTION_TO_DETAIL] The small decisions that define a garment.' },
  ],

  /* ---- Creative process ---------------------------------------------- */
  /* Stages are suggestions. Rename, reorder, add or remove them freely. */
  process: {
    intro: '[PROCESS_INTRO] A sentence on how an idea becomes a finished piece.',
    stages: [
      { title: 'Inspiration & Research',        text: '[PROCESS_RESEARCH] How a project begins.' },
      { title: 'Concept Development',           text: '[PROCESS_CONCEPT] How the idea is shaped and edited.' },
      { title: 'Sketching & Design',            text: '[PROCESS_SKETCHING] How the silhouette is drawn out.' },
      { title: 'Fabric & Material Selection',   text: '[PROCESS_MATERIALS] How cloth and colour are chosen.' },
      { title: 'Construction & Craftsmanship',  text: '[PROCESS_CONSTRUCTION] How the piece is cut, draped and sewn.' },
      { title: 'Final Creation',                text: '[PROCESS_FINAL] How the finished piece is fitted and presented.' },
    ],
  },
};
