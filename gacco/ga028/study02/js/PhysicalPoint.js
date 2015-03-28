function PhysicalPoint(xx, yy, zz){
	//x座標、y座標に、指定の値を代入する
	this.x = xx;
	this.y = yy;	
	this.z = zz;	

	//速度は最初は０にする
	this.vx = 0;
	this.vy = 0;
	this.vz = 0;

	//加速度は最初は０にする
	this.ax = 0;
	this.ay = 0;
	this.az = 0;
	
	//摩擦係数
	this.b = 0.95;
	
	//loop関数を開始する
	this.startLoop();
}


PhysicalPoint.prototype = {
	loop: function(){
		
		//経過時間（秒）をtに代入する
		var t = 33/1000;
		
		//現在速度と現在加速度から現在の位置を計算する
		this.x += this.vx*t + 0.5*this.ax*t*t;
		this.y += this.vy*t + 0.5*this.ay*t*t;
		this.z += this.vz*t + 0.5*this.az*t*t;
		
		//現在加速度から現在の速度を計算する
		this.vx += this.ax*t;
		this.vy += this.ay*t;
		this.vz += this.az*t;
		
		//速度に対して摩擦を考慮する
		this.vx *= this.b;
		this.vy *= this.b;
		this.vz *= this.b;
		
		//加速度を位置と速度に還元したので、０にする
		this.ax = 0;
		this.ay = 0;
		this.az = 0;
	},
	
	setKasokudo: function(aax, aay, aaz){
		//現在の加速度の値に指定の値を加算する
		this.ax += aax;
		this.ay += aay;
		this.az += aaz;
	},
	
	setKasokudoByPolar: function(r, dire){
		//現在の加速度の値に指定の値を加算する
		//渡される値は大きさと向きなので、それをx方向とy方向に変換する
		this.ax += r*Math.cos(dire);
		this.ay += r*Math.sin(dire);
	},
	
	startLoop:function(){
		//loop関数を33ミリ秒ごとに繰り返すように設定、開始
		var kore = this;

		this.timer = setInterval(function(){
			kore.loop();
		}, 33);

	}
}



