'use strict'

// Package imports
const koa          = require('koa');
const json         = require('koa-json');
const bodyParser   = require('koa-bodyparser');
const router       = require('koa-router')();
//const io           = require('koa-socket');
const axios        = require('axios');

const bots         = require('./lib/Bots');
const config       = require('./config.json');

const app = koa();

app.use(bodyParser());
app.use(json());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(function* (next) {
	yield next;
});

router
		.post('/', function * (next) {
				const body = this.request.body;

				const user = body.user_name;
				const text = body.text;
				const channel = body.hannel_name;

				const command = text.split(' ')[0];
				const params = text.substring(text.indexOf(' ') + 1, text.length);

				let data = null;

				switch (command.trim().toLowerCase()) {
						case 'gif' : this.body = yield bots.getGif(params); break;
						case 'btc' : this.body = yield bots.getBtc(params); break;
						case 'weather' : this.body = yield bots.getWeather(params); break;
						default : this.body = 'Invalid command. Please use one of the following: gif, btc';
				}
		});

// Socket.io start
//io.attach(app);

// Set port & listen
app.listen(process.env.PORT || config.site.port, () => {
	console.log(config.site.name + " running on port " + config.site.port + "...");
});
