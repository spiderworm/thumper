define(
	['Box2D','./GameObject'],
	function(Box2D,GameObject) {
	
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

		function RandomBlock() {
			this._init();

			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;

			var bodyDef = new b2BodyDef;
			bodyDef.type = b2Body.b2_dynamicBody;
			
			if(Math.random() > 0.5) {
				fixDef.shape = new b2PolygonShape;
				fixDef.shape.SetAsBox(
				Math.random() + 0.1 //half width
				,  Math.random() + 0.1 //half height
				);
			} else {
				fixDef.shape = new b2CircleShape(
					Math.random() + 0.1 //radius
				);
			}
			bodyDef.position.x = Math.random() * 10;
			bodyDef.position.y = Math.random() * 10;

			this.physics = {
				bodyDefinition: bodyDef,
				fixtureDefinitions: {
					main: fixDef
				},
				width: 1,
				height: 1
			};
		}
		RandomBlock.prototype = new GameObject();
		
		return RandomBlock;
		
	}
);