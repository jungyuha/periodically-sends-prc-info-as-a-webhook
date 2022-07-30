const got = require('got');
const host = 'kream.co.kr';
const port = 80;
const protocol = 'http';

const instance = got.extend({
	prefixUrl: `${protocol}://${host}:${port}`,
	handlers: [
		(options, next) => {
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			return next(options);
		}
	],
	hooks: {
		afterResponse: [
			(response) => {
				return response;
			}
		]
	}
});

module.exports = instance;