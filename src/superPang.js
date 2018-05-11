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
		// Add in a repeater for a little parallax action
		stage.insert(new Q.Backgrounds());
	});


//-------------LEVEL----------------
	Q.scene("level",function(stage){

	});



//-------------LOAD_RESOURCES----------------
	Q.load(["backgrounds.png", "backgrounds.json"], function() {
		Q.compileSheets("backgrounds.png", "backgrounds.json");
		Q.stageScene("level");
		Q.stageScene("back");
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
		},
		step:function(){}
	});


};
