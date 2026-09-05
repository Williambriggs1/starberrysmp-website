# StarberrySMP Forest Guide API

StarberrySMP exposes a small public, read-only API from the website itself. Because the site is hosted on GitHub Pages, the API is static JSON rather than a server-side application.

## Entry point

`/api/v1/manifest.json`

The manifest describes:

- all public Starberry informational slash commands
- which website dataset each command queries
- autocomplete behavior
- how list/detail embeds should be rendered
- guide URLs and Starberry branding

Starling downloads this manifest and interprets it generically. Starberry content is not duplicated in the bot repository.

## Data sources

The manifest currently exposes the existing website data under `/data/`, including rules/pages, server information, skills, crops, foods, economy, and ranks.

Normal content changes only require editing the website data files. Starling fetches those files live when commands are used.

## Adding future content

### Add a new crop, food, skill, or rank

Add it to the matching `/data/*.json` file. List commands and autocomplete automatically discover the new entry; no bot code change is required.

### Add a new informational slash command

Add a command definition to `/api/v1/manifest.json` using one of the generic modes supported by Starling:

- `list` — list every record in a resource
- `lookup` — query one record by ID/name/search text
- `object` — display one JSON object or nested object
- `help` — dynamically list API-defined commands

Command options may use `autocomplete: true`; Starling will build the suggestions from the referenced website resource.

Starling refreshes the manifest periodically and syncs slash commands automatically, so adding or removing an API-defined command does not require changing Starling's source code.

## Storage model

Starling does not persist Forest Guide content to disk. The bot only keeps the API manifest and very short-lived query results in memory. Restarting the bot clears that memory immediately.
