window.app = {};

(function($, win, doc, ns) {
    
    "use strict";
    
    var EventDispatcher = function() {
        this.listeners = [];
    };
    
    EventDispatcher.prototype.has = function(EVENT_NAME) {
        return this.listeners[EVENT_NAME] ? true : false;
    };
    
    // 独自メソッド追加
    EventDispatcher.prototype.initListener = function(EVENT_NAME) {
        this.listeners[EVENT_NAME] = [];
    };
    
    EventDispatcher.prototype.on = function(EVENT_NAME, callback) {
        if(!this.has(EVENT_NAME)) {
            this.initListener(EVENT_NAME);
        }
        this.listeners[EVENT_NAME].push(callback);
    };
    
    EventDispatcher.prototype.off = function(EVENT_NAME, callback) {
        if(!this.has(EVENT_NAME)) {
            this.initListener(EVENT_NAME);
        }
        for(var i=0, len=this.listeners[EVENT_NAME].length; i<len; i++) {
            if(this.listeners[EVENT_NAME][i] === callback) {
                this.listeners[EVENT_NAME].splice(i, 1);
            }
        }
    };
    
    EventDispatcher.prototype.trigger = function(EVENT_NAME) {
        if(!this.has(EVENT_NAME)) return;
        
        var _self = this,
            args = [].slice.call(arguments, 1),
            event = this.listeners[EVENT_NAME].slice();
        
        for(var i=0, len=event.length; i<len; i++) {
            event[i].apply(_self, args);
        }
    };
    
    // 独自メソッド追加
    EventDispatcher.prototype.extend = function(childClass) {
        for(var prop in EventDispatcher.prototype) {
            if(!childClass.prototype[prop]) childClass.prototype[prop] = EventDispatcher.prototype[prop];
        }
        return childClass;
    };
    
    /**
     * 今後入れたいメソッド群
     */
    // リスナーを返す
    EventDispatcher.prototype.listeners = function() {};
    // 一回きりの関数を登録（trigger時に削除する）
    EventDispatcher.prototype.oneTime = function() {};
    /**
     *
     */
    
    ns.EventDispatcher = EventDispatcher;
    
})(jQuery, window, window.document, window.app);

(function($, win, doc, ns) {
    
    "use strict";

    var echo1 = function() {
        console.log("echo1");
    };
    
    var echo2 = function() {
        console.log("echo2");
    };
    
    var echo3 = function() {
        console.log("echo3");
    };
    
    // simple
    console.log("============= simple =============");
    var evd1 = new ns.EventDispatcher();
    evd1.on("event1", echo1);
    evd1.on("event1", echo2);
    evd1.trigger("event1");
    evd1.off("event1", echo1);
    evd1.trigger("event1");
    
    // extend（実際は、クラスを作る時点でnewしたインスタンスでextendを使う -> あとでこれように諸々実装し直す）
    console.log("============= extend =============");
    var evd2 = new ns.EventDispatcher();
    var MyFunc = function(){};
    var func = new MyFunc();
    MyFunc.prototype.init = function() {};
    MyFunc = evd2.extend(MyFunc);
    func.on("event3", echo3);
    func.trigger("event3");
    func.on("event2", echo2);
    func.on("event2", echo3);
    func.trigger("event2");
    func.off("event2", echo2);
    func.trigger("event2");
    
    
})(jQuery, window, window.document, window.app);
