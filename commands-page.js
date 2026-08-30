// Polished Seed-rank command guide.
// This replaces the placeholder Commands page without changing the main page data.

const seedCommandPage = {
  category: "GETTING STARTED",
  title: "⌨️ Seed Commands",
  eyebrow: "PLAYER COMMANDS",
  intro: "The everyday commands available to Seed players, organized so you can quickly find what you need.",
  sections: [
    {
      title: "General 🌲",
      html: commandGrid([
        ["/spawn", "Teleport to spawn"],
        ["/home", "Teleport to one of your homes"],
        ["/sethome", "Set a home"],
        ["/delhome", "Delete a home"],
        ["/tpa <player>", "Request to teleport to another player"],
        ["/tpahere <player>", "Request that a player teleport to you"],
        ["/tpaccept", "Accept a teleport request"],
        ["/tpdeny", "Deny a teleport request"],
        ["/msg <player> <message>", "Send a private message"],
        ["/reply <message>", "Reply to your most recent private message"],
        ["/ignore <player>", "Ignore a player"],
        ["/afk", "Toggle AFK status"],
        ["/getskull <username>", "Get the skull/head of a specific player"],
        ["/offhand", "Move the item in your hand to your offhand"],
        ["/skulltoggle", "Toggle skull placement/interaction behavior"]
      ])
    },
    {
      title: "Economy 💰",
      html: commandGrid([
        ["/bal", "View your balance"],
        ["/baltop", "View the server balance leaderboard"],
        ["/pay <player> <amount>", "Send money to another player"]
      ])
    },
    {
      title: "Claims 🏡",
      html: commandGrid([
        ["/claim", "Create or resize a land claim"],
        ["/abandonclaim", "Delete the claim you are standing in"],
        ["/trust <player>", "Give a player full access to your claim"],
        ["/untrust <player>", "Remove a player's claim access"],
        ["/accesstrust <player>", "Allow use of doors, buttons, and similar blocks"],
        ["/containertrust <player>", "Allow access to containers and animals"],
        ["/trustlist", "View trusted players"],
        ["/claimslist", "View your claims"],
        ["/subdivideclaims", "Create subdivisions inside a claim"],
        ["/basicclaims", "Return to normal claiming mode"]
      ])
    },
    {
      title: "Player Warps ✨",
      html: commandGrid([
        ["/pwarp", "Open the Player Warp menu"],
        ["/pwarp <warp>", "Visit a Player Warp"],
        ["/pwarp create <name>", "Create your Player Warp"],
        ["/pwarp remove <name>", "Remove your Player Warp"],
        ["/pwarp manage <name>", "Manage your Player Warp"]
      ])
    },
    {
      title: "Player Shops 🧺",
      html: commandGrid([
        ["/qs", "Access QuickShop commands"],
        ["/qs price <amount>", "Change your shop price"],
        ["/qs buy", "Change a shop into a buying shop"],
        ["/qs sell", "Change a shop into a selling shop"],
        ["/qs remove", "Remove your shop"],
        ["/qs history", "View shop transaction history"]
      ])
    },
    {
      title: "Skills ⭐",
      html: `${commandGrid([
        ["/skills", "Open your Starberry Skills menu"],
        ["/veinminer", "Toggle Veinminer once unlocked"],
        ["/treefeller", "Toggle Treefeller once unlocked"],
        ["/autosmelt", "Toggle Auto Smelt once unlocked"]
      ])}<div class="quote-card"><strong>🌱 Progression Note</strong><br>Some commands and abilities require progression through Starberry Skills before they can be used. Higher supporter ranks unlock additional convenience commands, homes, shops, and Player Warps.</div>`
    }
  ]
};

function commandGrid(commands) {
  return `<div class="command-grid">${commands.map(([command, description]) => `
    <div class="command-card">
      <span class="command-code">${escapeCommand(command)}</span>
      <span class="command-description">${description}</span>
    </div>`).join("")}</div>`;
}

function escapeCommand(command) {
  return command
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const originalRenderPage = renderPage;
renderPage = function(id) {
  if (id === "commands") {
    state.pages.commands = seedCommandPage;
  }
  return originalRenderPage(id);
};
