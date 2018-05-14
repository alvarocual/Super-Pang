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
		stage.insert(new Q.Edge());
		stage.insert(new Q.Player());
	});



//-------------LOAD_RESOURCES----------------
	Q.load(["backgrounds.png", "backgrounds.json", "edge.png", "edge.json",
			"player.png", "player.json"], function() {
		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.compileSheets("edge.png", "edge.json");
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
				scale:3
			});
		}
	});

//-------------EDGE_SPRITE----------------
	Q.Sprite.extend("Edge",{
		init:function(p){
			this._super(p,{
				sprite: "edge",
				sheet: "edge",
				x:384,
				y:400,
				gravity:0,
				scale:3
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
				y:400,
				playing: true,
				scale:3
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
}
