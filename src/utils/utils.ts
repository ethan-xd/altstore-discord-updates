import { App, News } from './types';
import { APIEmbed } from 'discord-api-types/payloads/v8/channel';

export const appToEmbed = (app: App, sourceName: string): APIEmbed => {
	return {
		title: `Click here for ${app.version} IPA${app.beta ? ' (Beta)' : ''}`,
		description: app.versionDescription,
		url: app.downloadURL,
		color: parseInt(app.tintColor, 16),
		author: {
			name: app.name,
			icon_url: app.iconURL,
		},
		footer: {
			text: sourceName,
		},
		timestamp: app.versionDate,
		...(typeof app.screenshotURLs[0] === 'undefined'
			? {}
			: {
					image: {
						url: app.screenshotURLs[0],
					},
			  }),
	};
};

export const newsToEmbed = (news: News, sourceName: string): APIEmbed => {
	return {
		title: news.title,
		description: news.caption,
		color: parseInt(news.tintColor, 16),
		author: {
			name: sourceName,
		},
		timestamp: news.date,
		...(typeof news.imageURL === 'undefined'
			? {}
			: {
					image: {
						url: news.imageURL,
					},
			  }),
		...(typeof news.url === 'undefined'
			? {}
			: {
					url: news.url,
			  }),
	};
};
