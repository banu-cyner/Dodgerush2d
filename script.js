// =====================================================
// URL GOOGLE APPS SCRIPT
// =====================================================

const SCRIPT_URL =
    "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DISINI";


// =====================================================
// VARIABEL GAME
// =====================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player;

let obstacles = [];

let score = 0;

let gameRunning = false;

let gameLoopId;

let obstacleTimer = 0;

let gameSpeed = 3;

let keys = {
    left: false,
    right: false
};

let username = "";
let whatsapp = "";


// =====================================================
// UKURAN CANVAS
// =====================================================

function resizeCanvas() {

    canvas.width = Math.min(window.innerWidth * 0.95, 500);

    canvas.height = Math.min(window.innerHeight * 0.75, 700);
}

window.addEventListener("resize", resizeCanvas);


// =====================================================
// START GAME
// =====================================================

function startGame() {

    username =
        document.getElementById("username").value.trim();

    whatsapp =
        document.getElementById("whatsapp").value.trim();


    // VALIDASI USERNAME

    if (username.length < 3) {

        document.getElementById("message").innerText =
            "Username minimal 3 karakter!";

        return;
    }


    // VALIDASI NOMOR WA

    if (!/^[0-9]{10,15}$/.test(whatsapp)) {

        document.getElementById("message").innerText =
            "Nomor WhatsApp harus 10-15 digit!";

        return;
    }


    // RESET

    score = 0;

    obstacles = [];

    gameSpeed = 3;

    obstacleTimer = 0;

    gameRunning = true;


    document.getElementById("message").innerText = "";

    document.getElementById("playerName").innerText =
        username;

    document.getElementById("score").innerText =
        score;


    document.getElementById("menu")
        .classList.add("hidden");

    document.getElementById("gameOver")
        .classList.add("hidden");

    document.getElementById("leaderboard")
        .classList.add("hidden");

    document.getElementById("gameScreen")
        .classList.remove("hidden");


    resizeCanvas();


    // PLAYER

    player = {

        x: canvas.width / 2 - 20,

        y: canvas.height - 80,

        width: 40,

        height: 40,

        speed: 6

    };


    gameLoop();

}


// =====================================================
// GAME LOOP
// =====================================================

function gameLoop() {

    if (!gameRunning) return;


    update();

    draw();


    gameLoopId = requestAnimationFrame(gameLoop);
}


// =====================================================
// UPDATE
// =====================================================

function update() {


    // GERAK KIRI

    if (keys.left) {

        player.x -= player.speed;

    }


    // GERAK KANAN

    if (keys.right) {

        player.x += player.speed;

    }


    // BATAS KIRI

    if (player.x < 0) {

        player.x = 0;

    }


    // BATAS KANAN

    if (player.x + player.width > canvas.width) {

        player.x =
            canvas.width - player.width;

    }


    // BUAT RINTANGAN

    obstacleTimer++;


    if (obstacleTimer > 45) {

        createObstacle();

        obstacleTimer = 0;

    }


    // GERAK RINTANGAN

    obstacles.forEach(obstacle => {

        obstacle.y += obstacle.speed;

    });


    // HAPUS RINTANGAN

    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.y < canvas.height + 100
        );


    // COLLISION

    for (let obstacle of obstacles) {

        if (collision(player, obstacle)) {

            endGame();

            return;
        }

    }


    // SCORE

    score += 1;

    document.getElementById("score").innerText =
        score;


    // SEMAKIN LAMA SEMAKIN CEPAT

    if (score % 500 === 0) {

        gameSpeed += 0.5;

    }

}


// =====================================================
// CREATE OBSTACLE
// =====================================================

function createObstacle() {

    const size = 35 + Math.random() * 25;

    const x =
        Math.random() *
        (canvas.width - size);


    obstacles.push({

        x: x,

        y: -size,

        width: size,

        height: size,

        speed:
            gameSpeed +
            Math.random() * 2

    });

}


// =====================================================
// COLLISION
// =====================================================

function collision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


// =====================================================
// DRAW
// =====================================================

function draw() {


    // BACKGROUND

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // BACKGROUND GRID

    ctx.strokeStyle = "#182438";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < canvas.width;
        x += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, canvas.height);

        ctx.stroke();

    }


    for (
        let y = 0;
        y < canvas.height;
        y += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(canvas.width, y);

        ctx.stroke();

    }


    // PLAYER

    ctx.fillStyle = "#3498db";

    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );


    // PLAYER DETAIL

    ctx.fillStyle = "white";

    ctx.fillRect(

        player.x + 8,

        player.y + 8,

        8,

        8

    );

    ctx.fillRect(

        player.x + 24,

        player.y + 8,

        8,

        8

    );


    // OBSTACLES

    obstacles.forEach(obstacle => {

        ctx.fillStyle = "#e74c3c";

        ctx.fillRect(

            obstacle.x,

            obstacle.y,

            obstacle.width,

            obstacle.height

        );

    });

}


// =====================================================
// KEYBOARD
// =====================================================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a") {

        keys.left = true;

    }


    if (event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d") {

        keys.right = true;

    }

});


document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a") {

        keys.left = false;

    }


    if (event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d") {

        keys.right = false;

    }

});


// =====================================================
// TOMBOL HP
// =====================================================

const leftBtn =
    document.getElementById("leftBtn");

const rightBtn =
    document.getElementById("rightBtn");


leftBtn.addEventListener("touchstart", function(e) {

    e.preventDefault();

    keys.left = true;

});

leftBtn.addEventListener("touchend", function(e) {

    e.preventDefault();

    keys.left = false;

});


rightBtn.addEventListener("touchstart", function(e) {

    e.preventDefault();

    keys.right = true;

});

rightBtn.addEventListener("touchend", function(e) {

    e.preventDefault();

    keys.right = false;

});


// Untuk PC

leftBtn.addEventListener("mousedown", () => {
    keys.left = true;
});

leftBtn.addEventListener("mouseup", () => {
    keys.left = false;
});

rightBtn.addEventListener("mousedown", () => {
    keys.right = true;
});

rightBtn.addEventListener("mouseup", () => {
    keys.right = false;
});


// =====================================================
// GAME OVER
// =====================================================

function endGame() {

    gameRunning = false;

    cancelAnimationFrame(gameLoopId);


    document.getElementById("gameScreen")
        .classList.add("hidden");


    document.getElementById("gameOver")
        .classList.remove("hidden");


    document.getElementById("finalUsername")
        .innerText = username;


    document.getElementById("finalScore")
        .innerText = score;


    saveScore();

}


// =====================================================
// SIMPAN SKOR KE GOOGLE SHEETS
// =====================================================

function saveScore() {

    const status =
        document.getElementById("saveStatus");

    status.innerText =
        "⏳ Menyimpan skor...";


    const data = {

        username: username,

        whatsapp: whatsapp,

        score: score

    };


    fetch(SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        body: JSON.stringify(data)

    })

    .then(() => {

        status.innerText =
            "✅ Skor berhasil disimpan!";

    })

    .catch(error => {

        console.error(error);

        status.innerText =
            "❌ Gagal menyimpan skor.";

    });

}


// =====================================================
// LEADERBOARD
// =====================================================

function showLeaderboard() {

    document.getElementById("menu")
        .classList.add("hidden");

    document.getElementById("gameOver")
        .classList.add("hidden");

    document.getElementById("gameScreen")
        .classList.add("hidden");

    document.getElementById("leaderboard")
        .classList.remove("hidden");


    document.getElementById("leaderboardData")
        .innerHTML =
        "<p>⏳ Memuat leaderboard...</p>";


    loadLeaderboard();

}


// =====================================================
// LOAD LEADERBOARD
// =====================================================

function loadLeaderboard() {

    const callbackName =
        "leaderboardCallback_" +
        Date.now();


    window[callbackName] = function(data) {

        displayLeaderboard(data);

        delete window[callbackName];

        script.remove();

    };


    const script =
        document.createElement("script");


    script.src =
        SCRIPT_URL +
        "?action=leaderboard&callback=" +
        callbackName;


    document.body.appendChild(script);

}


// =====================================================
// DISPLAY LEADERBOARD
// =====================================================

function displayLeaderboard(data) {

    const container =
        document.getElementById("leaderboardData");


    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>Belum ada data pemain.</p>";

        return;
    }


    let html = "";


    data.forEach((player, index) => {

        let medal = index + 1;


        if (index === 0) medal = "🥇";

        if (index === 1) medal = "🥈";

        if (index === 2) medal = "🥉";


        html += `

            <div class="rank-row">

                <div class="rank">
                    ${medal}
                </div>

                <div class="player">
                    ${escapeHTML(player.username)}
                </div>

                <div class="points">
                    ${player.score}
                </div>

            </div>

        `;

    });


    container.innerHTML = html;

}


// =====================================================
// MENCEGAH HTML INJECTION
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =====================================================
// KEMBALI KE MENU
// =====================================================

function backToMenu() {

    gameRunning = false;


    document.getElementById("gameScreen")
        .classList.add("hidden");

    document.getElementById("gameOver")
        .classList.add("hidden");

    document.getElementById("leaderboard")
        .classList.add("hidden");

    document.getElementById("menu")
        .classList.remove("hidden");

      }
