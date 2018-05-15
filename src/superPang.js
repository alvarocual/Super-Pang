var game = function() {
	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI, Audio")
			.setup({width:768,
					height:576,
					maximize:true})
					//audioSupported:["ogg", "mp3"]})
			.controls().touch();


//-------------BACKGROUND----------------
	Q.scene("back",function(stage) {
		stage.insert(new Q.Backgrounds());
	});


//-------------LEVEL----------------
	Q.scene("level",function(stage){
		stage.insert(new Q.Left_Edge());
		//stage.insert(new Q.Right_Edge());
		//stage.insert(new Q.Down_Edge());
		stage.insert(new Q.Player());
	});



//-------------LOAD_RESOURCES----------------
	Q.load(["backgrounds.png", "backgrounds.json", "left_edge.png", "left_edge.json",
			"right_edge.png", "right_edge.json","player.png", "player.json",
			"down_edge.png", "down_edge.json", "up_edge.png", "up_edge.json"],
			function() {
		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.compileSheets("left_edge.png", "left_edge.json");
		Q.compileSheets("right_edge.png", "right_edge.json");
		Q.compileSheets("down_edge.png", "down_edge.json");
		Q.compileSheets("up_edge.png", "up_edge.json");
		Q.compileSheets("player.png", "player.json");

		Q.stageScene("back", 0);
		Q.stageScene("level", 1);
	});


//-------------ANIMATIONS-------------
	Q.animations("player", {
		move_right: 	{ frames: [3,0,1,2],  rate: 1/9 }, 
		move_left: 		{ frames: [3,0,1,2],  rate: 1/9, flip:"x" },
		stand: 			{ frames: [4],		  rate: 1/9 },
		died: 			{ frames: [6],		  rate: 1,	 loop: false, trigger:"dying" },
		victory:  		{ frames: [7],		  rate: 1,	 loop: false },
		shoot:  		{ frames: [5],		  rate: 1/9, loop: false }
	});

//-------------BACKGROUND_SPRITE----------------
	Q.Sprite.extend("Backgrounds",{
		init:function(p){
			this._super(p,{
				sprite: "background",
				sheet: "background",
				frame:0,
				x:384,
				y:288,
				//scale:3
			});
		}
	});

//-------------LEFT_EDGE_SPRITE----------------
	Q.Sprite.extend("Left_Edge",{
		init:function(p){
			this._super(p,{
				sprite: "left_edge",
				sheet: "left_edge",
				x:0,
				y:0,
				gravity: 0,
				//scale:3
			});
			this.add('2d');
		}
	});

//-------------RIGHT_EDGE_SPRITE----------------
	Q.Sprite.extend("Right_Edge",{
		init:function(p){
			this._super(p,{
				sprite: "right_edge",
				sheet: "right_edge",
				x:100,
				y:288,
				gravity: 0,
				//scale:3
			});
			this.add('2d');
		}
	});

//-------------DOWN_EDGE_SPRITE----------------
	Q.Sprite.extend("Down_Edge",{
		init:function(p){
			this._super(p,{
				sprite: "down_edge",
				sheet: "down_edge",
				x:384,
				y:500,
				gravity: 0,
				//scale:3
			});
			this.add('2d');
		}
	});


//-------------EDGE_SPRITE----------------
	Q.Sprite.extend("Up_Edge",{
		init:function(p){
			this._super(p,{
				sprite: "up_edge",
				sheet: "up_edge",
				x:384,
				y:288,
				gravity: 0,
				//scale:3
			});
			this.add('2d');
		}
	});

//-------------PLAYER_SPRITE----------------
	Q.Sprite.extend("Player",{
		init:function(p){
			this._super(p,{
				sprite:"player",
				sheet:"player",
				frame:4,
				x:400,
				y:400,//503
				playing: true,
				//scale:3
			});
			this.add('2d, platformerControls, animation');
		},

		step:function(){
			if(this.playing){
				if(this.p.vx > 0)
					this.play("move_right", 1);
				else if(this.p.vx < 0)
					this.play("move_left", 1);
				else
					this.play("stand", 1);
			}
		}
	});

//-------------BALL1_SPRITE----------------
	/*Q.Sprite.extend("Ball1",{
		init:function(p){
			this._super(p,{
				sprite:"bolas1",
				sheet:"bolas1",
				frame:0,

			});
		}
	});*/
}
