# AltStore Discord Updates

TypeScript Node.js tool for Discord webhooks to announce AltStore app updates and news, built for use
by a crontab.

## Set up

### Config

```json
{
	"webhookUrl": "",
	"roleID": "",
	"sources": ["https://cdn.altstore.io/file/altstore/apps.json"],
	"cacheFile": "cache.json"
}
```

- `webhookUrl`: Discord webhook URL.
- `roleID`: Discord server role ID to mention.
- `sources`: All the AltStore repos you wish to track.
- `cacheFile`: The local cache to not repeat announcements.

### Running

After building (`npm run build`), create a crontab (or scheduled task) that runs `dist/main.js` every
hour or so. The script automatically checks for duplicate announcements, so you'll only be notified
on that hour (or whatever period you select) if there is a new release or news item.

Write in your Linux terminal:

```
crontab -e
```

Then, if you wish for it to run every hour for example, save to the file:

```
0 */1 * * * node /path/to/the/repo/altstore-discord-updates/dist/main.js
```

Google crontab if you wish to learn more about it.
