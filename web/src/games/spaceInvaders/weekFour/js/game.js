var game = new Phaser.Game(480, 320, Phaser.AUTO, 'gameDiv');

var player;
var playing = false;
var speed = 4;
var alienSpeed = 10;
var lives = 3;
var bullets;
var lazers;
var aliens;
var redAliens;
var bosses;
var created = false;
var move = true;
var moveCounter = 0;
var score = 0;
var livesText;
var level = 1;
var levelText;
var nextLevelText;
var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
var livingReds = [];
var alienMoveSpeed = 1;
var score = 0;
var keyIsUp = true;
var lazersLeft = 0;
var moveFrom = 0;

function createAliens(){
  if(level % 4 != 0){
    for(var y = moveFrom; y < 4; y++){
      for(var x = 0; x < 10; x++){
        var alien = aliens.create(x * 30, y * 20, 'spaceInvaderGreen');
        alien.anchor.setTo(0.5, 0.5);
        alien.checkWorldBounds = true;
      }
    }
    aliens.x = 10;
    aliens.y = 50;
    var tween = game.add.tween(aliens).to( {x: 200}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  }
}
function createRedAliens(){
  if(moveFrom > 0 && level % 4 != 0){
    for(var y = 0; y < moveFrom; y++){
      for(var x = 0; x < 10; x++){
        var redAlien = redAliens.create(x*30, y*20, 'spaceInvaderRed');
        redAlien.anchor.set(0.5, 0.5);
        redAlien.checkWorldBounds = true;
        redAlien.outOfBoundsKill = true;
      }
    }
  } 
  redAliens.x = 10;
  redAliens.y = 50;
  var redTween = game.add.tween(redAliens).to({x: 200}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
}
function createBoss(){
  if(level % 4 == 0){
    for(var x = 0; x < 10; x++){
      var boss = bosses.create(30*x, 25, 'spaceInvaderRed');
    }
    bosses.x = 10;
    bosses.y = 20;
    var bossTween = game.add.tween(bosses).to({x:200}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  }
}
function descend(){
  aliens.y += 10;
}
function startGame(){
  playing = true;
  createAliens();
  createRedAliens();
}
function fireBullet() {
  if(bullets.countLiving() == 0){
    bullet = bullets.getFirstExists(false);
    if(bullet){
      bullet.reset(player.x, player.y - 20);
      bullet.body.velocity.y = -400;
      //bulletTime = game.time.now + 200;
    }
  }
}
function fireLazer(){
  if(lazers.countLiving() == 0){
    lazer = lazers.getFirstExists(false);
    if(lazer){
      lazer.reset(player.x, player.y -400);
      lazer.body.velocity.y = -4000;
    }
    lazersLeft--;
    lazerIconText.setText('  = ' + lazersLeft);
  }
}
function gameOver(){
  playing = false;
  gameOverText.visible = true;
  game.input.onDown.addOnce(function(){
    location.reload(); 
  }, this);
}
function checkAliens(){
  if(aliens.countLiving() == 0 && redAliens.countLiving() == 0 && bosses.countLiving() == 0){
    playing = false;
    level++;
    if(level > 2){
      moveFrom = 1;
    }
    if(level == 2){
      cautionScreen.visible = true;
    }
    else if(level == 3){
      newEnemyScreen.visible = true;
    }
    else{
      nextLevelText.setText('Level: ' + level + '\n Click to continue');
      nextLevelText.visible = true;
    }
    game.input.onDown.addOnce(function(){
      cautionScreen.visible = false;
      newEnemyScreen.visible = false;
      nextLevelText.visible = false;
      shopScreen.visible = true;
      game.input.onDown.addOnce(function(){
        shopScreen.visible = false;
        createAliens();
        createRedAliens();
        createBoss();
        levelText.setText('Level: ' + level);
        playing = true;
      }, this);
    });
  }

}
function collisionHandler(bullet, alien) {
  bullet.kill();
  alien.kill();
  score += 10;
  scoreText.setText(' Score: ' + score);
  nextLevelText.setText('Level: ' + level + '\n Click to continue');
  checkAliens();
}
function lazerHitsAlien(lazer, alien){
  alien.kill();
  score += 10;
  scoreText.setText(' Score: ' + score);
  nextLevelText.setText('Level: ' + level + '\n Click to continue');
  checkAliens();
}
function enemyFires() {
  enemyBullet = enemyBullets.getFirstExists(false);
  livingEnemies.length = 0;
  aliens.forEachAlive(function(alien){
    livingEnemies.push(alien);
  });
  if(enemyBullet && livingEnemies.length > 0){
    var random = game.rnd.integerInRange(0, livingEnemies.length-1);
    var shooter = livingEnemies[random];
    enemyBullet.reset(shooter.body.x, shooter.body.y);
    game.physics.arcade.moveToObject(enemyBullet, player, 120);
    firingTimer = game.time.now + 2000;
  }
}
function redFires(){
  enemyBullet = enemyBullets.getFirstExists(false);
  livingReds.length = 0;
  redAliens.forEachAlive(function(redAlien){
    livingReds.push(redAlien);
  });
  if(enemyBullet && livingReds.length > 0){
    var random = game.rnd.integerInRange(0, livingReds.length-1);
    var shooter = livingReds[random];
    //enemyBullet.reset(shooter.body.x, shooter.body.y);
    //game.physics.arcade.moveToObject(enemyBullet, player, 120);
    game.physics.arcade.moveToObject(shooter, player, 120);
    firingTimer = game.time.now + 2000;
  }
}
function bossFire(){
  bossBullet = bossBullets.getFirstExists(false);
  livingEnemies.length = 0;
  bosses.forEachAlive(function(boss){
    livingEnemies.push(boss);
  });
  if(bossBullet && livingEnemies.length > 0){
    var random = game.rnd.integerInRange(0, livingEnemies.length-1);
    var shooter = livingEnemies[random];
    bossBullet.reset(shooter.body.x, shooter.body.y);
    //game.physics.arcade.moveToObject(enemyBullet, player, 120);
    bossBullet.body.velocity.set(150);
    firingTimer = game.time.now + 2000;
  }
  
}
function enemyHitsPlayer (player, enemyBullet) {
  enemyBullet.kill();
  lives--;
  livesText.setText('Lives: ' + lives);
  if(lives < 1){
    gameOver();
  }
  else{
    lifeLost();
  }
}
function lifeLost(){
  playing = false;
  player.visible = false;
  lifeLostText.visible = true;
  enemyBullets.forEachAlive(function(enemyBullet){
    enemyBullet.kill();
  });
  game.input.onDown.addOnce(function(){
    playing = true;
    firingTimer = game.time.now + 2000;
    lifeLostText.visible = false;
    player.visible = true
  }, this); 
}


game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
//game.state.add('win', winState);

game.state.start('boot');
