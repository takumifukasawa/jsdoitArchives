(function($, win, doc) {
    
    "use strict";
    
    console.log("======================");
    
    var CharlieKey = function() {
        this.reg = /^[0-9]{1,4}$/;
        this.initialize();
    };
    
    CharlieKey.prototype.initialize = function() {
        this.masterKeyCord = null;
        this.isOpen = true;
    };
    
    // 簡易的なnumber check（あとで正規表現もやるから）
    CharlieKey.prototype.isNumber = function(x) {
        if(typeof x === "number") {
            return true;
        }
        return false;
    };
    
    CharlieKey.prototype.checkCordFormat = function(cord) {
        if(cord.toString().match(this.reg)) {
            return true;
        }
        return false;
    };
    
    CharlieKey.prototype.registerKeyCord = function(cord) {
        if(!this.isOpen) return;
        
        if(!this.isNumber(cord) || !this.checkCordFormat(cord)) return;
                
        this.masterKeyCord = cord;
        this.isOpen = false;
    };
    
    CharlieKey.prototype.setKeyCord = function(cord) {
        if(this.isOpen) return;
         
        if(!this.isNumber(cord) || !this.checkCordFormat(cord)) return;

        if(cord === this.masterKeyCord) {
            console.log("!!! OPEN !!! : " + cord);
            // 鍵が空いたので初期化
            this.initialize();
        } else {
            console.log(" FAILED : " + cord);
        }
    };
    
   
    var charlieKey = new CharlieKey();
    charlieKey.registerKeyCord(1000); // 解除キーを1000にする
    charlieKey.registerKeyCord(100); // 無視    

    for(var i=0; i<100; i++) {
        charlieKey.setKeyCord(Math.floor(Math.random()*9999));
    }
    //charlieKey.setKeyCord(1000); // 解除！   
    
})(jQuery, window, window.document);