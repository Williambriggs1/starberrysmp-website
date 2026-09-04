// Full-site search for pages, rules, commands, skills, crops, foods, economy, and ranks.
// Loaded after app.js so it replaces the original page-title-only search before data loading completes.

function setupSearch() {
  const input = document.getElementById("siteSearch");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;

  const entries = buildSearchIndex();
  let activeIndex = -1;
  let currentMatches = [];

  input.setAttribute("aria-label", "Search the Starberry forest guide");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", "searchResults");
  results.setAttribute("role", "listbox");

  const normalize = value => String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  function scoreEntry(entry, rawQuery) {
    const query = normalize(rawQuery);
    if (!query) return 0;

    const haystack = normalize(`${entry.label} ${entry.category} ${entry.keywords} ${entry.snippet}`);
    const label = normalize(entry.label);
    const words = query.split(" ").filter(Boolean);
    let score = 0;

    if (label === query) score += 120;
    if (label.startsWith(query)) score += 80;
    if (label.includes(query)) score += 60;
    if (haystack.includes(query)) score += 42;

    for (const word of words) {
      if (label.split(" ").some(x => x.startsWith(word))) score += 24;
      else if (haystack.split(" ").some(x => x.startsWith(word))) score += 14;
      else if (haystack.includes(word)) score += 8;
      else return 0;
    }

    if (entry.type === "page") score += 4;
    return score;
  }

  function highlight(text, query) {
    const safe = escapeSearchHtml(text);
    const terms = normalize(query).split(" ").filter(x => x.length > 1);
    if (!terms.length) return safe;
    const escapedTerms = terms.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escapedTerms.join("|")})`, "ig");
    return safe.replace(regex, "<mark>$1</mark>");
  }

  function pageHref(pageId) {
    return typeof starberryPageUrl === "function" ? starberryPageUrl(pageId) : `/#${pageId}`;
  }

  function render(query) {
    const q = query.trim();
    activeIndex = -1;

    if (!q) {
      currentMatches = [];
      results.innerHTML = `
        <div class="search-empty-state">
          <span>✦</span>
          <div><strong>Search the forest</strong><small>Try “alts”, “starberry”, “/back”, “farming”, “burger”, or “berry rank”.</small></div>
        </div>`;
      results.hidden = false;
      return;
    }

    currentMatches = entries
      .map(entry => ({ ...entry, score: scoreEntry(entry, q) }))
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .slice(0, 10);

    if (!currentMatches.length) {
      results.innerHTML = `
        <div class="search-empty-state">
          <span>🌱</span>
          <div><strong>No trail found for “${escapeSearchHtml(q)}”</strong><small>Try a shorter word or a related term.</small></div>
        </div>`;
      results.hidden = false;
      return;
    }

    results.innerHTML = currentMatches.map((entry, index) => `
      <a class="search-result" role="option" aria-selected="false" data-index="${index}" href="${pageHref(entry.pageId)}">
        <span class="search-result-icon">${entry.icon || "✦"}</span>
        <span class="search-result-copy">
          <span class="search-result-topline">
            <strong>${highlight(entry.label, q)}</strong>
            <em>${escapeSearchHtml(entry.typeLabel)}</em>
          </span>
          ${entry.snippet ? `<small>${highlight(trimSearchSnippet(entry.snippet, 105), q)}</small>` : ""}
        </span>
      </a>`).join("");

    results.hidden = false;
  }

  function setActive(index) {
    const links = [...results.querySelectorAll(".search-result")];
    if (!links.length) return;
    activeIndex = Math.max(0, Math.min(index, links.length - 1));
    links.forEach((link, i) => {
      const active = i === activeIndex;
      link.classList.toggle("active", active);
      link.setAttribute("aria-selected", active ? "true" : "false");
    });
    links[activeIndex].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("focus", () => render(input.value));

  input.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.hidden) render(input.value);
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex <= 0 ? currentMatches.length - 1 : activeIndex - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const link = results.querySelector(`.search-result[data-index="${activeIndex}"]`);
      if (link) link.click();
    } else if (event.key === "Escape") {
      results.hidden = true;
      input.blur();
    }
  });

  results.addEventListener("mousemove", event => {
    const link = event.target.closest(".search-result");
    if (link) setActive(Number(link.dataset.index));
  });

  results.addEventListener("click", event => {
    const link = event.target.closest(".search-result");
    if (!link) return;
    input.value = "";
    results.hidden = true;
    input.blur();
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".search-wrap")) results.hidden = true;
  });

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      input.focus();
      input.select();
      render(input.value);
    }
  });
}

function buildSearchIndex() {
  const entries = [];
  const seen = new Set();
  const stripHtml = html => {
    const node = document.createElement("div");
    node.innerHTML = html || "";
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  };

  function add(entry) {
    const key = `${entry.pageId}|${entry.type}|${entry.label}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ keywords: "", snippet: "", ...entry });
  }

  state.navigation.groups.forEach(group => {
    group.pages.forEach(page => add({
      pageId: page.id,
      label: page.label,
      category: group.title,
      icon: page.icon,
      type: "page",
      typeLabel: "PAGE",
      keywords: `${page.id} ${group.title}`
    }));
  });

  Object.entries(state.pages).forEach(([pageId, page]) => {
    if (!page) return;
    add({
      pageId,
      label: page.title?.replace(/^\p{Extended_Pictographic}+\s*/u, "") || pageId,
      category: page.category || "Guide",
      icon: "📖",
      type: "page-content",
      typeLabel: "GUIDE",
      snippet: page.intro || "",
      keywords: page.intro || ""
    });

    (page.sections || []).forEach(section => {
      const text = stripHtml(section.html);
      add({
        pageId,
        label: section.title.replace(/\s+[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u, ""),
        category: page.title || page.category,
        icon: "✦",
        type: "section",
        typeLabel: "SECTION",
        snippet: text,
        keywords: text
      });

      if (pageId === "rules") {
        const node = document.createElement("div");
        node.innerHTML = section.html || "";
        node.querySelectorAll("li").forEach(li => {
          const strong = li.querySelector("strong");
          const heading = strong ? strong.textContent.replace(/:\s*$/, "").trim() : trimSearchSnippet(li.textContent, 45);
          add({
            pageId: "rules",
            label: heading,
            category: "Server Rules",
            icon: "📜",
            type: "rule",
            typeLabel: "RULE",
            snippet: li.textContent.trim(),
            keywords: `${heading} ${li.textContent} alts alternate account rules`
          });
        });
      }
    });
  });

  state.skills.forEach(skill => add({
    pageId: "skills",
    label: skill.name,
    category: "Skills",
    icon: skill.icon || "⭐",
    type: "skill",
    typeLabel: "SKILL",
    snippet: skill.description,
    keywords: `${skill.short_description || ""} ${(skill.milestones || []).map(m => `level ${m.level} ${m.reward}`).join(" ")}`
  }));

  state.crops.forEach(crop => add({
    pageId: "crops",
    label: crop.name,
    category: "Custom Crops",
    icon: crop.icon || "🌱",
    type: "crop",
    typeLabel: "CROP",
    snippet: crop.lore || crop.description,
    keywords: `${crop.description} ${crop.lore || ""} ${(crop.uses || []).join(" ")}`
  }));

  state.foods.forEach(food => add({
    pageId: "food",
    label: food.name,
    category: "Cooking & Food",
    icon: food.icon || "🍽️",
    type: "food",
    typeLabel: "FOOD",
    snippet: food.lore || food.description,
    keywords: `${food.description} ${food.lore || ""} ${food.type} ${food.main_ingredient} ${(food.recipe || []).map(x => x.name).join(" ")}`
  }));

  if (state.economy) {
    add({ pageId: "economy", label: "Currency & Economy", category: "Gameplay", icon: "💰", type: "economy", typeLabel: "ECONOMY", snippet: state.economy.intro, keywords: JSON.stringify(state.economy) });
    add({ pageId: "economy", label: state.economy.bank?.name || "The Bank", category: "Currency & Economy", icon: "🏦", type: "bank", typeLabel: "BANK", snippet: state.economy.bank?.description || "", keywords: JSON.stringify(state.economy.bank || {}) });
  }

  if (typeof seedCommandPage !== "undefined") {
    (seedCommandPage.sections || []).forEach(section => {
      const node = document.createElement("div");
      node.innerHTML = section.html || "";
      node.querySelectorAll(".command-card").forEach(card => {
        const command = card.querySelector(".command-code")?.textContent?.trim();
        const description = card.querySelector(".command-description")?.textContent?.trim();
        if (!command) return;
        add({ pageId: "commands", label: command, category: section.title, icon: "⌨️", type: "command", typeLabel: "COMMAND", snippet: description, keywords: `${command.replace("/", "")} ${description}` });
      });
    });
  }

  if (typeof starberryRanks !== "undefined" && Array.isArray(starberryRanks)) {
    starberryRanks.forEach(rank => add({
      pageId: "supporter",
      label: rank.name,
      category: "Ranks & Supporter",
      icon: rank.icon || "🍓",
      type: "rank",
      typeLabel: "RANK",
      snippet: rank.description,
      keywords: `${rank.type} homes sethome ${rank.home_limit} quickshop shops ${rank.quickshop_limit} ${(rank.perks || []).join(" ")}`
    }));
  }

  return entries;
}

function escapeSearchHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function trimSearchSnippet(value, max = 100) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}
