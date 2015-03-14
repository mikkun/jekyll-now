var LINE_WIDTH = 2,
    BG_COLOR = "rgb(255, 255, 204)",
    CENTER_X = 250,
    CENTER_Y = 250,
    START_ANGLE = -(Math.PI / 2),
    HOUR_COLOR = "rgb(255, 153, 153)",
    HOUR_RADIUS = 80,
    HOUR_COUNT = 24,
    MIN_COLOR = "rgb(153, 255, 153)",
    MIN_RADIUS = 130,
    MIN_COUNT = 60,
    SEC_COLOR = "rgb(153, 153, 255)",
    SEC_RADIUS = 210,
    SEC_COUNT = 60;

function drawArc(color, radius, parameter) {
    pbCtx.beginPath();
    pbCtx.lineWidth = LINE_WIDTH;
    pbCtx.fillStyle = BG_COLOR;
    pbCtx.strokeStyle = color;
    pbCtx.arc(CENTER_X, CENTER_Y, radius, 0, Math.PI * 2, true);
    pbCtx.fill();
    pbCtx.stroke();

    pbCtx.beginPath();
    pbCtx.fillStyle = color;
    pbCtx.arc(
        CENTER_X, CENTER_Y,
        radius,
        START_ANGLE, START_ANGLE + (Math.PI * 2) * parameter,
        false
    );
    pbCtx.lineTo(CENTER_X, CENTER_Y);
    pbCtx.fill();
}

function setup() {

}

function loop() {
    var curr_time = new Date();

    pbCtx.clearRect(0, 0, screenWidth, screenHeight);

    drawArc(SEC_COLOR, SEC_RADIUS, (curr_time.getSeconds() / SEC_COUNT));
    drawArc(MIN_COLOR, MIN_RADIUS, (curr_time.getMinutes() / MIN_COUNT));
    drawArc(HOUR_COLOR, HOUR_RADIUS, (curr_time.getHours() / HOUR_COUNT));
}

function onPressed(n) {

}

function onMove(n) {

}

function onReleased(n) {

}
