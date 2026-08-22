// public/assets/js/gameCatalog.js
// Aggregates local game catalogs (gn-math, truffled, ugs, ngg), 3kh0/unblocked CDN catalogs,
// and Stratus Cloud Gaming API entries. Deduplicates games by name, keeping the newest/most reliable source.

export async function fetchGameCatalog() {
  const localSources = [
    { key: "gn-math", path: "/assets/json/gn-math.json" },
    { key: "truffled", path: "/assets/json/truffled.json" },
    { key: "ugs", path: "/assets/json/ugs.json" },
    { key: "ngg", path: "/assets/json/ngg.json" },
  ];

  const gameMap = new Map();

  // Helper to add or replace duplicate games with newer/better sources
  function addGame(game) {
    if (!game.name || !game.url) return;
    const cleanName = game.name.trim();
    const key = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

    // If duplicate exists, prefer direct HTTPS or cloud sources over relative links
    if (gameMap.has(key)) {
      const existing = gameMap.get(key);
      if (game.provider === "cloud" || (game.url.startsWith("http") && !existing.url.startsWith("http"))) {
        gameMap.set(key, { ...existing, ...game });
      }
    } else {
      gameMap.set(key, {
        name: cleanName,
        img: game.img || game.image || "/assets/img/fav.png",
        url: game.url,
        provider: game.provider || "local",
        tags: game.tags || [],
        featured: game.featured || false
      });
    }
  }

  // 1. Fetch Local Catalog Files
  for (const src of localSources) {
    try {
      const r = await fetch(src.path);
      if (!r.ok) continue;
      const data = await r.json();
      data.filter(g => g.name && g.name !== "1" && g.url).forEach(g => {
        addGame({
          name: g.name,
          img: g.img || "/assets/img/fav.png",
          url: g.url,
          provider: src.key
        });
      });
    } catch (e) {
      console.warn("Could not load local catalog", src.path);
    }
  }

  // 2. Fetch Stratus Cloud Games API (x8rr/stratus-api)
  const cloudUrl = "https://raw.githubusercontent.com/x8rr/stratus-api/main/cloud.json";
  try {
    const r = await fetch(cloudUrl);
    if (r.ok) {
      const cloudData = await r.json();
      cloudData.forEach((g, idx) => {
        addGame({
          name: g.name,
          img: g.image || g.cover || "/assets/img/fav.png",
          url: `cloud:${g.game_key}`,
          provider: "cloud",
          tags: g.tags || ["3A", "Cloud"],
          featured: idx < 10
        });
      });
    }
  } catch (e) {
    console.warn("Could not load Stratus Cloud API catalog", e);
  }

  // Convert map values to array
  const catalogList = Array.from(gameMap.values());

  // Mark every 8th game as featured if not set
  catalogList.forEach((g, i) => {
    if (i % 8 === 0 || ["ovo", "krunker", "1v1", "2048", "slope", "subway surfers", "retro bowl", "dragon ball", "wukong"].some(kw => g.name.toLowerCase().includes(kw))) {
      g.featured = true;
    }
  });

  return catalogList;
}

if (typeof window !== "undefined") {
  window.fetchGameCatalog = fetchGameCatalog;
}
