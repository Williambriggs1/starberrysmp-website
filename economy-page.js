// Expands the Currency & Bank page with player-driven shop information.
// Loaded after app.js so this replaces the base economy page renderer.

buildEconomyPage = function() {
  const e = state.economy;
  const bankName = e.bank.name || "The Bank";

  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "💰 Currency & Economy",
    intro: e.intro,
    sections: [
      {
        title: "Currency 💵",
        html: `<p>${e.currency_description}</p><div class="quote-card"><strong>${e.currency_goal}</strong></div>`
      },
      {
        title: "Player Shops 🛒",
        html: `<p>${e.player_shops.description}</p><p>${e.player_shops.warps_description}</p><div class="feature-grid"><div class="feature"><strong>📦 QuickShop Chests</strong><span>Create your own buy and sell shops using chests.</span></div><div class="feature"><strong>🧭 PlayerWarps</strong><span>Turn your shop, town, market, or attraction into a place other players can easily visit.</span></div></div>`
      },
      {
        title: `${bankName} 🏦`,
        html: `<p>${e.bank.description}</p><div class="bank-rate"><div class="bank-item"><span class="bank-icon">${e.bank.input_icon}</span><div><small>SELL</small><strong>${e.bank.input_amount} ${e.bank.input_item}</strong></div></div><div class="bank-arrow">→</div><div class="bank-item payout"><span class="bank-icon">${e.bank.output_icon}</span><div><small>RECEIVE</small><strong>$${e.bank.output_amount}</strong></div></div></div><div class="notice"><strong>Current Baseline:</strong> ${e.bank.input_amount} ${e.bank.input_item} = $${e.bank.output_amount}</div>${e.bank.additional_selling ? `<p>${e.bank.additional_selling}</p>` : ""}${e.bank.name_note ? `<div class="quote-card">✨ ${e.bank.name_note}</div>` : ""}`
      },
      {
        title: "How the Economy Fits Together ✦",
        html: `<p>${e.bank.reason}</p><ul class="clean-list"><li>Sell useful resources to the server for a dependable source of currency.</li><li>Use QuickShop chests to buy and sell directly with other players.</li><li>Use PlayerWarps to build recognizable shops, towns, and marketplaces.</li><li>Farmers can eventually turn unlocked custom crops into another source of income.</li></ul>`
      }
    ]
  };
};
