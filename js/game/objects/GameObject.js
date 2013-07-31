define(
	['Box2D'],
	function(Box2D) {
		
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

		function GameObject() {}
		GameObject.prototype.setPosition = function(x,y) {
			var newPos = new b2Vec2(x,y);
			if(this.physics) {
				if(this.physics.body) {
					this.physics.body.SetPosition(newPos);
				} else if(this.physics.bodyDefinition) {
					this.physics.bodyDefinition.position = newPos;
				}
			}
		}
		GameObject.prototype.stackOn = function(obj,x) {
			x = x || 0;
		
			var mySize, myPos;
			if(this.physics) {
				mySize = new b2Vec2(
					this.physics.width,
					this.physics.height
				);
				if(this.physics.body) {
					myPos = this.physics.body.GetPosition();
				} else if(this.physics.bodyDefinition) {
					myPos = new b2Vec2(
						this.physics.bodyDefinition.x,
						this.physics.bodyDefinition.y
					);
				}
			}

			var objSize;
			if(obj.physics) {
				objSize = new b2Vec2(
					obj.physics.width,
					obj.physics.height
				);
			}
			
			if(mySize && myPos && objSize) {
				obj.setPosition(
					myPos.x+x,
					myPos.y-((mySize.y/2)+(objSize.y/2))
				);
			} else {
				throw new Error("couldn't stack because couldn't determine coordinates or dimensions of one of the objects");
			}
			
			
		}
		GameObject.prototype.stackOnLeft = function(obj,x) {
			x = x || 0;
			var mySize, myPos;
			if(this.physics) {
				mySize = new b2Vec2(
					this.physics.width,
					this.physics.height
				);
			}

			var objSize;
			if(obj.physics) {
				objSize = new b2Vec2(
					obj.physics.width,
					obj.physics.height
				);
			}
			
			if(mySize && objSize) {
				this.stackOn(obj,x-(mySize.x/2)+(objSize.x/2));
			} else {
				throw new Error("couldn't stack because couldn't determine coordinates or dimensions of one of the objects");
			}
		}
		GameObject.prototype.stackOnRight = function(obj,x) {
			x = x || 0;
			var mySize, myPos;
			if(this.physics) {
				mySize = new b2Vec2(
					this.physics.width,
					this.physics.height
				);
			}

			var objSize;
			if(obj.physics) {
				objSize = new b2Vec2(
					obj.physics.width,
					obj.physics.height
				);
			}
			
			if(mySize && objSize) {
				this.stackOn(obj,x+(mySize.x/2)-(objSize.x/2));
			} else {
				throw new Error("couldn't stack because couldn't determine coordinates or dimensions of one of the objects");
			}
		}
		GameObject.prototype.setClimbingAction = function(obj) {
			this._climbingAction = obj;
		}
		GameObject.prototype.addAction = function(name,action) {
			if(this._actions[name])
				throw new Error("Object already has an action named '" + name + "'");
			this._actions[name] = action;
		}
		GameObject.prototype._init = function(width,height) {
			width = width || 1;
			height = height || 1;
			
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;

			var bodyDef = new b2BodyDef;
			bodyDef.userData = {};
			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(width/2,height/2);

			this._actions = {};
			
			this.physics = {
				bodyDefinition: bodyDef,
				fixtureDefinitions: {
					main: fixDef
				},
				jointDefinitions: {},
				width: width,
				height: height
			};
		}
		
		return GameObject;
	}
);