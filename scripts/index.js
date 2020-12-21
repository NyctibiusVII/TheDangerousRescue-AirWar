function start() {
    $("#startGame").hide();
    
	$("#backgroundGame").append("<div id='player' class='playerAnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy1' class='enemy1AnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy2'></div>");
	$("#backgroundGame").append("<div id='friend' class='friendAnimationClass'></div>");

    var game = {
        intervalLoop: 30,
        topLimit: 0,
        bottomLimit: 434,
        
        backgroundDirection: "left",
        velocityOfBackground: 1,
        movingFrom_n_To_n_pixels: 10,
        
        directionEnemy: "left",
        enemyVelocity: 5,
        enemyPositionX: undefined,
        enemyPositionY: parseInt(Math.random() * 334),
        startingPositionOnTheEnemy: 694,
    }
    game.timer = setInterval(loop, game.intervalLoop);

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
        moveEnemy1();
        backgroundAnimation();
    }

    function movePlayer() {
        if (game.pressed[keyboardKey.W]) {
            let top = parseInt($("#player").css("top"));
            $("#player").css("top",top - game.movingFrom_n_To_n_pixels);

            if (top <= game.topLimit) {
                $("#player").css("top",top + game.movingFrom_n_To_n_pixels);
            }
        }
        if (game.pressed[keyboardKey.S]) {
            let top = parseInt($("#player").css("top"));
            $("#player").css("top",top + game.movingFrom_n_To_n_pixels);

            if (top >= game.bottomLimit) {
                $("#player").css("top",top - game.movingFrom_n_To_n_pixels);
            }
        }
        if (game.pressed[keyboardKey.D]) {
        }
    }

    function moveEnemy1() {
        game.enemyPositionX = parseInt($("#enemy1").css(game.directionEnemy));
        $("#enemy1").css(game.directionEnemy,game.enemyPositionX - game.enemyVelocity);
        $("#enemy1").css("top",game.enemyPositionY);
        
        if (game.enemyPositionX <= 0) {
            game.enemyPositionY = parseInt(Math.random() * 334);
            $("#enemy1").css(game.directionEnemy, game.startingPositionOnTheEnemy);
            $("#enemy1").css("top",game.enemyPositionY);
        }
    }

	function backgroundAnimation() {
        game.backgroundDirection = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position", game.backgroundDirection - game.velocityOfBackground);
    }
}