function start() {
    $("#startGame").hide();
    
	$("#backgroundGame").append("<div id='player' class='playerAnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy1' class='enemy1AnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy2'></div>");
	$("#backgroundGame").append("<div id='friend' class='friendAnimationClass'></div>");
    
    var game = {}
    const interval = game.interval = 30;
    const velocity = game.velocity = 1;
    var backgroundDirection = game.backgroundDirection = "left";
      
    game.timer = setInterval(loop, interval);

    function loop() {
        backgroundAnimation();
    }
	
	function backgroundAnimation() {
        backgroundDirection = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position", backgroundDirection - velocity);
    }
}