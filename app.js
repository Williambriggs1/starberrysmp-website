const state = {
  navigation: null,
  pages: {},
  server: null,
  crops: [],
  foods: [],
  skills: [],
  economy: null,
  cosmetics: []
};

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

async function loadData() {
  const [navigation, pages, server, crops, foods, skills, economy, cosmetics] = await Promise.all([
    loadJSON("data/navigation.json"),
    loadJSON("data/pages.json"),
    loadJSON("data/server.json"),
    loadJSON("data/crops.json"),
    loadJSON("data/foods.json"),
    loadJSON("data/skills.json"),
    loadJSON("data/economy.json"),
    loadJSON("data/cosmetics.json")
  ]);

  state.navigation = navigation;
  state.pages = pages;
  state.server = server;
  state.crops = crops;
  state.foods = foods;
  state.skills = skills;
  state.economy = economy;
  state.cosmetics = cosmetics;

  renderNav();
  renderPage(currentId());
  setupSearch();
}

function currentId() {
  return location.hash.replace("#", "") || "welcome";
}

function renderNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = state.navigation.groups.map(group => `
    <div class="nav-group">
      <div class="nav-group-title">✦ ${group.title} ✦</div>
      ${group.pages.map(page => `
        <a class="nav-link" data-page="${page.id}" href="#${page.id}">
          <span class="nav-icon">${page.icon}</span>
          <span>${page.label}</span>
        </a>
      `).join("")}
    </div>
  `).join("");
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderPage(id) {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === id);
  });

  let page;
  if (id === "welcome") page = buildWelcomePage();
  else if (id === "join") page = buildJoinPage();
  else if (id === "skills") page = buildSkillsPage();
  else if (id === "crops") page = buildCropsPage();
  else if (id === "food") page = buildFoodPage();
  else if (id === "economy") page = buildEconomyPage();
  else if (id === "cosmetics") page = buildCosmeticsPage();
  else page = state.pages[id];

  const target = document.getElementById("page");
  const toc = document.getElementById("toc");

  if (!page) {
    target.innerHTML = `
      <section class="hero">
        <span class="eyebrow">🍓 StarberrySMP</span>
        <h1>Page not found</h1>
        <p>That path wandered a little too far into the forest.</p>
        <a class="button" href="#welcome">Return home</a>
      </section>`;
    toc.innerHTML = "";
    return;
  }

  target.innerHTML = `
    <div class="breadcrumb">✦ ${page.category} · StarberrySMP</div>
    <section class="hero">
      <span class="eyebrow">${page.eyebrow || page.category}</span>
      <h1>${page.title}</h1>
      <p>${page.intro}</p>
    </section>
    ${page.sections.map(section => {
      const sid = slugify(section.title);
      return `
        <section class="section" id="${sid}">
          <h2><span class="highlight">${section.title}</span></h2>
          ${section.html}
        </section>
      `;
    }).join("")}
  `;

  toc.innerHTML = page.sections.map(section => {
    const sid = slugify(section.title);
    return `<a href="#${sid}">${section.title}</a>`;
  }).join("");

  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function creatorCredit(item) {
  if (!item.creator || !item.creator.name) return "";
  const role = item.creator.role || "Modeler";
  const name = item.creator.url
    ? `<a href="${item.creator.url}" target="_blank" rel="noopener">${item.creator.name}</a>`
    : item.creator.name;

  return `<div class="creator-credit"><span>✦</span><span>${role}: <strong>${name}</strong></span></div>`;
}

function buildWelcomePage() {
  const s = state.server;
  return {
    category: "THE FOREST",
    eyebrow: "The Starberry Forest",
    title: "🍓 Welcome to the Forest",
    intro: s.tagline,
    sections: [
      {
        title: "About Starberry 🌿",
        html: `<p>${s.about}</p><div class="quote-card"><strong>${s.motto}</strong></div>`
      },
      {
        title: "What can you expect? ⭐",
        html: `
          <div class="feature-grid">
            ${state.skills.map(skill => `<div class="feature"><strong>${skill.icon} ${skill.name}</strong><span>${skill.short_description}</span></div>`).join("")}
            <div class="feature"><strong>🌱 Custom Crops</strong><span>New crops and foods that expand survival without replacing vanilla gameplay.</span></div>
            <div class="feature"><strong>🌐 Crossplay</strong><span>Designed for both Java and Bedrock players.</span></div>
          </div>`
      },
      {
        title: "Joining Information 🌱",
        html: `
          <ul class="clean-list">
            <li><strong>Java IP:</strong> ${s.java_address}</li>
            <li><strong>Bedrock Address:</strong> ${s.bedrock_address}</li>
            <li><strong>Bedrock Port:</strong> ${s.bedrock_port}</li>
            <li><strong>Version:</strong> ${s.version}</li>
          </ul>
          <a class="button" href="#join">View joining guide</a>`
      },
      {
        title: "Development 🍓",
        html: `<ul class="clean-list">${s.timeline.map(x => `<li><strong>${x.label}:</strong> ${x.value}</li>`).join("")}</ul><div class="quote-card">🌱 ${s.development_note}</div>`
      }
    ]
  };
}

function buildJoinPage() {
  const s = state.server;
  return {
    category: "GETTING STARTED",
    eyebrow: "Getting Started",
    title: "🌱 How To Join",
    intro: "Everything you need to connect to StarberrySMP from Java or Bedrock.",
    sections: [
      {
        title: "Server Info 🍓",
        html: `<ul class="clean-list"><li><strong>Java:</strong> <span class="code-line">${s.java_address}</span></li><li><strong>Bedrock:</strong> <span class="code-line">${s.bedrock_address}</span></li><li><strong>Bedrock Port:</strong> <span class="code-line">${s.bedrock_port}</span></li><li><strong>Version:</strong> ${s.version}</li></ul>`
      },
      {
        title: "Java 🖥️",
        html: `<ol class="steps"><li>Open Minecraft: Java Edition.</li><li>Choose <strong>Multiplayer</strong>.</li><li>Select <strong>Add Server</strong>.</li><li>Enter <span class="code-line">${s.java_address}</span>.</li><li>Save the server and join.</li></ol>`
      },
      {
        title: "Bedrock 📱",
        html: `<ol class="steps"><li>Open Minecraft Bedrock Edition.</li><li>Press <strong>Play</strong> and open the <strong>Servers</strong> tab.</li><li>Select <strong>Add Server</strong>.</li><li>Enter <span class="code-line">${s.bedrock_address}</span> and port <span class="code-line">${s.bedrock_port}</span>.</li><li>Save it and join the forest.</li></ol>`
      }
    ]
  };
}

function buildSkillsPage() {
  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "⭐ Skills",
    intro: "Long-term progression that rewards the things you already do in survival.",
    sections: [
      {
        title: "Core Skills 🌿",
        html: `<div class="feature-grid">${state.skills.map(skill => `<div class="feature"><strong>${skill.icon} ${skill.name}</strong><span>${skill.description}</span></div>`).join("")}</div>`
      },
      ...state.skills.map(skill => ({
        title: `${skill.name} Milestones ${skill.icon}`,
        html: skill.milestones.length
          ? `<ul class="clean-list">${skill.milestones.map(m => `<li><strong>Level ${m.level}:</strong> ${m.reward}</li>`).join("")}</ul>`
          : `<div class="quote-card">Milestones coming soon.</div>`
      }))
    ]
  };
}

function buildCropsPage() {
  const cards = state.crops.map(crop => `
    <article class="catalog-card" style="grid-template-columns:1fr;margin:0;padding:14px;min-width:0;">
      <div class="catalog-details" style="padding:0;">
        <span class="item-tag">CUSTOM CROP</span>
        <h3 style="margin:4px 0 6px;font-size:22px;">${crop.icon || "🌱"} ${crop.name}</h3>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.55;">${crop.description}</p>
        <div class="stat-row">
          <span><strong>Growth:</strong> ${crop.growth}</span>
          <span><strong>Harvest:</strong> ${crop.harvest}</span>
          <span><strong>Used For:</strong> ${crop.uses.join(", ")}</span>
        </div>
        ${creatorCredit(crop)}
      </div>
    </article>`).join("");

  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "🌱 Custom Crops",
    intro: "Discover new crops that add variety to farming while keeping the system simple and vanilla-friendly.",
    sections: [{
      title: "Crop Collection 🌿",
      html: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;align-items:stretch;">${cards}</div>`
    }]
  };
}

function buildFoodPage() {
  const cards = state.foods.map(food => `
    <article class="catalog-card" style="grid-template-columns:1fr;margin:0;padding:14px;min-width:0;">
      <div class="catalog-details" style="padding:0;">
        <span class="item-tag">CUSTOM FOOD</span>
        <h3 style="margin:4px 0 6px;font-size:22px;">${food.icon || "🍽️"} ${food.name}</h3>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.55;">${food.description}</p>
        <div class="stat-row" style="margin-bottom:10px;">
          <span><strong>Type:</strong> ${food.type}</span>
          <span><strong>Main:</strong> ${food.main_ingredient}</span>
        </div>
        <div style="font-size:12px;color:#aebbae;line-height:1.55;"><strong>Recipe:</strong> ${food.recipe.map(i => `${i.amount}× ${i.name}`).join(" + ")}</div>
        ${creatorCredit(food)}
      </div>
    </article>`).join("");

  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "🥧 Cooking & Food",
    intro: "Turn crops and familiar ingredients into cozy foods with straightforward recipes.",
    sections: [{
      title: "Recipe Collection 🍽️",
      html: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;align-items:stretch;">${cards}</div>`
    }]
  };
}

function buildCosmeticsPage() {
  return {
    category: "GETTING STARTED",
    eyebrow: "Collection",
    title: "✨ Cosmetics",
    intro: "Browse cosmetic items and see who created each piece.",
    sections: state.cosmetics.map(item => ({
      title: item.name,
      html: `<div class="catalog-card" style="grid-template-columns:1fr;"><div class="catalog-details"><span class="item-tag">${item.category || "COSMETIC"}</span><h3>${item.name}</h3><p>${item.description}</p>${item.availability ? `<div class="stat-row"><span><strong>Availability:</strong> ${item.availability}</span></div>` : ""}${creatorCredit(item)}</div></div>`
    }))
  };
}

function buildEconomyPage() {
  const e = state.economy;
  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "💰 Currency & Bank",
    intro: e.intro,
    sections: [
      { title: "Currency 💵", html: `<p>${e.currency_description}</p><div class="quote-card"><strong>${e.currency_goal}</strong></div>` },
      {
        title: "The Bank 🏦",
        html: `<p>${e.bank.description}</p><div class="bank-rate"><div class="bank-item"><span class="bank-icon">${e.bank.input_icon}</span><div><small>SELL</small><strong>${e.bank.input_amount} ${e.bank.input_item}</strong></div></div><div class="bank-arrow">→</div><div class="bank-item payout"><span class="bank-icon">${e.bank.output_icon}</span><div><small>RECEIVE</small><strong>$${e.bank.output_amount}</strong></div></div></div><div class="notice"><strong>Bank Rate:</strong> ${e.bank.input_amount} ${e.bank.input_item} = $${e.bank.output_amount}</div>`
      },
      { title: "Why this baseline? ✦", html: `<p>${e.bank.reason}</p>` }
    ]
  };
}

function setupSearch() {
  const input = document.getElementById("siteSearch");
  const results = document.getElementById("searchResults");
  const searchable = [];

  state.navigation.groups.forEach(group => {
    group.pages.forEach(p => {
      searchable.push({ id: p.id, label: p.label, category: group.title, text: `${p.label} ${group.title}`.toLowerCase() });
    });
  });

  function update() {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }

    const matches = searchable.filter(x => x.text.includes(q)).slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(x => `<a href="#${x.id}"><strong>${x.label}</strong><small>${x.category}</small></a>`).join("")
      : `<div style="padding:12px 14px;color:#91a193;">No matches found.</div>`;
    results.hidden = false;
  }

  input.addEventListener("input", update);
  results.addEventListener("click", () => {
    results.hidden = true;
    input.value = "";
  });

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      input.focus();
    }
    if (e.key === "Escape") {
      results.hidden = true;
      input.blur();
    }
  });
}

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

window.addEventListener("hashchange", () => renderPage(currentId()));

loadData().catch(error => {
  console.error(error);
  document.getElementById("page").innerHTML = `<section class="hero"><span class="eyebrow">Setup Needed</span><h1>Couldn’t load the data files.</h1><p>This site uses JSON files, so it needs to be opened through a local web server instead of double-clicking index.html.</p><div class="notice"><strong>Run:</strong> <span class="code-line">python -m http.server 8000</span><br>Then open <span class="code-line">http://localhost:8000</span></div></section>`;
});
