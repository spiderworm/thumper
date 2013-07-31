define(
	['Box2D','./GameObject'],
	function(Box2D,GameObject) {
	
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

		function GroundBlock(width,height) {
			this._init(width,height);
			this.physics.bodyDefinition.type = b2Body.b2_staticBody;
		}
		GroundBlock.prototype = new GameObject();

		return GroundBlock;
	}
);