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

After building (`npm run build`), create a shell script for a crontab (or scheduled task) that runs `dist/main.js` every
hour or so. The script automatically checks for duplicate announcements, so you'll only be notified
on that hour (or whatever period you select) if there is a new release or news item.

Create an executable shell script:

```
cd /path/to/the/repo/altstore-discord-updates
node dist/main.js
```

Then bring up the crontab editor with:

```
crontab -e
```

Then, if you wish for it to run every hour for example, save to the file:

```
0 */1 * * * /path/to/the/script/altstore.sh
```

Google crontab if you wish to learn more about it.
