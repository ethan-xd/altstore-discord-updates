import { run } from './execute';

(async () => {
	await run((await import('./config.json')).default);
})();
