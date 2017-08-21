;function SmartJS (ctx, [width, height], options = {}) {

	let	SmartJS = this,
	device = window,
	engineVersion = '0.1.0';

	let log = (message, theme) =>  console.log('[SmartJS]' + ((theme) ? ' [' + theme + '] ' : ' ') + ': ', message);

	device.log = log;

	let errorLog = function (err) {
		let stack = decodeURI(err.stack.replace(/(@|[\(\)]|[\w]+:\/\/)/g, '')).split(/\n/);
		stack = (stack[2] == '') ? stack[0] : stack[1].split('/');
		stack = stack[stack.length - 1].split(':');
		log("" + err.toString() + "\n file : " + stack[0] + "\n line : " + stack[1] + "\n symbol : " + stack[2]);
	};



// ********************************* //
// ************ Setting ************ //
// ********************************* //

	let isLoadDOM = false,
			isRun = false,
			isShowError = true;

	let slowMotion = 1;

	let contextSetting = {
		globalAplha: 1,
		globalCompositeOperation: "source-over",
		lineCap: 'square',
		lineJoin: 'round',
		textBaseline: 'middle',
		font: '14px sans-serif',
		fillStyle: '#f1f1f1',
		strokeStyle: '#f6f6f6'
	};

// ********************************* //
// ********** Setting End ********** //
// ********************************* //



// ********************************* //
// ************* Sizes ************* //
// ********************************* //

var width = width,
		height = height,

		width2 = width / 2,
		height2 = height / 2;

// ********************************* //
// *********** Sizes End *********** //
// ********************************* //



// ********************************* //
// ************* Event ************* //
// ********************************* //

	device.addEventListener('load', function () {
		events.runEvent('load');
	});

	let events = {

		eventCount: 0,
		topic: {
			'load': [],
			'beforeEng': [],
			'afterEng': []
		},

		addEvent: function (event, key, func) {
			if (!this.topic.hasOwnProperty(event) && typeof event == 'string') {
				this.topic[event] = [];
			}

			this.topic[event].push({
				func: func,
				key: key
			});

			this.eventCount += 1;
		},

		delEvent: function (event, key, bool = false) {
			if (this.topic.hasOwnProperty(event)) {
				this.topic[object.event].forEach((value, index, arr) => {
					if (value.key === key) {
						this.topic[event].splice(index, 1);
						this.eventCount -= 1;
						if (bool) {
							delete this.topic[event];
						}
					}
				});
			}
		},

		runEvent: function (event, key) {
			if (!this.topic.hasOwnProperty(event)) {
				return false;
			}

			if (key !== undefined) {
				this.topic[event].forEach((value) => {
					if (value.key === key) {
						setTimeout(value.func, 0);
					}
				});
			} else {
				let events = this.topic[event],
						length = events.length;

				while (length--) {
					setTimeout(events[length].func, 0);
				}
			}
		}

	};

	events.addEvent('load', 'dom', function () {
		isLoadDOM = true;
		createTag(canvas);
	});

// ********************************* //
// *********** Event End *********** //
// ********************************* //



// ********************************* //
// ********* Engine Object ********* //
// ********************************* //

	this.game = Object.create(null);
	this.system = Object.create(null);
	this.event = Object.create(null);

// ********************************* //
// ******* Engine Object End ******* //
// ********************************* //



// ********************************* //
// ************ Events ************* //
// ********************************* //

this.event.addEvent = function (object, func) {
	events.addEvent(object, func);
};

this.event.delEvent = function (object, bool) {
	events.delEvent(object, bool)
};

this.event.runEvent = function (object) {
	events.runEvent(object);
};

this.event.eventCount = function () {
	return events.eventCount;
};

// ********************************* //
// *********** Events End ********** //
// ********************************* //



// ********************************* //
// ************* System ************ //
// ********************************* //

	this.system.setDefaultSetting = function () {
		for (var prop in contextSetting) {
			context[prop] = contextSetting[prop];
		}
		context.save();
	};

	this.system.setSetting = function (setting) {
		for (var prop in setting) {
			if (contextSetting.hasOwnProperty(prop)) {
				contextSetting[prop] = setting[prop];
			}
		}
	};

// ********************************* //
// ********** System End *********** //
// ********************************* //



// ********************************* //
// ************* Game ************** //
// ********************************* //

	let fps = 60,
			loops = {},
			step = 1 / fps,
			thatTick = Date.now(),
			lastTick = 0,
			dt = 0;

	let loop = function () {
		if (isLoadDOM && isRun) {
			try {
				thatTick = Date.now();
				dt = dt + Math.min(1, (thatTick - lastTick) / 1000);

				while (dt > step) {
					currLoop.update(dt);
					dt = dt - step;
				}

				currLoop.render();
				lastTick = thatTick;

			} catch (error) {
				if (isShowError) {
					errorLog(error);
				}
				return;
			}
		}
		engine(loop);
	};

	let currLoop = {
		update: function () {
			log("please use 'startLoop' for game start");
		},
		redner: function () {
		},
		entry: false,
		exit: false
	};

	let getRequestAnimationFrame = function () {
		return device.requestAnimationFrame  ||
			device.mozRequestAnimationFrame    ||
			device.webkitRequestAnimationFrame ||
			device.oRequestAnimationFrame			||
			function (callback) {
				setTimeout(callback, 1e3 / fps);
			};
	};

	let engine = getRequestAnimationFrame();

	this.game.getLoop = function (key) {
		return (key in loops) ? loops[key] : false;
	};

	this.game.newLoop = function (key, update, render, entry, exit) {
		if (!loops.hasOwnProperty(key)) {
			loops[key] = {
				update: update,
				render: render,
				entry: entry || false,
				exit: exit	|| false
			};
		}
	};

	this.game.newLoopFromConstructor = function (key, constructor) {
		let loop = new constructor();
		if (!loop.hasOwnProperty(key)) {
			loops[key] = {
				update: loop.update,
				render: loop.render,
				entry: loop.entry || false,
				exit: loop.exit || false
			};
		}
	};

	this.game.newLoopFromClassObject = function (key, obj) {
		if (!loops.hasOwnProperty(key) && obj.update && obj.render) {
			loops[key] = {
				update: obj.update,
				render: obj.render,
				entry: obj.entry || false,
				exit: obj.exit || false
			};
		}
	};

	this.game.setLoop = function (key) {
		if (key in loops) {
			currLoop = loops[key];
		}
	};

	this.game.startLoop = function (key) {
		this.setLoop(key);
		this.start();
	};

	this.game.start = function () {
		if (isRun) {
			return log('loop is totaly runned', 'Game');
		} else {
			isRun = true;
			loop();
		}
	};

	this.game.stop = function () {
		if (isRun) {
			engine = function () {
				log('game is stop', 'Game');
			}
			isRun = false;
		} else {
			log('game have already stopped', 'Game');
		}
	};

	this.game.resume = function () {
		if (!isRun) {
			engine = getRequestAnimationFrame();
			this.start();
		}
	};

	this.game.getDT = function () {
		return dt;
	}

	this.game.getContext = function () {
		return (isLoadDOM) ? context : false;
	};

	this.game.getFPS = function () {
		return fps;
	};

	this.game.setFPS = function (newFps) {
		fps = (newFps >= 30 && newFps <= 120) ? newFps : 60;
	};

	// let ticks = 0,
	// 		fpsMonitor = {},
	// 		statsThatTick = Date.now(),
	// 		statsLastTick = 0;

	// var	Monitor = function (key) {
	// 	this.key = key;


	// };

// ********************************* //
// ************ Game End *********** //
// ********************************* //



// ********************************* //
// ********** Canvas Init ********** //
// ********************************* //

	let canvas = document.createElement('canvas'),
			context = canvas.getContext(ctx.toLowerCase());

			canvas.width = width;
			canvas.height = height;

			canvas.style.backgroundColor = options.background || 'silver';

	let createTag = function (elem) {
		document.body.appendChild(elem);

		elem.style.position = 'fixed';
		elem.style.left = '0px';
		elem.style.top = '0px';
		elem.style.overflow = 'hidden';
		elem.style.zIndex = '1000';
	};

// ********************************* //
// ******** Canvas Init End ******** //
// ********************************* //

};

SmartJS.prototype = Object.prototype;