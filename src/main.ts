import * as fs from 'fs';
import axios from 'axios';

import { UpdatedApp, UpdatedNews, Cache, Repo } from './utils/types';
import { appToEmbed, newsToEmbed } from './utils/utils';
import { APIEmbed } from 'discord-api-types/payloads/v8/channel';

const cfg = require('../config.json');

(async () => {
	const initialCache = { app: {}, news: {} } as const;

	const cacheFile = 'cache.json';

	if (!fs.existsSync(cacheFile)) {
		fs.writeFileSync(cacheFile, JSON.stringify(initialCache));
	}

	let cache: Cache;

	try {
		cache = JSON.parse(fs.readFileSync(cacheFile).toString());
	} catch (e) {
		cache = initialCache;
	}

	const updatedApps: UpdatedApp[] = [];
	const newNews: UpdatedNews[] = [];

	const repoData: Repo[] = await Promise.all(
		cfg.sources.map(async (sourceURL: string) => (await axios.get(sourceURL)).data),
	);

	const newCache: Cache = repoData.reduce(
		(result: Cache, source) => ({
			app: {
				...result.app,
				[source.identifier]: source.apps.reduce((previousApp: Cache['app'][string], app) => {
					if (cache.app[source.identifier]?.[app.bundleIdentifier] !== app.version) {
						updatedApps.push({ app, source: source.name });
					}
					return {
						...previousApp,
						[app.bundleIdentifier]: app.version,
					};
				}, {}),
			},
			news: {
				...result.news,
				[source.identifier]: source.news.map((news) => {
					if (!cache.news[source.identifier]?.includes(news.identifier)) {
						newNews.push({ news, source: source.name });
					}
					return news.identifier;
				}),
			},
		}),
		initialCache,
	);

	const appUpdateCount = updatedApps.length;
	const newsUpdateCount = newNews.length;

	const sendMessage = async <T>(
		updateCount: number,
		updatedThings: T[],
		mapper: (value: T) => APIEmbed,
	) => {
		if (updateCount === 0) return;
		let contentMessage = `<@&${cfg.roleID}>`;

		if (updateCount > 10) {
			contentMessage += ` (${updateCount - 10} more update${
				updateCount - 10 !== 1 ? 's' : ''
			} hidden)`;
		}

		await axios.post(cfg.webhookUrl, {
			content: contentMessage,
			embeds: updatedThings.slice(0, 10).map(mapper),
		});
	};

	await Promise.all([
		sendMessage(appUpdateCount, updatedApps, ({ app, source }) => appToEmbed(app, source)),
		sendMessage(newsUpdateCount, newNews, ({ news, source }) => newsToEmbed(news, source)),
	]);

	fs.writeFileSync(cacheFile, JSON.stringify(newCache));
})();
