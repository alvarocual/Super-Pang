var game = function() {
	var Q = window.Q = Quintus()
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI, Audio")
			.setup({width:512,
					//height:384,
					scaleToFit:true})
					//audioSupported:["ogg", "mp3"]})
			.controls().touch();

	Q.scene("level1",function(stage) {
		// Add in a repeater for a little parallax action
		stage.insert(new Q.Backgrounds());
	});

	Q.load(["backgrounds.png", "backgrounds.json"], function() {
		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.stageScene("level1");
	});


	Q.Sprite.extend("Backgrounds",{
		init:function(p){
			this._super(p,{
				sprite: "background",
				sheet: "background",
				frame:0,
				x:128,
				y:96
			});
		},
		step: function(){}
	});


};
