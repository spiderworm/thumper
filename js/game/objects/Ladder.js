define(
	['Box2D','./GameObject'],
	function(Box2D,GameObject) {
	
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

		function Ladder(height) {
			this._init(.25,height);
			this.physics.bodyDefinition.type = b2Body.b2_staticBody;
			this.physics.bodyDefinition.userData.isClimbable = true;
			this.physics.fixtureDefinitions.main.isSensor = true;
		}
		Ladder.prototype = new GameObject();

		return Ladder;
	}
);