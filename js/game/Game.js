define(
	['Box2D','Timeline','./objects/Player','./levels/LevelOne'],
	function(Box2D,Timeline,Player,LevelOne) {

	
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		var b2World = Box2D.Dynamics.b2World;

		var timeline = new Timeline();
		



		function Game(width,height) {

			this._element = document.createElement('canvas');
			this._element.width = width;
			this._element.height = height;

			var world = this._world = new b2World(
				new b2Vec2(0, 10)    //gravity
				,  true                 //allow sleep
			);
			
			this._player = new Player();

			window.world = world;
			
			function update() {
				world.Step(
					1 / 60   //frame-rate
					,  10       //velocity iterations
					,  10       //position iterations
				);
				world.DrawDebugData();
				world.ClearForces();
			};

			timeline.everyFrame(update);

			this._levels = {
				1: {
					Cnstrctr: LevelOne
				}
			};
			
			this._setLevel(1);
			
		}
		Game.prototype.getElement = function() {
			return this._element;
		}
		Game.prototype._setLevel = function(levelId) {
			if(this._currentLevel)
				this._currentLevel.clear();
		
			var Level = this._levels[levelId].Cnstrctr;

			this._currentLevel = new Level(this._world,this._element,this._player);
		}
		
		

		
		
		
	
		
	
		
		return Game;

	}
);
