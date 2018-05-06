var game = function() {
var Q = window.Q = Quintus()
	.include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D")
	.setup({ width: 320, height: 480 })
	.controls().touch()

	Q.Sprite.extend("Mario", {
		init: function(p) {
			this._super(p, {
				sprite: "mario_anim",
				sheet: "marioR",
				gravity: 0.65,
				frame: 0,
				x: 150,
				y: 380,
				alive: true
			});
			this.add("2d, platformerControls, animation");
			this.on("bump.left, bump.right, bump.top", function(collision) {
				
			});

			this.on("bump.left, bump.right, bump.top", this, "killed");
			this.on("dying", this, "die");
		},

		killed: function(collision) {
			if (collision.obj.isA("Goomba") || collision.obj.isA("Bloopa")) {
				this.p.alive = false;
				this.p.vx = 0;
				this.p.vy = -150;
				this.play("death");
			}
		},

		die: function() { this.destroy(); },

		step: function(dt) {
			if (this.p.alive) {
				if (this.p.y >= 700) {
					this.p.sheet = "marioR";
					this.p.frame = 0;
					this.p.x = 150;
					this.p.y = 380;
				}

				if (this.p.vx === 0) this.play("stand_right");
				if (this.p.vx > 0) this.play("walk_right");
				if (this.p.vx < 0) this.play("walk_left");
				if (this.p.vy > 0 || this.p.vy < 0) this.play("jump_right");
				if ((this.p.vy > 0 || this.p.vy < 0) && this.p.vx < 0) this.play("jump_left");
			}
		}
	});

	Q.animations("mario_anim", {
		stand_right: { frames: [0], flip: false, loop: true },
		stand_left: { frames: [0], flip: "x", loop: true },
		walk_right: { frames: [1,2,3], rate: 1/10, flip: false, loop: true },
		walk_left: { frames: [1,2,3], rate: 1/10, flip: "x", loop: true },
		jump_right: { frames: [4], flip: false, loop: true },
		jump_left: { frames: [4], flip: "x", loop: true },
		death: { frames: [12], flip: false, rate: 2, loop: false, trigger: "dying" }
	})

	Q.Sprite.extend("Goomba", {
		init: function(p) {
			this._super(p, {
				sprite: "goomba_anim",
				sheet: "goomba",
				frame: 0,
				x: 600,
				y: 380,
				vx: 100,
				alive: true
			});

			this.add("2d, aiBounce, animation");
			this.on("bump.left, bump.right, bump.bottom", this, "kill");
			this.on("bump.top", this, "killed");
			this.on("dying", this, "die");
		},

		kill: function(collision) {
			if (collision.obj.isA("Mario")) {
				Q.stageScene("endGame", 1, { label: "You Died" });
			}
		},

		killed: function(collision) {
			if (collision.obj.isA("Mario")) {
				this.p.alive = false;
				this.p.vx = 0;
				this.play("death");
				collision.obj.p.vy = -300;
			}
		},

		die: function() { this.destroy(); },

		step: function(dt) {
			if (this.p.alive) {
				if (this.p.vx > 0 || this.p.vx < 0) this.play("walk");
			}
		}
	});

	Q.animations("goomba_anim", {
		walk: { frames: [0,1], flip: false, rate: 1/5, loop: true },
		death: { frames: [2], flip: false, rate: 1, loop: false, trigger: "dying" }
	});

	Q.Sprite.extend("Bloopa", {
		init: function(p) {
			this._super(p, {
				sprite: "bloopa_anim",
				sheet: "bloopa",
				gravity: 0.1,
				frame: 0,
				x: 500,
				y: 480,
				vy: 150,
				alive: true
			});

			this.add("2d, aiBounce, animation");
			this.on("bump.left, bump.right, bump.bottom", this, "kill");
			this.on("bump.top", this, "killed");
			this.on("dying", this, "die");
		},

		kill: function(collision) {
			if (collision.obj.isA("Mario")) {
				Q.stageScene("endGame", 1, { label: "You Died" });
			}
			// Bounce on the ground
			else this.p.vy = -150;
		},

		killed: function(collision) {
			if (collision.obj.isA("Mario")) {
				this.p.alive = false;
				this.play("death");
				collision.obj.p.vy = -300;
			}
		},

		die: function() {
			this.destroy();
		},

		step: function(dt) {
			if (this.p.alive) {
				if (this.p.vy > 0) this.play("down");
				else this.play("up");
			}
		}
	});

	Q.animations("bloopa_anim", {
		up: { frames: [0], flip: false, loop: true },
		down: { frames: [1], flip: false, loop: true },
		death: { frames: [2], flip: false, rate: 1, loop: false, trigger: "dying" }
	});

	Q.Sprite.extend("Princess", {
		init: function(p) {
			this._super(p, {
				asset: "princess.png",
				frame: 0,
				x: 2000,
				y: 400
			});

			this.add("2d");
			this.on("bump.left, bump.right, bump.top", function(collision) {
				if (collision.obj.isA("Mario")) {
					Q.stageScene("winGame", 1, { label: "You Won!" });
					// TODO: Quitar el control al jugador
				}
			})
		}
	});

	Q.Sprite.extend("Coin", {
		init: function(p) {
			this._super(p, {
				sheet: "coin_anim",
				frame: 0,
				sprite: "coin",
				gravity: 0,
				sensor: true,
				picked: false
			});

			this.add("tween, animation");
			this.on("sensor", function(collision) {
				if (!this.p.collision && collision.isA("Mario")) {
					Q.state.inc("score", 1);
					this.p.picked = true;
					this.animate({ y: this.p.y - 50 }, 0.2, Q.Easing.Linear, {
						callback: function() {
							this.destroy();
						},
					});
				}
			});
		},

		step: function(p) {
			this.play("switch");
		},
	});

	Q.animations("coin_anim", {
		switch: { frames: [0, 1, 2], loop: true, rate: 1/2 },
	});

	Q.UI.Text.extend("Score", {
		init: function(p) {
			this._super({
				label: "Score: 0",
				x: 60,
				y: 0,
			});
			Q.state.on("change.score", this, "score");
		},
		score: function(score) {
			this.p.label = "score: " + score;
		}
	});

	Q.scene("HUD", function(stage) {
		stage.insert(new Q.Score());
	});

	Q.scene("level1", function(stage) {
		Q.stageTMX("level.tmx", stage);
		const mario = stage.insert(new Q.Mario());
		stage.add("viewport").follow(mario);
		stage.viewport.offsetX = -130;
		stage.viewport.offsetY = 160;

		stage.insert(new Q.Goomba());
		stage.insert(new Q.Bloopa());
		stage.insert(new Q.Princess());
		/*
		stage.insert(new Q.Coin({ x: 250, y: 400 }));
		stage.insert(new Q.Coin({ x: 500, y: 400 }));
		stage.insert(new Q.Coin({ x: 750, y: 400 }));
		stage.insert(new Q.Coin({ x: 1000, y: 400 }));
		*/
		stage.insert(new Q.Score());
	});

	Q.scene("endGame", function(stage) {
		const container = stage.insert(
			new Q.UI.Container({
				x: Q.width/2,
				y: Q.height/2,
				fill: "rgba(0,0,0,0.5)"
			})
		);

		const button = container.insert(
			new Q.UI.Button({
				x: 0,
				y: 0,
				fill: "#CCCCCC",
				label: "Play Again",
				keyActionName: "fire"
			})
		);

		const label = container.insert(
			new Q.UI.Text({
				x: 10,
				y: -10 - button.p.h,
				label: stage.options.label
			})
		);

		button.on("click", function() {
			Q.clearStages();
			Q.stageScene("level1");
		});

		container.fit(20);
	});

	Q.scene("winGame", function(stage) {
		const container = stage.insert(
			new Q.UI.Container({
				x: Q.width/2,
				y: Q.height/2,
				fill: "rgba(0,0,0,0.5)"
			})
		);

		const button = container.insert(
			new Q.UI.Button({
				x: 0,
				y: 0,
				fill: "#CCCCCC",
				label: "Play Again",
				keyActionName: "fire"
			})
		);

		const label = container.insert(
			new Q.UI.Text({
				x: 10,
				y: -10 - button.p.h,
				label: stage.options.label
			})
		);

		button.on("click", function() {
			Q.clearStages();
			Q.stageScene("level1");
		});
		
		container.fit(20);
	});

	Q.scene("mainMenu", function(stage) {
		const container = stage.insert(
			new Q.UI.Container({
				x: Q.width,
				y: Q.height
			})
		);

		const button = container.insert(
			new Q.UI.Button({
				x: -Q.width/2,
				y: -Q.height/2,
				fill: "#CCCCCC",
				asset: "mainTitle.png",
				keyActionName: "fire"
			})
		);

		button.on("click", function() {
			Q.clearStages();
			Q.stageScene("level1");
		});

		container.fit(20);
	})
	
	Q.loadTMX("level.tmx, mario_small.json, mario_small.png, goomba.json, goomba.png, bloopa.json, bloopa.png, princess.png, mainTitle.png, coin.png", function() {
		Q.compileSheets("mario_small.png", "mario_small.json");
		Q.compileSheets("goomba.png", "goomba.json");
		Q.compileSheets("bloopa.png", "bloopa.json");
		Q.stageScene("mainMenu");
	});
};
