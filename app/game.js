let smart = new SmartJS('2D', [480, 360], {background: '#ffaf25'});

let game = smart.game;

var a = 1;

game.newLoopFromConstructor('menu', function () {

	this.update = function (dt) {

	},

	this.render = function () {

	}

});

game.startLoop('menu');