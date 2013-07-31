define(
	function() {
	
		function Level() {}
		Level.prototype._init = function(world) {
			this._objects = {};
			this._world = world;
		}
		Level.prototype.clear = function() {
			for(var i in this._objects) {
				var o = this._objects[i];
				this._world.DestroyBody(o.physics.body);
			}
		}
		Level.prototype.getObject = function(name) {
			return this._objects[name.toString()];
		}
		Level.prototype._addObject = function(name,obj) {
			if(this._objects[name.toString()])
				throw new Error('object with same name already exists');
			var body = this._world.CreateBody(obj.physics.bodyDefinition);
			obj.physics.body = body;
			
			obj.physics.fixtures = {};
			var fixture;
			for(var i in obj.physics.fixtureDefinitions) {
				fixture = body.CreateFixture(obj.physics.fixtureDefinitions[i]);
				obj.physics.fixtures[i] = fixture;
			}
			
			this._objects[name] = obj;
		}
		Level.prototype._bodies = null;
		Level.prototype._world = null;

		return Level;
	}
);