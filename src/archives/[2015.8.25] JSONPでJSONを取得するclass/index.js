(function($, win, doc) {                                                                                                                                                                                                   
                                                                                                                                                                                                                   
    "use strict";  

    
    ////////////////////////////////////////////////////////////////////////////////////////
    //
    // GetJson class
    //
    ////////////////////////////////////////////////////////////////////////////////////////    
 
    
    var GetJson = function() {};
    
    
    ////////////////////////////////////////////////////////////////////////////////////////
    //
    // part1: use jQuery
    //
    ////////////////////////////////////////////////////////////////////////////////////////    
    

    // jsonpのcallbackNameはいらない
    GetJson.prototype.jQuery = function(url, callback) {
        if(!url) return;

        $.ajax({                                                                                                                                                                                                     
            type: "GET",                                                                                                                                                                                             
            url: url,                                                                                                                                                            
            dataType: "jsonp",                                                                                                                                                                                                                                                                                                                                                                                               
            success: callback,
                                                                                                                                                                                                                   
            error: function(data) {                               
                throw new Error("cannot get json.");                                                                                                                                                                 
            }                                                                                                                                                                                                        
        });    
    };
    
    
    ////////////////////////////////////////////////////////////////////////////////////////
    //
    // part2: use javascript native api
    //
    ////////////////////////////////////////////////////////////////////////////////////////    
    
    
    GetJson.prototype.nativeAPI = function(url, jsonpCallbackName, callback) {
        if(!url) return;
        
        var callbackName,
            script,
            rand;
        
        // コールバックのバリューを一意に定める
        rand         = Math.floor(Math.random()*10000);
        callbackName = 'jsonp_callback' + rand.toString();
        
        // コールバックが読み込まれたらコールバック自身を消す
        win[callbackName] = function(data) {
            delete win[callbackName];
            // jsはすでに読み込まれているのでremoveしてOK
            doc.body.removeChild(script);
            callback(data);
        };

        script = doc.createElement('script');
        // urlにクエリがすでに含まれていたら末尾は "&"
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + jsonpCallbackName + '=' + callbackName;
        doc.body.appendChild(script);
    };
    

    ////////////////////////////////////////////////////////////////////////////////////////
    //
    // other: use XMLHttpRequest Level2
    //
    // サーバー側で Access-Control-Allow-Origin が許可されていないと通らない
    //
    ////////////////////////////////////////////////////////////////////////////////////////    

    
    GetJson.prototype.XHR2 = function(url, callback) {
    
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            switch(xhr.readyState) {
                case 0: break; // xhrを作った直後
                case 1: break; // xhrのopenが完了
                case 2: break; // responce header を取得できた
                case 3: break; // responce body を取得中
                
                case 4:        // xhr通信完了
                    if(xhr.status === 0) {
                        console.log("cannot get by xhr");
                    } else {
                        // レスポンスステータスが正常の場合、jsonを処理する
                        if((200 <= xhr.status && xhr.status < 300) || (xhr.status === 304)) {
                            callback(JSON.parse(xhr.responseText));
                        } else {
                            console.log("bad responce: " + xhr.status);
                        }
                    }
                    break;
            }
        };
        xhr.send(null);
    };
    
    
    ////////////////////////////////////////////////////////////////////////////////////////
    //
    // config
    //
    ////////////////////////////////////////////////////////////////////////////////////////    
    
    /**
     * jsonを再帰的にリスト化
     */
    var recurse = function(data, frag, parents) {
        var ol, li, keys;
        
        ol = doc.createElement("ol");
        keys = Object.keys(data);
        
        for(var i=0, len=keys.length; i<len; i++) {
            li = doc.createElement("li");
            li.innerText = keys[i];
            ol.appendChild(li);
            if(typeof data[keys[i]] === "object") {
                (parents) ? parents.appendChild(ol) : frag.appendChild(ol);
                recurse(data[keys[i]], frag, li);
            } else {
                li.innerText += " is ¥" + data[keys[i]];
            }
        }
        
        (parents) ? parents.appendChild(ol) : frag.appendChild(ol);
        return frag;
    };
    
    /**
     * 取得したjsonを処理するためのコールバック
     */
    var jsonpCallbackFunc = function(data) {
        var header, fragment, border;
        
        fragment = doc.createDocumentFragment();
        fragment = recurse(data, fragment);
        
        border = doc.createElement("hr");
        fragment.appendChild(border);
        
        doc.body.appendChild(fragment);
    };
    
    
    ////////////////////////////////////////////////////////////////////////////////////////
    //
    // run
    //
    ////////////////////////////////////////////////////////////////////////////////////////    

     
    var url                   = "json-url",
        jsonpCallbackName     = "callback-name";
    
    var getJson = new GetJson();

    /**
     * ex)
     */
    /*
    getJson.jQuery(url, jsonpCallbackFunc);
    getJson.nativeAPI(url, jsonpCallbackName, jsonpCallbackFunc);
    getJson.XHR2(url, jsonpCallbackFunc);
    */
    
})(jQuery, window, window.document);
