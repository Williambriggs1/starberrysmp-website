(() => {
  const params = new URLSearchParams(location.search);
  const captureType = params.get("capture");
  if (!captureType) return;

  const item = (params.get("item") || "").toLowerCase().trim();
  const aliases = {
    alt: "alternate-accounts",
    alts: "alternate-accounts",
    alternate: "alternate-accounts",
    grief: "no-griefing-or-stealing",
    griefing: "no-griefing-or-stealing",
    scam: "no-scamming",
    scamming: "no-scamming",
    lag: "do-not-intentionally-cause-lag",
    advertising: "no-spam-or-unauthorized-advertising",
    ads: "no-spam-or-unauthorized-advertising",
    doxxing: "protect-personal-information",
    exploits: "no-bugs-dupes-or-exploits",
    cheats: "no-unfair-advantages",
    rmt: "no-real-money-trading"
  };

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slug(value) {
    return String(value || "").toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function captureCard({ eyebrow, icon, title, subtitle, body, footer = "starberrysmp.com" }) {
    return `
      <article id="discord-capture-card" class="discord-capture-card">
        <div class="capture-stars">✦ · ✧ · ✦</div>
        <header class="capture-header">
          <span class="capture-icon">${icon}</span>
          <div>
            <span class="capture-eyebrow">${esc(eyebrow)}</span>
            <h1>${esc(title)}</h1>
            ${subtitle ? `<p>${esc(subtitle)}</p>` : ""}
          </div>
        </header>
        <div class="capture-body">${body}</div>
        <footer class="capture-footer"><span>🍓 StarberrySMP</span><span>${esc(footer)}</span></footer>
      </article>`;
  }

  function renderRule() {
    const sections = state.pages.rules?.sections || [];
    const rules = [];
    const parser = new DOMParser();

    sections.forEach(section => {
      const doc = parser.parseFromString(`<div>${section.html}</div>`, "text/html");
      doc.querySelectorAll("li").forEach(li => {
        const strong = li.querySelector("strong");
        const heading = strong ? strong.textContent.replace(/:\s*$/, "").trim() : li.textContent.trim();
        rules.push({ heading, key: slug(heading), section: section.title.replace(/\s+[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u, ""), html: li.innerHTML });
      });
    });

    const wanted = aliases[item] || item;
    const rule = rules.find(r => r.key === wanted) || rules.find(r => r.key.includes(wanted));
    if (!rule) return notFound("Rule", item);

    return captureCard({
      eyebrow: `SERVER RULE · ${rule.section}`,
      icon: "📜",
      title: rule.heading,
      subtitle: "StarberrySMP Community Guidelines",
      body: `<div class="capture-rule-text">${rule.html}</div>`
    });
  }

  function renderJoin() {
    const s = state.server;
    return captureCard({
      eyebrow: "HOW TO JOIN",
      icon: "🌱",
      title: "Join the Starberry Forest",
      subtitle: "Java & Bedrock Crossplay",
      body: `
        <div class="capture-info-grid">
          <div><small>JAVA</small><strong>${esc(s.java_address)}</strong></div>
          <div><small>BEDROCK</small><strong>${esc(s.bedrock_address)}</strong><span>Port ${esc(s.bedrock_port)}</span></div>
        </div>
        <div class="capture-note">Open Multiplayer / Servers, add StarberrySMP using the address above, then join the forest. ✦</div>`
    });
  }

  function renderSkill() {
    const skill = state.skills.find(x => x.name.toLowerCase() === item || slug(x.name) === item);
    if (!skill) return notFound("Skill", item);
    const milestones = skill.milestones?.length
      ? `<div class="capture-list">${skill.milestones.map(m => `<div><b>Level ${m.level}</b><span>${esc(m.reward)}</span></div>`).join("")}</div>`
      : `<div class="capture-note">Milestones are still growing.</div>`;
    return captureCard({
      eyebrow: "STARBERRY SKILLS",
      icon: skill.icon || "⭐",
      title: skill.name,
      subtitle: skill.short_description || skill.description,
      body: `<p class="capture-description">${esc(skill.description)}</p>${milestones}`
    });
  }

  function renderCrop() {
    const crop = state.crops.find(x => x.id === item || slug(x.name) === item);
    if (!crop) return notFound("Crop", item);
    return captureCard({
      eyebrow: "CUSTOM CROP",
      icon: crop.icon || "🌱",
      title: crop.name,
      subtitle: crop.description,
      body: `
        ${crop.lore ? `<div class="capture-lore">✦ <em>${esc(crop.lore)}</em></div>` : ""}
        <div class="capture-tags"><span><b>Growth</b>${esc(crop.growth)}</span><span><b>Harvest</b>${esc(crop.harvest)}</span></div>
        <div class="capture-note"><strong>Used For:</strong> ${esc(crop.uses.join(", "))}</div>`
    });
  }

  function renderFood() {
    const food = state.foods.find(x => x.id === item || slug(x.name) === item);
    if (!food) return notFound("Food", item);
    return captureCard({
      eyebrow: food.type?.toUpperCase() || "CUSTOM FOOD",
      icon: food.icon || "🍽️",
      title: food.name,
      subtitle: food.description,
      body: `
        ${food.lore ? `<div class="capture-lore">✦ <em>${esc(food.lore)}</em></div>` : ""}
        <div class="capture-tags"><span><b>Type</b>${esc(food.type)}</span><span><b>Main</b>${esc(food.main_ingredient)}</span></div>
        <div class="capture-recipe"><small>RECIPE</small>${food.recipe.map(i => `<span>${i.amount}× ${esc(i.name)}</span>`).join("<b>+</b>")}</div>`
    });
  }

  function renderEconomy(bankOnly = false) {
    const e = state.economy;
    if (bankOnly) {
      return captureCard({
        eyebrow: "CURRENCY & ECONOMY",
        icon: "🏦",
        title: e.bank.name || "The Bank",
        subtitle: e.bank.description,
        body: `
          <div class="capture-rate"><span>${e.bank.input_icon} ${e.bank.input_amount} ${esc(e.bank.input_item)}</span><b>→</b><strong>${e.bank.output_icon} $${e.bank.output_amount}</strong></div>
          ${e.bank.additional_selling ? `<div class="capture-note">${esc(e.bank.additional_selling)}</div>` : ""}`
      });
    }
    return captureCard({
      eyebrow: "CURRENCY & ECONOMY",
      icon: "💰",
      title: "Starberry Economy",
      subtitle: e.intro,
      body: `
        <p class="capture-description">${esc(e.currency_description)}</p>
        <div class="capture-rate"><span>${e.bank.input_icon} ${e.bank.input_amount} ${esc(e.bank.input_item)}</span><b>→</b><strong>${e.bank.output_icon} $${e.bank.output_amount}</strong></div>
        <div class="capture-note">🧺 QuickShop chests + 🧭 PlayerWarps keep trading player-driven.</div>`
    });
  }

  function renderRank() {
    const ranks = typeof starberryRanks !== "undefined" ? starberryRanks : [];
    const rank = ranks.find(x => x.id === item || slug(x.name) === item);
    if (!rank) return notFound("Rank", item);
    return captureCard({
      eyebrow: rank.type.toUpperCase(),
      icon: rank.icon,
      title: rank.name,
      subtitle: rank.description,
      body: `
        <div class="capture-rank-limit"><span>🧺 QuickShop Limit</span><strong>${rank.quickshop_limit}</strong></div>
        <div class="capture-list">${rank.perks.map(perk => `<div><b>✦</b><span>${esc(perk)}</span></div>`).join("")}</div>`
    });
  }

  function notFound(kind, value) {
    return captureCard({ eyebrow: "STARBERRY INFO", icon: "🍓", title: `${kind} not found`, subtitle: value || "No item was provided.", body: `<div class="capture-note">Check the capture command and try again.</div>` });
  }

  function renderCapture() {
    document.body.classList.add("capture-mode");
    let html;
    if (captureType === "rule") html = renderRule();
    else if (captureType === "join") html = renderJoin();
    else if (captureType === "skill") html = renderSkill();
    else if (captureType === "crop") html = renderCrop();
    else if (captureType === "food") html = renderFood();
    else if (captureType === "economy") html = renderEconomy(false);
    else if (captureType === "bank") html = renderEconomy(true);
    else if (captureType === "rank") html = renderRank();
    else html = notFound("Capture", captureType);

    document.getElementById("page").innerHTML = html;
    document.body.dataset.captureReady = "true";
    document.title = `StarberrySMP · ${captureType}`;
  }

  let attempts = 0;
  const wait = setInterval(() => {
    attempts++;
    const coreReady = typeof state !== "undefined" && state.navigation && state.server && state.crops.length && state.foods.length && state.skills.length && state.economy;
    const rankReady = captureType !== "rank" || (typeof starberryRanks !== "undefined" && starberryRanks.length);
    if (coreReady && rankReady) {
      clearInterval(wait);
      renderCapture();
    } else if (attempts > 100) {
      clearInterval(wait);
    }
  }, 50);
})();
