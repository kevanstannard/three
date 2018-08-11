/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 84);
/******/ })
/************************************************************************/
/******/ ({

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45;
var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
var NEAR = 1;
var FAR = 10000;

var scene = void 0;
var camera = void 0;
var renderer = void 0;
var axisHelper = void 0;
var gridHelper = void 0;
var orbit = void 0;
var stats = void 0;

var lights = void 0;
var mesh = void 0;
var bones = void 0;
var skeletonHelper = void 0;
var state = {
  animateBones: true
};

var origin = new THREE.Vector3(0, 0, 0);

function initStats() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '20px';
  stats.setMode(0); // 0: fps, 1: ms
  document.getElementById('stats').appendChild(stats.domElement);
}

function createGeometry(sizing) {
  var geometry = new THREE.CylinderGeometry(5, // radiusTop
  5, // radiusBottom
  sizing.height, // height
  4, // radiusSegments
  sizing.segmentCount, // heightSegments
  true);

  // Vertices of the shape
  for (var i = 0; i < geometry.vertices.length; i += 1) {
    // Each vertex corresponds to one skin index
    // which corresponds to one skin weight.
    //
    // The skin index is the index of the bone that
    // the particular vertex is influenced by
    // (each vertex can only belong to one bone).
    //
    // The skin weight is the amount of influence
    // that bone has over that vertex.
    //
    // http://stackoverflow.com/questions/23052306/what-is-the-meaning-of-skin-indices-and-skin-weights

    // Current vertex
    var vertex = geometry.vertices[i];

    // The cylinder geometry is centered at (0, 0, 0) which means that
    // half of cylinder has negative y coordinates, and
    // half of cylinder has positive y coordinates.
    // Create a `y` value that is offset from zero by adding half the height.
    // So our `y` values will be 0, 8, 16, 24 and 32.
    var y = vertex.y + sizing.halfHeight;

    // The skin index is the index of the bone that
    // the particular vertex is influenced by
    // (each vertex can only belong to one bone).
    //
    // Our shape has a segment height of 8.
    // Our `y` value rage from 0 to 32.
    // Work out which bone influences this vertex
    //
    // We get:
    // y = 0, bone = 0
    // y = 8, bone = 1
    // y = 16, bone = 2
    // y = 24, bone = 3
    // y = 32, bone = 4
    //
    // It's important to note that a bone is a POINT not a line.
    // Two Bone points are required to make a visual bone line.
    // In this example, there are 5 bones.
    //
    // The skinIndices' values correspond to the geometry's vertices.
    // Each vertex can have up to 4 bones associated with it.
    // So if you look at the first vertex, and the first skinIndex,
    // this will tell you the bones associated with that vertex.
    //
    // For example the first vertex could have a value of ( 10.05, 30.10, 12.12 ).
    // Then the first skin index could have the value of ( 10, 2, 0, 0 ).
    // The first skin weight could have the value of ( 0.8, 0.2, 0, 0 ).
    // In affect this would take the first vertex, and then the bone mesh.bones[10]
    // and apply it 80% of the way. Then it would take the bone skeleton.bones[2]
    // and apply it 20% of the way. The next two values have a weight of 0,
    // so they would have no affect.
    var skinIndex = Math.floor(y / sizing.segmentHeight);

    // When working with a SkinnedMesh, each vertex can have
    // up to 4 bones affecting it. The skinWeights property
    // is an array of weight values that correspond to the
    // order of the vertices in the geometry.
    //
    // So for instance, the first skinWeight would correspond
    // to the first vertex in the geometry.
    //
    // Since each vertex can be modified by 4 bones,
    // a Vector4 is used to represent the skin weights for that vertex.
    //
    // The values of the vector should typically be between 0 and 1.
    // For instance when set to 0 the bone transformation will have no affect.
    //
    // When set to 0.5 it will have 50% affect.
    // When set to 100%, it will have 100% affect.
    //
    // If there is only 1 bone associated with the vertex
    // then you only need to worry about the first component of the vector,
    // the rest can be ignored and set to 0.
    var skinWeight = y % sizing.segmentHeight / sizing.segmentHeight;

    geometry.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
    geometry.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));
  }
  return geometry;
}

function createBones(sizing) {
  bones = [];
  var prevBone = new THREE.Bone();
  bones.push(prevBone);
  prevBone.position.y = -sizing.halfHeight;

  for (var i = 0; i < sizing.segmentCount; i += 1) {
    var bone = new THREE.Bone();
    bone.position.y = sizing.segmentHeight;
    bones.push(bone);
    prevBone.add(bone);
    prevBone = bone;
  }
  return bones;
}

function createMesh(geometry, theBones) {
  var material = new THREE.MeshPhongMaterial({
    skinning: true,
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

  var theMesh = new THREE.SkinnedMesh(geometry, material);
  var skeleton = new THREE.Skeleton(theBones);

  theMesh.add(theBones[0]);

  theMesh.bind(skeleton);

  skeletonHelper = new THREE.SkeletonHelper(theMesh);
  skeletonHelper.material.linewidth = 2;
  scene.add(skeletonHelper);

  return theMesh;
}

function initBones() {
  var segmentHeight = 8;
  var segmentCount = 4;
  var height = segmentHeight * segmentCount;
  var halfHeight = height * 0.5;

  var sizing = {
    segmentHeight: segmentHeight,
    segmentCount: segmentCount,
    height: height,
    halfHeight: halfHeight
  };

  var geometry = createGeometry(sizing);
  var theBones = createBones(sizing);
  mesh = createMesh(geometry, theBones);

  mesh.scale.multiplyScalar(1);
  scene.add(mesh);
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(50, 50, 50);
  camera.lookAt(origin);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  orbit = new THREE.OrbitControls(camera, renderer.domElement);

  THREEx.WindowResize(renderer, camera);

  document.body.appendChild(renderer.domElement);

  initStats();

  gridHelper = new THREE.GridHelper(30, 10);
  scene.add(gridHelper);

  axisHelper = new THREE.AxisHelper(30);
  scene.add(axisHelper);

  lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);
  lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  lights[2] = new THREE.PointLight(0xffffff, 1, 0);

  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  initBones();
}

function update() {
  var time = Date.now() * 0.001;
  if (state.animateBones) {
    for (var i = 0; i < mesh.skeleton.bones.length; i += 1) {
      mesh.skeleton.bones[i].rotation.z = Math.sin(time) * 2 / mesh.skeleton.bones.length;
    }
  }

  skeletonHelper.update();
  stats.update();
  orbit.update();
}

function render() {
  renderer.render(scene, camera);
}

function tick() {
  update();
  render();
  requestAnimationFrame(tick);
}

init();
tick();

/***/ })

/******/ });