/* All site content lives here. Edit texts, order and videos in this file only. */
window.SITE = {
  /* Bump after replacing images so browsers fetch the new files instead of cached ones */
  version: 24,

  contact: {
    whatsapp: '972546984986',   // international format: no +, no leading 0, no dashes
    email: 'audax.tlv@gmail.com',
    instagram: 'https://www.instagram.com/barak__ai/'
  },

  /* Clips that play in the hero wall. Each opens its full video on click. */
  hero: ['sacara-2', 'snips-1', 'maison-murphy', 'particle-gravite', 'legeneral-1', 'spec-knife',
         'snips-3', 'particle-scent', 'sacara-3', 'spec-bali', 'film-garden', 'spec-go'],

  /* Client projects, in display order. featured: true = big card. */
  clients: [
    {
      id: 'snips', name: 'Snips', logo: 'snips', featured: true,
      tag: 'אפליקציית סדרות קצרות',
      about: 'סדרת פרסומות לאפליקציית הסטרימינג Snips: סיפורים שלמים בתוך דקה, בדיוק כמו המוצר.',
      groups: [{ videos: [
        { id: 'snips-1', title: 'החתונה' },
        { id: 'snips-2', title: 'המשרד' },
        { id: 'snips-3', title: 'סיפורים גדולים' }
      ]}]
    },
    {
      id: 'particle', name: 'Particle', logo: 'particle', featured: true,
      tag: 'טיפוח לגברים',
      cover: ['particle-gravite', 'particle-scent', 'particle-barber'],
      about: 'פרסומות מוצר, קמפיין בושם וסרטוני UGC למותג הטיפוח האמריקאי Particle.',
      groups: [
        { videos: [
          { id: 'particle-gravite', title: 'Gravité · בושם' },
          { id: 'particle-scent', title: 'Gravité · תווי ריח' },
          { id: 'particle-iefc', title: 'קרם מיצוק לעיניים' },
          { id: 'particle-barber', title: 'סרום נגד שיבה · המספרה' },
          { id: 'particle-podcast', title: 'סרום נגד שיבה · פודקאסט' }
        ]},
        { title: 'UGC', videos: [
          { id: 'particle-facecream', title: '6 סיבות · קרם פנים' },
          { id: 'particle-shampoo', title: '5 סיבות · שמפו' }
        ]}
      ]
    },
    {
      id: 'maison', name: 'Maison du Miel', logo: 'maison', featured: true,
      coverImage: 'maison-murphy-wide',
      tag: 'בשמים',
      about: 'סרט מותג לבית הבשמים Maison du Miel.',
      groups: [{ videos: [
        { id: 'maison-murphy', title: 'Loi de Murphy' }
      ]}]
    },
    {
      id: 'sacara', name: 'SACARA', logo: 'sacara', featured: true,
      tag: 'בשמים',
      about: 'סדרת סרטוני מוצר לבשמים של SACARA.',
      groups: [{ videos: [
        { id: 'sacara-1', title: 'SACARA 01' },
        { id: 'sacara-2', title: 'SACARA 02' },
        { id: 'sacara-3', title: 'SACARA 03' }
      ]}]
    },
    {
      id: 'deel', name: 'Deel', logo: 'deel',
      tag: 'HR וגיוס גלובלי',
      about: 'פרסומת לפלטפורמת ה-HR הגלובלית Deel.',
      groups: [{ videos: [
        { id: 'deel-1', title: 'Deel' }
      ]}]
    },
    {
      id: 'legeneral', name: 'Le Général', logo: 'legeneral',
      tag: 'נדל"ן יוקרה',
      about: 'סרטי תדמית לפרויקט המגורים Le Général.',
      groups: [{ videos: [
        { id: 'legeneral-1', title: 'Beyond the Sea' },
        { id: 'legeneral-2', title: 'Above the City' }
      ]}]
    }
  ],

  /* Self-initiated ads for real or imagined brands (not commissioned).
     wide: true = full-width card above the row (for horizontal videos).
     Row order = right to left on screen (RTL): GO, L'Oréal, Bali, Ruby Bay, Audi × Adidas, Knife, Swimwear. */
  spec: [
    { id: 'go', name: 'GO by Tnuva', tag: 'משקה חלבון', groups: [{ videos: [{ id: 'spec-go', title: 'GO by Tnuva' }] }] },
    { id: 'loreal', name: "L'Oréal Men Expert", tag: 'דאודורנט לגבר', groups: [{ videos: [{ id: 'spec-loreal', title: "L'Oréal Men Expert" }] }] },
    { id: 'bali', name: 'Bali', tag: 'משקה קוקוס', groups: [{ videos: [{ id: 'spec-bali', title: 'Bali' }] }] },
    { id: 'rubybay', name: 'Ruby Bay', tag: 'אופנה', groups: [{ videos: [{ id: 'spec-rubybay', title: 'Ruby Bay' }] }] },
    { id: 'audi-adidas', name: 'Audi × Adidas', tag: 'פורמולה 1', groups: [{ videos: [{ id: 'spec-audi-adidas', title: 'Audi × Adidas' }] }] },
    { id: 'knife', name: 'Knife', tag: 'סכין שף', groups: [{ videos: [{ id: 'spec-knife', title: 'Knife' }] }] },
    { id: 'swim', name: 'Swimwear', tag: 'קולקציית בגדי ים', groups: [{ videos: [
      { id: 'spec-swim-1', title: 'Swimwear 01' }, { id: 'spec-swim-2', title: 'Swimwear 02' },
      { id: 'spec-swim-3', title: 'Swimwear 03' }, { id: 'spec-swim-4', title: 'Swimwear 04' },
      { id: 'spec-swim-5', title: 'Swimwear 05' }, { id: 'spec-swim-6', title: 'Swimwear 06' },
      { id: 'spec-swim-7', title: 'Swimwear 07' }
    ]}] }
  ],

  /* Short films and personal work. Order = right to left on screen. */
  films: [
    { id: 'film-firstday', title: 'היום הראשון', tag: 'פרק פיילוט' },
    { id: 'film-statues', title: 'אילו הייתה מצלמה', tag: 'יצירות מופת מהעבר, כאילו צולמו בזמן אמת' },
    { id: 'film-garden', title: 'ליזי בורדן', tag: "אומאז' לסדרה 'מפלצת: ליזי בורדן' של נטפליקס" },
    { id: 'film-kitchen', title: 'אלמוזנינו מקררים', tag: 'מערכון' },
    { id: 'film-football', title: 'קיליאן אמבפה', tag: 'סרט קצר' },
    { id: 'spec-halloween', title: 'מדידת תחפושות', tag: 'UGC · האלווין' },
    { id: 'film-studio', title: 'הסטודיו', tag: 'הכירו את הצוות שלי' }
  ],

  process: [
    { title: 'בריף', text: 'שיחה קצרה על המותג, המטרה והקהל.' },
    { title: 'קונספט ותסריט', text: 'רעיון, תסריט ולוח השראה לאישור לפני שמתחילים לייצר.' },
    { title: 'הפקה', text: 'יצירת הדמויות, הסצנות והשוטים בכלי AI, עם שמירה על עקביות המותג.' },
    { title: 'עריכה וסאונד', text: 'עריכה, מוזיקה, סאונד וכתוביות.' },
    { title: 'מסירה', text: 'קבצים מוכנים לכל רשת, אנכי ואופקי.' }
  ]
};
