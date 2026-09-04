// Adds compact lore callouts to the crop and food catalog cards.
// Loaded after app.js so the existing data-driven page builders can be enhanced
// without changing the rest of the site renderer.

const originalBuildCropsPage = buildCropsPage;
buildCropsPage = function() {
  const page = originalBuildCropsPage();
  const cards = state.crops.map(crop => `
    <article class="catalog-card" style="grid-template-columns:1fr;margin:0;padding:14px;min-width:0;">
      <div class="catalog-details" style="padding:0;">
        <span class="item-tag">CUSTOM CROP</span>
        <h3 style="margin:4px 0 6px;font-size:22px;">${crop.icon || "🌱"} ${crop.name}</h3>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.55;">${crop.description}</p>
        ${crop.lore ? `<div class="lore-line">${crop.lore}</div>` : ""}
        <div class="stat-row">
          <span><strong>Growth:</strong> ${crop.growth}</span>
          <span><strong>Harvest:</strong> ${crop.harvest}</span>
          <span><strong>Used For:</strong> ${crop.uses.join(", ")}</span>
        </div>
        ${creatorCredit(crop)}
      </div>
    </article>`).join("");

  page.sections = [{
    title: "Crop Collection 🌿",
    html: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;align-items:stretch;">${cards}</div>`
  }];

  return page;
};

const originalBuildFoodPage = buildFoodPage;
buildFoodPage = function() {
  const page = originalBuildFoodPage();
  const cards = state.foods.map(food => `
    <article class="catalog-card" style="grid-template-columns:1fr;margin:0;padding:14px;min-width:0;">
      <div class="catalog-details" style="padding:0;">
        <span class="item-tag">CUSTOM FOOD</span>
        <h3 style="margin:4px 0 6px;font-size:22px;">${food.icon || "🍽️"} ${food.name}</h3>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.55;">${food.description}</p>
        ${food.lore ? `<div class="lore-line">${food.lore}</div>` : ""}
        <div class="stat-row" style="margin-bottom:10px;">
          <span><strong>Type:</strong> ${food.type}</span>
          <span><strong>Main:</strong> ${food.main_ingredient}</span>
        </div>
        <div style="font-size:12px;color:#aebbae;line-height:1.55;"><strong>Recipe:</strong> ${food.recipe.map(i => `${i.amount}× ${i.name}`).join(" + ")}</div>
        ${creatorCredit(food)}
      </div>
    </article>`).join("");

  page.sections = [{
    title: "Recipe Collection 🍽️",
    html: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;align-items:stretch;">${cards}</div>`
  }];

  return page;
};
