define(function() {

	// shim layer with setTimeout fallback
	var requestAnimationFrame = (function(){

		return window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
			setTimeout(callback, 1000 / 60);
		};
	})();

	function Timer() {
		this._time = (new Date()).getTime();
	}
	Timer.prototype.next = function() {
		var t = (new Date()).getTime();
		var o = this._time;
		var r = (t-this._time)/1000;
		this._time = t;
		return r;
	}
	
	function Timeline() {
	}
	Timeline.prototype.factor = 1;
	Timeline.prototype.everyFrame = function(d) {
		var tl = this;
		var count = 0;
		var timer = new Timer();
		function f() {
			count++;
			if(count>=tl.factor) {
				count-=tl.factor;
				d(timer.next());
			}
			requestAnimationFrame(f);
		}
		requestAnimationFrame(f);
	}
	Timeline.prototype.every = function(d,f) {
		var lastTime = (new Date()).getTime();
		window.setInterval(
			function() {
				var diff = (new Date()).getTime() - lastTime;
				lastTime+=diff;
				f(diff/1000);
			},
			d*1000*this.factor
		);
	}
	Timeline.prototype.in = function(d,f) {
		window.setTimeout(
			function() {
				f();
			},
			d*1000*this.factor
		);
	}
	
	return Timeline;

});