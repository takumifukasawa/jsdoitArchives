// forked from takumifukasawa's "threejs: sprite animation" http://jsdo.it/takumifukasawa/mUrk
// forked from takumifukasawa's "threejs: test shadermaterial" http://jsdo.it/takumifukasawa/0vG9
// forked from takumifukasawa's "threejs: 四角の箱" http://jsdo.it/takumifukasawa/2bn3

'use strict';

var vertexShader = '\nstruct SpriteAnimation {\n  float frameNum;\n  float fps;\n  float colNum;\n  float rowNum;\n  float cellAspect; // w / h\n  bool loop;\n};\n\nuniform SpriteAnimation u_spriteAnimation;\n  \nuniform float u_time;\nuniform float u_startTime;\nuniform float u_opacity;\n  \nvarying vec2 v_uv;\nvarying mat3 v_spriteMat;\nvarying float v_opacity;\n  \nbool isFrameLimit(float frameIndex, SpriteAnimation spriteAnimation, float elapsedTime) {\n  if(frameIndex > spriteAnimation.frameNum) {\n    return true;\n  }\n  if(!spriteAnimation.loop && elapsedTime / (spriteAnimation.frameNum / spriteAnimation.fps) > 1.) {\n    return true;\n  }\n  return false;\n}\n  \nfloat getFrameIndex(float elapsedTime, SpriteAnimation spriteAnimation) {\n  return mod(floor(elapsedTime * spriteAnimation.fps), spriteAnimation.frameNum);\n}\n  \nmat3 getSpriteMat(float frameIndex, SpriteAnimation spriteAnimation) {\n  mat3 scaleMat = mat3(\n    1. / spriteAnimation.colNum, 0., 0.,\n    0., 1. / spriteAnimation.rowNum, 0.,\n    0., 0., 1.\n  );\n    \n  mat3 translateMat = mat3(\n    1., 0., mod(frameIndex, spriteAnimation.colNum),\n    0., 1., spriteAnimation.rowNum - (floor(frameIndex / spriteAnimation.colNum) + 1.),\n    0., 0., 1.\n  );\n  return translateMat * scaleMat;\n}\n  \nvoid main(void) {\n  vec2 _uv = uv;\n  \n  float elapsedTime = u_time - u_startTime;\n  float frameIndex = getFrameIndex(elapsedTime, u_spriteAnimation);\n\n  v_opacity = isFrameLimit(frameIndex, u_spriteAnimation, elapsedTime) ? 0. : u_opacity;\n\n  v_spriteMat = getSpriteMat(frameIndex, u_spriteAnimation);\n\n  v_uv = _uv;\n  \n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}\n';

var fragmentShader = '\nuniform sampler2D u_texture;\n  \nvarying vec2 v_uv;\nvarying mat3 v_spriteMat;\nvarying float v_opacity;\n\nvec4 getSpriteAnimationColor(sampler2D texture, vec2 uv, mat3 spriteMat) {\n  vec3 _uv = vec3(uv, 1.);\n  _uv *= spriteMat;\n  return texture2D(texture, _uv.xy / _uv.z);\n}\n  \nvoid main(void) {\n  vec4 smpColor = getSpriteAnimationColor(u_texture, v_uv, v_spriteMat);\n  smpColor *= v_opacity;\n  gl_FragColor = smpColor;\n  \n  #ifdef ALPHATEST\n    if(gl_FragColor.a < ALPHATEST)\n     discard;\n  #endif\n}\n';

var width = undefined,
    height = undefined;
var texture = null;
var mesh = null;

var ratio = window.pixelRatio;

var wrapper = document.getElementById('wrapper');

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
camera.position.copy(new THREE.Vector3(0, 0, 10));
camera.lookAt(new THREE.Vector3(0, 0, 0));

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var src = "common/img/photo-1454789591675-556c287e39e2.png";

var textureLoader = new THREE.TextureLoader();
textureLoader.load(src, function (tex) {
  texture = tex;
  initMesh();
});

var initMesh = function initMesh() {
  var geometry = new THREE.PlaneGeometry(2, 2);
  var uniforms = {
    u_texture: {
      type: 't',
      value: texture
    },
    u_spriteAnimation: {
      value: {
        frameNum: 16,
        colNum: 4,
        rowNum: 4,
        fps: 4,
        cellAspect: 1,
        loop: 1
      }
    },
    u_opacity: {
      type: 'f',
      value: 1
    },
    u_time: {
      type: 'f',
      value: 0
    },
    u_startTime: {
      type: 'f',
      value: 0
    }
  };
  var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.DoubleSide
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};

var onWindowResize = function onWindowResize() {
  width = wrapper.offsetWidth;
  height = wrapper.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

var tick = function tick(time) {
  if (mesh) {
    mesh.material.uniforms.u_texture.needsUpdate = true;
    mesh.material.uniforms.u_time.value = time / 1000;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

