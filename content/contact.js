/* ==========================================================================
   CONTACT & SOCIAL
   WhatsApp, email, Instagram, location. Nothing here is invented: until a
   real value is entered, the matching link is not shown as a working link.
   ========================================================================== */
window.CONTACT = {
  /* ---- WhatsApp --------------------------------------------------------
     number:  full international number, country code first, digits only
              (spaces, + and dashes are tolerated), e.g. '94771234567'.
     message: text pre-filled in the chat.
     The site builds  https://wa.me/<number>?text=<encoded message>.
     While the number is not set, every WhatsApp button stays hidden.     */
  whatsapp: {
    number: 'REPLACE_WITH_NUMBER',
    message: 'Hello! I would like to enquire about your fashion designs.',
  },

  email: '[CONTACT_EMAIL]',              // e.g. 'studio@example.com'
  location: '[DESIGNER_LOCATION]',       // e.g. 'City, Country'

  instagram: {
    url: '[INSTAGRAM_URL]',              // full link, e.g. 'https://www.instagram.com/handle/'
    handle: '',                          // optional, e.g. '@handle' (derived from the url if empty)
  },

  /* Optional extra profiles, shown in the social section and footer.
     Example: { label: 'Pinterest', url: 'https://www.pinterest.com/handle/' } */
  social: [],

  /* ---- Contact section wording --------------------------------------- */
  heading: 'Enquiries',
  invitation: 'For commissions, collaborations and questions about the work, write directly.',
  enquiryNote: '[ENQUIRY_NOTE] Optional: availability, lead times, or the kinds of projects currently being accepted. Set to an empty string to hide this line.',
};
