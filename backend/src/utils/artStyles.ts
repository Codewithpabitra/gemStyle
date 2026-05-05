export interface ArtStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
  prompt: string;
  creditsRequired: number;
  tag: string;
}

export const ART_STYLES: Record<string, ArtStyle> = {
  doodle: {
    id: "doodle",
    name: "Cute Doodle",
    emoji: "🌸",
    description: "Hand-drawn notebook profile with pastel colors",
    tag: "Popular",
    creditsRequired: 1,
    prompt: `Transform this photo into a cute hand-drawn doodle style social media profile page. Convert the person into a cartoon illustration with crayon/pencil texture, soft pastel colors (pink, purple, mint, yellow), and a friendly smiling expression. Add a playful UI layout around the portrait: handwritten-style fonts, flower and star doodles, soft notebook background. Style looks drawn with colored pencils — slightly imperfect lines, wholesome cozy aesthetic. Mobile 9:16 aspect ratio. High detail, vibrant but soft tones.`,
  },
  pixar: {
    id: "pixar",
    name: "Pixar 3D",
    emoji: "🎬",
    description: "Smooth 3D cartoon with cinematic lighting",
    tag: "Trending",
    creditsRequired: 1,
    prompt: `Convert this photo into a Pixar-style 3D animated character portrait. Features: smooth skin, large expressive eyes, cinematic soft lighting, subtle rim light, high-quality 3D render. Keep the facial structure and resemblance accurate. Blurred warm background. The style should look exactly like a Pixar movie still. Highly detailed, professional render.`,
  },
  ghibli: {
    id: "ghibli",
    name: "Studio Ghibli",
    emoji: "🎨",
    description: "Dreamy anime with hand-painted atmosphere",
    tag: "Dreamy",
    creditsRequired: 1,
    prompt: `Transform this photo into an anime character illustration in the Studio Ghibli art style. Features: soft watercolor-like hand-painted background (nature or magical setting), gentle lighting, detailed hair with slight wind motion, calm emotional expression, warm color palette. The style should feel like a still from a Ghibli film — dreamy, cinematic, soulful. Keep facial features accurate.`,
  },
  oilpaint: {
    id: "oilpaint",
    name: "Oil Painting",
    emoji: "🖌️",
    description: "Classical Renaissance portrait with brushstrokes",
    tag: "Classic",
    creditsRequired: 1,
    prompt: `Turn this photo into a classical oil painting portrait in the style of Dutch Golden Age / Renaissance masters. Style: visible rich brushstrokes, dramatic chiaroscuro lighting, dark muted background, deep color saturation, varnished canvas texture. Keep the face realistic and detailed. Museum quality.`,
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    emoji: "⚡",
    description: "Neon-lit futuristic sci-fi character",
    tag: "Futuristic",
    creditsRequired: 1,
    prompt: `Transform this photo into a cyberpunk futuristic character illustration. Features: neon lights in blue, pink, and purple glowing on the face, futuristic cityscape background with rain and neon signs, high contrast lighting, holographic elements. Keep the face recognizable. Cinematic sci-fi movie poster quality.`,
  },
  watercolor: {
    id: "watercolor",
    name: "Watercolor",
    emoji: "💧",
    description: "Soft flowing watercolor portrait",
    tag: "Artistic",
    creditsRequired: 1,
    prompt: `Convert this photo into a beautiful watercolor painting portrait. Style: soft flowing pigment bleeds, wet-on-wet technique, light transparent washes layered over each other, white paper showing through in highlights, delicate linework for facial features. Palette: warm peachy tones for skin, soft blues and greens. Fine art illustration quality.`,
  },
  comic: {
    id: "comic",
    name: "Marvel Comic",
    emoji: "💥",
    description: "Bold comic book hero portrait",
    tag: "Action",
    creditsRequired: 1,
    prompt: `Transform this photo into a Marvel/DC comic book style character illustration. Features: bold black ink outlines, halftone dot shading texture, dynamic comic panel lighting, vivid saturated colors, slightly exaggerated heroic features. The person looks like a comic book superhero. Vintage comic print quality.`,
  },
  pencil: {
    id: "pencil",
    name: "Pencil Sketch",
    emoji: "✏️",
    description: "Hyper-detailed graphite portrait",
    tag: "Minimal",
    creditsRequired: 1,
    prompt: `Convert this photo into a hyper-detailed graphite pencil sketch portrait. Style: fine hatching and cross-hatching for shading, pencil strokes visible, sharp focus on eyes and facial features, slightly softer edges on hair, white paper texture in highlights. Black and white only. Museum-quality realism.`,
  },
  fantasy: {
    id: "fantasy",
    name: "Fantasy Warrior",
    emoji: "⚔️",
    description: "Epic fantasy character with armor",
    tag: "Epic",
    creditsRequired: 2,
    prompt: `Transform this person into an epic fantasy warrior character. Features: intricate ornate armor, magical glowing runes, dramatic fantasy lighting, flowing cape, mystical fog background, heroic pose. Keep the facial features recognizable. Style like a AAA fantasy game cinematic render — ultra detailed, dramatic, legendary.`,
  },
  renaissance: {
    id: "renaissance",
    name: "Renaissance Portrait",
    emoji: "👑",
    description: "Royal noble portrait in period clothing",
    tag: "Regal",
    creditsRequired: 2,
    prompt: `Reimagine this person as a Renaissance-era noble or royalty portrait. Style: period-appropriate clothing (velvet, lace, jewels), formal seated pose, dark interior background with draped fabric, dramatic side lighting from a window. Oil paint texture, highly detailed fabric and jewelry. The person should look like historical royalty.`,
  },
};

export function getStyleById(id: string): ArtStyle | undefined {
  return ART_STYLES[id];
}

export function getAllStyles(): ArtStyle[] {
  return Object.values(ART_STYLES);
}