define(
	['./GameObject','Box2D','Timeline','THREEx.KeyboardState'],
	function(GameObject,Box2D,Timeline,KeyboardState) {
		
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2Fixture = Box2D.Dynamics.b2Fixture;
		var b2World = Box2D.Dynamics.b2World;
		var b2MassData = Box2D.Collision.Shapes.b2MassData;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
		var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
		var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
		var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

		var keyboardState = new KeyboardState();
		var timeline = new Timeline();
		
		function Player() {
			this._init(.5,1);
			this._setUpPhysics();

			this._setUpUserControl();
			this._jumpReady = true;
			window.player = this;
		}
		
		Player.prototype = new GameObject();
		
		Player.prototype.userControlled = false;
		
		Player.prototype.isMoveReady = function() {
			return this.isUpright() && this.isOnGround();
		}
		
		Player.prototype.isUpright = function() {
			return true;
		}
		
		Player.prototype.isOnGround = function() {
			if(this.physics.fixtures && this.physics.fixtures.groundSensor) {
				var cl = this.physics.body.GetContactList();
				while(cl) {
					if(cl.contact.IsTouching()) {
						var fixA = cl.contact.GetFixtureA();
						var fixB = cl.contact.GetFixtureB();
						
						if(fixA === this.physics.fixtures.groundSensor && !fixB.IsSensor())
							return true;
						if(fixB === this.physics.fixtures.groundSensor && !fixA.IsSensor())
							return true;
					}
					cl = cl.next;
				}
			}
			return false;
		}
	
		Player.prototype.applyBrakes = function() {
			this.physics.body.GetFixtureList().SetFriction(5);
		}
		
		Player.prototype.disableBrakes = function() {
			this.physics.body.GetFixtureList().SetFriction(.5);
		}
		
		Player.prototype.moveLeft = function() {
			if(!this.isMoveReady())
				return false;
			this.disableBrakes();
			var factor = -15 - this.physics.body.GetLinearVelocity().x;
			if(factor > 1) factor = 1;
			var force = new b2Vec2(factor,0);
			var pos = this.physics.body.GetPosition();
			pos.y += .25
			this.physics.body.ApplyForce(force,pos);
		}

		Player.prototype.moveRight = function() {
			if(!this.isMoveReady())
				return false;
			this.disableBrakes();
			var factor = 15 - this.physics.body.GetLinearVelocity().x;
			if(factor < -1) factor = -1;
			var force = new b2Vec2(factor,0);
			var pos = this.physics.body.GetPosition();
			pos.y += .25
			this.physics.body.ApplyForce(force,pos);
		}

		Player.prototype.moveUp = function() {
			if(this._actions.climbing) {
				var cl = this.physics.body.GetContactList();
				while(cl) {
					if(cl.contact.IsTouching()) {
						var data = cl.other.GetUserData();
						if(data && data.isClimbable) {
							this._actions.climbing.startClimbing(cl.other);
							this._actions.climbing.climb(10,-.2);
							break;
						}
					}
					cl = cl.next;
				}
			}
			
			if(!this.isMoveReady())
				return false;
		}

		Player.prototype.jump = function() {
			if(!this._jumpReady || !this.isMoveReady())
				return false;
				
			this._jumpReady = false;
			var player = this;
			timeline.in(.25,function() { player._jumpReady = true; });
			
			var force = new b2Vec2(0,-320);
			this.physics.body.ApplyForce(
				force,
				this.physics.body.GetPosition()
			);
		}
		
		Player.prototype.balance = function() {
			if(this.physics.fixtures && this.physics.fixtures.main) {
				var angle = this.physics.body.GetAngle();
				
				var factor = angle;
				
				factor = factor < -.25 ? -.25 : factor;
				factor = factor > .25 ? .25 : factor;

				var verts = [
					new b2Vec2(-.25 - factor, -.5 - factor/4),
					new b2Vec2(.25 - factor, -.5 + factor/4),
					new b2Vec2(.25, .3 + factor/4),
					new b2Vec2(.1, .5 + factor/4),
					new b2Vec2(-.1, .5 - factor/4),
					new b2Vec2(-.25, .3 - factor/4)
				];

				//this.physics.fixtures.main.GetShape().SetAsArray(verts);
				this.physics.body.SetAngularVelocity(-angle*1);
			}
		}
		
		Player.prototype._setUpPhysics = function() {
			var mainFixDef = new b2FixtureDef();
			mainFixDef.density = 2.0;
			mainFixDef.friction = 0.7;
			mainFixDef.restitution = 0.2;
			mainFixDef.shape = new b2PolygonShape();
			//mainFixDef.shape.SetAsBox(.25,.5);
			
			var verts = [
				new b2Vec2(-.25, -.5),
				new b2Vec2(.25, -.5),
				new b2Vec2(.25, .3),
				new b2Vec2(.1, .5),
				new b2Vec2(-.1, .5),
				new b2Vec2(-.25, .3)
			];
			
			mainFixDef.shape.SetAsArray(verts);
				
			var groundSensorFixDef = new b2FixtureDef();
			groundSensorFixDef.isSensor = true;
			
			groundSensorFixDef.shape = new b2PolygonShape();
			var verts = [
				new b2Vec2(-.15, .5),
				new b2Vec2(.15, .5),
				new b2Vec2(.15, .6),
				new b2Vec2(-.15,.6)
			];
			groundSensorFixDef.shape.SetAsArray(verts);
			
			
			var bodyDef = new b2BodyDef;
			bodyDef.type = b2Body.b2_dynamicBody;
			bodyDef.position.x = 100000;
			bodyDef.position.y = 100000;
			
			this.physics.bodyDefinition = bodyDef,
			this.physics.fixtureDefinitions.main = mainFixDef;
			this.physics.fixtureDefinitions.groundSensor = groundSensorFixDef;
		}
		
		Player.prototype._setUpUserControl = function() {
			var timeline = new Timeline();
			var player = this;
			timeline.everyFrame(function() {
				player._checkInput();
			});
		}
		
		Player.prototype._checkInput = function() {

			var running = false;
			if(this.userControlled) {
				if(this._actions.climbing && this._actions.climbing.isClimbing()) {
					if(keyboardState.pressed("w")) {
						this._actions.climbing.climb(10,-.2);
					}
					if(keyboardState.pressed("s")) {
						this._actions.climbing.climb(10,.2);
					}
					if(keyboardState.pressed("a")) {
						this._actions.climbing.climbOff(-100,-60);
					}
					if(keyboardState.pressed("d")) {
						this._actions.climbing.climbOff(100,-60);
					}
				} else {
					if(keyboardState.pressed("w")) {
						this.moveUp();
					}
					if(keyboardState.pressed("d")) {
						running = true;
						this.moveRight();
					}
					if(keyboardState.pressed("a")) {
						running = true;
						this.moveLeft();
					}
					if(keyboardState.pressed("space")) {
						this.jump();
					}
					if(!running) {
						this.applyBrakes();
					}
				}
				this.balance();
			}

		}
		
		return Player;
		
	}
);