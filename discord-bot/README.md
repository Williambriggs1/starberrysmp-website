# 🍓 StarberrySMP Discord Bot

A lightweight Discord helper bot for StarberrySMP. The website remains the source of truth: the bot opens Starberry's existing capture-card URLs, screenshots the rendered card, and replies in Discord.

## Commands

- `!alts` — alternate-account rule
- `!rule <name>` — any server rule
- `!join` — Java & Bedrock join info
- `!farming`, `!mining`, `!foraging`, `!fishing`
- `!skill <name>`
- `!crop <name>`
- `!food <name>`
- `!economy`
- `!bank`
- `!rank <seed|sprout|bloom|berry|starfruit>`
- `!help`

The rule aliases already supported by the website also work directly: `!grief`, `!scam`, `!lag`, `!doxxing`, `!exploits`, `!cheats`, and `!rmt`.

## Bloom setup

1. Create a Node.js bot/server instance in Bloom.
2. Use Node.js 20 or newer.
3. Upload this `discord-bot` folder or clone the repository and use this folder as the working directory.
4. Run `npm install`.
5. Copy `.env.example` to `.env` and set `DISCORD_TOKEN`.
6. Start with `npm start`.

Puppeteer downloads Chromium during install. The bot launches it with `--no-sandbox`, which is commonly required on game/bot hosting panels. If Bloom already provides Chromium, set `CHROMIUM_EXECUTABLE_PATH` in `.env`.

If Chromium cannot start on the Bloom image, the bot does not crash: it falls back to a Discord embed linking to the correct live guide page.

## Discord Developer Portal

Because the bot uses `!` prefix commands, enable **Message Content Intent** for the bot in the Discord Developer Portal under **Bot → Privileged Gateway Intents**.

Recommended bot permissions:
- View Channels
- Send Messages
- Embed Links
- Attach Files
- Read Message History

Do **not** commit `.env` or the Discord bot token.

## Website integration

Default website: `https://starberrysmp.com`

Examples used by the bot:
- `/?capture=rule&item=alts`
- `/?capture=join`
- `/?capture=skill&item=farming`
- `/?capture=crop&item=starberry`
- `/?capture=food&item=burger`
- `/?capture=bank`
- `/?capture=rank&item=berry`

Screenshots are cached in memory for 10 minutes by default so repeated commands do not repeatedly render the same page.
