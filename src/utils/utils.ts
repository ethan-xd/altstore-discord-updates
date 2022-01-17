import { App, News } from './types';

export const appToEmbed = (app: App) => {
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
			text: `${app.bundleIdentifier} | ${app.developerName} | ${app.versionDate}`,
		},
		image: {
			url: app.screenshotURLs[0],
		},
	};
};

export const newsToEmbed = (news: News) => {
	return {
		title: news.title,
		description: news.caption,
		color: parseInt(news.tintColor, 16),
		author: {
			name: news.sourceName,
		},
		image: {
			url: news.imageURL,
		},
		footer: {
			text: `${news.identifier} | ${news.date}`,
		},
	};
};
