// forked from takumifukasawa's "glsl: orb" http://jsdo.it/takumifukasawa/uipa
// forked from takumifukasawa's "webgl: glslを書く雛形" http://jsdo.it/takumifukasawa/GicP
'use strict';

start();

function start() {
    var wrapper = document.querySelector('#wrapper');
    var canvas = document.querySelector('#canvas');

    var vertexShaderText = document.querySelector('#vertexShader').textContent;
    var fragmentShaderText = document.querySelector('#fragmentShader').textContent;

    var ratio = window.devicePixelRatio || 1;
    var cw = wrapper.offsetWidth * ratio;
    var ch = wrapper.offsetHeight * ratio;
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = cw / ratio + 'px';
    canvas.style.height = ch / ratio + 'px';
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // global
    var mx = undefined,
        my = undefined;
    var startTime = undefined;
    var time = 0.0;
    var tempTime = 0.0;
    var uniLocation = new Array();

    // イベントリスナー登録
    canvas.addEventListener('mousemove', mouseMove, true);

    var vertexShader = createShader(gl, vertexShaderText, 'vertex-shader');
    var fragmentShader = createShader(gl, fragmentShaderText, 'fragment-shader');

    // シェーダ周りの初期化
    var program = createProgram(gl, vertexShader, fragmentShader);

    uniLocation[0] = gl.getUniformLocation(program, 'time');
    uniLocation[1] = gl.getUniformLocation(program, 'mouse');
    uniLocation[2] = gl.getUniformLocation(program, 'resolution');

    // 頂点データ回りの初期化
    var position = [-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];
    var index = [0, 2, 1, 1, 2, 3];

    var positionVBO = createVBO(gl, position);
    var indexIBO = createIBO(gl, index);
    var vertexAttLocation = gl.getAttribLocation(program, 'position');

    gl.bindBuffer(gl.ARRAY_BUFFER, positionVBO);
    gl.enableVertexAttribArray(vertexAttLocation);
    gl.vertexAttribPointer(vertexAttLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexIBO);

    // その他の初期化
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    mx = 0.5;
    my = 0.5;
    startTime = new Date().getTime();

    // レンダリング関数呼出
    update();

    // mouse
    function mouseMove(e) {
        mx = e.clientX * ratio / cw;
        my = e.clientY * ratio / ch;
    }

    // レンダリングを行う関数
    function update() {

        // 時間管理
        time = (new Date().getTime() - startTime) / 1000;

        // カラーバッファをクリア
        gl.clear(gl.COLOR_BUFFER_BIT);

        // uniform 関連
        gl.uniform1f(uniLocation[0], time + tempTime);
        gl.uniform2fv(uniLocation[1], [mx, my]);
        gl.uniform2fv(uniLocation[2], [cw, ch]);

        // 描画
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        gl.flush();

        // 再帰
        requestAnimationFrame(update);
    }
}

function createShader(gl, shaderText, type) {
    var shader = undefined;

    switch (type) {
        case 'vertex-shader':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;
        case 'fragment-shader':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
    }

    // 生成されたshaderをsourceに割り当てる
    gl.shaderSource(shader, shaderText);
    // シェーダーをコンパイル
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        return;
    }

    return shader;
}

function createProgram(gl, vs, fs) {
    var program = gl.createProgram();

    // プログラムオブジェクトにシェーダーを割り当てる
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    // プログラムオブジェクトにシェーダーをリンク
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);
    return program;
}

function createVBO(gl, data) {
    // バッファオブジェクトの作成
    var vbo = gl.createBuffer();
    // バッファをバインド
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // バッファにデータをセット
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    // バッファのバインドを無効化
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // 生成したvboを返して終了
    return vbo;
}

function createIBO(gl, data) {
    // バッファオブジェクトの生成
    var ibo = gl.createBuffer();
    // バッファをバインド
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    // バッファにデータをセット
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    // バッファのバインドを無効化
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // 生成したiboを返して終了
    return ibo;
}

