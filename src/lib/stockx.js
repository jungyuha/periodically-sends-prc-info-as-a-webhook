const got = require('got');
const host = 'stockx.com';
const port = 443;
const protocol = 'https';

const instance = got.extend({
	prefixUrl: `${protocol}://${host}:${port}`,
	handlers: [
		(options, next) => {
			return next(options);
		}
	],
	hooks: {
		afterResponse: [
			(response) => {
				console.log(response);
				return response;
			}
		]
	}
});

module.exports = instance;