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
  labelClub:  { fr: "Le club", en: "The club" },
  labelHours: { fr: "Horaires", en: "Hours" },
  priceNote:  { fr: "Prix en dinars (DT)", en: "Prices in dinars (DT)" },
  madeNote:   { fr: "Fait maison, chaque jour", en: "Homemade, every day" },
  setWord:    { fr: "Set", en: "Set" },
  themeForest:{ fr: "Forêt", en: "Forest" },
  themeCream: { fr: "Crème", en: "Cream" },
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
          fr: "2 œufs à la coque, bacon de bœuf, fromage frais aux herbes, roquette, tomates cerises, feta, fruit de saison, toasts de pain complet, confiture et miel.",
          en: "2 soft-boiled eggs, beef bacon, herbed cream cheese, rocket, cherry tomatoes, feta, seasonal fruit, wholegrain toast, jam and honey.",
        },
        extra: { fr: "Assaisonnement : zaatar, huile d’olive, ail en poudre, sel, citron · Extra : avocat", en: "Seasoning: zaatar, olive oil, garlic powder, salt, lemon · Extra: avocado" },
        price: "",
      },
      {
        name: { fr: "Le Savory Club", en: "The Savory Club" },
        desc: {
          fr: "2 œufs à la coque, bacon de bœuf, fromage frais aux herbes, roquette, tomates cerises, feta, toasts de pain complet, huile d’olive.",
          en: "2 soft-boiled eggs, beef bacon, herbed cream cheese, rocket, cherry tomatoes, feta, wholegrain toast, olive oil.",
        },
        extra: { fr: "Extra : avocat", en: "Extra: avocado" },
        price: "",
      },
      {
        name: { fr: "Granola Bowl", en: "Granola Bowl" },
        desc: {
          fr: "Granola aux graines, fruits secs, yaourt grec, fruits de saison et sirop de datte.",
          en: "Seed granola, dried fruit, Greek yoghurt, seasonal fruit and date syrup.",
        },
        extra: { fr: "Au choix : miel ou beurre de cacahuète", en: "Your choice: honey or peanut butter" },
        price: "",
      },
    ],
  },
  {
    id: "bowls",
    layout: "plates",
    name: { fr: "Bowls Signature", en: "Signature Bowls" },
    note: { fr: "Préparations maison & options protéinées adaptées au sport.", en: "Homemade, with protein options built for sport." },
    items: [
      {
        name: { fr: "Chickpea Salad Bowl", en: "Chickpea Salad Bowl" },
        desc: {
          fr: "Pois chiches cuits et assaisonnés, poulet fumé, roquette, concombre, tomates cerises et oignons pickles.",
          en: "Seasoned chickpeas, smoked chicken, rocket, cucumber, cherry tomatoes and pickled onions.",
        },
        extra: { fr: "Sauce : vinaigrette tahini-citron maison", en: "Sauce: homemade tahini-lemon dressing" },
        price: "",
      },
      {
        name: { fr: "Sweet Mediterranean Bowl", en: "Sweet Mediterranean Bowl" },
        desc: {
          fr: "Patate douce rôtie aux épices, roquette, houmous, feta, grenade (ou fruit de saison) et sauce tahini-citron.",
          en: "Spiced roasted sweet potato, rocket, hummus, feta, pomegranate (or seasonal fruit) and tahini-lemon sauce.",
        },
        extra: { fr: "", en: "" },
        price: "",
      },
      {
        name: { fr: "Recovery Bowl", en: "Recovery Bowl" },
        desc: {
          fr: "Poulet basse température, kimchi de salade romaine, couscous complet, tomates cerises, concombre, oignon, vinaigrette maison.",
          en: "Slow-cooked chicken, romaine kimchi, wholegrain couscous, cherry tomatoes, cucumber, onion, house dressing.",
        },
        extra: { fr: "", en: "" },
        price: "",
      },
      {
        name: { fr: "Dragon Eyes Rice", en: "Dragon Eyes Rice" },
        desc: {
          fr: "Deux œufs mollets marinés Mayak, riz vinaigré, salade de concombre Sunomono, oignon nouveau et sésame.",
          en: "Two Mayak-marinated soft eggs, vinegared rice, Sunomono cucumber salad, spring onion and sesame.",
        },
        extra: { fr: "Extra : avocat", en: "Extra: avocado" },
        price: "",
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
        name: { fr: "Bánh Mì Wrap", en: "Bánh Mì Wrap" },
        desc: {
          fr: "Poulet basse température, pickles carotte, radis (Do Chua), concombre mandoline, mayo sriracha et coriandre.",
          en: "Slow-cooked chicken, pickled carrot and radish (Do Chua), shaved cucumber, sriracha mayo and coriander.",
        },
        extra: { fr: "", en: "" },
        price: "",
      },
      {
        name: { fr: "Pincho de Tortilla Feta", en: "Pincho de Tortilla Feta" },
        desc: {
          fr: "Tortilla espagnole, feta, persil, roquette, tomates cerises et pickles.",
          en: "Spanish tortilla, feta, parsley, rocket, cherry tomatoes and pickles.",
        },
        extra: { fr: "", en: "" },
        price: "",
      },
      {
        name: { fr: "Sardines & Houmous Mediterranean", en: "Sardines & Hummus Mediterranean" },
        desc: {
          fr: "Sardines marinées, houmous, roquette, tomates cerises, huile d’olive et citron.",
          en: "Marinated sardines, hummus, rocket, cherry tomatoes, olive oil and lemon.",
        },
        extra: { fr: "", en: "" },
        price: "",
      },
      {
        name: { fr: "Fresh Spring Rolls", en: "Fresh Spring Rolls" },
        desc: {
          fr: "2 rouleaux de printemps aux légumes (carotte, concombre, chou, herbes fraîches), poulet basse température.",
          en: "2 vegetable spring rolls (carrot, cucumber, cabbage, fresh herbs), slow-cooked chicken.",
        },
        extra: { fr: "Sauce au choix : cacahuète ou nuoc-mam", en: "Sauce of your choice: peanut or nuoc-mam" },
        price: "",
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
        name: { fr: "Mousse au Chocolat Protéinée", en: "Protein Chocolate Mousse" },
        desc: {
          fr: "Mousse onctueuse au chocolat riche en protéines, idéale pour la récupération sportive.",
          en: "Silky, protein-rich chocolate mousse, ideal for post-game recovery.",
        },
        extra: { fr: "", en: "" },
        price: "",
      },
      {
        name: { fr: "Carrot Cake Artisanal", en: "Artisan Carrot Cake" },
        desc: {
          fr: "Carotte, noix, épices douces et glaçage cream cheese.",
          en: "Carrot, walnuts, warm spices and cream cheese frosting.",
        },
        extra: { fr: "", en: "" },
        price: "",
      },
      {
        name: { fr: "Fondant au Chocolat", en: "Chocolate Fondant" },
        desc: {
          fr: "Chocolat noir, pur beurre et sucre de canne.",
          en: "Dark chocolate, pure butter and cane sugar.",
        },
        extra: { fr: "", en: "" },
        price: "",
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
        title: { fr: "Infusions & Spécialités", en: "Infusions & Specialities" },
        note: { fr: "", en: "" },
        items: [
          { name: { fr: "Bissap Maison", en: "House Bissap" }, desc: { fr: "Infusé d’ananas, hibiscus et cannelle.", en: "Pineapple, hibiscus and cinnamon infusion." }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Chai Latte", en: "Chai Latte" }, desc: { fr: "Mélange d’épices artisanales, thé noir et lait d’amande.", en: "Artisan spice blend, black tea and almond milk." }, extra: { fr: "", en: "" }, price: "" },
        ],
      },
      {
        title: { fr: "Caféteria", en: "Coffee" },
        note: { fr: "Servi chaud ou glacé", en: "Served hot or iced" },
        items: [
          { name: { fr: "Espresso", en: "Espresso" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Americano", en: "Americano" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Latte", en: "Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Vanilla Latte", en: "Vanilla Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Whipped Honey Latte", en: "Whipped Honey Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Cinnamon Brown Shaken Espresso Latte", en: "Cinnamon Brown Shaken Espresso Latte" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Spanish Latte", en: "Spanish Latte" }, desc: { fr: "Avec lait condensé.", en: "With condensed milk." }, extra: { fr: "", en: "" }, price: "" },
        ],
      },
      {
        title: { fr: "Matchas glacés", en: "Cold Matchas" },
        note: { fr: "", en: "" },
        items: [
          { name: { fr: "Matcha Glacé Vanille", en: "Iced Vanilla Matcha" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Matcha Glacé Fraise", en: "Iced Strawberry Matcha" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Matcha Glacé Mangue", en: "Iced Mango Matcha" }, desc: { fr: "", en: "" }, extra: { fr: "", en: "" }, price: "" },
        ],
      },
      {
        title: { fr: "Jus frais pressés & Smoothies", en: "Fresh Juices & Smoothies" },
        note: { fr: "", en: "" },
        items: [
          { name: { fr: "Oron Rich", en: "Oron Rich" }, desc: { fr: "Fraise, kiwi, pomme, glace pilée.", en: "Strawberry, kiwi, apple, crushed ice." }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Green Detox", en: "Green Detox" }, desc: { fr: "Ananas, citron, concombre.", en: "Pineapple, lemon, cucumber." }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Berry Boost", en: "Berry Boost" }, desc: { fr: "Yaourt au coco, framboise, fraise.", en: "Coconut yoghurt, raspberry, strawberry." }, extra: { fr: "", en: "" }, price: "" },
          { name: { fr: "Smoothies Recovery & Energy", en: "Recovery & Energy Smoothies" }, desc: { fr: "Sélection de fruits frais et superaliments.", en: "A selection of fresh fruit and superfoods." }, extra: { fr: "", en: "" }, price: "" },
        ],
      },
    ],
  },
];
