let starberryRanks = [];

async function loadRanks() {
  try {
    const response = await fetch("data/ranks.json");
    if (!response.ok) throw new Error("Failed to load rank data");
    starberryRanks = await response.json();
  } catch (error) {
    console.error(error);
  }
}

function buildRanksPage() {
  const cards = starberryRanks.map(rank => `
    <article class="rank-card rank-${rank.id}">
      <div class="rank-card-top">
        <span class="rank-icon">${rank.icon}</span>
        <div>
          <span class="rank-type">${rank.type}</span>
          <h3>${rank.name}</h3>
        </div>
      </div>
      <p>${rank.description}</p>
      <div class="rank-shop-limit"><span>🏡 SetHome Limit</span><strong>${rank.home_limit}</strong></div>
      <div class="rank-shop-limit"><span>🧺 QuickShop Limit</span><strong>${rank.quickshop_limit}</strong></div>
      <ul class="rank-perks">
        ${rank.perks.map(perk => `<li>${escapeRankText(perk)}</li>`).join("")}
      </ul>
    </article>`).join("");

  return {
    category: "COMMUNITY",
    eyebrow: "SUPPORTER RANKS",
    title: "🍓 Ranks & Supporter",
    intro: "Starberry's rank ladder begins with the free Seed rank and grows through four supporter tiers. Supporter perks focus on convenience and customization rather than pay-to-win progression.",
    sections: [
      {
        title: "Rank Path 🌱",
        html: `<div class="rank-path">${starberryRanks.map(rank => `<span>${rank.icon} ${rank.name}</span>`).join('<b>→</b>')}</div>`
      },
      {
        title: "Rank Perks ✨",
        html: `<div class="rank-grid">${cards}</div>`
      },
      {
        title: "About Supporter Perks 💖",
        html: `<div class="quote-card">Supporter ranks are designed around quality-of-life features, personalization, and extra room for things like homes and player shops. Additional perks may be added as the server is finalized.</div>`
      }
    ]
  };
}

function escapeRankText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const originalRankRenderPage = renderPage;
renderPage = function(id) {
  if (id === "supporter" && starberryRanks.length) {
    state.pages.supporter = buildRanksPage();
  }
  return originalRankRenderPage(id);
};

loadRanks().then(() => {
  if (currentId() === "supporter") renderPage("supporter");
});
