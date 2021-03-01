(function($, win, doc) {
    
    "use strict";
    
    ///////////////////////////////////////////////
    // graphics
    ///////////////////////////////////////////////    
    
    var Graphics = function(opt) {
        opt = opt || {};
        
        PIXI.Graphics.call(this);
        
        this.position.x = opt.x || 100;
        this.position.y = opt.y || 100;
        
        this.points = this.makePoints(0, 0);
        this.color = Math.random()*0x00ff00;
    };
    
    Graphics.prototype = new PIXI.Graphics();
    
    Graphics.prototype.makePoints = function(baseX, baseY, distance) {
        var points = [];
        var t, dt, dx, dy, type;
        for(var i=0; i<3; i++) {
            t = Math.floor(Math.random()*360);
            dt = Math.floor(Math.random()*2);
            dx = Math.floor(Math.random()*160);
            dy = Math.floor(Math.random()*80);
            type = "tan";
            points.push({
                baseX: baseX,
                baseY: baseY,
                x: this.makePoint(baseX, dx, t, type),
                y: this.makePoint(baseY, dy, t, type),
                t: t,
                dt: dt,
                dx: dx,
                dy: dy,
                type: type
            });
        }
        return points;
    };
    
    // いろんな変化量を作ってみる
    Graphics.prototype.makePoint = function(base, d, t, type) {
        var c;
        switch(type) {
            case "sincos":
                c = Math.sin(t*Math.PI/180)*Math.cos(t*Math.PI/180)*d;
                break;
            case "tan":
                c = Math.sin(Math.tan(t*Math.PI/180)*0.05)*d;
                break;
            case "pow":
                c = Math.sin(Math.pow(8, Math.sin(t*Math.PI/180))*Math.PI/180)*d;
                break;
            default:
                c = Math.sin(t*Math.PI/180)*d;
                break;
        }
        return base + c;
    };

                
    Graphics.prototype.update = function(i) {
        var point = this.points[i];
        point.t += point.dt;
            
        if(point.t > 360) point.t = 0;
         
        point.x = this.makePoint(point.baseX, point.dx, point.t, point.type);
        point.y = this.makePoint(point.baseY, point.dy, point.t, point.type);
        
    };
    
    Graphics.prototype.render = function() {
        this.clear();
        
        this.beginFill(this.color, 0.6);
        
        for(var i=0, len=this.points.length; i<len; i++) {
            this.update(i);
            
            if(i===0) {
                this.moveTo(this.points[i].x, this.points[i].y);
                continue;
            }
            this.lineTo(this.points[i].x, this.points[i].y);
        }
    };
    
    
    ///////////////////////////////////////////////
    // main
    ///////////////////////////////////////////////    
    
    var Main = function() {
        this.graphicsNum = 200;
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.width = win.innerWidth;
        this.height = win.innerHeight;
        //this.ratio = win.devicePixelRatio;
        this.ratio = 1;
        
        this.$view = $("#my-canvas");
        this.$view.width(this.width).height(this.height);
        

        /* 最近のバージョンはstageを作る必要がないらしい
        this.stage = new PIXI.Stage(0x000000);
        this.stage.interactive = true;
        */
        
        this.stage = new PIXI.Container();
        this.stage.interactive = true;
        
        // rendererのサイズを決める
        // resolution: 2 -> retina対応
        // antialias: true -> antialiasをオン
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, { resolution: this.ratio, antialias: true });
        
        // rendererのcanvasをコンテナに追加
        this.$view[0].appendChild(this.renderer.view);
        
        // retina対応分縮める -> でも本当は Line:123のresolutionだけでいいらしい。
        /*
        this.renderer.view.style.width = this.width + "px";
        this.renderer.view.style.height = this.height + "px";
        */
        
        // グラフィクスインスタンス追加
        this.graphicsArray = [];
        var graphics;
        for(var i=0, len=this.graphicsNum; i<len; i++) {
            graphics = new Graphics({
                x: Math.random()*this.width,
                y: Math.random()*this.height
            });
            this.graphicsArray.push(graphics);
            this.stage.addChild(graphics);
        }
       
        // スタッツを追加。PIXI.jsとは関係ない
        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = "fixed";
        this.stats.domElement.style.top = "0";
        this.stats.domElement.style.left = "0";
        doc.body.appendChild(this.stats.domElement);
        
        this.run();
    };
    
    Main.prototype.update = function() {
    };
    
    Main.prototype.render = function() {
        for(var i=0, len=this.graphicsArray.length; i<len; i++) {   
            this.graphicsArray[i].render();
        }
        
        this.renderer.render(this.stage);
        this.stats.update();
    };
    
    Main.prototype.run = function() {
        /* pixiのticker。でもrequestanimationframeを使う方法が見つからなかった
        this.ticker = PIXI.ticker.shared;
        this.ticker.add(this.render.bind(this));  
        */
        
        
        // 自分でrequestanimation指定してもOK
        window.requestAnimationFrame = (function(){
            return window.requestAnimationFrame     ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function(callback, element){                                                                                                                                                                 
                    window.setTimeout(callback, 1000 / 60);
                };                                                                                                                                                                                           
        })();

        var loop = function() {                                                                                                                                                                              
            this.update();
            this.render(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        loop();
        //requestAnimationFrame(loop);
        
    };
       
    window.onload = function() {
        new Main();
    };
    
})(jQuery, window, window.document);