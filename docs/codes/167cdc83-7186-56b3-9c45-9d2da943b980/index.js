// forked from takumi.fukasawa's "forked: [canvas] 紙ふぶき" http://jsdo.it/takumi.fukasawa/zjGD
// forked from iwao111's "forked: [canvas] 紙ふぶき" http://jsdo.it/iwao111/dWOW
// forked from dobin's "forked: [canvas] 紙ふぶき" http://jsdo.it/dobin/qEcf
// forked from Shingo.Shibamoto's "forked: [canvas] 紙ふぶき" http://jsdo.it/Shingo.Shibamoto/llOI
// forked from teetteet's "forked: [canvas] 紙ふぶき" http://jsdo.it/teetteet/r8As
// forked from ikr7's "forked: [canvas] 紙ふぶき" http://jsdo.it/ikr7/nutG
// forked from tsubao's "[canvas] 紙ふぶき" http://jsdo.it/tsubao/iR2g
	var DEF_KAMIKIRE_MAX = 30;
	
	var kamikire_array = [];
	var cvs;
	var ctx;
	var stageWidth, stageHeight;
	var resizeFlg = true;
    var colorFlag = true;
	//
	window.onload = function()
	{
		init();
	}
	
    
function hsv2rgb(hue, sat, val) {
    var red, grn, blu, i, f, p, q, t;
    hue%=360;
    if(val==0) {return({r:0, g:0, v:0});}
    sat/=100;
    val/=100;
    hue/=60;
    i = Math.floor(hue);
    f = hue-i;
    p = val*(1-sat);
    q = val*(1-(sat*f));
    t = val*(1-(sat*(1-f)));
    if (i==0) {red=val; grn=t; blu=p;}
    else if (i==1) {red=q; grn=val; blu=p;}
    else if (i==2) {red=p; grn=val; blu=t;}
    else if (i==3) {red=p; grn=q; blu=val;}
    else if (i==4) {red=t; grn=p; blu=val;}
    else if (i==5) {red=val; grn=p; blu=q;}
    red = Math.floor(red*255);
    grn = Math.floor(grn*255);
    blu = Math.floor(blu*255);
    return ({r:red, g:grn, b:blu});
}

  
	
	//初期処理
	function init()
	{
		cvs = document.getElementById("canvas");
		
		//ウィンドウサイズ設定
		stageWidth = window.innerWidth ? window.innerWidth : $(window).width();
		stageHeight = window.innerHeight ? window.innerHeight : $(window).height();
		cvs.width = stageWidth;
		cvs.height = stageHeight;
		
		ctx = cvs.getContext("2d");
        ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, cvs.width, cvs.height);
		
		//生成
		for(var i=0; i<DEF_KAMIKIRE_MAX; i++){
//			var kami = new Kamikire(10+Math.floor(Math.random()*5));
            var kami = new Kamikire(10+Math.floor(Math.random()*8));

			kami.x = Math.random()*stageWidth;
			kami.y = Math.random()*stageHeight;
			
			ctx.fillStyle = "#" + kami._r + kami._g + kami._b;
			ctx.fillRect(kami.x, kami.y, kami.SIZE, kami.SIZE);
			
			//
			kamikire_array.push(kami);
		}
		
		setInterval(EnterFrame, 30);
	}
	
    //紙ふぶき
	function Kamikire(_size){
		this.SIZE = _size;
		
		this.x = 0;
		this.y = 0;
		this.alpha = 1;
		
		var t = Math.random()*Math.PI*2;
		//var r = Math.floor((1+Math.cos(t))*127.9999);
		//var g = Math.floor((1+Math.cos(t+Math.PI*2/3))*127.9999);
		//var b = Math.floor((1+Math.cos(t-Math.PI*2/3))*127.9999);
        
        var hue = 100;
        var sat = 60;
        //var val = Math.floor((1+Math.cos(t-Math.PI*2/3))*127.9999);
        //var val = 35;
        var val = Math.round(Math.random()*50) + 50;
        
        //var rgbvalue = hsv2rgb(hue, sat, val);

        //ctx.fillStyle = 'rgb('+rgbvalue[r]+','+rgbvalue[g]+','+rgbvalue[b]+')';
        
		
		//this._r = r;
		//this._g = g;
		//this._b = b;
        
        /*
        this._r = rgbvalue['r'];
        this._g = rgbvalue['g'];
        this._b = rgbvalue['b'];
        */
        
        if(colorFlag) {
            this._r = 255;
            this._g = 215;
            this._b = 0;
            colorFlag = false;
        } else {
            this._r = 0;
            this._g = 255;
            this._b = 127;
            colorFlag = true;
        }
        
        //this.alpha = 95;
        
		this._backColor = 0x010101*Math.floor(127+Math.random()*64);
		this._omega = (Math.random()*2-1)*Math.PI/4;
		this._fallTheta = 0;
		//this._fallSpeed = 1+Math.random()*2;
        this._fallSpeed = 8+Math.random()*2;
		
		this._theta = Math.random()*Math.PI*2;
		this._Ax = 1;
		this._Ay = Math.random();
		this._Az = Math.random()*2-1;
		var _l = Math.sqrt(this._Ax*this._Ax+this._Ay*this._Ay+this._Az*this._Az);
		this._Ax /= _l;
		this._Ay /= _l;
		this._Az /= _l;
		var _s = Math.sqrt(this._Ax*this._Ax+this._Ay*this._Ay);
		if(_s == 0){ // then A == ( 0, 0, -1 );
			this._Bx = 1.0; this._By = 0.0; this._Bz = 0.0;
			this._Cx = 0.0; this._Cy = 1.0; this._Cz = 0.0;
		} else {
			this._Bx = this._Ay; this._By = -this._Ax; this._Bz = 0;
			this._Cx = this._Ax*this._Az; this._Cy = this._Ay*this._Az; this._Cz = -(_s*_s);
			this._Bx /= _s; this._By /= _s;
			this._Cx /= _s*_l; this._Cy /= _s*_l; this._Cz /= _s*_l;
		}
	}
	
	Kamikire.prototype = {
		get rotation3D(){
			return this._theta - (Math.PI*2)*Math.floor(this._theta/(Math.PI*2));
		},
		set rotation3D(theta){
			this._theta = theta - (Math.PI*2)*Math.floor(theta/(Math.PI*2));
			var _cos = Math.cos(this._theta);
			var _sin = Math.sin(this._theta);
			
			// vector F is the rotated image of (1,0,0);
			var _Fx = this._Ax*this._Ax+(this._Bx*this._Bx+this._Cx*this._Cx)*_cos;
			var _Fy = this._Ax*this._Ay+(this._Bx*this._By+this._Cx*this._Cy)*_cos+(this._Bx*this._Cy-this._Cx*this._By)*_sin;
			var _Fz = this._Ax*this._Az+(this._Bx*this._Bz+this._Cx*this._Cz)*_cos-(this._Bx*this._Cz-this._Cx*this._Bz)*_sin;
        
			// vector G is the rotated image of (0,1,0);
			var _Gx = this._Ax*this._Ay+(this._By*this._Bx+this._Cy*this._Cz)*_cos+(this._By*this._Cx-this._Cy*this._Bx)*_sin;
			var _Gy = this._Ay*this._Ay+(this._By*this._By+this._Cy*this._Cy)*_cos;
			var _Gz = this._Ay*this._Az+(this._By*this._Bz+this._Cy*this._Cz)*_cos+(this._By*this._Cz-this._Cy*this._Bz)*_sin;

            var divide = 1.8;
			//
			//ctx.fillStyle = 'rgba('+this._r+', '+this._g+', '+this._b+', '+this.alpha+')';
			ctx.fillStyle = 'rgb('+this._r+', '+this._g+', '+this._b+')';
            
            //ctx.fillStyle = 'rgb(135, 190, 240)';

            //ctx.fillStyle = 'rgb(135, 190, 240)';hsb(.55, 0%, 0%)';
        

			ctx.beginPath();
			ctx.lineTo(this.x-_Fx*this.SIZE/divide+_Gx*this.SIZE/divide, this.y-_Fy*this.SIZE/divide+_Gy*this.SIZE/divide);
			ctx.lineTo(this.x-_Fx*this.SIZE/divide-_Gx*this.SIZE/divide, this.y-_Fy*this.SIZE/divide-_Gy*this.SIZE/divide);
            //ctx.lineTo(this.x, this.y);
       
			ctx.lineTo(this.x+_Fx*this.SIZE/2-_Gx*this.SIZE/2, this.y+_Fy*this.SIZE/2-_Gy*this.SIZE/2);
			ctx.lineTo(this.x+_Fx*this.SIZE/2+_Gx*this.SIZE/2, this.y+_Fy*this.SIZE/2+_Gy*this.SIZE/2);
			ctx.closePath();
			ctx.fill();


/*
			ctx.beginPath();
			ctx.lineTo(this.x-_Fx*this.SIZE+_Gx*this.SIZE, this.y-_Fy*this.SIZE+_Gy*this.SIZE);
			//ctx.lineTo(this.x-_Fx*this.SIZE/2-_Gx*this.SIZE/2, this.y-_Fy*this.SIZE/2-_Gy*this.SIZE/2);
            ctx.lineTo(this.x, this.y);
       
			//ctx.lineTo(this.x+_Fx*this.SIZE/2-_Gx*this.SIZE/2, this.y+_Fy*this.SIZE/2-_Gy*this.SIZE/2);
			ctx.lineTo(this.x+_Fx*this.SIZE+_Gx*this.SIZE, this.y+_Fy*this.SIZE+_Gy*this.SIZE);
			ctx.closePath();
			ctx.fill();
      */
        
        
		},
		fall: function(){
			this.rotation3D = this.rotation3D + this._omega;
			
			this.x += this._fallSpeed*Math.sin(this._fallTheta);
			this.y += this._fallSpeed*Math.cos(this._fallTheta);
			this._fallTheta += (Math.random()*2-1)*Math.PI/12;
			if(this._fallTheta < -Math.PI/2){
				this._fallTheta = -Math.PI - this._fallTheta;
			}
			if(this._fallTheta > Math.PI/2){
				this._fallTheta = Math.PI - this._fallTheta;
			}
		}
	}
	
	
	//enterframe
	function EnterFrame()
	{
		//初期化
		if(resizeFlg){
			resizeFlg = false;
			cvs.width = stageWidth;
			cvs.height = stageHeight;
		}
		ctx.clearRect(0,0,stageWidth,stageHeight);
		
		//表示更新
		for( i=0; i<DEF_KAMIKIRE_MAX; ++i){
			if(kamikire_array[i].y>0){
				var par = kamikire_array[i].y / stageHeight;
				par = 1 - par;
				
				kamikire_array[i].alpha = par;
			}
			
			if(kamikire_array[i].x - kamikire_array[i].SIZE/Math.SQRT2 > stageWidth){
				kamikire_array[i].x -= stageWidth;
			}
			if(kamikire_array[i].x + kamikire_array[i].SIZE/Math.SQRT2 < 0){
				kamikire_array[i].x += stageWidth;
			}
			if(kamikire_array[i].y - kamikire_array[i].SIZE/Math.SQRT2 > stageHeight){
				kamikire_array[i].y -= stageHeight;
			}
			
			kamikire_array[i].fall();
		}
	}
	
	/**
	 * リサイズ
	 */
	$(window).resize(function(){
		resizeFlg = true;
		stageWidth = window.innerWidth ? window.innerWidth : $(window).width();
		stageHeight = window.innerHeight ? window.innerHeight : $(window).height();
	});