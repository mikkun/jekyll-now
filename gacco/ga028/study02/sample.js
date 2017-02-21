// sample.js : シューティングゲーム「EVADE AND DESTROY」
//
// See : http://mikkun.github.io/gacco/ga028/study02/
//
// Written by KUSANAGI Mitsuhisa <mikkun@mbg.nifty.com> / Date : 2017-02-21

"use strict";

var SCREEN_WIDTH = 320,
    SCREEN_HEIGHT = 480,
    BG_COLOR = "rgb(0, 0, 0)",
    FONT_FACE = "bold 12px monospace",
    FONT_COLOR = "rgb(255, 255, 255)",

    MAX_BG_IMAGE = 2,
    MAX_SHOT = 4,
    MIN_ENEMY = 4,
    MIN_BEAM = 0,

    MAX_LV = 12,
    MAX_SCORE = 100000000,

    WAIT = 15,
    THRESHOLD_SCORE = 5000,

    background = new Image(),
    sprite = new Image(),

    bg_image = {},
    bg_images = [],
    player = {},
    player_point,
    shot = {},
    shots = [],
    enemy = {},
    enemies = [],
    beam = {},
    beams = [],

    hi_score,
    valid_storage;

// オブジェクトを継承
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function setup() {
    var i;

    document.title = "EVADE AND DESTROY";
    document.getElementsByName("viewport")[0].content
        = "width=" + SCREEN_WIDTH;
    document.body.style.backgroundColor = BG_COLOR;

    screenWidth = SCREEN_WIDTH;
    screenHeight = SCREEN_HEIGHT;
    pbCanvas.width = SCREEN_WIDTH;
    pbCanvas.height = SCREEN_HEIGHT;
    pbCanvas.style.backgroundColor = BG_COLOR;

    background.src = "./img/background.png";
    sprite.src = "./img/sprite.png";

    // 背景
    bg_image = {
        id: 0,
        y: SCREEN_HEIGHT,
        dy: 1,
        scroll: function () { // 背景スクロール
            this.y = this.y >= 0 ? this.y : SCREEN_HEIGHT;
            pbCtx.drawImage(
                background,
                320 * this.id, this.y, SCREEN_WIDTH, SCREEN_HEIGHT,
                0, 0, SCREEN_WIDTH, SCREEN_HEIGHT
            );
        }
    };
    for (i = 0; i < MAX_BG_IMAGE; i += 1) {
        bg_images[i] = object(bg_image);
        bg_images[i].id = i;
        bg_images[i].dy = Math.pow(2, i);
    }

    // プレイヤー
    player = {
        lv: 0,
        score: 0,
        id: 0,
        x: SCREEN_WIDTH / 2,
        y: -32768,
        velocity: 24,
        is_alive: false,
        is_gameover: true,
        pattern: 0,
        move: function () { // プレイヤー移動
            var sprite_x;
            this.x = this.x <                16 ?                16
                   : this.x > SCREEN_WIDTH - 16 ? SCREEN_WIDTH - 16
                   :                              this.x;
            switch (this.id) {
            case 0: // 自機
                this.pattern = this.pattern === 0 ? 1 : 0;
                sprite_x = 0 + 32 * this.pattern;
                break;
            case 251: // 爆発パターン#1
                sprite_x = 160;
                break;
            case 252: // 爆発パターン#2
                sprite_x = 192;
                break;
            case 253: // 爆発パターン#3
                sprite_x = 224;
                break;
            case 254: // 爆発パターン#4
                sprite_x = 256;
                break;
            default: // 爆発パターン消去
                this.y = -32768;
            }
            pbCtx.drawImage(
                sprite,
                sprite_x, 0, 32, 32,
                this.x - 16, this.y - 16, 32, 32
            );
        }
    };
    player_point = new PhysicalPoint(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 64);

    // 自機ショット
    shot = {
        x: -32768,
        y: SCREEN_HEIGHT - 64,
        dy: 16,
        is_alive: false,
        pattern: 0,
        move: function () { // 自機ショット移動
            this.y = this.y >= 0 ? this.y : -32768;
            this.is_alive = this.y >= 8 ? true : false;
            this.pattern = this.pattern === 0 ? 1 : 0;
            pbCtx.drawImage(
                sprite,
                288, (0 + 16 * this.pattern), 16, 16,
                this.x - 8, this.y - 8, 16, 16
            );
        }
    };
    for (i = 0; i < MAX_SHOT; i += 1) {
        shots[i] = object(shot);
    }

    // 敵キャラクター
    enemy = {
        id: 0,
        pts: 0,
        x: 32767,
        y: 32767,
        dx: 2,
        dy: 1,
        dy_default: 1,
        is_alive: false,
        pattern: 0,
        move: function () { // 敵キャラクター移動
            var sprite_x;
            this.y = this.y <= SCREEN_HEIGHT ? this.y : 32767;
            this.dy
                = this.y <= SCREEN_HEIGHT - 16 ? this.dy : this.dy_default;
            this.is_alive
                = this.y >= 0 && this.y <= SCREEN_HEIGHT - 16 ? true : false;
            switch (this.id) {
            case 0: // 敵機
                this.pts = 1000;
                this.dy = 3;
                this.dy_default = 3;
                this.pattern = this.pattern === 0 ? 1 : 0;
                sprite_x = 64 + 32 * this.pattern;
                break;
            case 1: // 隕石
                this.dy_default = 1;
                sprite_x = 128;
                break;
            case 251: // 爆発パターン#1
                this.dy = 2;
                sprite_x = 160;
                break;
            case 252: // 爆発パターン#2
                this.dy = 2;
                sprite_x = 192;
                break;
            case 253: // 爆発パターン#3
                this.dy = 1;
                sprite_x = 224;
                break;
            case 254: // 爆発パターン#4
                this.dy = 0;
                sprite_x = 256;
                break;
            default: // 爆発パターン消去
                this.y = 32767;
            }
            pbCtx.drawImage(
                sprite,
                sprite_x, 0, 32, 32,
                this.x - 16, this.y - 16, 32, 32
            );
        },
        checkCollision: function () { // 敵キャラクター衝突判定
            var n, dx, dy;
            if (!this.is_alive) {
                return;
            }
            if (player.is_alive) { // 対自機
                dx = this.x - player.x;
                dy = this.y - player.y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(16, 2)) {
                    player.score += this.id === 0 ? this.pts : 0;
                    player.id = 251;
                    player.is_alive = false;
                    this.id = this.id < 251 ? 251 : this.id;
                    this.is_alive = false;
                }
            }
            for (n = 0; n < MAX_SHOT; n += 1) { // 対自機ショット
                if (!shots[n].is_alive || !player.is_alive) {
                    continue;
                }
                dx = this.x - shots[n].x;
                dy = this.y - shots[n].y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(16, 2)) {
                    shots[n].y = this.id < 251 ? -32768 : shots[n].y;
                    shots[n].is_alive
                        = this.id < 251 ? false : shots[n].is_alive;
                    player.score += this.id === 0 ? this.pts : 0;
                    this.id = this.id === 0 ? 251 : this.id;
                    this.is_alive = this.id >= 251 ? false : this.is_alive;
                }
            }
        }
    };
    for (i = 0; i < MIN_ENEMY + MAX_LV; i += 1) {
        enemies[i] = object(enemy);
    }

    // 敵機ビーム
    beam = {
        x: 32767,
        y: 32767,
        dx: 2,
        dy: 8,
        dx_default: 2,
        is_alive: false,
        pattern: 0,
        move: function () { // 敵機ビーム移動
            this.y = this.y <= SCREEN_HEIGHT ? this.y : 32767;
            this.dx
                = this.y <= SCREEN_HEIGHT - 16 ? this.dx : this.dx_default;
            this.is_alive
                = this.y >= 0 && this.y <= SCREEN_HEIGHT - 16 ? true : false;
            this.pattern = this.pattern === 0 ? 1 : 0;
            pbCtx.drawImage(
                sprite,
                304, (0 + 16 * this.pattern), 16, 16,
                this.x - 8, this.y - 8, 16, 16
            );
        },
        checkCollision: function () { // 敵機ビーム衝突判定
            var dx, dy;
            if (!this.is_alive) {
                return;
            }
            if (player.is_alive) { // 対自機
                dx = this.x - player.x;
                dy = this.y - player.y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(8, 2)) {
                    player.id = 251;
                    player.is_alive = false;
                    this.y = 32767;
                    this.is_alive = false;
                }
            }
        }
    };
    for (i = 0; i < MIN_BEAM + MAX_LV; i += 1) {
        beams[i] = object(beam);
    }

    // ハイスコア
    try {
        hi_score = parseInt(localStorage.getItem("hi_score"), 10) || 0;
        valid_storage = true;
    } catch (e) {
        hi_score = hi_score || 0;
        valid_storage = false;
    }

    // ローディング画面
    pbCtx.beginPath();
    pbCtx.fillStyle = BG_COLOR;
    pbCtx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    pbCtx.fill();
    pbCtx.font = FONT_FACE;
    pbCtx.fillStyle = FONT_COLOR;
    pbCtx.fillText("==== NOW  LOADING ====", SCREEN_WIDTH / 2, 12);
    if (!valid_storage) {
        pbCtx.fillText("*** STORAGE  ERROR ***", SCREEN_WIDTH / 2, 24);
    }
}

function loop() {
    var i, j, curr_lv;

    pbCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 背景
    for (i = 0; i < MAX_BG_IMAGE; i += 1) {
        bg_images[i].y -= bg_images[i].dy;
        bg_images[i].scroll();
    }

    // 自機ショット
    for (i = 0; i < MAX_SHOT; i += 1) {
        if (!player.is_alive) {
            break;
        }
        if (curYubiY >= SCREEN_HEIGHT - 48) { // 自機ショット発射
            shots[i].x = shots[i].y < 0 ? player.x + 1 : shots[i].x;
            shots[i].y = shots[i].y < 0 ? player.y + 16 : shots[i].y;
            for (j = 0; j < MAX_SHOT; j += 1) {
                if (i !== j && shots[j].y === shots[i].y) {
                    shots[i].y -= 8;
                }
            }
        }
        shots[i].y -= shots[i].dy;
        shots[i].move();
    }

    // 敵機ビーム
    for (i = 0; i < MIN_BEAM + player.lv; i += 1) {
        beams[i].x += beams[i].dx;
        beams[i].y += beams[i].dy;
        beams[i].move();
        beams[i].checkCollision();
    }

    // 敵キャラクター
    for (i = 0; i < MIN_ENEMY + player.lv; i += 1) {
        if (enemies[i].y > SCREEN_HEIGHT - 16) {
            enemies[i].id = Math.floor(Math.random() * 2);
            enemies[i].x = 16 + 32 * Math.floor(Math.random() * 10);
            enemies[i].y
                = -SCREEN_WIDTH + Math.floor(Math.random() * SCREEN_WIDTH);
        }
        if (enemies[i].id === 0 && Math.abs(player.x - enemies[i].x) <= 96) {
            for (j = 0; j < MIN_BEAM + player.lv; j += 1) { // 敵機ビーム発射
                if (beams[j].is_alive
                    || !(enemies[i].y >= 32 && enemies[i].y <= player.y - 64)
                    || Math.floor(Math.random() * 256) !== 0) {
                    continue;
                }
                beams[j].x = enemies[i].x + 1;
                beams[j].y = enemies[i].y + 16;
                beams[j].dx = player.x - enemies[i].x > 64 ?  beams[j].dx
                            : enemies[i].x - player.x > 64 ? -beams[j].dx
                            :                                 0;
                break;
            }
        }
        if (enemies[i].id === 0 && player.y - enemies[i].y <= 256) { // 敵機
            enemies[i].x
                = player.x - enemies[i].x > 48 ? enemies[i].x + enemies[i].dx
                : enemies[i].x - player.x > 48 ? enemies[i].x - enemies[i].dx
                :                                enemies[i].x;
            enemies[i].dy *= 2;
        }
        if (enemies[i].id === 1 && enemies[i].y < 0) { // 隕石
            enemies[i].dy = 1 + Math.floor(Math.random() * 3);
        }
        if (enemies[i].id >= 251 && enemies[i].id <= 254) { // 爆発パターン
            enemies[i].id += 1;
        }
        enemies[i].y += enemies[i].dy;
        enemies[i].move();
        enemies[i].checkCollision();
    }

    // プレイヤー
    if (player.is_alive) {
        if (curYubiTouched) { // プレイヤー移動
            player_point.setKasokudo(
                (curYubiX - player_point.x) * player.velocity, 0
            );
        }
        player.x = Math.floor(player_point.x);
        player.y = SCREEN_HEIGHT - 64;
    } else {
        if (player.id >= 251 && player.id <= 254 + WAIT) { // 爆発パターン
            player.id += 1;
        }
        if (player.id === 255 + WAIT) { // ゲームオーバー
            try {
                localStorage.setItem("hi_score", hi_score);
                valid_storage = true;
            } catch (e) {
                valid_storage = false;
            }
            player.is_gameover = true;
        }
        if (player.is_gameover && curYubiTouched) { // 再スタート
            setup();
            player.is_alive = true;
            player.is_gameover = false;
        }
    }
    player.move();

    // 自機ショット用タップエリア
    if (!player.is_gameover) {
        pbCtx.drawImage(
            sprite,
            0, 32, 320, 32,
            0, SCREEN_HEIGHT - 32, 320, 32
        );
    }

    // タイトルバナー
    if (player.is_gameover) {
        pbCtx.drawImage(
            sprite,
            0, 64, 320, 32,
            0, (SCREEN_HEIGHT - 32) / 2, 320, 32
        );
    }

    // 得点表示欄
    pbCtx.beginPath();
    pbCtx.fillStyle = BG_COLOR;
    pbCtx.rect(0, 0, SCREEN_WIDTH, 16);
    pbCtx.fill();

    // 得点表示
    pbCtx.font = FONT_FACE;
    pbCtx.fillStyle = FONT_COLOR;
    if (player.is_alive) {
        player.score += 1;
        player.score
            = player.score < MAX_SCORE ? player.score : MAX_SCORE;
        hi_score = player.score < hi_score ? hi_score : player.score;
        pbCtx.fillText("HI-SCORE: " + hi_score, SCREEN_WIDTH / 2, 12);
    } else {
        pbCtx.fillText("===== GAME  OVER =====", SCREEN_WIDTH / 2, 12);
        pbCtx.fillText("---- TAP TO START ----", SCREEN_WIDTH / 2, 24);
    }
    pbCtx.fillText("SCORE: " + player.score, 2, 12);

    // 難易度計算
    curr_lv = Math.floor(player.score / THRESHOLD_SCORE);
    player.lv = curr_lv < MAX_LV ? curr_lv : MAX_LV;
}

function onPressed(n) {}

function onMove(n) {}

function onReleased(n) {}
