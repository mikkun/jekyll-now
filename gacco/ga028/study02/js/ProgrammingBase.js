var pbCanvas;
var pbCtx;
var yubiX=new Array(0, 0, 0, 0, 0), yubiY=new Array(0, 0, 0, 0, 0);
var yubiNum = 0

var curYubiX = 0;
var curYubiY = 0;
var preYubiX = 0;
var preYubiY = 0;
var curYubiTouched = false;
var preYubiTouched = false;

var screenWidth = 768;
var screenHeight = 1024

onload = function() {
	pbCanvas = document.getElementById('pbCanvas');
	if ( ! pbCanvas || ! pbCanvas.getContext ) {
		return false;
	}
	pbCtx = pbCanvas.getContext('2d');
	init();
	setup();
	setInterval(loop, 33);
};

function init(){

	pbCanvas.addEventListener("mousedown", function(evt){
		var rect = pbCanvas.getBoundingClientRect();

		preYubiTouched = curYubiTouched;
		preYubiX = curYubiX;
		preYubiY = curYubiY;
		curYubiTouched = true;
		curYubiX = evt.clientX - rect.left;
		curYubiY = evt.clientY - rect.top;
		
		yubiNum = 1
		yubiX[0] = evt.clientX - rect.left;
		yubiY[0] = evt.clientY - rect.top;
		onPressed([0]);
	}, false);
	
	pbCanvas.addEventListener("mousemove", function(evt){
		var rect = pbCanvas.getBoundingClientRect();
		
		preYubiX = curYubiX;
		preYubiY = curYubiY;
		curYubiX = evt.clientX - rect.left;
		curYubiY = evt.clientY - rect.top;

		yubiX[0] = evt.clientX - rect.left;
		yubiY[0] = evt.clientY - rect.top;
		onMove([0]);
	}, false);
	
	pbCanvas.addEventListener("mouseup", function(evt){
		var rect = pbCanvas.getBoundingClientRect();

		preYubiTouched = curYubiTouched;
		preYubiX = curYubiX;
		preYubiY = curYubiY;
		curYubiTouched = false
		curYubiX = evt.clientX - rect.left;
		curYubiY = evt.clientY - rect.top;

		yubiNum = 0
		yubiX[0] = evt.clientX - rect.left;
		yubiY[0] = evt.clientY - rect.top;
		onReleased([0]);
	}, false);
	
	pbCanvas.addEventListener("touchstart",function(evt) {
		evt.preventDefault();

		preYubiTouched = curYubiTouched;
		preYubiX = curYubiX;
		preYubiY = curYubiY;
		curYubiTouched = true;
		curYubiX = evt.changedTouches[0].pageX;
		curYubiY = evt.changedTouches[0].pageY;

		yubiNum = evt.touches.length;
		for(var i=0; i < evt.touches.length; ++i){
			yubiX[i] = evt.touches[i].pageX;
			yubiY[i] = evt.touches[i].pageY;
		}

		var curMoveNum = new Array();
		for(var i=0; i < yubiX.length; ++i){
			for(var j=0; j < evt.changedTouches.length; ++j){
				if(yubiX[i] == evt.changedTouches[j].pageX && yubiY[i] == evt.changedTouches[j].pageY){
					curMoveNum.push(i);
				}
			}
		}
		onPressed(curMoveNum);
	}, false);
	
	pbCanvas.addEventListener("touchmove", function(evt) {
		evt.preventDefault();

		preYubiX = curYubiX;
		preYubiY = curYubiY;
		curYubiX = evt.changedTouches[0].pageX;
		curYubiY = evt.changedTouches[0].pageY;

		yubiNum = evt.touches.length;
		for(var i=0; i < evt.touches.length; ++i){
			yubiX[i] = evt.touches[i].pageX;
			yubiY[i] = evt.touches[i].pageY;
		}

		var curMoveNum = new Array();
		for(var i=0; i < yubiX.length; ++i){
			for(var j=0; j < evt.changedTouches.length; ++j){
				if(yubiX[i] == evt.changedTouches[j].pageX && yubiY[i] == evt.changedTouches[j].pageY){
					curMoveNum.push(i);
				}
			}
		}
		onMove(curMoveNum);
		
	}, false);
	
	pbCanvas.addEventListener("touchend", function(evt) {
		evt.preventDefault();

		preYubiTouched = curYubiTouched;
		preYubiX = curYubiX;
		preYubiY = curYubiY;
		curYubiTouched = false
		curYubiX = evt.changedTouches[0].pageX;
		curYubiY = evt.changedTouches[0].pageY;
		
		var curMoveNum = new Array();
		for(var i=0; i < yubiX.length; ++i){
			for(var j=0; j < evt.changedTouches.length; ++j){
				if(yubiX[i] == evt.changedTouches[j].pageX && yubiY[i] == evt.changedTouches[j].pageY){
					curMoveNum.push(i);
				}
			}
		}

		yubiNum = evt.touches.length;
		onReleased(curMoveNum);
	}, false);
}

function log(st){
	document.getElementById("testField").innerHTML += st+"<br/>\n";
}

function logClear(){
	document.getElementById("testField").innerHTML = "";
}
