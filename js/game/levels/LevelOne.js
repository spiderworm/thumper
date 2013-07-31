define(
	[
		'Box2D',
		'./Level',
		'../objects/Wall',
		'../objects/GroundBlock',
		'../objects/LeftRampBlock',
		'../objects/Crate',
		'../objects/Ladder',
		'../objects/RightRampBlock',
		'../objects/RandomBlock',
		'../joints/ClimbingJoint'
	],
	function(
		Box2D,
		Level,
		Wall,
		GroundBlock,
		LeftRampBlock,
		Crate,
		Ladder,
		RightRampBlock,
		RandomBlock,
		ClimbingJoint
	) {

		var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
		var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
		var b2Vec2 = Box2D.Common.Math.b2Vec2;

		function LevelOne(world,canvas,player) {

			this._init(world);
		
			player.userControlled = true;
			this._player = player;
			
			this._createLevelShape();
			this._createLeftRoom();
			this._createShelves();

			
			var floor = this.getObject('floor');		
			floor.stackOnLeft(player,1);
			this._addObject('player',player);

			
			new ClimbingJoint(player,world);

			var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
			
			//setup debug draw
			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(canvas.getContext("2d"));
			debugDraw.SetDrawScale(30);
			debugDraw.SetFillAlpha(.1);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
			
		}
		LevelOne.prototype = new Level();
		LevelOne.prototype._createLeftRoom = function() {
			
			var rightWall = new Wall(.1,.5);
			rightWall.setPosition(2.5,7.5);
			this._addObject('room right wall',rightWall);
			
			var ceiling = new Wall(2.5,.1);
			rightWall.stackOnRight(ceiling);
			this._addObject('room ceiling',ceiling);
			
			var crate1 = new Crate(1);
			ceiling.stackOnLeft(crate1,.2);
			this._addObject('crate 1',crate1);

			var crate2 = new Crate(1);
			crate1.stackOn(crate2,.1);
			this._addObject('crate 2',crate2);

			var crate3 = new Crate(1);
			crate2.stackOn(crate3,-.15);
			this._addObject('crate 3',crate3);
			
			var crate4 = new Crate(1);
			ceiling.stackOnRight(crate4,-.1);
			this._addObject('crate 4',crate4);

			var crate5 = new Crate(.75);
			crate4.stackOnLeft(crate5,-.1);
			this._addObject('crate 5',crate5);

			var crate6 = new Crate(1);
			crate5.stackOnLeft(crate6);
			this._addObject('crate 6',crate6);

		}
		LevelOne.prototype._createLevelShape = function() {

			var floor = new GroundBlock(400,2);
			floor.setPosition(200,10);
			this._addObject('floor',floor);
			
			var ladder = new Ladder(10);
			floor.stackOnLeft(ladder,3);
			this._addObject('ladder 1',ladder);
			
			/* main bounds */
			var leftWall = new Wall(2,500);
			floor.stackOnLeft(leftWall,-1.9);
			this._addObject('left wall',leftWall);

			var ramp = new LeftRampBlock(8,4);
			floor.stackOnLeft(ramp,11)
			this._addObject('left ramp',ramp);

		}
		LevelOne.prototype._createShelves = function() {
		
			var x,y;
			for(var y_id=0; y_id<4; y_id++) {
				for(var x_id=0; x_id<5; x_id++) {
				
					x = 25 + x_id*6;
					y = -2 + y_id*3;
				
					var shelf = new GroundBlock(4.7,.1);
					shelf.setPosition(x,y)
				
					this._addObject(
						'shelf ' + x_id + ',' + y_id,
						shelf
					);
					
					var crate = new Crate(.5);
					shelf.stackOn(crate);
					this._addObject(
						'crate ' + x + ',' + y + ' 1',
						crate
					)

				}
			}

		}


		return LevelOne;
		
	}
);
