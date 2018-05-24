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
	});



//-------------LOAD_RESOURCES----------------
	Q.load(["backgrounds.png", "backgrounds.json", "left_edge.png",
			"right_edge.png", "player.png", "player.json",
			"down_edge.png", "up_edge.png", "arpon.png"],
			function() {
		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.compileSheets("player.png", "player.json");

		Q.stageScene("back", 0);
		Q.stageScene("level", 1);
	});


//-------------ANIMATIONS-------------
	Q.animations("player", {
		move_left: 		{ frames: [3,0,1,2],  rate: 1/8, flip:"left" }, 
		move_right: 	{ frames: [3,0,1,2],  rate: 1/8, flip:"right" },
		stand: 			{ frames: [4],		  rate: 1/8 },
		died: 			{ frames: [6],		  rate: 1,	 loop: false, trigger:"dying" },
		victory:  		{ frames: [7],		  rate: 1,	 loop: false },
		shoot:  		{ frames: [5],		  rate: 1/8, loop: false, trigger:"shooted" ,next: "stand"}
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
				x:755,
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
				type: Q.SPRITE_ENEMY,
				gravity: 0,
				scale:3
			});
			this.add('2d');
		}
	});

//-------------HARPOON_SPRITE----------------
	Q.MovingSprite.extend("Harpoon",{
		init:function(p){
			this._super(p,{
				asset:"arpon.png",
				scale:2,
				collisionMask: Q.SPRITE_ENEMY,
				y:582,
				gravity: 0,
				vy: -200
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
				scale:2,
				jumpSpeed:0
			});
			this.add('2d, platformerControls, animation');
			
			/*The user push the fire button*/
			Q.input.on("fire", this,"fire");

			/* Wait until the firing animation has played until
			 actually launching the harpoon*/
			this.on("shooted",this,"launchHarpoon");
		},

		step:function(dt){
			if(this.p.playing){
				if(this.p.vx > 0){
					this.p.vx = 400;
					this.play("move_right", 1);
				}
				else if(this.p.vx < 0){
					this.p.vx = -400;
					this.play("move_left", 1);
				}
				else
					this.play("stand", 1);
			}
		},

		fire:function(){
			this.play("shoot", 3);
		},

		launchHarpoon: function(){
			var harpoon = new Q.Harpoon({x:this.p.x});
			this.stage.insert(harpoon);
		}

	});
}