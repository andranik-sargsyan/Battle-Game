let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext("2d");

let imgPlayer = document.getElementById("img-player");

let player = {
    x: canvas.width / 2,
    y: canvas.height,
    angle: Math.PI / 2,
    radius: 25,
    movingKey: undefined,
    speed: 3,
    turnRate: 3,
    bulletSpeed: 8,
    bulletRadius: 5,
    bullets: []
};

player.y -= player.radius + 15;

let enemyTypes = [
    {
        hp: 1,
        radius: 25,
        class: "img-enemy-light",
        src: "pics/enemy_light.gif",
        half: 35
    },
    {
        hp: 2,
        radius: 30,
        class: "img-enemy-heavy",
        src: "pics/enemy_heavy.gif",
        half: 40
    },
    {
        hp: 4,
        radius: 40,
        class: "img-enemy-boss",
        src: "pics/enemy_boss.gif",
        half: 45
    }
];
let enemies = [];

for (var i = 1; i <= 4; i++) {
    let enemyType = enemyTypes[getRandomInt(3)];

    let enemy = {
        x: i * canvas.width / 5,
        y: enemyType.radius,
        angle: (5 + getRandomInt(3)) * Math.PI / 4,
        radius: enemyType.radius,
        speed: 1,
        bullets: [],
        hp: enemyType.hp,
        image: document.createElement("img"),
        half: enemyType.half
    };

    enemy.image.src = enemyType.src;
    enemy.image.classList.add(enemyType.class);
    enemy.image.style.left = `${canvas.offsetLeft + enemy.x - enemy.half}px`;
    enemy.image.style.top = `${canvas.offsetTop + enemy.y - enemy.half}px`;
    document.body.appendChild(enemy.image);

    enemies.push(enemy);
}

function updatePlayer() {
    switch (player.movingKey) {
        //case "ArrowUp":
        case "w":
            player.x += player.speed * Math.cos(player.angle);
            player.y -= player.speed * Math.sin(player.angle);
            break;
        //case "ArrowDown":
        case "s":
            player.x -= player.speed * Math.cos(player.angle);
            player.y += player.speed * Math.sin(player.angle);
            break;
        //case "ArrowLeft":
        case "a":
            player.angle += player.turnRate * Math.PI / 180;
            break;
        //case "ArrowRight":
        case "d":
            player.angle -= player.turnRate * Math.PI / 180;
            break;
        case "q":
            player.x -= player.speed * Math.sin(Math.PI - player.angle);
            player.y += player.speed * Math.cos(Math.PI - player.angle);
            break;
        case "e":
            player.x += player.speed * Math.sin(Math.PI - player.angle);
            player.y -= player.speed * Math.cos(Math.PI - player.angle);
            break;
        default:
            break;
    }
}

function updateEnemies() {
    for (let enemy of enemies) {
        enemy.x += enemy.speed * Math.cos(enemy.angle);
        enemy.y -= enemy.speed * Math.sin(enemy.angle);

        if (enemy.x < 0 || enemy.x > canvas.width || enemy.y < 0 || enemy.y > canvas.height) {
            enemy.angle = getRandomInt(Math.PI * 360) / 360;
        }

        if (getRandomInt(150) == 0) {
            enemy.bullets.push({
                x: enemy.x + (enemy.radius + player.bulletRadius + 10) * Math.cos(enemy.angle),
                y: enemy.y - (enemy.radius + player.bulletRadius + 10) * Math.sin(enemy.angle),
                dx: player.bulletSpeed * Math.cos(enemy.angle),
                dy: player.bulletSpeed * Math.sin(enemy.angle),
                radius: player.bulletRadius
            });
        }
    }
}

function updatePlayerBullets() {
    for (let bullet of player.bullets) {
        bullet.x += bullet.dx;
        bullet.y -= bullet.dy;
    }

    for (let bullet of player.bullets) {
        for (let enemy of enemies) {
            if (!bullet.hit && (bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2 <= enemy.radius ** 2) {
                enemy.hp--;
                bullet.hit = true;
            }
        }
    }

    player.bullets = player.bullets.filter(b => !b.hit && b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height);

    for (let enemy of enemies) {
        if (enemy.hp <= 0) {
            enemy.image.remove();
        }
    }

    enemies = enemies.filter(e => e.hp > 0);
}

function updateEnemyBullets() {
    for (let enemy of enemies) {
        for (let bullet of enemy.bullets) {
            bullet.x += bullet.dx;
            bullet.y -= bullet.dy;
        }

        enemy.bullets = enemy.bullets.filter(b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height);
    }
}

function updateBullets() {
    updatePlayerBullets();
    updateEnemyBullets();
}

function update() {
    updatePlayer();
    updateEnemies();
    updateBullets();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    //ctx.beginPath();
    //ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    //ctx.stroke();
    //ctx.fillStyle = "lightgreen";
    //ctx.fill();

    //ctx.beginPath();
    //ctx.moveTo(player.x, player.y);
    //ctx.lineTo(player.x + (player.radius + 10) * Math.cos(player.angle), player.y - (player.radius + 10) * Math.sin(player.angle));
    //ctx.stroke();

    imgPlayer.style.left = `${canvas.offsetLeft + player.x - 40}px`;
    imgPlayer.style.top = `${canvas.offsetTop + player.y - 40}px`;
    imgPlayer.style.transform = `rotate(${-player.angle * 180 / Math.PI}deg)`;
}

function drawEnemies() {
    for (let enemy of enemies) {
        //ctx.beginPath();
        //ctx.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
        //ctx.stroke();
        //ctx.fillStyle = "orange";
        //ctx.fill();

        //ctx.beginPath();
        //ctx.moveTo(enemy.x, enemy.y);
        //ctx.lineTo(enemy.x + (enemy.radius + 10) * Math.cos(enemy.angle), enemy.y - (enemy.radius + 10) * Math.sin(enemy.angle));
        //ctx.stroke();

        enemy.image.style.left = `${canvas.offsetLeft + enemy.x - enemy.half}px`;
        enemy.image.style.top = `${canvas.offsetTop + enemy.y - enemy.half}px`;
    }
}

function drawPlayerBullets() {
    for (let bullet of player.bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
    }
}

function drawEnemyBullets() {
    for (let enemy of enemies) {
        for (let bullet of enemy.bullets) {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        }
    }
}

function drawBullets() {
    drawPlayerBullets();
    drawEnemyBullets();
}

function draw() {
    clear();
    drawPlayer();
    drawEnemies();
    drawBullets();
}

function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function playSound(source) {
    let element = document.getElementById(`sound-${source}`);
    element.pause();
    element.currentTime = 0;
    element.play();
}

loop();

document.addEventListener("keydown", e => {
    switch (e.key) {
        //case "ArrowUp":
        //case "ArrowDown":
        //case "ArrowLeft":
        //case "ArrowRight":
        case "w":
        case "s":
        case "a":
        case "d":
        case "q":
        case "e":
            player.movingKey = e.key;
            break;
        case "f":
            //case " ":
            let angle = player.angle - Math.atan((player.radius - 6) / (player.radius + player.bulletRadius + 10));
            let diagonal = Math.sqrt((player.radius - 6) ** 2 + (player.radius + player.bulletRadius + 10) ** 2);

            player.bullets.push({
                x: player.x + diagonal * Math.cos(angle),
                y: player.y - diagonal * Math.sin(angle),
                dx: player.bulletSpeed * Math.cos(player.angle),
                dy: player.bulletSpeed * Math.sin(player.angle),
                radius: player.bulletRadius
            });

            playSound("shoot");
            break;
        default:
            break;
    }
});

document.addEventListener("keyup", e => {
    switch (e.key) {
        //case "ArrowUp":
        //case "ArrowDown":
        //case "ArrowLeft":
        //case "ArrowRight":
        case "w":
        case "s":
        case "a":
        case "d":
        case "q":
        case "e":
            player.movingKey = undefined;
            break;
        default:
            break;
    }
});