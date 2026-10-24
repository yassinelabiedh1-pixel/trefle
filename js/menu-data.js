/* ============================================================
   LA CARTE DE TREFFEL PADEL CLUB
   ------------------------------------------------------------
   C'est ICI que vous modifiez la carte.
   - Chaque produit a : name (fr / en), desc (fr / en), extra
     (fr / en, ligne en italique : sauce, option, supplément ;
     mettre "" s'il n'y en a pas) et price (texte libre, "" tant
     que le prix n'est pas fixé).
   - PHOTO : chaque produit cherche automatiquement sa photo dans
     images/produits/<nom-simplifié>.webp (puis .jpg, .jpeg, .png).
     La liste exacte des noms attendus est dans images/LISEZ-MOI.txt.
     Pour forcer un autre fichier : photo: "images/produits/x.jpg"
   - VIDÉO : déposez images/produits/<nom-simplifié>.mp4 (muette, courte,
     moins de 5 Mo) et elle joue en boucle à la place de la photo, qui reste
     l'image d'attente. Ou forcer : video: "images/produits/x.mp4"
   - "layout": "plates" (grande photo au-dessus du texte).
   - "groups" : sous-parties d'un set (ex. Boissons).
   ============================================================ */

const HERO_IMAGE = "";

const UI_TEXT = {
  eyebrow:    { fr: "Padel Club", en: "Padel Club" },
  kicker:     { fr: "La carte du club", en: "The club menu" },
  title1:     { fr: "Le vrai club,", en: "The real club," },
  title2:     { fr: "comme avant.", en: "like before." },
  heroLine:   { fr: "On vient pour le sport, on reste pour les visages.", en: "You come for the sport, you stay for the faces." },
  footerBig1: { fr: "Une deuxième maison.", en: "A second home." },
  footerBig2: { fr: "Un refuge.", en: "A refuge." },
  creedKicker:{ fr: "Le trèfle à quatre feuilles", en: "The four-leaf clover" },
  leafSport:  { fr: "Sport", en: "Sport" },
  leafSocial: { fr: "Social", en: "Social" },
  leafWell:   { fr: "Bien-être", en: "Well-being" },
  leafJoy:    { fr: "Plaisir", en: "Pleasure" },
  labelClub:  { fr: "Le club", en: "The club" },
  labelHours: { fr: "Horaires", en: "Hours" },
  priceNote:  { fr: "Prix en dinars (DT)", en: "Prices in dinars (DT)" },
  madeNote:   { fr: "Fait maison, chaque jour", en: "Homemade, every day" },
  setWord:    { fr: "Set", en: "Set" },
  themeForest:{ fr: "Forêt", en: "Forest" },
  themeCream: { fr: "Blanc", en: "White" },
};

const MENU = [
  {
    id: "brunch",
    layout: "plates",
    name: { fr: "Petits déjeuners & Brunch", en: "Breakfast & Brunch" },
    note: { fr: "Healthy, homemade & good tasting.", en: "Healthy, homemade & good tasting." },
    items: [
      {
        name: { fr: "Le Breakfast Club", en: "The Breakfast Club" },
        desc: {
          fr: "2 œufs à la coque, bacon de bœuf, gouta fraîche, roquette, tomates cerises, feta, fruit de saison, toasts de pain complet, confiture et miel.",
          en: "2 soft-boiled eggs, beef bacon, fresh gouta cheese, rocket, cherry tomatoes, feta, seasonal fruit, wholegrain toast, jam and honey.",
        },
        extra: { fr: "Extra : avocat +8 DT", en: "Extra: avocado +8 DT" },
        price: "32 DT",
      },
      {
        name: { fr: "Le Savory Club", en: "The Savory Club" },
        desc: {
          fr: "2 œufs à la coque, bacon de bœuf, gouta fraîche, roquette, tomates cerises, feta, toasts de pain complet, huile d'olive.",
          en: "2 soft-boiled eggs, beef bacon, fresh gouta cheese, rocket, cherry tomatoes, feta, wholegrain toast, olive oil.",
        },
        extra: { fr: "Extra : avocat +8 DT", en: "Extra: avocado +8 DT" },
        price: "25 DT",
      },
      {
        name: { fr: "Granola Bowl", en: "Granola Bowl" },
        desc: {
          fr: "Granola aux graines, fruits secs, yaourt grec, fruits de saison et peanut butter.",
          en: "Seed granola, dried fruit, Greek yoghurt, seasonal fruit and peanut butter.",
        },
        extra: { fr: "", en: "" },
        price: "17 DT",
      },
    ],
  },
  {
    id: "bowls",
    layout: "plates",
    name: { fr: "Bowls", en: "Bowls" },
    note: { fr: "Everything is made from scratch.", en: "Everything is made from scratch." },
    items: [
      {
        name: { fr: "Sweet Mediterranean Bowl", en: "Sweet Mediterranean Bowl" },
        desc: {
          fr: "Patate douce rôtie aux épices, roquette, houmous, feta, grenade et sauce tahini-citron.",
          en: "Spiced roasted sweet potato, rocket, hummus, feta, pomegranate and tahini-lemon sauce.",
        },
        extra: { fr: "Végétarien", en: "Vegetarian" },
        price: "22 DT",
      },
      {
        name: { fr: "Recovery Bowl", en: "Recovery Bowl" },
        desc: {
          fr: "Poulet basse température, kimchi de salade romaine, couscous complet, tomates cerises, concombre, oignon, vinaigrette maison.",
          en: "Slow-cooked chicken, romaine kimchi, wholegrain couscous, cherry tomatoes, cucumber, onion, house dressing.",
        },
        extra: { fr: "", en: "" },
        price: "25 DT",
      },
      {
        name: { fr: "Dragon Eyes Rice", en: "Dragon Eyes Rice" },
        desc: {
          fr: "Deux œufs mollets marinés Mayak, riz vinaigré, salade de concombre Sunomono, oignon et sésame.",
          en: "Two Mayak-marinated soft eggs, vinegared rice, Sunomono cucumber salad, onion and sesame.",
        },
        extra: { fr: "Végétarien · Extra : avocat +8 DT", en: "Vegetarian · Extra: avocado +8 DT" },
        price: "30 DT",
      },
      {
        name: { fr: "Chickpea Salad", en: "Chickpea Salad" },
        photo: "images/produits/chickpea-salad-bowl.webp",
        desc: {
          fr: "Pois chiches, roquette, tomates cerises, poulet fumé, oignons pickles, sauce tahini-citron.",
          en: "Chickpeas, rocket, cherry tomatoes, smoked chicken, pickled onion, tahini-lemon sauce.",
        },
        extra: { fr: "", en: "" },
        price: "24 DT",
      },
    ],
  },
  {
    id: "wraps",
    layout: "plates",
    name: { fr: "Wraps & Snacking", en: "Wraps & Snacking" },
    note: { fr: "", en: "" },
    items: [
      {
        name: { fr: "Wrap Thon", en: "Tuna Wrap" },
        desc: {
          fr: "Thon savoureux, laitue, tomates et sauce au fromage légère, roulés en tortilla.",
          en: "Savoury tuna, lettuce, tomatoes and a light cheese sauce, rolled in a tortilla.",
        },
        extra: { fr: "", en: "" },
        price: "14 DT",
      },
      {
        name: { fr: "Wrap Jambon", en: "Ham Wrap" },
        desc: {
          fr: "Jambon de dinde, fromage scamorza fumé, laitue, tomates et une sauce au fromage légère, roulés en tortilla.",
          en: "Turkey ham, smoked scamorza cheese, lettuce, tomatoes and a light cheese sauce, rolled in a tortilla.",
        },
        extra: { fr: "", en: "" },
        price: "15 DT",
      },
      {
        name: { fr: "Salade Classique", en: "Classic Salad" },
        desc: {
          fr: "Chicorée, romaine, roquette, tomates cerises, pickles.",
          en: "Chicory, romaine, rocket, cherry tomatoes, pickles.",
        },
        extra: { fr: "", en: "" },
        price: "10 DT",
      },
      {
        name: { fr: "Sardines & Houmous", en: "Sardines & Hummus" },
        photo: "images/produits/sardines-houmous-mediterranean.webp",
        desc: {
          fr: "Sardines marinées, houmous, roquette, tomates cerises, huile d'olive et citron.",
          en: "Marinated sardines, hummus, rocket, cherry tomatoes, olive oil and lemon.",
        },
        extra: { fr: "Mediterranean", en: "Mediterranean" },
        price: "25 DT",
      },
    ],
  },
  {
    id: "sweets",
    layout: "plates",
    name: { fr: "Sweets & Desserts", en: "Sweets & Desserts" },
    note: { fr: "", en: "" },
    items: [
      {
        name: { fr: "Cookie de Saison", en: "Seasonal Cookie" },
        desc: {
          fr: "Cookie artisanal.",
          en: "Artisan cookie.",
        },
        extra: { fr: "", en: "" },
        price: "10 DT",
      },
      {
        name: { fr: "Carrot Cake Artisanal", en: "Artisan Carrot Cake" },
        desc: {
          fr: "Carotte, noix, épices douces et glaçage cream cheese.",
          en: "Carrot, walnuts, warm spices and cream cheese frosting.",
        },
        extra: { fr: "", en: "" },
        price: "13 DT",
      },
      {
        name: { fr: "Fondant au Chocolat", en: "Chocolate Fondant" },
        desc: {
          fr: "Chocolat, pur beurre et sucre de canne.",
          en: "Chocolate, pure butter and cane sugar.",
        },
        extra: { fr: "", en: "" },
        price: "14 DT",
      },
      {
        name: { fr: "Mousse au Chocolat Protéinée", en: "Protein Chocolate Mousse" },
        desc: {
          fr: "Chocolat riche en protéines, texture légère.",
          en: "Protein-rich chocolate, light texture.",
        },
        extra: { fr: "", en: "" },
        price: "12 DT",
      },
    ],
  },
  {
    id: "boissons",
    layout: "plates",
    name: { fr: "Boissons & Créations", en: "Drinks & Creations" },
    note: { fr: "", en: "" },
    groups: [
      {
        title: { fr: "Craft Coffee & Matcha", en: "Craft Coffee & Matcha" },
        note: {
          fr: "Sirops maison au sucre de canne · Prix : chaud / glacé · Extra shot espresso +2 DT · Lait végétal +4 DT",
          en: "House-made cane sugar syrups · Prices: hot / iced · Extra espresso shot +2 DT · Plant-based milk +4 DT",
        },
        items: [
          { name: { fr: "Espresso", en: "Espresso" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "5 DT" },
          { name: { fr: "Capucin", en: "Capucin" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "7 DT" },
          { name: { fr: "Americano", en: "Americano" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "6 / 8 DT" },
          { name: { fr: "Latte", en: "Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "8 / 10 DT" },
          { name: { fr: "Vanilla Latte", en: "Vanilla Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "12 / 14 DT" },
          { name: { fr: "Cappuccino", en: "Cappuccino" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "8 / 10 DT" },
          { name: { fr: "Flat White", en: "Flat White" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "8 / 10 DT" },
          { name: { fr: "Milk Chocolate", en: "Milk Chocolate" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "8 DT" },
          { name: { fr: "Matcha Latte", en: "Matcha Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "14 / 15 DT" },
          { name: { fr: "Vanilla Matcha Latte", en: "Vanilla Matcha Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "16 / 18 DT" },
          { name: { fr: "Iced Mango Matcha", en: "Iced Mango Matcha" }, photo: "images/produits/matcha-glace-mangue.webp", desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "20 DT" },
          { name: { fr: "Iced Raspberry Matcha", en: "Iced Raspberry Matcha" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "22 DT" },
        ],
      },
      {
        title: { fr: "Jus & Infusions", en: "Juices & Infusions" },
        note: { fr: "", en: "" },
        items: [
          { name: { fr: "Jus de Grenade", en: "Pomegranate Juice" }, desc: { fr: "Jus frais de grenade pressée.", en: "Freshly pressed pomegranate juice." }, extra: { fr: "", en: "" }, price: "12 DT" },
          { name: { fr: "Jus d'Orange", en: "Orange Juice" }, desc: { fr: "Jus d'orange fraîchement pressé.", en: "Freshly squeezed orange juice." }, extra: { fr: "", en: "" }, price: "8 DT" },
          { name: { fr: "Bissap", en: "Bissap" }, photo: "images/produits/bissap-maison.webp", desc: { fr: "Infusion maison de fleurs d'hibiscus.", en: "House hibiscus flower infusion." }, extra: { fr: "", en: "" }, price: "12 DT" },
          { name: { fr: "Chai Latte", en: "Chai Latte" }, desc: { fr: "Thé noir infusé aux épices & lait.", en: "Spiced black tea & milk." }, extra: { fr: "", en: "" }, price: "14 DT" },
        ],
      },
    ],
  },
];
