define(
	['Box2D'],
	function(Box2D) {
	
		var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		
		function ClimbingJoint(obj,world) {
			this._obj = obj;
			this._climber = obj;
			this._currentClimbingBody = null;
			this._world = world;

			obj.addAction('climbing',this);
		}
		
		ClimbingJoint.prototype.isClimbing = function() {
			return this._currentClimbingBody !== null;
		}
		
		ClimbingJoint.prototype.startClimbing = function(physicsBody) {
			if(this.isClimbing())
				this.stopClimbing();
		
			this._currentClimbingBody = physicsBody;
		
			var pos = this._climber.physics.body.GetPosition();
			var halfHeight = this._climber.physics.height/2;
						
			var handDef = new b2MouseJointDef();
			handDef.bodyA = this._world.GetGroundBody();
			handDef.bodyB = this._climber.physics.body;
			handDef.collideConnected = true;
			handDef.maxForce = 0;
			handDef.target.Set(pos.x,pos.y-halfHeight);
			
			var footDef = new b2MouseJointDef();
			footDef.bodyA = this._world.GetGroundBody();
			footDef.bodyB = this._climber.physics.body;
			footDef.collideConnected = true;
			footDef.maxForce = 0;
			footDef.target.Set(pos.x,pos.y+halfHeight);

			this._handJoint = this._world.CreateJoint(handDef);
			this._footJoint = this._world.CreateJoint(footDef);
		}
		
		ClimbingJoint.prototype.stopClimbing = function() {
			if(this.isClimbing()) {
				this._currentClimbingBody = null;
				this._world.DestroyJoint(this._handJoint);
				this._world.DestroyJoint(this._footJoint);
				this._handJoint = null;
				this._footJoint = null;
			}
		}
		
		ClimbingJoint.prototype.climb = function(force,reach) {
			if(this.isClimbing()) {
				var pos = this._currentClimbingBody.GetPosition();
				var x = pos.x;
				pos = this._climber.physics.body.GetPosition();
				var y = pos.y+reach;
				var halfHeight = this._climber.physics.height/2;
				this._handJoint.SetMaxForce(force);
				this._footJoint.SetMaxForce(force);
				this._handJoint.SetTarget(new b2Vec2(x,y-halfHeight));
				this._footJoint.SetTarget(new b2Vec2(x,y+halfHeight));
			}
		}

		ClimbingJoint.prototype.climbOff = function(xForce,yForce) {
			if(this.isClimbing()) {
				this.stopClimbing();

				this._climber.physics.body.ApplyForce(
					new b2Vec2(xForce,yForce),
					this._climber.physics.body.GetPosition()
				);
			}
		}

		return ClimbingJoint;
	
	}
);