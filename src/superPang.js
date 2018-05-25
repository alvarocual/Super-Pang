var game = function() {
	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI, Audio")
			.setup({width:768,
					height:576,
					maximize:true})
					//audioSupported:["ogg", "mp3"]})
			.controls().touch();
			//Q.debug = true;


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
		stage.on('poststep', this, gameLoop);
	});

	// TODO: AL cargar todos los backgrounds se termina el juego
	gameLoop = function(dt) {
		
		Q.state.set('current', Q.state.p.current - dt);

		if (Q.state.p.current < 0) {

			Q.state.set('current', Q.state.p.refresh);
			var xRandom = 0;

			if (Q.state.p.nBackground === 40) {
				// Creamos bola especial de victoria
				// El numero aleatorio tiene que ser diferente por el tamaño de la bola
				xRandom = Math.floor((Math.random() * 600) + 100);
				Q.stage().insert(new Q.BolaEspecial({x:xRandom}));
			}
			else {
				xRandom = Math.floor((Math.random() * 600) + 100);
				Q.stage().insert(new Q.Bolas1({x:xRandom}));
			}


			if (Q.state.p.changeBackground === 3) {
				Q.stage(0).insert(new Q.Backgrounds({frame:Q.state.p.nBackground}));
				Q.state.set('changeBackground', -1);
				Q.state.set('nBackground', Q.state.p.nBackground + 1);
				
			}

			Q.state.set('changeBackground', Q.state.p.changeBackground + 1);
		}
	};


//-------------LOAD_RESOURCES----------------
	Q.load(["backgrounds.png", "backgrounds.json", "player.png", "player.json", "arpon.png", "arpon.json",
			"left_edge.png", "right_edge.png", "down_edge.png", "up_edge.png",
			"bolas1.png", "bolas1.json", "bolas2.png", "bolas2.json", "bolas3.png", "bolas3.json",
			"bolas4.png", "bolas4.json", "bolas5.png", "bolas5.json", "bolaEspecial.png", "bolaEspecial.json"],

			function() {
		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.compileSheets("player.png", "player.json");
		Q.compileSheets("arpon.png", "arpon.json");
		Q.compileSheets("bolas1.png", "bolas1.json");
		Q.compileSheets("bolas2.png", "bolas2.json");
		Q.compileSheets("bolas3.png", "bolas3.json");
		Q.compileSheets("bolas4.png", "bolas4.json");
		Q.compileSheets("bolas5.png", "bolas5.json");
		Q.compileSheets("bolaEspecial.png", "bolaEspecial.json");

		Q.state.reset({refresh:5, current:5, changeBackground:0, nBackground:1, ammo:2});

		Q.stageScene("back", 0);
		Q.stageScene("level", 1);
	});


//-------------ANIMATIONS-------------
	Q.animations("player", {
		move_right: 	{ frames: [3,0,1,2],  rate: 1/8, flip:"right" }, 
		move_left: 		{ frames: [3,0,1,2],  rate: 1/8, flip:"left" },
		stand: 			{ frames: [4],		  rate: 1/8 },
		died: 			{ frames: [6],		  rate: 1,	 loop: false, trigger:"dying" },
		victory:  		{ frames: [7],		  rate: 1,	 loop: false },
		shoot:  		{ frames: [5],		  rate: 1/8, loop: false, trigger:"shooted", next: "stand" }
	});

	Q.animations("bolaEspecial", {
		change: {frames: [0,1], rate: 3}
	});
	
	Q.animations("arpon", {
		change: {frames: [0,1], rate: 1/8}
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
		}
	});


//-------------UP_EDGE_SPRITE----------------
	Q.Sprite.extend("Up_Edge",{
		init:function(p){
			this._super(p,{
				asset: "up_edge.png",
				x:384,
				y:12,
				collisionMask: Q.SPRITE_PARTICLE | Q.SPRITE_FRIENDLY,
				type: Q.SPRITE_ENEMY,
				gravity: 0,
				scale:3
			});
		}
	});

//-------------BOLAS1_SPRITE----------------
	Q.Sprite.extend("Bolas1",{
		init:function(p){
			this._super(p,{
				sprite: "bolas1",
				sheet: "bolas1",
				frame:0,
				y:78,
				vx: 175,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				gravity: 0.5,
				scale:2
			});
			this.add('2d, aiBounce');
			this.on("hit",this,"collision");
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -700;
				}

				if (collision.obj.isA("Up_Edge")) {
					this.p.vy = 350;
				}
			});						
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();
			}
		}
	});

//-------------BOLAS2_SPRITE----------------
	Q.Sprite.extend("Bolas2",{
		init:function(p){
			this._super(p,{
				sprite: "bolas2",
				sheet: "bolas2",
				frame:0,
				x:200,
				y:200,
				vx: 175,
				gravity: 0.5,
				scale:2
			});
			this.add('2d, aiBounce');
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -625;
				}
			})						
		}
	});

//-------------BOLAS3_SPRITE----------------
	Q.Sprite.extend("Bolas3",{
		init:function(p){
			this._super(p,{
				sprite: "bolas3",
				sheet: "bolas3",
				frame:0,
				x: 200,
				y: 200,
				vx: 175,
				gravity: 0.5,
				scale:2
			});
			this.add('2d, aiBounce');
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left ", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -550;
				}
			})						
		}
	});

//-------------BOLAS4_SPRITE----------------
	Q.Sprite.extend("Bolas4",{
		init:function(p){
			this._super(p,{
				sprite: "bolas4",
				sheet: "bolas4",
				frame:0,
				x:200,
				y:200,
				vx: 175,
				gravity: 0.5,
				scale:2
			});
			this.add('2d, aiBounce');
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -450;
				}
			})						
		}
	});

//-------------BOLAS5_SPRITE----------------
	Q.Sprite.extend("Bolas5",{
		init:function(p){
			this._super(p,{
				sprite: "bolas5",
				sheet: "bolas5",
				frame:0,
				x:200,
				y:200,
				vx: 175,
				gravity: 0.5,
				scale:2
			});
			this.add('2d, aiBounce');
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -350;
				}
			})						
		}
	});

//-------------BOLAESPECIAL_SPRITE----------------
	Q.Sprite.extend("BolaEspecial",{
		init:function(p){
			this._super(p,{
				sprite: "bolaEspecial",
				sheet: "bolaEspecial",
				vx: 175,
				x:200,
				y:200,
				gravity: 0.5,
				scale:2
			});
			this.add('2d, animation, aiBounce');
		}, 

		step:function() {
			this.play("change", 1);

			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -550;
				}
			})
		}
	});		

//-------------HARPOON_SPRITE----------------
	Q.MovingSprite.extend("Harpoon",{
		init:function(p) {
			this._super(p,{
				sprite: "arpon",
				sheet: "arpon",
				frame: 0,
				scale:2,
				y:854,
				type: Q.SPRITE_FRIENDLY,
				collisionMask: Q.SPRITE_ENEMY,
				vy: -250
			});
			this.add('animation');
			this.on("hit",this,"collision");
		},

		collision: function(col) {
			if(col.obj.isA("Up_Edge")){
				this.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
			}
		},

		step: function(dt) {
			this.p.y += this.p.vy * dt;
			this.stage.collide(this);
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
				gravity:0,
				playing: true,
				type: Q.SPRITE_FRIENDLY,
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
			if(Q.state.p.ammo > 0){
				this.play("shoot", 3);
				Q.state.set('ammo', Q.state.p.ammo-1);
			}
		},

		launchHarpoon: function(){
			var harpoon = new Q.Harpoon({x:this.p.x});
			this.stage.insert(harpoon);
		}

	});
}
