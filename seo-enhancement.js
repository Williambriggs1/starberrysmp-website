(() => {
  const baseTitle = "StarberrySMP | Cozy Vanilla+ Minecraft SMP Community";
  const baseDescription = "Join StarberrySMP, a cozy vanilla+ Minecraft SMP community for Java and Bedrock with skills, custom crops, cooking, player shops, land claims, ranks, and forest-themed progression.";

  const metaByPage = {
    welcome: {
      title: baseTitle,
      description: baseDescription
    },
    rules: {
      title: "StarberrySMP Server Rules | Minecraft SMP Community",
      description: "Read the StarberrySMP Minecraft server rules covering community conduct, griefing, claims, fair gameplay, trading, alternate accounts, and staff support."
    },
    join: {
      title: "How to Join StarberrySMP | Java & Bedrock Minecraft SMP",
      description: "Learn how to join StarberrySMP on Minecraft Java or Bedrock and connect to a cozy vanilla+ crossplay survival multiplayer community."
    },
    "getting-started": {
      title: "StarberrySMP Getting Started Guide | Vanilla+ Minecraft SMP",
      description: "Start your adventure on StarberrySMP with vanilla-friendly survival, land claims, skills, custom crops, farming progression, and community gameplay."
    },
    claims: {
      title: "Land Claims Guide | StarberrySMP Minecraft Server",
      description: "Learn how to protect builds, farms, storage, and homes on StarberrySMP using GriefPrevention land claims and trust commands."
    },
    commands: {
      title: "StarberrySMP Player Commands | Minecraft SMP Guide",
      description: "Browse useful StarberrySMP player commands for homes, teleportation, economy, claims, PlayerWarps, QuickShop, skills, and utility features."
    },
    skills: {
      title: "Minecraft Skills & Progression | StarberrySMP",
      description: "Explore StarberrySMP skills including Farming, Mining, Foraging, and Fishing, with natural survival progression and unlockable milestones."
    },
    crops: {
      title: "Custom Minecraft Crops | StarberrySMP Farming Guide",
      description: "Discover StarberrySMP custom Minecraft crops, farming ingredients, crop lore, recipe uses, and vanilla-friendly farming progression."
    },
    food: {
      title: "Custom Minecraft Food & Recipes | StarberrySMP",
      description: "Browse StarberrySMP custom foods, drinks, desserts, recipes, ingredients, and cozy cooking content for our vanilla+ Minecraft SMP."
    },
    economy: {
      title: "Minecraft Economy, Player Shops & Bank | StarberrySMP",
      description: "Learn about the StarberrySMP player-driven economy, QuickShop chest shops, PlayerWarps, trading, currency, and server bank system."
    },
    supporter: {
      title: "StarberrySMP Ranks & Supporter Perks | Minecraft SMP",
      description: "Compare Seed, Sprout, Bloom, Berry, and Starfruit ranks, including home limits, QuickShop limits, convenience perks, and customization features."
    },
    farming: {
      title: "Farming Skill Guide | StarberrySMP Minecraft SMP",
      description: "Learn about StarberrySMP farming progression, crop unlocks, right-click harvesting, bonus harvests, auto-replant, and farming milestones."
    },
    mining: {
      title: "Mining Skill Guide | StarberrySMP Minecraft SMP",
      description: "Explore StarberrySMP mining progression, mining milestones, Veinminer, Auto-Smelt, and vanilla-friendly mining rewards."
    },
    foraging: {
      title: "Foraging Skill Guide | StarberrySMP Minecraft SMP",
      description: "Explore StarberrySMP foraging progression, Treefeller, natural wood gathering, forest gameplay, and vanilla-friendly skill rewards."
    },
    fishing: {
      title: "Fishing Skill Guide | StarberrySMP Minecraft SMP",
      description: "Explore StarberrySMP fishing progression, fishing milestones, survival rewards, and cozy vanilla-friendly fishing gameplay."
    }
  };

  function setMeta(selector, attribute, value) {
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute(attribute, value);
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
  }

  window.addEventListener("hashchange", updateSeo);
  document.addEventListener("DOMContentLoaded", updateSeo);
  setTimeout(updateSeo, 0);
})();
