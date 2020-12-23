function start() {
    $("#startGame").hide();
    
	$("#backgroundGame").append("<div id='player' class='playerAnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy1' class='enemy1AnimationClass'></div>");
	$("#backgroundGame").append("<div id='enemy2'></div>");
	$("#backgroundGame").append("<div id='friend' class='friendAnimationClass'></div>");
    $("#backgroundGame").append("<div id='scoreboard'></div>");
    $("#backgroundGame").append("<div id='energy'></div>");

    var soundShooting = document.getElementById("soundShooting");
    var explosionSound = document.getElementById("explosionSound");
    var music = document.getElementById("music");
    var soundGameOver = document.getElementById("soundGameOver");
    var lostSound = document.getElementById("lostSound");
    var soundRescue = document.getElementById("soundRescue");

    var game = {
        scores: 0,
        saved: 0,
        lost: 0,

        pointsForTheEnemy_1: 100,
        pointsForTheEnemy_2: 50,

        currentEnergy: 3,

        generalVelocityOfEnemies: 0.3,
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
        direcTopFriend: "top",
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
        music.addEventListener("ended", function(){ music.currentTime = 0; music.play(); }, false);
        music.play();
        backgroundAnimation();

        movePlayer();
        moveFriend();

        moveEnemy1();
        moveEnemy2();

        collision();
        energy();
        scoreboard();
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
            soundShooting.play();
            game.canShoot = false;

            topP = parseInt($("#player").css(game.topPlayer))
            game.playerPositionX = parseInt($("#player").css(game.leftPlayer))
            game.topShoot = topP + game.topAlignment;                            // Alinhando tiro com uma margem no top
            game.shootPositionX = game.playerPositionX + game.rightAlignment;    // Alinhando tiro a direita
            $("#backgroundGame").append("<div id='shoot' class='shootAnimationClass'></div");
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
            game.currentEnergy--;

            enemy1X = parseInt($("#enemy1").css(game.directionEnemy_1));
            enemy1Y = parseInt($("#enemy1").css(game.direcTopEnemy_1));
            explosion1(enemy1X,enemy1Y);
        
            game.enemyPositionY = parseInt(Math.random() * game.enemyValueRandomPositionY);
            $("#enemy1").css(game.directionEnemy_1, game.resetPositionEnemy_1);
            $("#enemy1").css(game.direcTopEnemy_1, game.enemyPositionY);
        }
        if (collision_2.length > 0) {
            game.currentEnergy--;

            enemy2X = parseInt($("#enemy2").css(game.directionEnemy_2));
            enemy2Y = parseInt($("#enemy2").css(game.direcTopEnemy_2));
            explosion2(enemy2X,enemy2Y);

            $("#enemy2").remove();
            repositionEnemy2();
        }
        if (collision_3.length > 0) {
            game.scores += game.pointsForTheEnemy_1;
            game.enemyVelocity_1 += game.generalVelocityOfEnemies;

            enemy1X = parseInt($("#enemy1").css(game.directionEnemy_1));
            enemy1Y = parseInt($("#enemy1").css(game.direcTopEnemy_1));
            explosion1(enemy1X,enemy1Y);

            $("#shoot").css(game.leftPlayer, game.resetPositionShoot);

            game.enemyPositionY = parseInt(Math.random() * game.enemyValueRandomPositionY);
            $("#enemy1").css(game.directionEnemy_1, game.resetPositionEnemy_1);
            $("#enemy1").css(game.direcTopEnemy_1, game.enemyPositionY);
        }
        if (collision_4.length > 0) {
            game.scores += game.pointsForTheEnemy_2;
            game.enemyVelocity_2 += game.generalVelocityOfEnemies;

            enemy2X = parseInt($("#enemy2").css(game.directionEnemy_2));
            enemy2Y = parseInt($("#enemy2").css(game.direcTopEnemy_2));
            $("#enemy2").remove();
            explosion2(enemy2X, enemy2Y);

            $("#shoot").css(game.leftPlayer, game.resetPositionShoot);
            repositionEnemy2();
        }
        if (collision_5.length > 0) {
            soundRescue.play();
            game.saved++;
            repositionFriend();
            $("#friend").remove();
        }
        if (collision_6.length > 0) {
            game.lost++;
            friendX = parseInt($("#friend").css(game.directionFriend));
            friendY = parseInt($("#friend").css(game.direcTopFriend));
            explosion3(friendX, friendY);

            $("#friend").remove();
            repositionFriend();
        }
    }



    function explosion1(enemy1X, enemy1Y) {
        explosionSound.play();
        $("#backgroundGame").append(`
        <div id='explosion1'>
            <img src='./assets/images/explosion.gif' class='explosionGif' alt='explosão'>
        </div`);

        var div = $("#explosion1");
        div.css(game.direcTopEnemy_1, enemy1Y);
        div.css(game.directionEnemy_1, enemy1X);

        var explosionTime = window.setInterval(removeExplosion, 500);
        function removeExplosion() {
            div.remove();
            window.clearInterval(explosionTime);
            explosionTime = null;
        }
    }
    function explosion2(enemy1X, enemy1Y) {
        explosionSound.play();
        $("#backgroundGame").append(`
        <div id='explosion2'>
            <img src='./assets/images/explosion.gif' class='explosionGif' alt='explosão'>
        </div`);
        
        var div2 = $("#explosion2");
        div2.css(game.direcTopEnemy_2, enemy1Y);
        div2.css(game.directionEnemy_2, enemy1X);
        
        var explosionTime2 = window.setInterval(removeExplosion2, 500);
        function removeExplosion2() {
            div2.remove();
            window.clearInterval(explosionTime2);
            explosionTime2 = null;
        }
    }
    function explosion3(friendX, friendY) {
        lostSound.play();
        $("#backgroundGame").append("<div id='explosion3' class='friendDeadAnimationClass'></div");
        $("#explosion3").css(game.directionFriend, friendX);
        $("#explosion3").css(game.direcTopFriend, friendY);

        var explosionTime3 = window.setInterval(resetExplosion3, 1000);
        function resetExplosion3() {
            $("#explosion3").remove();
            window.clearInterval(explosionTime3);
            explosionTime3 = null;
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

    function energy() {
		if (game.currentEnergy === 3) {
			$("#energy").css("background-image", "url(./assets/images/energy3.png)");
		}
		if (game.currentEnergy === 2) {
			$("#energy").css("background-image", "url(./assets/images/energy2.png)");
		}
		if (game.currentEnergy === 1) {
			$("#energy").css("background-image", "url(./assets/images/energy1.png)");
		}
		if (game.currentEnergy === 0) {
			$("#energy").css("background-image", "url(./assets/images/energy0.png)");
            gameOver();
        }
	}
    function scoreboard() {
        var space = "&nbsp;&nbsp;&nbsp;"
        $("#scoreboard").html(`<h2> Pontos: ${game.scores} ${space} Salvos: ${game.saved} ${space} Perdidos: ${game.lost} </h2>`);
    }



    function gameOver() {
        game.endOfTheGame = true;
        music.pause();
        soundGameOver.play();
        
        window.clearInterval(game.timer);
        game.timer = null;
        
        $("#player").remove();
        $("#friend").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#explosion1").remove();
        $("#explosion2").remove();
        $("#shoot").remove();
        
        $("#backgroundGame").append("<div id='end'></div>");
        $("#end").html(`
        <div id='separate'>
            <h1>Game Over</h1>
            <p>Sua pontuação foi: ${game.scores} </p>
            <div id='restart' onClick='restartGame()'>
                <h3>Jogar Novamente</h3>
            </div>
        </div>`
        );
    }
}

function restartGame() {
    soundGameOver.pause();
    $("#end").remove();
    start();
}