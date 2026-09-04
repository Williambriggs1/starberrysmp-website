const RULE_ALIASES = new Set([
  "alts", "alt", "alternate", "grief", "griefing", "scam", "scamming",
  "lag", "advertising", "ads", "doxxing", "exploits", "cheats", "rmt"
]);

const SKILL_SHORTCUTS = new Set(["farming", "mining", "foraging", "fishing"]);

function clean(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9 _-]/g, "").slice(0, 80);
}

function parseCommand(content, prefix) {
  if (!content.startsWith(prefix)) return null;
  const raw = content.slice(prefix.length).trim();
  if (!raw) return null;

  const [nameRaw, ...rest] = raw.split(/\s+/);
  const name = clean(nameRaw);
  const query = clean(rest.join(" "));

  if (RULE_ALIASES.has(name)) return { type: "rule", item: name, label: name };
  if (SKILL_SHORTCUTS.has(name)) return { type: "skill", item: name, label: name };

  switch (name) {
    case "rule":
      return query ? { type: "rule", item: query, label: query } : { error: `Usage: ${prefix}rule <rule>` };
    case "join":
      return { type: "join", item: "", label: "join" };
    case "skill":
      return query ? { type: "skill", item: query, label: query } : { error: `Usage: ${prefix}skill <farming|mining|foraging|fishing>` };
    case "crop":
      return query ? { type: "crop", item: query, label: query } : { error: `Usage: ${prefix}crop <crop name>` };
    case "food":
      return query ? { type: "food", item: query, label: query } : { error: `Usage: ${prefix}food <food name>` };
    case "economy":
      return { type: "economy", item: "", label: "economy" };
    case "bank":
      return { type: "bank", item: "", label: "bank" };
    case "rank":
      return query ? { type: "rank", item: query, label: query } : { error: `Usage: ${prefix}rank <seed|sprout|bloom|berry|starfruit>` };
    case "help":
    case "starberry":
      return { help: true };
    default:
      return null;
  }
}

function captureUrl(siteUrl, command) {
  const base = new URL(siteUrl);
  base.pathname = "/";
  base.search = "";
  base.hash = "";
  base.searchParams.set("capture", command.type);
  if (command.item) base.searchParams.set("item", command.item);
  return base.toString();
}

function guideUrl(siteUrl, command) {
  const paths = {
    rule: "/rules/",
    join: "/join/",
    skill: "/skills/",
    crop: "/crops/",
    food: "/food/",
    economy: "/economy/",
    bank: "/economy/",
    rank: "/ranks/"
  };
  return new URL(paths[command.type] || "/", siteUrl).toString();
}

function helpText(prefix) {
  return [
    "**🍓 StarberrySMP Bot Commands**",
    `\`${prefix}alts\` — alternate-account rule`,
    `\`${prefix}rule <name>\` — server rule`,
    `\`${prefix}join\` — Java & Bedrock join info`,
    `\`${prefix}farming\`, \`${prefix}mining\`, \`${prefix}foraging\`, \`${prefix}fishing\` — skill card`,
    `\`${prefix}skill <name>\` — skill card`,
    `\`${prefix}crop <name>\` — custom crop`,
    `\`${prefix}food <name>\` — recipe / food`,
    `\`${prefix}economy\` — economy overview`,
    `\`${prefix}bank\` — bank rate`,
    `\`${prefix}rank <name>\` — Seed → Starfruit rank info`
  ].join("\n");
}

module.exports = { parseCommand, captureUrl, guideUrl, helpText };
