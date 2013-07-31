define(
	['Box2D','./GameObject'],
	function(Box2D,GameObject) {
			
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

		function LeftRampBlock(width,height) {
			this._init(width,height);

			var verts = [
				new b2Vec2(-width/2,height/2),
				new b2Vec2(width/2,-height/2),
				new b2Vec2(width/2,height/2)
			];

			this.physics.fixtureDefinitions.main.shape.SetAsArray(verts);
			this.physics.bodyDefinition.type = b2Body.b2_staticBody;
		}
		LeftRampBlock.prototype = new GameObject();

		return LeftRampBlock;
	}
);