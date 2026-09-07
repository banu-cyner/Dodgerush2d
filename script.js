/* =====================================================
   DODGE RUSH 2D
   ===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT
   ===================================================== */

/*
   GANTI BAGIAN INI DENGAN URL GOOGLE APPS SCRIPT KAMU.

   Contoh:

   const SCRIPT_URL =
   "https://script.google.com/macros/s/XXXXXXXX/exec";
*/

const SCRIPT_URL =
    "MASUKKAN_URL_APPS_SCRIPT_DI_SINI";



/* =====================================================
   ELEMENT HTML
   ===================================================== */

const menu =
    document.getElementById("menu");

const gameScreen =
    document.getElementById("gameScreen");

const gameOver =
    document.getElementById("gameOver");

const leaderboard =
    document.getElementById("leaderboard");

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const usernameInput =
    document.getElementById("username");

const whatsappInput =
    document.getElementById("whatsapp");

const message =
    document.getElementById("message");

const playerName =
    document.getElementById("playerName");

const scoreText =
    document.getElementById("score");

const finalUsername =
    document.getElementById("finalUsername");

const finalScore =
    document.getElementById("finalScore");

const saveStatus =
    document.getElementById("saveStatus");

const leaderboardData =
    document.getElementById("leaderboardData");



/* =====================================================
   VARIABEL GAME
   ===================================================== */

let player = null;

let obstacles = [];

let score = 0;

let gameRunning = false;

let animationId = null;

let obstacleTimer = 0;

let gameSpeed = 3;

let username = "";

let whatsapp = "";


let keys = {

    left: false,

    right: false

};



/* =====================================================
   UKURAN CANVAS
   ===================================================== */

function resizeCanvas() {

    const width =
        Math.min(
            window.innerWidth * 0.94,
            500
        );


    const height =
        Math.min(
            window.innerHeight * 0.68,
            650
        );


    canvas.width = Math.max(
        300,
        Math.floor(width)
    );


    canvas.height = Math.max(
        400,
        Math.floor(height)
    );
}


window.addEventListener(
    "resize",
    resizeCanvas
);



/* =====================================================
   MULAI GAME
   ===================================================== */

function startGame() {

    username =
        usernameInput.value.trim();


    whatsapp =
        whatsappInput.value.trim();


    /* VALIDASI USERNAME */

    if (username.length < 3) {

        message.innerText =
            "Username minimal 3 karakter!";

        usernameInput.focus();

        return;
    }


    /* VALIDASI NOMOR WA */

    if (!/^[0-9]{10,15}$/.test(whatsapp)) {

        message.innerText =
            "Nomor WhatsApp harus 10-15 digit!";

        whatsappInput.focus();

        return;
    }


    message.innerText = "";


    /* SIAPKAN CANVAS */

    resizeCanvas();


    /* RESET GAME */

    score = 0;

    obstacles = [];

    obstacleTimer = 0;

    gameSpeed = 3;

    gameRunning = true;


    /* BUAT PLAYER */

    player = {

        x:
            canvas.width / 2 - 20,

        y:
            canvas.height - 65,

        width: 40,

        height: 40,

        speed: 6

    };


    /* UPDATE UI */

    playerName.innerText =
        username;

    scoreText.innerText =
        "0";


    /* PINDAH KE GAME */

    menu.classList.add(
        "hidden"
    );

    gameOver.classList.add(
        "hidden"
    );

    leaderboard.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    /* HENTIKAN LOOP LAMA */

    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );

    }


    /* JALANKAN GAME */

    gameLoop();
}



/* =====================================================
   GAME LOOP
   ===================================================== */

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    update();

    draw();


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}



/* =====================================================
   UPDATE GAME
   ===================================================== */

function update() {


    /* GERAK KIRI */

    if (keys.left) {

        player.x -=
            player.speed;

    }


    /* GERAK KANAN */

    if (keys.right) {

        player.x +=
            player.speed;

    }


    /* BATAS KIRI */

    if (player.x < 0) {

        player.x = 0;

    }


    /* BATAS KANAN */

    if (
        player.x +
        player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }


    /* TIMER RINTANGAN */

    obstacleTimer++;


    if (obstacleTimer >= 45) {

        createObstacle();

        obstacleTimer = 0;

    }


    /* GERAKKAN RINTANGAN */

    for (
        let i = 0;
        i < obstacles.length;
        i++
    ) {

        obstacles[i].y +=
            obstacles[i].speed;

    }


    /* HAPUS RINTANGAN */

    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.y <
                canvas.height + 100
        );


    /* CEK TABRAKAN */

    for (
        let i = 0;
        i < obstacles.length;
        i++
    ) {

        if (
            checkCollision(
                player,
                obstacles[i]
            )
        ) {

            endGame();

            return;

        }

    }


    /* TAMBAH SCORE */

    score++;


    scoreText.innerText =
        score;


    /* TAMBAH KECEPATAN */

    if (
        score > 0 &&
        score % 500 === 0
    ) {

        gameSpeed += 0.4;

    }

}



/* =====================================================
   BUAT RINTANGAN
   ===================================================== */

function createObstacle() {

    const size =
        35 +
        Math.random() * 25;


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



/* =====================================================
   COLLISION
   ===================================================== */

function checkCollision(
    a,
    b
) {

    return (

        a.x <
        b.x + b.width

        &&

        a.x + a.width >
        b.x

        &&

        a.y <
        b.y + b.height

        &&

        a.y + a.height >
        b.y

    );

}



/* =====================================================
   GAMBAR GAME
   ===================================================== */

function draw() {


    /* BACKGROUND */

    ctx.fillStyle =
        "#09111e";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* GRID */

    ctx.strokeStyle =
        "#162337";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < canvas.width;
        x += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y < canvas.height;
        y += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }


    /* PLAYER */

    if (player) {

        drawPlayer();

    }


    /* RINTANGAN */

    for (
        let i = 0;
        i < obstacles.length;
        i++
    ) {

        drawObstacle(
            obstacles[i]
        );

    }

}



/* =====================================================
   GAMBAR PLAYER
   ===================================================== */

function drawPlayer() {

    /* BADAN */

    ctx.fillStyle =
        "#3498db";


    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );


    /* BAGIAN ATAS */

    ctx.fillStyle =
        "#5dade2";


    ctx.fillRect(

        player.x + 8,

        player.y - 6,

        24,

        8

    );


    /* MATA */

    ctx.fillStyle =
        "white";


    ctx.fillRect(

        player.x + 8,

        player.y + 10,

        8,

        8

    );


    ctx.fillRect(

        player.x + 24,

        player.y + 10,

        8,

        8

    );


    /* MESIN */

    ctx.fillStyle =
        "#f1c40f";


    ctx.fillRect(

        player.x + 13,

        player.y + 30,

        14,

        8

    );

}



/* =====================================================
   GAMBAR RINTANGAN
   ===================================================== */

function drawObstacle(
    obstacle
) {

    ctx.fillStyle =
        "#e74c3c";


    ctx.fillRect(

        obstacle.x,

        obstacle.y,

        obstacle.width,

        obstacle.height

    );


    /* DETAIL */

    ctx.fillStyle =
        "#ff7675";


    ctx.fillRect(

        obstacle.x + 6,

        obstacle.y + 6,

        obstacle.width - 12,

        5

    );

}



/* =====================================================
   KEYBOARD PC
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            keys.left = true;

            event.preventDefault();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            keys.right = true;

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            keys.left = false;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            keys.right = false;

        }

    }
);



/* =====================================================
   KONTROL HP
   ===================================================== */

const leftBtn =
    document.getElementById(
        "leftBtn"
    );

const rightBtn =
    document.getElementById(
        "rightBtn"
    );



/* TOMBOL KIRI */

function startLeft(e) {

    e.preventDefault();

    keys.left = true;

}


function stopLeft(e) {

    e.preventDefault();

    keys.left = false;

}



/* TOMBOL KANAN */

function startRight(e) {

    e.preventDefault();

    keys.right = true;

}


function stopRight(e) {

    e.preventDefault();

    keys.right = false;

}



/* TOUCH */

leftBtn.addEventListener(
    "touchstart",
    startLeft,
    { passive: false }
);

leftBtn.addEventListener(
    "touchend",
    stopLeft,
    { passive: false }
);

leftBtn.addEventListener(
    "touchcancel",
    stopLeft,
    { passive: false }
);


rightBtn.addEventListener(
    "touchstart",
    startRight,
    { passive: false }
);

rightBtn.addEventListener(
    "touchend",
    stopRight,
    { passive: false }
);

rightBtn.addEventListener(
    "touchcancel",
    stopRight,
    { passive: false }
);



/* MOUSE */

leftBtn.addEventListener(
    "mousedown",
    startLeft
);

leftBtn.addEventListener(
    "mouseup",
    stopLeft
);

leftBtn.addEventListener(
    "mouseleave",
    stopLeft
);


rightBtn.addEventListener(
    "mousedown",
    startRight
);

rightBtn.addEventListener(
    "mouseup",
    stopRight
);

rightBtn.addEventListener(
    "mouseleave",
    stopRight
);



/* =====================================================
   GAME OVER
   ===================================================== */

function endGame() {

    if (!gameRunning) {

        return;

    }


    gameRunning = false;


    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );

    }


    /* TAMPILKAN GAME OVER */

    gameScreen.classList.add(
        "hidden"
    );

    gameOver.classList.remove(
        "hidden"
    );


    finalUsername.innerText =
        username;


    finalScore.innerText =
        score;


    saveStatus.innerText =
        "⏳ Menyimpan skor...";


    /* SIMPAN KE GOOGLE SHEETS */

    saveScore();

}



/* =====================================================
   SIMPAN SCORE
   ===================================================== */

function saveScore() {

    /* CEK URL */

    if (
        SCRIPT_URL ===
        "MASUKKAN_URL_APPS_SCRIPT_DI_SINI"
    ) {

        saveStatus.innerText =
            "⚠️ Google Sheets belum terhubung.";

        return;

    }


    const data = {

        username:
            username,

        whatsapp:
            whatsapp,

        score:
            score

    };


    fetch(
        SCRIPT_URL,
        {

            method: "POST",

            mode: "no-cors",

            body:
                JSON.stringify(data)

        }
    )

    .then(
        function() {

            saveStatus.innerText =
                "✅ Skor tersimpan!";

        }
    )

    .catch(
        function(error) {

            console.error(error);

            saveStatus.innerText =
                "❌ Gagal menyimpan skor.";

        }
    );

}



/* =====================================================
   LEADERBOARD
   ===================================================== */

function showLeaderboard() {

    menu.classList.add(
        "hidden"
    );

    gameScreen.classList.add(
        "hidden"
    );

    gameOver.classList.add(
        "hidden"
    );

    leaderboard.classList.remove(
        "hidden"
    );


    leaderboardData.innerHTML =
        "<p>⏳ Memuat leaderboard...</p>";


    loadLeaderboard();

}



/* =====================================================
   LOAD LEADERBOARD
   ===================================================== */

function loadLeaderboard() {

    if (
        SCRIPT_URL ===
        "MASUKKAN_URL_APPS_SCRIPT_DI_SINI"
    ) {

        leaderboardData.innerHTML =
            `
            <p class="empty">
                ⚠️ Google Sheets belum terhubung.
            </p>
            `;

        return;

    }


    const callbackName =
        "leaderboard_" +
        Date.now();


    window[callbackName] =
        function(data) {

            displayLeaderboard(
                data
            );


            delete window[
                callbackName
            ];

            if (script) {

                script.remove();

            }

        };


    const script =
        document.createElement(
            "script"
        );


    script.src =
        SCRIPT_URL +
        "?action=leaderboard&callback=" +
        callbackName;


    script.onerror =
        function() {

            leaderboardData.innerHTML =
                `
                <p class="empty">
                    ❌ Tidak dapat mengambil data leaderboard.
                </p>
                `;

            delete window[
                callbackName
            ];

            script.remove();

        };


    document.body.appendChild(
        script
    );

}



/* =====================================================
   TAMPILKAN LEADERBOARD
   ===================================================== */

function displayLeaderboard(
    data
) {

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        leaderboardData.innerHTML =
            `
            <p class="empty">
                Belum ada pemain.
            </p>
            `;

        return;

    }


    let html = "";


    data.forEach(
        function(player, index) {

            let rank =
                index + 1;


            let medal =
                rank;


            if (rank === 1) {

                medal = "🥇";

            }

            else if (rank === 2) {

                medal = "🥈";

            }

            else if (rank === 3) {

                medal = "🥉";

            }


            html +=
                `
                <div class="rank-row">

                    <div class="rank">
                        ${medal}
                    </div>

                    <div class="player">
                        ${escapeHTML(
                            String(
                                player.username
                            )
                        )}
                    </div>

                    <div class="points">
                        ${Number(
                            player.score
                        ).toLocaleString("id-ID")}
                    </div>

                </div>
                `;

        }
    );


    leaderboardData.innerHTML =
        html;

}



/* =====================================================
   KEAMANAN USERNAME
   ===================================================== */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}



/* =====================================================
   MAIN LAGI
   ===================================================== */

function retryGame() {

    startGame();

}



/* =====================================================
   MENU UTAMA
   ===================================================== */

function backToMenu() {

    gameRunning = false;


    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );

    }


    gameScreen.classList.add(
        "hidden"
    );

    gameOver.classList.add(
        "hidden"
    );

    leaderboard.classList.add(
        "hidden"
    );

    menu.classList.remove(
        "hidden"
    );

}



/* =====================================================
   EVENT BUTTON
   ===================================================== */

document
    .getElementById("startBtn")
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById("leaderboardBtn")
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById("retryBtn")
    .addEventListener(
        "click",
        retryGame
    );


document
    .getElementById(
        "gameOverLeaderboardBtn"
    )
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById("homeBtn")
    .addEventListener(
        "click",
        backToMenu
    );


document
    .getElementById(
        "leaderboardHomeBtn"
    )
    .addEventListener(
        "click",
        backToMenu
    );


document
    .getElementById(
        "refreshLeaderboardBtn"
    )
    .addEventListener(
        "click",
        loadLeaderboard
    );



/* =====================================================
   ENTER UNTUK MULAI
   ===================================================== */

usernameInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            startGame();

        }

    }
);


whatsappInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            startGame();

        }

    }
);



/* =====================================================
   INISIALISASI
   ===================================================== */

resizeCanvas();
