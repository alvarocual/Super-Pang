var game = function() {
	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI, Audio")
			.setup({width:768,
					height:576,
					maximize:true,
					audioSupported:["mp3"]})
			.controls().touch().enableSound();
			Q.debug = true;

//---------------TÍTULO-----------------
	Q.Sprite.extend("Titulo", {
        init: function(p) {
            this._super(p, {
                asset: "tittle.png",
                scale: 1.35
            });
        }
    });

//---------------CREDITOS-----------------
	Q.Sprite.extend("Creditos", {
        init: function(p) {
            this._super(p, {
                asset: "credits.png",
                scale: 1.35
            });
        }
    });

//-------------MAIN_TITLE---------------
	Q.scene("mainTitle", function(stage){
		stage.insert(new Q.Titulo({x:384, y:288}));
		Q.audio.play("inicio.mp3", {loop:true});

		var boxPlay = stage.insert(new Q.UI.Container({x: 384, y: 418}));
		var boxCredits = stage.insert(new Q.UI.Container({x: 384, y: 460}));
        
        var buttonPlay = boxPlay.insert(new Q.UI.Button({ x: 0, y: 0, w: 256, h: 30}));
        var buttonCredits = boxCredits.insert(new Q.UI.Button({ x: 0, y: 0, w: 256, h: 30}));

        buttonPlay.on("click", function() {
        	Q.audio.stop("inicio.mp3");
            Q.stageScene("back", 0);
			Q.stageScene("level", 1);
        });

        buttonCredits.on("click", function() {
        	Q.stageScene("credits", 0);
        });
	});

//-------------CREDITS----------------
	Q.scene("credits",function(stage) {
		stage.insert(new Q.Creditos({x:384, y:288}));

		var boxReturn = stage.insert(new Q.UI.Container({x: 641, y: 502}));
		
		var buttonReturn = boxReturn.insert(new Q.UI.Button({ x: 0, y: 0, w: 175, h: 60}));

		buttonReturn.on("click", function() {
			Q.audio.stop("victoria.mp3");
			Q.stageScene("mainTitle", 0);
        });
	});


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
		Q.audio.play("bandaSonora.mp3", {loop:true});
		Q.state.reset({refresh:11, current:1, nBackground:0, ammo:4, endGame:0});
		stage.on('poststep', this, gameLoop);
	});

	gameLoop = function(dt) {
		
		Q.state.set('current', Q.state.p.current - dt);

		if (Q.state.p.current < 0) {

			Q.state.set('current', Q.state.p.refresh);
			var xRandom = 0;

			if (Q.state.p.nBackground === 1) {
				xRandom = Math.floor((Math.random() * 600) + 100);
				Q.stage().insert(new Q.BolaEspecial({x:xRandom}));
			}
			else if(Q.state.p.nBackground < 40){
				xRandom = Math.floor((Math.random() * 600) + 100);
				Q.stage().insert(new Q.Bolas2({x:xRandom, vy:0}));

				if (((Q.state.p.nBackground % 2) === 0) && (Q.state.p.nBackground != 0)) {
					Q.stage().insert(new Q.Rectangulos1({x:300}));
				}
			}
			Q.stage(0).insert(new Q.Backgrounds({frame:Q.state.p.nBackground}));
			Q.state.set('nBackground', Q.state.p.nBackground + 1);
		}
	};


//-------------LOAD_RESOURCES----------------
	Q.load(["backgrounds.png", "backgrounds.json", "player.png", "player.json", "arpon.png", 
			"arpon.json", "left_edge.png", "right_edge.png", "down_edge.png", "up_edge.png",
			"rectangulos1.png", "rectangulos1.json", "rectangulos2.png", "rectangulos2.json", 
			"rectangulos3.png", "rectangulos3.json", "explosionRect1.png", "explosionRect2.png",
			"explosionRect3.png", "tittle.png", "credits.png", "explosionRect1.json", "explosionRect2.json", 
			"explosionRect3.json", "bolas2.png", "bolas2.json", "bolas3.png", "bolas3.json",
			"bolas4.png", "bolas4.json", "bolas5.png", "bolas5.json", "bolaEspecial.png",
			"bolaEspecial.json", "explosion2.png", "explosion2.json", "explosion3.png", 
			"explosion3.json", "explosion4.png", "explosion4.json", "explosion5.png",
			"explosion5.json", "burbuja_pop.mp3", "rectangulo_pop.mp3", "gameover.mp3",
			"inicio.mp3", "victoria.mp3", "disparo.mp3", "bandaSonora.mp3"], function() {

		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.compileSheets("player.png", "player.json");
		Q.compileSheets("arpon.png", "arpon.json");
		Q.compileSheets("bolas2.png", "bolas2.json");
		Q.compileSheets("bolas3.png", "bolas3.json");
		Q.compileSheets("bolas4.png", "bolas4.json");
		Q.compileSheets("bolas5.png", "bolas5.json");
		Q.compileSheets("rectangulos1.png", "rectangulos1.json");
		Q.compileSheets("rectangulos2.png", "rectangulos2.json");
		Q.compileSheets("rectangulos3.png", "rectangulos3.json");

		Q.compileSheets("explosion2.png", "explosion2.json");
		Q.compileSheets("explosion3.png", "explosion3.json");
		Q.compileSheets("explosion4.png", "explosion4.json");
		Q.compileSheets("explosion5.png", "explosion5.json");
		Q.compileSheets("explosionRect1.png", "explosionRect1.json");
		Q.compileSheets("explosionRect2.png", "explosionRect2.json");
		Q.compileSheets("explosionRect3.png", "explosionRect3.json");

		Q.compileSheets("bolaEspecial.png", "bolaEspecial.json");

		Q.stageScene("mainTitle",0);
	});


//-------------ANIMATIONS-------------
	Q.animations("player", {
		move_right: 	{ frames: [3,0,1,2],  rate: 1/8, flip:"right" }, 
		move_left: 		{ frames: [3,0,1,2],  rate: 1/8, flip:"left" },
		stand: 			{ frames: [4],		  rate: 1/8 },
		died: 			{ frames: [6],		  rate: 1,	 loop: false, trigger:"dying" },
		win:  		    { frames: [7],		  rate: 1,	 loop: false},
		shoot:  		{ frames: [5],		  rate: 1/8, loop: false, trigger:"shooted" }
	});

	Q.animations("bolaEspecial", {
		change: {frames: [0,1], rate: 2}
	});
	
	Q.animations("arpon", {
		change: {frames: [0,1], rate: 1/8}
	});

	Q.animations("rectangulos1", {
		change: {frames: [0,1,2], rate: 1/10}
	});

	Q.animations("rectangulos2", {
		change: {frames: [0,1,2], rate: 1/10}
	});

	Q.animations("rectangulos3", {
		change: {frames: [0,1,2], rate: 1/10}
	});

	Q.animations("explosion2", {
		boom: {frames: [0,1,2], rate: 1/5, loop: false, trigger:"erase"}
	});

	Q.animations("explosion3", {
		boom: {frames: [0,1,2], rate: 1/5, loop: false, trigger:"erase"}
	});

	Q.animations("explosion4", {
		boom: {frames: [0,1,2], rate: 1/5, loop: false, trigger:"erase"}
	});

	Q.animations("explosion5", {
		boom: {frames: [0,1,2], rate: 1/5, loop: false, trigger:"erase"}
	});

	Q.animations("explosionRect1", {
		boom: {frames: [0,1,2], rate: 1/5, loop: false, trigger:"erase"}
	});

	Q.animations("explosionRect2", {
		boom: {frames: [0,1,2], rate: 1/5, loop: false, trigger:"erase"}
	});

	Q.animations("explosionRect3", {
		boom: {frames: [0,1,2], rate: 1/5, loop: false, trigger:"erase"}
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


//-------------BOLAS2_SPRITE----------------
	Q.Sprite.extend("Bolas2",{
		init:function(p){
			this._super(p,{
				sprite: "bolas2",
				sheet: "bolas2",
				frame:0,
				y:78,
				vx: 150,
				vy:-350,
				gravity: 0.5,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, aiBounce');
			this.on("hit",this,"collision");

		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -625;
				}
			});					
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();

				Q.audio.play("burbuja_pop.mp3");
				var explosion2 = new Q.Explosion2({x:this.p.x, y:this.p.y});
				this.stage.insert(explosion2);
				

				var bola31 = new Q.Bolas3({x:this.p.x, y:this.p.y, vx:150});
				this.stage.insert(bola31);
				var bola32 = new Q.Bolas3({x:this.p.x, y:this.p.y, vx:-150});
				this.stage.insert(bola32);
			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});

//-------------BOLAS3_SPRITE----------------
	Q.Sprite.extend("Bolas3",{
		init:function(p){
			this._super(p,{
				sprite: "bolas3",
				sheet: "bolas3",
				frame:0,
				vx: 150,
				vy:-350,
				gravity: 0.5,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, aiBounce');
			this.on("hit",this,"collision");
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left ", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -550;
				}
			});						
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();

				Q.audio.play("burbuja_pop.mp3");
				var explosion3 = new Q.Explosion3({x:this.p.x, y:this.p.y});
				this.stage.insert(explosion3);

				var bola41 = new Q.Bolas4({x:this.p.x, y:this.p.y, vx:150});
				this.stage.insert(bola41);
				var bola42 = new Q.Bolas4({x:this.p.x, y:this.p.y, vx:-150});
				this.stage.insert(bola42);
			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});

//-------------BOLAS4_SPRITE----------------
	Q.Sprite.extend("Bolas4",{
		init:function(p){
			this._super(p,{
				sprite: "bolas4",
				sheet: "bolas4",
				frame:0,
				vx: 150,
				vy:-350,
				gravity: 0.5,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, aiBounce');
			this.on("hit",this,"collision");
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -450;
				}
			});						
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();

				Q.audio.play("burbuja_pop.mp3");
				var explosion4 = new Q.Explosion4({x:this.p.x, y:this.p.y});
				this.stage.insert(explosion4);

				var bola51 = new Q.Bolas5({x:this.p.x, y:this.p.y, vx:150});
				this.stage.insert(bola51);
				var bola52 = new Q.Bolas5({x:this.p.x, y:this.p.y, vx:-150});
				this.stage.insert(bola52);
			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});

//-------------BOLAS5_SPRITE----------------
	Q.Sprite.extend("Bolas5",{
		init:function(p){
			this._super(p,{
				sprite: "bolas5",
				sheet: "bolas5",
				frame:0,
				vx: 150,
				vy:-350,
				gravity: 0.5,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, aiBounce');
			this.on("hit",this,"collision");
		},

		step: function() {
			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -350;
				}
			});						
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();

				Q.audio.play("burbuja_pop.mp3");
				var explosion5 = new Q.Explosion5({x:this.p.x, y:this.p.y});
				this.stage.insert(explosion5);

			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});

//-------------BOLAESPECIAL_SPRITE----------------
	Q.Sprite.extend("BolaEspecial",{
		init:function(p){
			this._super(p,{
				sprite: "bolaEspecial",
				sheet: "bolaEspecial",
				vx: 150,
				x:200,
				y:200,
				gravity: 0.5,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, animation, aiBounce');
			this.on("hit",this,"collision");
		}, 

		step:function() {
			this.play("change", 1);

			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -550;
				}
			});						
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				Q.state.set('endGame', 1);
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();
			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});


//-------------RECTANGULOS1_SPRITE----------------
	Q.Sprite.extend("Rectangulos1",{
		init:function(p){
			this._super(p,{
				sprite: "rectangulos1",
				sheet: "rectangulos1",
				y: 78,
				vx: 150,
				vy: 150,
				gravity: 0,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, animation, aiBounce');
			this.on("hit",this,"collision");

		},

		step: function() {
			this.play("change", 1);

			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -150;
				}
				else if (collision.obj.isA("Up_Edge")) {
					this.p.vy = 150;
				}
			});					
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();

				Q.audio.play("rectangulo_pop.mp3");
				var explosionRect1 = new Q.ExplosionRect1({x:this.p.x, y:this.p.y});
				this.stage.insert(explosionRect1);
				var bola21 = new Q.Rectangulos2({x:this.p.x, y:this.p.y, vx: 150});
				this.stage.insert(bola21);
				var bola22 = new Q.Rectangulos2({x:this.p.x, y:this.p.y, vx:-150});
				this.stage.insert(bola22);
			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});

//-------------RECTANGULOS2_SPRITE----------------
	Q.Sprite.extend("Rectangulos2",{
		init:function(p){
			this._super(p,{
				sprite: "rectangulos2",
				sheet: "rectangulos2",
				y: 78,
				vx: 150,
				vy: -150,
				gravity: 0,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, animation, aiBounce');
			this.on("hit",this,"collision");

		},

		step: function() {
			this.play("change", 1);

			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -150;
				}
				else if (collision.obj.isA("Up_Edge")) {
					this.p.vy = 150;
				}
			});					
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();

				Q.audio.play("rectangulo_pop.mp3");
				var explosionRect2 = new Q.ExplosionRect2({x:this.p.x, y:this.p.y});
				this.stage.insert(explosionRect2);
				var bola31 = new Q.Rectangulos3({x:this.p.x, y:this.p.y, vx: 150});
				this.stage.insert(bola31);
				var bola32 = new Q.Rectangulos3({x:this.p.x, y:this.p.y, vx:-150});
				this.stage.insert(bola32);
			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});

//-------------RECTANGULOS3_SPRITE----------------
	Q.Sprite.extend("Rectangulos3",{
		init:function(p){
			this._super(p,{
				sprite: "rectangulos3",
				sheet: "rectangulos3",
				y: 78,
				vx: 150,
				vy: -150,
				gravity: 0,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_FRIENDLY | Q.SPRITE_DEFAULT,
				scale:2
			});
			this.add('2d, animation, aiBounce');
			this.on("hit",this,"collision");

		},

		step: function() {
			this.play("change", 1);

			this.on("bump.bottom, bump.top, bump.right, bump.left", function(collision) {
				if (collision.obj.isA("Down_Edge")) {
					this.p.vy = -150;
				}
				else if (collision.obj.isA("Up_Edge")) {
					this.p.vy = 150;
				}
			});					
		},

		collision: function(col) {
			if(col.obj.isA("Harpoon")){
				col.obj.destroy();
				Q.state.set('ammo', Q.state.p.ammo+1);
				this.destroy();
				Q.audio.play("rectangulo_pop.mp3");
				var explosionRect3 = new Q.ExplosionRect3({x:this.p.x, y:this.p.y});
				this.stage.insert(explosionRect3);
			}
			if(col.obj.isA("Player")){
				col.obj.p.playing = false;
				col.obj.del("platformerControls");
				col.obj.play("died", 3);
			}
		}
	});	


//-------------EXPLOSION_BOLA2----------------
	Q.Sprite.extend("Explosion2",{
		init:function(p){
			this._super(p,{
				sprite:"explosion2",
				sheet:"explosion2",
				frame:0,
				type: Q.SPRITE_POWERUP,
				scale:2
			});
			this.add('animation');
			this.on("erase", this, "kill");
		},

		step: function(){
			this.play("boom", 1);
		},

		kill: function(){
			this.destroy();
		}
	});

//-------------EXPLOSION_BOLA3----------------
	Q.Sprite.extend("Explosion3",{
		init:function(p){
			this._super(p,{
				sprite:"explosion3",
				sheet:"explosion3",
				frame:0,
				type: Q.SPRITE_POWERUP,
				scale:2
			});
			this.add('animation');
			this.on("erase", this, "kill");
		},

		step: function(){
			this.play("boom", 1);
		},

		kill: function(){
			this.destroy();
		}
	});

//-------------EXPLOSION_BOLA4----------------
	Q.Sprite.extend("Explosion4",{
		init:function(p){
			this._super(p,{
				sprite:"explosion4",
				sheet:"explosion4",
				frame:0,
				type: Q.SPRITE_POWERUP,
				scale:2
			});
			this.add('animation');
			this.on("erase", this, "kill");
		},

		step: function(){
			this.play("boom", 1);
		},

		kill: function(){
			this.destroy();
		}
	});

//-------------EXPLOSION_BOLA5----------------
	Q.Sprite.extend("Explosion5",{
		init:function(p){
			this._super(p,{
				sprite:"explosion5",
				sheet:"explosion5",
				frame:0,
				type: Q.SPRITE_POWERUP,
				scale:2
			});
			this.add('animation');
			this.on("erase", this, "kill");
		},

		step: function(){
			this.play("boom", 1);
		},

		kill: function(){
			this.destroy();
		}
	});

//-------------EXPLOSION_RECTANGULO1----------------
	Q.Sprite.extend("ExplosionRect1",{
		init:function(p){
			this._super(p,{
				sprite:"explosionRect1",
				sheet:"explosionRect1",
				frame:0,
				type: Q.SPRITE_POWERUP,
				scale:2
			});
			this.add('animation');
			this.on("erase", this, "kill");
		},

		step: function(){
			this.play("boom", 1);
		},

		kill: function(){
			this.destroy();
		}
	});

//-------------EXPLOSION_RECTANGULO2----------------
	Q.Sprite.extend("ExplosionRect2",{
		init:function(p){
			this._super(p,{
				sprite:"explosionRect2",
				sheet:"explosionRect2",
				frame:0,
				type: Q.SPRITE_POWERUP,
				scale:2
			});
			this.add('animation');
			this.on("erase", this, "kill");
		},

		step: function(){
			this.play("boom", 1);
		},

		kill: function(){
			this.destroy();
		}
	});

//-------------EXPLOSION_RECTANGULO1----------------
	Q.Sprite.extend("ExplosionRect3",{
		init:function(p){
			this._super(p,{
				sprite:"explosionRect3",
				sheet:"explosionRect3",
				frame:0,
				type: Q.SPRITE_POWERUP,
				scale:2
			});
			this.add('animation');
			this.on("erase", this, "kill");
		},

		step: function(){
			this.play("boom", 1);
		},

		kill: function(){
			this.destroy();
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
				vy: -360
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
				collisionMask:Q.SPRITE_PARTICLE | Q.SPRITE_DEFAULT,
				scale:2,
				jumpSpeed:0
			});
			this.add('2d, platformerControls, animation');
			
			/*The user push the fire button*/
			Q.input.on("fire", this,"fire");

			/* Wait until the firing animation has played until
			 actually launching the harpoon*/
			this.on("shooted",this,"launchHarpoon");
			this.on("dying", this, "kill");
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

			if (Q.state.p.endGame === 1) {
					Q.audio.stop("bandaSonora.mp3");
					Q.audio.play("victoria.mp3");
					this.play("win", 3);
					this.p.playing = false;
					this.del("platformerControls");
					Q.stage().pause();
					Q.clearStages();
					Q.stageScene("credits",0);
			}
		},

		fire:function(){
			if(this.p.playing){
				if(Q.state.p.ammo > 0){
					Q.audio.play("disparo.mp3");
					this.play("shoot", 3);
					Q.state.set('ammo', Q.state.p.ammo-1);
				}
			}
		},

		launchHarpoon: function(){
			var harpoon = new Q.Harpoon({x:this.p.x});
			this.stage.insertHarpoon(harpoon);
		},

		kill: function(){
			Q.audio.stop("bandaSonora.mp3");
			Q.audio.play("gameover.mp3");
			Q.stage().pause();
			Q.clearStages();
			Q.stageScene("mainTitle", 0);
		}
	});
}
