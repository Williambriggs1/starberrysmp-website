(() => {
  const baseTitle = "StarberrySMP | Cozy Vanilla+ Minecraft SMP Community";
  const baseDescription = "Join StarberrySMP, a cozy vanilla+ Minecraft SMP community for Java and Bedrock with skills, custom crops, cooking, player shops, land claims, ranks, and forest-themed progression.";

  const metaByPage = {
    welcome: { title: baseTitle, description: baseDescription },
    rules: { title: "StarberrySMP Server Rules | Minecraft SMP Community", description: "Read the StarberrySMP Minecraft server rules covering community conduct, griefing, claims, fair gameplay, trading, alternate accounts, and staff support." },
    links: { title: "Important Links | StarberrySMP Minecraft Community", description: "Find official StarberrySMP community links, resources, social pages, server tools, and other important destinations." },
    faq: { title: "StarberrySMP FAQ | Minecraft SMP Questions", description: "Find answers to common StarberrySMP questions about crossplay, claims, progression, ranks, gameplay, and community features." },
    join: { title: "How to Join StarberrySMP | Java & Bedrock Minecraft SMP", description: "Learn how to join StarberrySMP on Minecraft Java or Bedrock and connect to a cozy vanilla+ crossplay survival multiplayer community." },
    "getting-started": { title: "StarberrySMP Getting Started Guide | Vanilla+ Minecraft SMP", description: "Start your adventure on StarberrySMP with vanilla-friendly survival, land claims, skills, custom crops, farming progression, and community gameplay." },
    claims: { title: "Land Claims Guide | StarberrySMP Minecraft Server", description: "Learn how to protect builds, farms, storage, and homes on StarberrySMP using GriefPrevention land claims and trust commands." },
    commands: { title: "StarberrySMP Player Commands | Minecraft SMP Guide", description: "Browse useful StarberrySMP player commands for homes, teleportation, economy, claims, PlayerWarps, QuickShop, skills, and utility features." },
    "server-info": { title: "StarberrySMP Server Information | Java & Bedrock", description: "View technical and gameplay information for the StarberrySMP Java and Bedrock crossplay Minecraft community." },
    cosmetics: { title: "Minecraft Cosmetics | StarberrySMP", description: "Explore StarberrySMP cosmetic-only features, customization, tags, particles, glows, and supporter personalization." },
    farming: { title: "Farming Skill Guide | StarberrySMP Minecraft SMP", description: "Learn about StarberrySMP farming progression, crop unlocks, right-click harvesting, bonus harvests, auto-replant, and farming milestones." },
    mining: { title: "Mining Skill Guide | StarberrySMP Minecraft SMP", description: "Explore StarberrySMP mining progression, mining milestones, Veinminer, Auto-Smelt, and vanilla-friendly mining rewards." },
    foraging: { title: "Foraging Skill Guide | StarberrySMP Minecraft SMP", description: "Explore StarberrySMP foraging progression, Treefeller, natural wood gathering, forest gameplay, and vanilla-friendly skill rewards." },
    fishing: { title: "Fishing Skill Guide | StarberrySMP Minecraft SMP", description: "Explore StarberrySMP fishing progression, fishing milestones, survival rewards, and cozy vanilla-friendly fishing gameplay." },
    skills: { title: "Minecraft Skills & Progression | StarberrySMP", description: "Explore StarberrySMP skills including Farming, Mining, Foraging, and Fishing, with natural survival progression and unlockable milestones." },
    crops: { title: "Custom Minecraft Crops | StarberrySMP Farming Guide", description: "Discover StarberrySMP custom Minecraft crops, farming ingredients, crop lore, recipe uses, and vanilla-friendly farming progression." },
    food: { title: "Custom Minecraft Food & Recipes | StarberrySMP", description: "Browse StarberrySMP custom foods, drinks, desserts, recipes, ingredients, and cozy cooking content for our vanilla+ Minecraft SMP." },
    economy: { title: "Minecraft Economy, Player Shops & Bank | StarberrySMP", description: "Learn about the StarberrySMP player-driven economy, QuickShop chest shops, PlayerWarps, trading, currency, and server bank system." },
    events: { title: "StarberrySMP Events | Minecraft Community Events", description: "Discover events and community activities hosted on StarberrySMP, a cozy Java and Bedrock Minecraft SMP community." },
    supporter: { title: "StarberrySMP Ranks & Supporter Perks | Minecraft SMP", description: "Compare Seed, Sprout, Bloom, Berry, and Starfruit ranks, including home limits, QuickShop limits, convenience perks, and customization features." },
    changelog: { title: "StarberrySMP Changelog | Minecraft Server Updates", description: "Follow StarberrySMP updates, changes, new features, fixes, and additions to the Minecraft server and community." }
  };

  function setMeta(selector, attribute, value) {
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute(attribute, value);
  }

  function ensureLink(rel, href, extra = {}) {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
    Object.entries(extra).forEach(([key, value]) => link.setAttribute(key, value));
  }

  function updateSeo() {
    const id = typeof currentId === "function" ? currentId() : "welcome";
    const meta = metaByPage[id] || metaByPage.welcome;
    document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[name="twitter:title"]', "content", meta.title);
    setMeta('meta[name="twitter:description"]', "content", meta.description);

    ensureLink("icon", "/assets/starberry-favicon.svg?v=1", { type: "image/svg+xml" });
    ensureLink("shortcut icon", "/assets/starberry-favicon.svg?v=1", { type: "image/svg+xml" });
    ensureLink("apple-touch-icon", "/assets/starberry-logo.png?v=3");
  }

  window.addEventListener("hashchange", updateSeo);
  document.addEventListener("DOMContentLoaded", updateSeo);
  setTimeout(updateSeo, 0);
})();
