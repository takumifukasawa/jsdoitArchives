'use strict';

var vertexShaderText = '\nattribute vec3 position;\nattribute vec2 uv;\nuniform mat4 modelViewProjectionMatrix;\nvarying vec2 vUv;\nvoid main(void) {\n    vUv = uv;\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.);\n}\n';

var fragmentShaderText = '\nprecision mediump float;\nvarying vec2 vUv;\nuniform float time;\nvoid main(void) {\n    float t = (sin(time) + 1.) * .5;\n    gl_FragColor = vec4(vUv, t, 1.);\n}\n';

var ratio = Math.min(1.75, window.devicePixelRatio);

var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

var vertexShader = createShader(gl, 'vertexShader', vertexShaderText);
var fragmentShader = createShader(gl, 'fragmentShader', fragmentShaderText);

var program = createProgram(gl, vertexShader, fragmentShader);

var polyIndices = [0, 2, 1, 2, 3, 1];

var polyAttributes = [{
    label: "position",
    location: gl.getAttribLocation(program, "position"),
    stride: 3,
    data: [-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0]
}, {
    label: "uv",
    location: gl.getAttribLocation(program, "uv"),
    stride: 2,
    data: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]
}];

polyAttributes.forEach(function (attribute, i) {
    attribute.vbo = createVBO(gl, attribute.data);
});

var polyIBO = createIBO(gl, polyIndices);

var polyUniforms = {};
polyUniforms.modelViewProjectionMatrix = gl.getUniformLocation(program, 'modelViewProjectionMatrix');
polyUniforms.time = gl.getUniformLocation(program, 'time');

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var modelViewProjectionMatrix = mat4.create();

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
gl.enable(gl.BLEND);

var onWindowResize = function onWindowResize() {
    var width = window.innerWidth * ratio;
    var height = window.innerHeight * ratio;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width / ratio + 'px';
    canvas.style.height = height / ratio + 'px';
    gl.viewport(0, 0, width, height);
};

var tick = function tick(time) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.lookAt(viewMatrix, [0.0, 0.0, 0.5], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.ortho(projectionMatrix, -1.0, 1.0, 1.0, -1.0, 0.1, 1);
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

    polyAttributes.forEach(function (_ref) {
        var vbo = _ref.vbo;
        var location = _ref.location;
        var stride = _ref.stride;

        setAttribute(gl, vbo, location, stride);
    });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polyIBO);

    gl.uniform1f(polyUniforms.time, time / 1000);
    gl.uniformMatrix4fv(polyUniforms.modelViewProjectionMatrix, false, modelViewProjectionMatrix);
    gl.drawElements(gl.TRIANGLES, polyIndices.length, gl.UNSIGNED_SHORT, 0);

    gl.flush();
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

//----------------------------------------------------
// utils
//----------------------------------------------------

function createProgram(gl, vs, fs) {
    var program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        return program;
    } else {
        console.log(gl.getProgramInfoLog(program));
    }
}

function createShader(gl, type, str) {
    var shader = null;
    switch (type) {
        case 'vertexShader':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;
        case 'fragmentShader':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
        default:
            break;
    }

    if (!shader) {
        throw "cannot create shader";
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        console.log(gl.getShaderInfoLog(shader));
    }
}

function createVBO(gl, array) {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

function createIBO(gl, array) {
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(array), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}

function setAttribute(gl, vbo, attLocation, stride) {
    var format = arguments.length <= 4 || arguments[4] === undefined ? gl.FLOAT : arguments[4];
    return (function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.enableVertexAttribArray(attLocation);
        gl.vertexAttribPointer(attLocation, stride, format, false, 0, 0);
    })();
}

