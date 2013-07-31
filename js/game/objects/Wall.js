define(
	['Box2D','./GameObject','./GroundBlock'],
	function(Box2D,GameObject,GroundBlock) {
	
	
		function Wall(width,height) {
			var result = new GroundBlock(width,height);
			return result;
		}

		return Wall;
	}
);