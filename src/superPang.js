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
		stage.insert(new Q.Right_Edge());
		stage.insert(new Q.Up_Edge());
		stage.insert(new Q.Down_Edge());
		stage.insert(new Q.Player());
		stage.insert(new Q.Bolas1());
	});



//-------------LOAD_RESOURCES----------------
	Q.load(["backgrounds.png", "backgrounds.json", "player.png", "player.json", 
			"left_edge.png", "right_edge.png", "down_edge.png", "up_edge.png",
			"bolas1.png", "bolas1.json", "bolas2.png", "bolas2.json", "bolas3.png", "bolas3.json",
			"bolas4.png", "bolas4.json", "bolas5.png", "bolas5.json", "bolasEspeciales.png", "bolasEspeciales.json"],
			function() {
		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.compileSheets("player.png", "player.json");
		Q.compileSheets("bolas1.png", "bolas1.json");
		Q.compileSheets("bolas2.png", "bolas2.json");
		Q.compileSheets("bolas3.png", "bolas3.json");
		Q.compileSheets("bolas4.png", "bolas4.json");
		Q.compileSheets("bolas5.png", "bolas5.json");
		Q.compileSheets("bolasEspeciales.png", "bolasEspeciales.json");

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

	Q.animations("bolasEspeciales", {
		change: {frames: [0,1,2,3], rate: 3}
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

//-------------LEFT_EDGE_SPRITE----------------
	Q.Sprite.extend("Left_Edge",{
		init:function(p){
			this._super(p,{
				asset: "left_edge.png",
				x:12,
				y:288,
				gravity: 0,
				scale:3
			});
			this.add('2d');
		}
	});

//-------------RIGHT_EDGE_SPRITE----------------
	Q.Sprite.extend("Right_Edge",{
		init:function(p){
			this._super(p,{
				asset: "right_edge.png",
				x:750,
				y:288,
				gravity: 0,
				scale:3
			});
			this.add('2d');
		}
	});

//-------------DOWN_EDGE_SPRITE----------------
	Q.Sprite.extend("Down_Edge",{
		init:function(p){
			this._super(p,{
				asset: "down_edge.png",
				x:384,
				y:564,
				gravity: 0,
				scale:3
			});
			this.add('2d');
		}
	});


//-------------UP_EDGE_SPRITE----------------
	Q.Sprite.extend("Up_Edge",{
		init:function(p){
			this._super(p,{
				asset: "up_edge.png",
				x:384,
				y:12,
				gravity: 0,
				scale:3
			});
			this.add('2d');
		}
	});


//-------------BOLAS1_SPRITE----------------
	Q.Sprite.extend("Bolas1",{
		init:function(p){
			this._super(p,{
				sprite: "bolas1",
				sheet: "bolas1",
				frame:0,
				x: 200,
				y: 450,
				vx: 75,
				vy: -300,
				gravity: 0.25,
				scale:2
			});
			this.add('2d');
		},

		step: function(dt) {
			this.p.vy += dt * 9.8;
			this.p.x += this.p.vx * dt;
			this.p.y += this.p.vy * dt;
		}
	});

//-------------BOLAS2_SPRITE----------------
	Q.Sprite.extend("Bolas2",{
		init:function(p){
			this._super(p,{
				sprite: "bolas2",
				sheet: "bolas2",
				frame:0,
				gravity: 0,
				gravity: 0.25,
				scale:2
			});
			this.add('2d');
		}
	});

//-------------BOLAS3_SPRITE----------------
	Q.Sprite.extend("Bolas3",{
		init:function(p){
			this._super(p,{
				sprite: "bolas3",
				sheet: "bolas3",
				frame:0,
				gravity: 0.25,
				scale:2
			});
			this.add('2d');
		}
	});

//-------------BOLAS4_SPRITE----------------
	Q.Sprite.extend("Bolas4",{
		init:function(p){
			this._super(p,{
				sprite: "bolas4",
				sheet: "bolas4",
				frame:0,
				gravity: 0.25,
				scale:2
			});
			this.add('2d');
		}
	});

//-------------BOLAS5_SPRITE----------------
	Q.Sprite.extend("Bolas5",{
		init:function(p){
			this._super(p,{
				sprite: "bolas5",
				sheet: "bolas5",
				frame:0,
				gravity: 0.25,
				scale:2
			});
			this.add('2d');
		}
	});

//-------------BOLASESPECIALES_SPRITE----------------
	Q.Sprite.extend("BolasEspeciales",{
		init:function(p){
			this._super(p,{
				sprite: "bolasEspeciales",
				sheet: "bolasEspeciales",
				gravity: 0.25,
				scale:2
			});
			this.add('2d, animation');
		}, 

		step:function(){
			this.play("change", 1);
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
				y:520,
				playing: true,
				scale:2
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
