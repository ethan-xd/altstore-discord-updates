import cfg from './config.json';

import * as fs from 'fs';
import axios from 'axios';

import { App, News, Cache } from './utils/types';
import { appToEmbed, newsToEmbed } from './utils/utils';

(async () => {
	if (!fs.existsSync(cfg.cacheFile)) {
		fs.writeFileSync(
			cfg.cacheFile,
			JSON.stringify({
				app: {},
				news: [],
			}),
		);
	}

	const cache = JSON.parse(fs.readFileSync(cfg.cacheFile).toString());

	const newCache: Cache = {
		app: {},
		news: {},
	};

	const updatedApps: App[] = [];
	const newNews: News[] = [];

	for (const sourceURL of cfg.sources) {
		const source = (await axios.get(sourceURL)).data;

		newCache.app[source.identifier] = {};
		newCache.news[source.identifier] = [];

		source.apps.forEach((app: App) => {
			if (
				cache.app[source.identifier] === undefined ||
				cache.app[source.identifier][app.bundleIdentifier] === undefined ||
				cache.app[source.identifier][app.bundleIdentifier] !== app.version
			)
				updatedApps.push(app);

			newCache.app[source.identifier]![app.bundleIdentifier] = app.version;
		});

		source.news.forEach((news: News) => {
			if (
				cache.news[source.identifier] === undefined ||
				!cache.news[source.identifier].includes(news.identifier)
			) {
				news.sourceName = source.name;
				newNews.push(news);
			}

			// @ts-ignore
			newCache.news[source.identifier].push(news.identifier);
		});
	}

	if (updatedApps.length !== 0)
		await axios.post(cfg.webhookUrl, {
			content: `<@&${cfg.roleID}>`,
			embeds: updatedApps.map(appToEmbed),
		});

	if (newNews.length !== 0)
		await axios.post(cfg.webhookUrl, {
			content: `<@&${cfg.roleID}>`,
			embeds: newNews.map(newsToEmbed),
		});

	fs.writeFileSync(cfg.cacheFile, JSON.stringify(newCache));
})();
