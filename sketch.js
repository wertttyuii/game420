let player;
let bullets = [];
let enemies = [];
let score = 0;
let gameTimer = 60; // 游戏时间，单位为秒

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  
  // 创建敌人
  for (let i = 0; i < 30; i++) {
    enemies.push(new Enemy());
  }
  
  // 设置倒计时
  setInterval(countdown, 1000);
}

function draw() {
  background(220);
  
  player.update();
  player.display();
  
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    
    // 检查子弹是否击中敌人
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(enemies[j])) {
        score += 10; // 击中敌人得分
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
    
    // 检查子弹是否超出屏幕
    if (bullets[i] && bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }
  
  // 更新并显示敌人
  for (let enemy of enemies) {
    enemy.update();
    enemy.display();
    
    // 检查敌人是否碰到玩家
    if (enemy.hits(player)) {
      gameOver(); // 游戏结束
    }
  }
  
  // 显示得分和剩余时间
  fill(0);
  text("Score: " + score, 30, 30);
  text("Time: " + gameTimer, 30, 60);
  
  // 检查游戏时间是否结束
  if (gameTimer <= 0 && enemies.length > 0) {
    gameOver(); // 游戏时间结束
  } else if (enemies.length === 0) {
    gameWin(); // 获得胜利
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.move(0, -15); // 向上移动
  } else if (keyCode === DOWN_ARROW) {
    player.move(0, 15); // 向下移动
  } else if (keyCode === LEFT_ARROW) {
    player.move(-15, 0); // 向左移动
  } else if (keyCode === RIGHT_ARROW) {
    player.move(15, 0); // 向右移动
  } else if (key === ' ') {
    bullets.push(new Bullet(player.x, player.y)); // 发射子弹
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    player.move(0, 0); // 停止上下移动
  } else if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    player.move(0, 0); // 停止左右移动
  }
}

function countdown() {
  if (gameTimer > 0) {
    gameTimer--;
  } else {
    gameOver(); // 游戏时间结束
  }
}

// 游戏结束函数
function gameOver() {
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  noLoop();
}

// 获胜函数
function gameWin() {
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("You Win!", width / 2, height / 2);
  noLoop();
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 5;
  }
  
  move(x, y) {
    this.x += x;
    this.y += y;
    
    // 限制玩家在屏幕内移动
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
  
  update() {
    // 更新玩家状态（例如动画等）
  }
  
  display() {
    // 绘制玩家（使用自定义的可爱造型）
    fill(255, 0, 0);
    ellipse(this.x, this.y, 50, 50);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
  }
  
  update() {
    this.x += this.speed;
  }
  
  display() {
    // 绘制子弹
    fill(0);
    ellipse(this.x, this.y, 10, 10);
  }
  
  offscreen() {
    return this.x > width;
  }
  
  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < 30; // 当子弹与敌人的距离小于一定值时，视为击中
  }
}

class Enemy {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(1, 3);
  }
  
  update() {
    // 更新敌人状态（例如动画等）
    this.x -= this.speed;
    
    // 当敌人超出屏幕时，重新生成在屏幕右侧
    if (this.x < 0) {
      this.x = width;
      this.y = random(height);
    }
  }
  
  display() {
    // 绘制敌人（使用特殊的造型）
    fill(0, 0, 255);
    rect(this.x, this.y, 30, 30);
  }
  
  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 30; // 当敌人与玩家的距离小于一定值时，视为碰撞
  }
}



