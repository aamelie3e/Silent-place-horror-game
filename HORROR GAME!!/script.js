
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let cameraX = 0;
const keys = {};

const player = {
    x: 0,
    speed: 220,
    moving: false,
    facing: 1
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

window.addEventListener("blur", () => {
    Object.keys(keys).forEach(k => keys[k] = false);
});

function drawHallway() {
    // Background
    ctx.fillStyle = "#111414";
    ctx.fillRect(0, 0, width, height);

    // Ceiling
    const ceiling = ctx.createLinearGradient(0, 0, 0, height * 0.25);
    ceiling.addColorStop(0, "#080a0a");
    ceiling.addColorStop(1, "#303333");

    ctx.fillStyle = ceiling;
    ctx.fillRect(0, 0, width, height * 0.25);

    // Back wall
    const wall = ctx.createLinearGradient(0, 0, 0, height * 0.75);
    wall.addColorStop(0, "#393d3c");
    wall.addColorStop(1, "#171a1a");

    ctx.fillStyle = wall;
    ctx.fillRect(0, height * 0.25, width, height * 0.5);

    // Floor
    const floor = ctx.createLinearGradient(0, height * 0.65, 0, height);
    floor.addColorStop(0, "#444746");
    floor.addColorStop(1, "#101212");

    ctx.fillStyle = floor;
    ctx.fillRect(0, height * 0.65, width, height * 0.35);

    // Perspective corridor lines
    ctx.strokeStyle = "rgba(0,0,0,0.65)";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(0, height * 0.25);
    ctx.lineTo(width * 0.5, height * 0.43);
    ctx.lineTo(width, height * 0.25);

    ctx.moveTo(0, height * 0.85);
    ctx.lineTo(width * 0.5, height * 0.62);
    ctx.lineTo(width, height * 0.85);
    ctx.stroke();

    // Wall panels
    for (let x = -100; x < width + 100; x += 180) {
        ctx.strokeStyle = "#202424";
        ctx.lineWidth = 4;

        ctx.strokeRect(
            x - cameraX % 180,
            height * 0.3,
            145,
            height * 0.34
        );
    }

    // Central doorway
    const doorWidth = width * 0.19;
    const doorHeight = height * 0.39;
    const doorX = width / 2 - doorWidth / 2;
    const doorY = height * 0.25;

    ctx.fillStyle = "#030404";
    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

    ctx.strokeStyle = "#494b48";
    ctx.lineWidth = 8;
    ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);

    // Door frame shadow
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(doorX - 12, doorY, 12, doorHeight);
    ctx.fillRect(doorX + doorWidth, doorY, 12, doorHeight);

    // Ceiling lights
    ctx.fillStyle = "#a5aaa4";
    ctx.fillRect(width * 0.42, height * 0.12, width * 0.16, 7);

    // Weak light
    const light = ctx.createRadialGradient(
        width / 2,
        height * 0.42,
        5,
        width / 2,
        height * 0.42,
        width * 0.5
    );

    light.addColorStop(0, "rgba(165,175,165,0.13)");
    light.addColorStop(1, "rgba(165,175,165,0)");

    ctx.fillStyle = light;
    ctx.fillRect(0, 0, width, height);
}

function drawFog(time) {
    for (let i = 0; i < 8; i++) {
        const x = width / 2 + Math.sin(time * 0.0003 + i) * width * 0.35;
        const y = height * (0.42 + i * 0.055);

        const fog = ctx.createRadialGradient(x, y, 5, x, y, 260);

        fog.addColorStop(0, "rgba(190,195,192,0.15)");
        fog.addColorStop(1, "rgba(190,195,192,0)");

        ctx.fillStyle = fog;
        ctx.fillRect(x - 260, y - 260, 520, 520);
    }
}

function drawPlayer(time) {
    const x = width / 2;
    const ground = height * 0.83;

    const movement = player.moving
        ? Math.sin(time * 0.015) * 4
        : 0;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.ellipse(x, ground, 25, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111313";
    ctx.fillRect(x - 12, ground - 42 + movement, 10, 42);
    ctx.fillRect(x + 3, ground - 42 - movement, 10, 42);

    ctx.fillStyle = "#242827";
    ctx.fillRect(x - 17, ground - 95, 34, 55);

    ctx.fillStyle = "#202323";
    ctx.beginPath();
    ctx.arc(x, ground - 108, 13, 0, Math.PI * 2);
    ctx.fill();
}

let lastTime = 0;

function draw(time = 0) {
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    player.moving = false;

    if (keys["a"] || keys["arrowleft"]) {
        cameraX -= player.speed * delta;
        player.moving = true;
    }

    if (keys["d"] || keys["arrowright"]) {
        cameraX += player.speed * delta;
        player.moving = true;
    }

    drawHallway();
    drawFog(time);
    drawPlayer(time);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
