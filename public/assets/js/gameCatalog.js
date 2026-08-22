// public/assets/js/gameCatalog.js
// This module loads all game catalogues (local JSON files) and the remote Stratus cloud games.
// It normalises each entry to a common shape used by the UI.

export async function fetchGameCatalog() {
  const localSources = [
    { key: "gn-math", path: "/assets/json/gn-math.json" },
    { key: "truffled", path: "/assets/json/truffled.json" },
    { key: "ugs", path: "/assets/json/ugs.json" },
    { key: "ngg", path: "/assets/json/ngg.json" },
  ];

  const catalogs = [];

  // Load local JSON files
  for (const src of localSources) {
    try {
      const r = await fetch(src.path);
      if (!r.ok) continue;
      const data = await r.json();
      const games = data
        .filter(g => g.name && g.url)
        .map(g => ({
          name: g.name,
          img: g.img || "/assets/img/fav.png",
          url: g.url,
          provider: src.key,
          tags: g.tags || [],
        }));
      catalogs.push(...games);
    } catch (e) {
      console.error("Failed to load", src.path, e);
    }
  }

  // Load cloud games from Stratus API
  const cloudUrl = "https://raw.githubusercontent.com/x8rr/stratus-api/main/cloud.json";
  try {
    const r = await fetch(cloudUrl);
    if (r.ok) {
      const cloudData = await r.json(); // array of objects
      const cloudGames = cloudData.map(g => ({
        name: g.name,
        img: g.image || "/assets/img/fav.png",
        // Use a special launch identifier that play.html can resolve
        url: `cloud:${g.game_key}`,
        provider: "cloud",
        tags: g.tags || [],
        // Mark the first few as featured for the hero banner
        featured: false,
      }));
      // Mark first 5 as featured
      cloudGames.slice(0, 5).forEach(g => (g.featured = true));
      catalogs.push(...cloudGames);
    } else {
      console.warn("Cloud catalog fetch failed", r.status);
    }
  } catch (e) {
    console.error("Error fetching cloud catalog", e);
  }

  return catalogs;
}

if (typeof window !== 'undefined') {
  window.fetchGameCatalog = fetchGameCatalog;
}

