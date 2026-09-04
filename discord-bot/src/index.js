require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");
const { CaptureService } = require("./capture");
const { parseCommand, captureUrl, guideUrl, helpText } = require("./commands");

const token = process.env.DISCORD_TOKEN;
const prefix = process.env.BOT_PREFIX || "!";
const siteUrl = process.env.STARBERRY_SITE_URL || "https://starberrysmp.com";
const allowedGuildId = process.env.ALLOWED_GUILD_ID || "";
const cacheMinutes = Number(process.env.CAPTURE_CACHE_MINUTES || 10);
const timeoutMs = Number(process.env.CAPTURE_TIMEOUT_MS || 15000);

if (!token || token === "put_your_bot_token_here") {
  console.error("Missing DISCORD_TOKEN. Copy .env.example to .env and add the bot token.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const captures = new CaptureService({ timeoutMs, cacheMinutes });
const cooldowns = new Map();
const COOLDOWN_MS = 3000;

function onCooldown(userId) {
  const last = cooldowns.get(userId) || 0;
  const remaining = COOLDOWN_MS - (Date.now() - last);
  if (remaining > 0) return remaining;
  cooldowns.set(userId, Date.now());
  return 0;
}

client.once("ready", () => {
  console.log(`🍓 Starberry bot online as ${client.user.tag}`);
  console.log(`Guide: ${siteUrl} | Prefix: ${prefix}`);
  client.user.setActivity(`${prefix}help · starberrysmp.com`);
});

client.on("messageCreate", async message => {
  if (message.author.bot || !message.guild) return;
  if (allowedGuildId && message.guild.id !== allowedGuildId) return;

  const command = parseCommand(message.content, prefix);
  if (!command) return;

  if (command.help) {
    await message.reply({ content: helpText(prefix), allowedMentions: { repliedUser: false } });
    return;
  }

  if (command.error) {
    await message.reply({ content: command.error, allowedMentions: { repliedUser: false } });
    return;
  }

  const remaining = onCooldown(message.author.id);
  if (remaining) return;

  const capture = captureUrl(siteUrl, command);
  const guide = guideUrl(siteUrl, command);

  try {
    await message.channel.sendTyping();
    const png = await captures.screenshot(capture);
    const safeName = `${command.type}-${command.item || "starberry"}`.replace(/[^a-z0-9-]/gi, "-").slice(0, 60);
    const attachment = new AttachmentBuilder(png, { name: `${safeName}.png` });
    await message.reply({
      files: [attachment],
      allowedMentions: { repliedUser: false }
    });
  } catch (error) {
    console.error(`Capture failed for ${capture}`, error);
    const embed = new EmbedBuilder()
      .setColor(0xff6fae)
      .setTitle("🍓 Starberry guide")
      .setDescription("I couldn't render the image card on this host, but the live guide is still available.")
      .addFields({ name: "Open the guide", value: guide });
    await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down Starberry bot...`);
  await captures.close();
  client.destroy();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", error => console.error("Unhandled rejection:", error));
process.on("uncaughtException", error => console.error("Uncaught exception:", error));

client.login(token);
