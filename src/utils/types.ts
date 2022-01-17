export interface Repo {
	name: string;
	identifier: string;
	sourceURL: string;
	apps: App[];
	news: News[];
	userInfo: UserInfo;
}

export interface App {
	beta?: boolean;
	bundleIdentifier: string;
	developerName: string;
	downloadURL: string;
	iconURL: string;
	localizedDescription: string;
	name: string;
	screenshotURLs: string[];
	size: number;
	subtitle?: string;
	tintColor: string;
	version: string;
	versionDate: string;
	versionDescription: string;
	permissions?: AppPermission[];
}

export interface AppPermission {
	type: string;
	usageDescription: string;
}

export interface News {
	title: string;
	identifier: string;
	caption: string;
	tintColor: string;
	imageURL?: string;
	date: string;
	notify: boolean;
	appID?: string;
	url?: string;
	sourceName: string;
}

export interface UserInfo {
	patreonAccessToken: string;
}

export interface Cache {
	app: { [source: string]: { [app: string]: string } };
	news: { [source: string]: string[] };
}
