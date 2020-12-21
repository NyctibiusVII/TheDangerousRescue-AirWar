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
        // Background //
        backgroundDirection: "left",
        velocityOfBackground: 1,
        movingFrom_n_To_n_pixels: 10,
        // Friend //
        positionFriend: "left",
        limitPositionFriend: 906,
        resetPositionFriend: 0,
        directionFriend: "left",
        friendVelocity: 1,
        // Enemy 1 //
        positionEnemy_1: "left",
        limitPositionEnemy_1: 0,
        resetPositionEnemy_1: 694,
        directionEnemy_1: "left",
        enemyVelocity_1: 5,
        // Enemy 2 //
        positionEnemy_2: "left",
        limitPositionEnemy_2: 0,
        resetPositionEnemy_2: 775,
        directionEnemy_2: "left",
        enemyVelocity_2: 3,
        // Enemies //
        enemyPositionX: undefined,
        enemyPositionY: parseInt(Math.random() * 334),
        enemyValueRandomPositionY: 334,
        // Shoot //
        canShoot: true,
        executeShootingTime: 30,
        shootingVelocity: 15,
        shootingRangeLimit: 900,
        topShoot: undefined,
        shootPositionX: undefined,
        topPlayer: "top",
        topAlignment: 40,
        leftPlayer: "left",
        rightAlignment: 190,
        playerPositionX: undefined,
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
        moveFriend();

        moveEnemy1();
        moveEnemy2();

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
            shoot();
        }
    }

    function moveFriend() {
        game.enemyPositionX = parseInt($("#friend").css(game.positionFriend));
        $("#friend").css(game.directionFriend, game.enemyPositionX + game.friendVelocity);

        if (game.enemyPositionX > game.limitPositionFriend) {
            $("#friend").css(game.directionFriend, game.resetPositionFriend);
        }
    }

    function shoot() {
        if (game.canShoot === true) {
            game.canShoot = false;

            topP = parseInt($("#player").css(game.topPlayer))
            game.playerPositionX = parseInt($("#player").css(game.leftPlayer))
            game.topShoot = topP + game.topAlignment;                            // Alinhando tiro com uma margem no top
            game.shootPositionX = game.playerPositionX + game.rightAlignment;   // Alinhando tiro a direita
            $("#backgroundGame").append("<div id='shoot'></div");
            $("#shoot").css(game.topPlayer, game.topShoot);
            $("#shoot").css(game.leftPlayer, game.shootPositionX);

            var shootingTime = window.setInterval(executeShooting, game.executeShootingTime);
        }

        function executeShooting() {
            game.playerPositionX = parseInt($("#shoot").css(game.leftPlayer));
            $("#shoot").css(game.leftPlayer, game.playerPositionX + game.shootingVelocity);

            if (game.playerPositionX > game.shootingRangeLimit) {
                window.clearInterval(shootingTime);
                shootingTime = null;
                $("#shoot").remove();
                game.canShoot = true;
            }
        }
    }

    function moveEnemy1() {
        game.enemyPositionX = parseInt($("#enemy1").css(game.positionEnemy_1));
        $("#enemy1").css(game.directionEnemy_1,game.enemyPositionX - game.enemyVelocity_1);
        $("#enemy1").css("top",game.enemyPositionY);
        
        if (game.enemyPositionX <= game.limitPositionEnemy_1) {
            game.enemyPositionY = parseInt(Math.random() * game.enemyValueRandomPositionY);
            $("#enemy1").css(game.directionEnemy_1, game.resetPositionEnemy_1);
            $("#enemy1").css("top",game.enemyPositionY);
        }
    }

    function moveEnemy2() {
        game.enemyPositionX = parseInt($("#enemy2").css(game.positionEnemy_2));
        $("#enemy2").css(game.directionEnemy_2, game.enemyPositionX - game.enemyVelocity_2);

        if (game.enemyPositionX <= game.limitPositionEnemy_2) {
            $("#enemy2").css(game.directionEnemy_2, game.resetPositionEnemy_2);
        }
    }

	function backgroundAnimation() {
        game.backgroundDirection = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position", game.backgroundDirection - game.velocityOfBackground);
    }
}