function start() {
    $("#startGame").hide();
    
	$("#backgroundGame").append("<div id='player' class='playerAnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy1' class='enemy1AnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy2'></div>");
	$("#backgroundGame").append("<div id='friend' class='friendAnimationClass'></div>");

    var game = {
        interval: 30,
        velocity: 1,
        backgroundDirection: "left",
        amountOfPixelsMoved: 10
    }
    game.timer = setInterval(loop, game.interval);

    var keyboardKey = {
        W: 87,
        S: 83,
        D: 68
    }
    game.pressed = [];

    $(document).keydown((e) => { game.pressed[e.which] = true; });
    $(document).keyup((e) => { game.pressed[e.which] = false; });

    function loop() {
        movePlayer();
        backgroundAnimation();
    }

    function movePlayer() {
        if (game.pressed[keyboardKey.W]) {
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top",topo - game.amountOfPixelsMoved);
        }
        if (game.pressed[keyboardKey.S]) {
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top",topo + game.amountOfPixelsMoved);
        }
        if (game.pressed[keyboardKey.D]) {
        }
    }

	function backgroundAnimation() {
        game.backgroundDirection = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position", game.backgroundDirection - game.velocity);
    }
}