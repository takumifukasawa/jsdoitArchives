// forked from mottsu's "Googleマップテスト ～ 住所、最寄駅を取得" http://jsdo.it/mottsu/w0gS
$(function () {
    // Mapの表示位置、表示方法などの設定値
    var latlng = new google.maps.LatLng(35.461051, 139.629473);
    var opts = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
    };
    
    // Mapを表示するdiv要素と設定値を渡す
    var map = new google.maps.Map(document.getElementById("map-canvas"), opts);
    
    // ジオコーダー
    var geocoder = new google.maps.Geocoder();
    
    // マーカー
    var marker = new google.maps.Marker({
        draggable: true,
        position: latlng,
        map: map
    });
    
    // 吹き出し
    var infoWin = new google.maps.InfoWindow();
    
    // Mapがクリックされた時のリスナーを登録
    google.maps.event.addListener(map, 'click', function (event) {
        
        var getAddress = function () {
            var dfd = $.Deferred();
            var resultStr = "";

            // geocodeリクエストを実行。
            // 第１引数はGeocoderRequest。緯度経度⇒住所の変換時はlatLngプロパティを入れればOK。
            // 第２引数はコールバック関数。
            geocoder.geocode({
                latLng: event.latLng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // results.length > 1 で返ってくる場合もありますが・・・。
                    if (results[0].geometry) {
                        
                        // 住所を取得(日本の場合だけ「日本, 」を削除)
                        var address = results[0].formatted_address.replace(/^日本, /, '');
                        
                        resultStr += address + "<br />(" + event.latLng.lat() + ", " + event.latLng.lng() + ")" + "<br /><br />";
                        dfd.resolve(resultStr);
                    }
                    
                } else if (status == google.maps.GeocoderStatus.ERROR) {
                    dfd.reject("サーバとの通信時に何らかのエラーが発生！");
                } else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
                    dfd.reject("リクエストに問題アリ！geocode()に渡すGeocoderRequestを確認せよ！！");
                } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    dfd.reject("短時間にクエリを送りすぎ！落ち着いて！！");
                } else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
                    dfd.reject("このページではジオコーダの利用が許可されていない！・・・なぜ！？");
                } else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
                    dfd.reject("サーバ側でなんらかのトラブルが発生した模様。再挑戦されたし。");
                } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                    dfd.reject("見つかりません");
                } else {
                    dfd.reject("えぇ～っと・・、バージョンアップ？");
                }
            });

            return dfd.promise();            
        };
        
        heartrailsURL = "http://express.heartrails.com/api/json?method=getStations&";
        heartrailsURL += "x=" + event.latLng.lng() + "&";
        heartrailsURL += "y=" + event.latLng.lat() + "&";
        heartrailsURL += "jsonp=getStation";    // JSONPのコールバック関数
        
        getAddress().then(
            // done
            function (resultStr) {
                $.ajax({
                    type: 'get',
                    url: heartrailsURL,
                    dataType: 'jsonp',
                    jsonpCallback: 'getStation',
                    timeout: 30000
                }).done(function (json, textStatus, XMLHttpRequest) {
                    for (i = 0; i < json.response.station.length; i++) {
                        // 徒歩何分か（1分80mで計算）※参考：https://ja.wikipedia.org/wiki/%E5%BE%92%E6%AD%A9%E6%89%80%E8%A6%81%E6%99%82%E9%96%93
                        dist = Math.ceil(json.response.station[i].distance.slice(0, -1) / 80);
                        
                        resultStr += json.response.station[i].line + " ";
                        resultStr += json.response.station[i].name;
                        resultStr += "駅までの距離：" + json.response.station[i].distance + "／徒歩：" + dist + "分<br />";
                    }
                    
                    // 吹き出しの内容を設定
                    infoWin.setContent(resultStr);
                    
                    // クリックした場所にマーカーを追加
                    marker.setPosition(event.latLng);
                    marker.setMap(map);
                    
                    // 吹き出しを開く
                    infoWin.open(map, marker);
                    google.maps.event.addListener(marker, "click", function (event) {
                        infoWin.open(map, marker);
                    });
                }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('通信エラーが発生しました。');
                }).always(function (XMLHttpRequest, textStatus) {
                });
            },
            // fail
            function (errMsg) {
                infoWin.close();
                alert(errMsg);
            }
        );
    });
});
