import type { Dish, MaterialTexture, DiningSpace } from '../types';

export const DISHES: Dish[] = [
  {
    id: 'wild-morel-momo',
    name: 'Wild Morel & Truffle Momo',
    indigenousName: 'Khumbu Valley Morel Dumpling',
    category: 'nepali',
    elevation: '3,800m • Khumbu Valley',
    description: 'Translucent handmade dumplings cradling hand-foraged Himalayan morels and wild chanterelles, bathed in a shimmering clarified timur pepper and bone marrow broth with alpine blooms.',
    provenance: 'Wild mushrooms gathered by local Sherpa foragers in the sub-alpine forests of Namche Bazaar.',
    notes: ['Wild Morel', 'Timur Peppercorn', 'Bone Marrow Consommé', 'Edible Mountain Flowers'],
    spiceLevel: 2,
    pairing: 'Smoked Lapsang Souchong Infusion or 2019 Jura Savagnin',
    image: '/images/morel_momo.jpg',
  },
  {
    id: 'wok-seared-tiger-prawns',
    name: 'Wok-Scorched Tiger Prawns',
    indigenousName: 'Tangra Cast Iron Wok Prawn',
    category: 'indochinese',
    elevation: '800°C Roaring Wok Hei',
    description: 'Jumbo prawns blasted over 800°C roaring wok hei with scorched Kashmiri chilies, crispy scallion curls, dark Himalayan timur reduction, and toasted sesame crunch on volcanic stone.',
    provenance: 'A tribute to the century-old Chinese Hakka community of Tangra, reinterpreted with high-altitude Himalayan aromatics.',
    notes: ['Wok Hei Smoke', 'Scorched Kashmiri Chili', 'Wild Timur Crust', 'Burnt Garlic Oil'],
    spiceLevel: 4,
    pairing: 'Chilled Grüner Veltliner or Himalayan Juniper Highball',
    image: '/images/wok_dish.jpg',
  },
  {
    id: 'himalayan-botanical-cocktail',
    name: 'Sagarmatha Smoked Elixir',
    indigenousName: 'High Summit Botanical Spirit',
    category: 'botanical',
    elevation: '5,364m • Basecamp Spirits',
    description: 'Himalayan highland grain spirit rested with toasted timur peppercorns and lapsang tea, served over hand-chiseled glacial mountain ice with smoldering cinnamon and pine aroma.',
    provenance: 'Crafted with botanicals gathered along the old salt caravan routes connecting Mustang to Lhasa.',
    notes: ['Smoked Tea Smoke', 'Timur Citrus Numb', 'Alpine Juniper Berry', 'Charred Bark'],
    spiceLevel: 1,
    pairing: 'Served as an aperture before the Hearth Tasting Journey',
    image: '/images/botanical_cocktail.jpg',
  },
];

export const MATERIAL_TEXTURES: MaterialTexture[] = [
  {
    id: 'cleft-slate',
    name: 'Cleft Himalayan Slate',
    origin: 'Langtang Valley Quarries',
    description: 'Hand-chiseled dark rock with deep metamorphic grain, retaining natural warmth from our central hearth and serving as cold stone plating.',
    tactileTrait: 'Rough, cool, eternal, mineral-scented',
  },
  {
    id: 'charred-yak-timber',
    name: 'Charred Yak Pine',
    origin: 'Solukhumbu High Woodlands',
    description: 'Ancient timber treated with fire using traditional mountain smoking techniques to seal against moisture and impart a velvety matte black finish.',
    tactileTrait: 'Deeply grained, scorched, resonant with cedar resin',
  },
  {
    id: 'handspun-yak-wool',
    name: 'Dolpo Yak Wool Textiles',
    origin: 'Upper Dolpo Nomadic Camps',
    description: 'Unbleached natural fleece woven on wooden pit looms by high-altitude pastoralists, offering insulating tactile comfort in dining booths.',
    tactileTrait: 'Dense, organic, comforting, natural earth tones',
  },
  {
    id: 'hammered-brass',
    name: 'Sacred Patan Brass',
    origin: 'Patan Artisan Guilds',
    description: 'Hand-hammered brass light fixtures and butter lamp vessels that cast flickering golden reflections across raw stone surfaces.',
    tactileTrait: 'Warm metallic luster, soft hammered dimples',
  },
  {
    id: 'wild-botanicals',
    name: 'High-Altitude Timur & Jimbu',
    origin: 'Mustang & Manang Plateaus',
    description: 'Wild mountain pepper berries and high-altitude wild chives dried in dry alpine wind, delivering electric citrus numbness and savory depth.',
    tactileTrait: 'Pungent, tingling, aromatic resin',
  },
];

export const DINING_SPACES: DiningSpace[] = [
  {
    id: 'the-fire-hearth',
    title: 'The Fire Hearth',
    subtitle: 'The Soul of the Sanctuary',
    capacity: '32 Guests • DIFC Sunken Hearth',
    atmosphere: 'Raw black stone hearth, glowing embers, ambient cedar aroma',
    description: 'Surrounding our open wood-burning stone hearth in the heart of DIFC, guests dine on sunken slate tables where dishes are finished over live cedar flames before your eyes.',
  },
  {
    id: 'the-ridge-overlook',
    title: 'The Skyline Ridge Room',
    subtitle: 'Dubai Skyline & Mountain Ambience',
    capacity: '24 Guests • Skyline Alcoves',
    atmosphere: 'Floor-to-ceiling panoramic glass, Dubai twilight vistas, floating candlelight',
    description: 'Framing dramatic views of the Dubai architectural skyline through brutalist Himalayan black slate and amber shadows, this room brings the grandeur of the mountains to the heart of the metropolis.',
  },
  {
    id: 'the-alchemists-bar',
    title: 'The Salt Route Bar',
    subtitle: 'Highland Mixology & Botanical Ferments',
    capacity: '14 Seats • Monolithic Slate Counter',
    atmosphere: 'Intimate low-lit counter carved from a single 8-ton slab of slate',
    description: 'Dedicated to rare Himalayan spirits, barrel-aged wild ferments, smoked yak butter infusions, and bespoke Tibetan tea pairings in Dubai.',
  },
];

export const NARRATIVE_STOPS = [
  {
    number: '01',
    title: 'The Altitude',
    subtitle: 'Elevation changes everything',
    quote: 'At 4,000 meters, water boils at 86°C. Flavors compress. Herbs grow smaller, yet intensely aromatic.',
    desc: 'The extreme temperature shifts and mineral-rich glacial soil force Himalayan wild plants—like Timur pepper and Jimbu—to concentrate volatile essential oils to survive. Every bite carries the punch of the alpine ridge.',
    tag: 'ELEVATION 3,800M — 8,848M',
  },
  {
    number: '02',
    title: 'The Nomadic Hearth',
    subtitle: 'Smoke, Salt & Fermentation',
    quote: 'In the high valleys, winter is severe. Food is preserved not as compromise, but as high art.',
    desc: 'Through ancient techniques of sun-drying fermented leafy greens (Gundruk), slow-smoking yak dairy, and aging meats over juniper embers, Himalayan cuisine developed a deep, savory umami that modern palates are only beginning to comprehend.',
    tag: 'PRESERVATION & PATIENCE',
  },
  {
    number: '03',
    title: 'The Silk & Salt Crossroads',
    subtitle: 'Where Hakka Woks Meet Himalayan Spices',
    quote: 'For centuries, traders traversed the treacherous passes between Nepal, Tibet, and Canton.',
    desc: 'When Cantonese Hakka immigrants brought their blazing woks to Calcutta and Nepal in the late 19th century, an extraordinary culinary dialect was born. We unite this blazing Wok Hei with mountain herbs to forge an entirely new fine-dining landscape.',
    tag: 'CROSS-CULTURAL CONVERGENCE',
  },
];
