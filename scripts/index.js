function start() {
    $("#startGame").hide();
    
	$("#backgroundGame").append("<div id='player' class='playerAnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy1' class='enemy1AnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy2'></div>");
	$("#backgroundGame").append("<div id='friend' class='friendAnimationClass'></div>");

    var game = {
        endOfTheGame: false,
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
        direcTopEnemy_1: "top",
        directionEnemy_1: "left",
        enemyVelocity_1: 5,
        // Enemy 2 //
        positionEnemy_2: "left",
        limitPositionEnemy_2: 0,
        resetPositionEnemy_2: 775,
        direcTopEnemy_2: "top",
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
        resetPositionShoot: 950,
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

        collision();

        moveEnemy1();
        moveEnemy2();

        backgroundAnimation();
    }



    function movePlayer() {
        if (game.pressed[keyboardKey.W]) {
            let top = parseInt($("#player").css(game.topPlayer));
            $("#player").css(game.topPlayer,top - game.movingFrom_n_To_n_pixels);

            if (top <= game.topLimit) {
                $("#player").css(game.topPlayer,top + game.movingFrom_n_To_n_pixels);
            }
        }
        if (game.pressed[keyboardKey.S]) {
            let top = parseInt($("#player").css(game.topPlayer));
            $("#player").css(game.topPlayer,top + game.movingFrom_n_To_n_pixels);

            if (top >= game.bottomLimit) {
                $("#player").css(game.topPlayer,top - game.movingFrom_n_To_n_pixels);
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
            game.shootPositionX = game.playerPositionX + game.rightAlignment;    // Alinhando tiro a direita
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
    function collision() {
        var collision_1 = ($("#player").collision($("#enemy1"))); // Player => Elipóptero       | 🚁X🚁
        var collision_2 = ($("#player").collision($("#enemy2"))); // Player => Caminhão         | 🚁X🚛
        var collision_3 = ($("#shoot").collision($("#enemy1")));  // Player/Shoot => Elipóptero | 🔫X🚁
        var collision_4 = ($("#shoot").collision($("#enemy2")));  // Player/Shoot => Caminhão   | 🔫X🚛
        var collision_5 = ($("#player").collision($("#friend"))); // Player => Amigo            | 🚁X🏃🏻‍♂️
        var collision_6 = ($("#enemy2").collision($("#friend"))); // Elipóptero => Amigo        | 🚁X🏃🏻‍♂️
        
        if (collision_1.length > 0) {
            enemy1X = parseInt($("#enemy1").css(game.directionEnemy_1));
            enemy1Y = parseInt($("#enemy1").css(game.direcTopEnemy_1));
            explosion1(enemy1X,enemy1Y);
        
            game.enemyPositionY = parseInt(Math.random() * game.enemyValueRandomPositionY);
            $("#enemy1").css(game.directionEnemy_1, game.resetPositionEnemy_1);
            $("#enemy1").css(game.direcTopEnemy_1, game.enemyPositionY);
        }
        if (collision_2.length > 0) {
            enemy2X = parseInt($("#enemy2").css(game.directionEnemy_2));
            enemy2Y = parseInt($("#enemy2").css(game.direcTopEnemy_2));
            explosion2(enemy2X,enemy2Y);

            $("#enemy2").remove();
            repositionEnemy2();
        }
        if (collision_3.length > 0) {
            enemy1X = parseInt($("#enemy1").css(game.directionEnemy_1));
            enemy1Y = parseInt($("#enemy1").css(game.direcTopEnemy_1));
            explosion1(enemy1X,enemy1Y);

            $("#shoot").css(game.leftPlayer, game.resetPositionShoot);

            game.enemyPositionY = parseInt(Math.random() * game.enemyValueRandomPositionY);
            $("#enemy1").css(game.directionEnemy_1, game.resetPositionEnemy_1);
            $("#enemy1").css(game.direcTopEnemy_1, game.enemyPositionY);
        }
        if (collision_4.length > 0) {
            enemy2X = parseInt($("#enemy2").css(game.directionEnemy_2));
            enemy2Y = parseInt($("#enemy2").css(game.direcTopEnemy_2));
            $("#enemy2").remove();
            explosion2(enemy2X, enemy2Y);

            $("#shoot").css(game.leftPlayer, game.resetPositionShoot);
            repositionEnemy2();
        }
        if (collision_5.length > 0) {
            repositionFriend();
            $("#friend").remove();
        }
    }



    function explosion1(enemy1X,enemy1Y) {
        $("#backgroundGame").append("<div id='explosion1'></div");
        $("#explosion1").css("background-image", "url(./assets/images/explosion.png)");

        var div = $("#explosion1");
        div.css(game.direcTopEnemy_1, enemy1Y);
        div.css(game.directionEnemy_1, enemy1X);
        div.animate({width: 200, opacity: 0}, "slow");

        var explosionTime = window.setInterval(removeExplosion, 1000);
        function removeExplosion() {
            div.remove();
            window.clearInterval(explosionTime);
            explosionTime = null;
        }
    }
    function explosion2(enemy1X,enemy1Y) {
        $("#backgroundGame").append("<div id='explosion2'></div");
        $("#explosion2").css("background-image", "url(./assets/images/explosion.png)");
        
        var div2 = $("#explosion2");
        div2.css(game.direcTopEnemy_2, enemy1Y);
        div2.css(game.directionEnemy_2, enemy1X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var explosionTime2 = window.setInterval(removeExplosion2, 1000);
        function removeExplosion2() {
            div2.remove();
            window.clearInterval(explosionTime2);
            explosionTime2 = null;
        }
    }



    function repositionEnemy2() {
        var collisionTime4 = window.setInterval(reposition4, 5000);

        function reposition4() {
            window.clearInterval(collisionTime4);
            collisionTime4 = null;

            if (game.endOfTheGame === false) {
                $("#backgroundGame").append("<div id=enemy2></div");
            }
        }
    }

	function repositionFriend() {
        var friendTime = window.setInterval(reposition6, 6000);

        function reposition6() {
            window.clearInterval(friendTime);
            friendTime = null;

            if (game.endOfTheGame === false) {
                $("#backgroundGame").append("<div id='friend' class='friendAnimationClass'></div>");
            }
        }
    }



    function moveEnemy1() {
        game.enemyPositionX = parseInt($("#enemy1").css(game.positionEnemy_1));
        $("#enemy1").css(game.directionEnemy_1,game.enemyPositionX - game.enemyVelocity_1);
        $("#enemy1").css(game.direcTopEnemy_1, game.enemyPositionY);
        
        if (game.enemyPositionX <= game.limitPositionEnemy_1) {
            game.enemyPositionY = parseInt(Math.random() * game.enemyValueRandomPositionY);
            $("#enemy1").css(game.directionEnemy_1, game.resetPositionEnemy_1);
            $("#enemy1").css(game.direcTopEnemy_1, game.enemyPositionY);
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